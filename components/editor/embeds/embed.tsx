import { Skeleton } from '@material-ui/lab';
import useFetcher from 'libs/web/api/fetcher';
import { FC, useEffect, useState } from 'react';
import { Metadata } from 'unfurl.js/dist/types';
import { EmbedProps } from '.';
import InnerHTML from 'dangerously-set-html-content';
import { decode } from 'qss';

export const Embed: FC<EmbedProps> = ({ attrs: { href } }) => {
    const { request } = useFetcher();
    const [data, setData] = useState<Metadata>();

    useEffect(() => {
        request<undefined, Metadata>({
            url: href,
            method: 'GET',
        }).then((data) => {
            setData(data);
        });
    }, [href, request]);

    if (!data) {
        return <Skeleton variant="rect" height={128}></Skeleton>;
    }

    const html = (data?.oEmbed as any)?.html;

    if (html) {
        return <InnerHTML html={html} />;
    }

    const url =
        data?.open_graph?.url ??
        decode<{ url: string }>(href.replace(/.*\?/, '')).url;

    return <iframe className="w-full h-96" src={url} allowFullScreen />;
};
