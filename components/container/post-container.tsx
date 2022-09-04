import { FC, useMemo } from 'react';
// TODO: Maybe can custom
import 'highlight.js/styles/zenburn.css';
import UIState from 'libs/web/state/ui';
import InnerHTML from 'dangerously-set-html-content';
import { NoteModel } from 'libs/shared/note';
import pupa from 'pupa';
import MainEditor from 'components/editor/main-editor';

const MAX_WIDTH = 900;

export const PostContainer: FC<{
    isPreview?: boolean;
    note?: NoteModel;
}> = ({ isPreview = false, note }) => {
    const {
        settings: {
            settings: { injection },
        },
    } = UIState.useContainer();

    const injectionHTML = useMemo(() => {
        return pupa(injection ?? '', {
            ...note,
            url: typeof window !== 'undefined' ? location.href : null,
        });
    }, [injection, note]);

    const className = 'pt-10 px-6 m-auto max-w-full w-[900px]';

    return (
        <>
            <MainEditor
                isPreview={isPreview}
                note={note}
                className={className}
                readOnly
            />
            {isPreview ? null : (
                <>
                    {injection ? (
                        <InnerHTML
                            id="snippet-injection"
                            className={className}
                            style={{ width: MAX_WIDTH }}
                            html={injectionHTML}
                        />
                    ) : null}
                    <footer className="pb-10 text-gray-300 text-center my-20 text-sm">
                        Built with{' '}
                        <a
                            href="https://cinwell.com/notea/"
                            target="_blank"
                            rel="noreferrer"
                        >
                            Notea
                        </a>
                    </footer>
                </>
            )}
        </>
    );
};
