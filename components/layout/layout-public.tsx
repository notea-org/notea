import { NoteModel } from 'libs/shared/note';
import { PageMode } from 'libs/shared/page';
import { TreeModel } from 'libs/shared/tree';
import NoteState from 'libs/web/state/note';
import NoteTreeState from 'libs/web/state/tree';
import { FC, useMemo } from 'react';
import Error from 'next/error';
import useI18n from 'libs/web/hooks/use-i18n';
import { NextSeo } from 'next-seo';
import { removeMarkdown } from 'libs/web/utils/markdown';
import { ReactNodeLike } from 'prop-types';

const LayoutPublic: FC<{
    tree?: TreeModel;
    note?: NoteModel;
    pageMode: PageMode;
    baseURL: string;
    children: ReactNodeLike;
}> = ({ children, note, tree, pageMode, baseURL }) => {
    const { t } = useI18n();

    const description = useMemo(
        () => removeMarkdown(note?.content).slice(0, 100),
        [note]
    );

    if (pageMode !== PageMode.PUBLIC) {
        return <Error statusCode={404} title={t('Not a public page')}></Error>;
    }

    return (
        <>
            <NextSeo
                title={note?.title}
                titleTemplate="%s - Powered by Notea"
                description={description}
                openGraph={{
                    title: note?.title,
                    description,
                    url: `${baseURL}/${note?.id}`,
                    images: [
                        { url: note?.pic ?? `${baseURL}/logo_1280x640.png` },
                    ],
                    type: 'article',
                    article: {
                        publishedTime: note?.date,
                    },
                }}
            />
            <NoteTreeState.Provider initialState={tree}>
                <NoteState.Provider initialState={note}>
                    {children}
                </NoteState.Provider>
            </NoteTreeState.Provider>
        </>
    );
};

export default LayoutPublic;
