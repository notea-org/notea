import { api } from 'libs/server/connect';
import { useAuth } from 'libs/server/middlewares/auth';
import { useStore } from 'libs/server/middlewares/store';
import dayjs from 'dayjs';
import { getPathFileByName } from 'libs/server/note-path';
import md5 from 'md5';
import { extname } from 'path';
import { readFileFromRequest } from 'libs/server/file';
import { readFileSync } from 'fs';
import { strCompress } from 'libs/shared/str';

export const config = {
    api: {
        bodyParser: false,
    },
};

export default api()
    .use(useAuth)
    .use(useStore)
    .post(async (req, res) => {
        const id = req.query.id as string;
        const file = await readFileFromRequest(req);
        const buffer = readFileSync(file.path);
        const fileName = `${dayjs().format('YYYY/MM/DD')}/${md5(buffer).slice(
            0,
            8
        )}${extname(file.name ?? '')}`;
        const filePath = getPathFileByName(fileName);

        await req.state.store.putObject(filePath, buffer, {
            contentType: file.type ?? 'application/octet-stream',
            meta: {
                id: strCompress(id),
            },
            headers: {
                cacheControl:
                    'public, max-age=31536000, s-maxage=31536000, stale-while-revalidate=31536000',
                contentDisposition: 'inline',
            },
        });

        res.json({ url: `/api/file/${fileName}` });
    });
