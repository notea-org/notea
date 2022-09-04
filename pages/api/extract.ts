import { api } from 'libs/server/connect';
import { useReferrer } from 'libs/server/middlewares/referrer';
import { unfurl } from 'unfurl.js';

const expires = 86400;

export default api()
    .use(useReferrer)
    .get(async (req, res) => {
        const url = decodeURIComponent((req.query as { url: string }).url);
        if (!url) {
            return res.APIError.NOT_SUPPORTED.throw('missing url');
        }

        const result = await unfurl(url as string, {
            oembed: true,
        });

        res.setHeader(
            'Cache-Control',
            `public, max-age=${expires}, s-maxage=${expires}, stale-while-revalidate=${expires}`
        );

        // XXX: It’s best to allow users to resize the iframe
        if (/youtu\.?be(?:\.com)?/.test(url)) {
            const oEmbed = result.oEmbed as any;
            const html = oEmbed.html as string;
            const newHtml = html
                .replace(/width="?\d+"?/, 'width="100%"')
                .replace(/height="?\d+"?/, 'height="400"');

            oEmbed.html = newHtml;
        } else if (/bilibili\.com/.test(url)) {
            const avId = result.open_graph.url?.match(/([^/]*)\/$/)?.[1];
            result.oEmbed = {
                html: `<iframe width="100%" height=400 src="//player.bilibili.com/player.html?bvid=${avId}" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true"></iframe>`,
            } as any;
        } else if (/gist\.github\.com/.test(url)) {
            result.open_graph = {
                ...result.open_graph,
                url: `${url}.pibb`,
            };
        } else if (/(app|viewer).diagrams.net\//.test(url)) {
            const data = url.split('#')?.[1];
            result.open_graph = {
                ...result.open_graph,
                url: `https://viewer.diagrams.net/?highlight=0000ff&edit=_blank&layers=1&nav=1#${data}`,
            };
        }

        res.json(result);
    });
