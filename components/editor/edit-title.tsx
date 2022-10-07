import { TextareaAutosize } from '@material-ui/core';
import useI18n from 'libs/web/hooks/use-i18n';
import { has } from 'lodash';
import { useRouter } from 'next/router';
import {
    FC,
    useCallback,
    KeyboardEvent,
    useRef,
    useMemo,
    ChangeEvent,
} from 'react';
import EditorState from 'libs/web/state/editor';

const EditTitle: FC<{ readOnly?: boolean }> = ({ readOnly }) => {
    const { editorEl, onNoteChange, note } = EditorState.useContainer();
    const router = useRouter();
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const onInputTitle = useCallback(
        (event: KeyboardEvent<HTMLTextAreaElement>) => {
            if (event.key.toLowerCase() === 'enter') {
                event.stopPropagation();
                event.preventDefault();
                editorEl.current?.focusAtEnd();
            }
        },
        [editorEl]
    );

    const onTitleChange = useCallback(
        (event: ChangeEvent<HTMLTextAreaElement>) => {
            const title = event.target.value;
            onNoteChange.callback({ title })
                ?.catch((v) => console.error('Error whilst changing title: %O', v));
        },
        [onNoteChange]
    );

    const autoFocus = useMemo(() => has(router.query, 'new'), [router.query]);
    const { t } = useI18n();

    return (
        <h1 className="text-3xl mb-8">
            <TextareaAutosize
                ref={inputRef}
                dir="auto"
                readOnly={readOnly}
                className="outline-none w-full resize-none block bg-transparent"
                placeholder={t('New Page')}
                defaultValue={note?.title}
                key={note?.id}
                onKeyPress={onInputTitle}
                onChange={onTitleChange}
                maxLength={128}
                autoFocus={autoFocus}
            />
        </h1>
    );
};

export default EditTitle;
