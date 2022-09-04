import { Skeleton } from '@material-ui/lab';
import useFetcher from 'libs/web/api/fetcher';
import { decode } from 'qss';
import { FC, useEffect, useState } from 'react';
import { Metadata } from 'unfurl.js/dist/types';
import { EmbedProps } from '.';

export const Bookmark: FC<EmbedProps> = ({ attrs: { href } }) => {
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

    const image = data?.open_graph?.images?.[0].url ?? data?.favicon;
    const title = data?.open_graph?.title ?? data?.title;
    const description = data?.open_graph?.description ?? data?.description;
    const url =
        data?.open_graph?.url ??
        decode<{ url: string }>(href.replace(/.*\?/, '')).url;

    if (!data) {
        return <Skeleton variant="rect" height={128}></Skeleton>;
    }

    return (
        <a
            className="bookmark overflow-hidden border-gray-200 border rounded flex h-32 !no-underline hover:bg-blue-50"
            href={url}
            target="_blank"
            rel="noreferrer"
        >
            <div className="flex-1 p-2 overflow-hidden">
                <div className="mb-2 block text-gray-800 overflow-ellipsis overflow-hidden h-6">
                    {title}
                </div>
                <div className="text-sm overflow-ellipsis overflow-hidden h-10 text-gray-400 mb-2">
                    {description}
                </div>
                <div className="text-sm overflow-ellipsis overflow-hidden h-5">
                    {url}
                </div>
            </div>
            {!!image && (
                <div className="md:w-48 flex w-0">
                    <img
                        className="m-auto object-cover h-full"
                        src={image}
                        alt={title}
                    />
                </div>
            )}
        </a>
    );
};
