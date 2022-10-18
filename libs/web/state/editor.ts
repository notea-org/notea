import NoteState from 'libs/web/state/note';
import { useRouter } from 'next/router';
import {
    useCallback,
    MouseEvent as ReactMouseEvent,
    useState,
    useRef,
} from 'react';
import { searchNote, searchRangeText } from 'libs/web/utils/search';
import useFetcher from 'libs/web/api/fetcher';
import { NOTE_DELETED } from 'libs/shared/meta';
import { isNoteLink, NoteModel } from 'libs/shared/note';
import { useToast } from 'libs/web/hooks/use-toast';
import PortalState from 'libs/web/state/portal';
import { NoteCacheItem } from 'libs/web/cache';
import noteCache from 'libs/web/cache/note';
import { createContainer } from 'unstated-next';
import MarkdownEditor from '@notea/rich-markdown-editor';
import { useDebouncedCallback } from 'use-debounce';
import { ROOT_ID } from 'libs/shared/tree';
import { has } from 'lodash';
import UIState from './ui';

const onSearchLink = async (keyword: string) => {
    const list = await searchNote(keyword, NOTE_DELETED.NORMAL);

    return list.map((item) => ({
        title: item.title,
        // todo 路径
        subtitle: searchRangeText({
            text: item.rawContent || '',
            keyword,
            maxLen: 40,
        }).match,
        url: `/${item.id}`,
    }));
};

const useEditor = (initNote?: NoteModel) => {
    const {
        createNoteWithTitle,
        updateNote,
        createNote,
        note: noteProp,
    } = NoteState.useContainer();
    const note = initNote ?? noteProp;
    const {
        ua: { isBrowser },
    } = UIState.useContainer();
    const router = useRouter();
    const { request, error } = useFetcher();
    const toast = useToast();
    const editorEl = useRef<MarkdownEditor>(null);

    const onNoteChange = useDebouncedCallback(
        async (data: Partial<NoteModel>) => {
            const isNew = has(router.query, 'new');

            if (isNew) {
                data.pid = (router.query.pid as string) || ROOT_ID;
                const item = await createNote({ ...note, ...data });
                const noteUrl = `/${item?.id}`;

                if (router.asPath !== noteUrl) {
                    await router.replace(noteUrl, undefined, { shallow: true });
                }
            } else {
                await updateNote(data);
            }
        },
        500
    );

    const onCreateLink = useCallback(
        async (title: string) => {
            const result = await createNoteWithTitle(title);

            if (!result) {
                throw new Error('todo');
            }

            return `/${result.id}`;
        },
        [createNoteWithTitle]
    );

    const onClickLink = useCallback(
        (href: string) => {
            if (isNoteLink(href.replace(location.origin, ''))) {
                router.push(href, undefined, { shallow: true })
                    .catch((v) => console.error('Error whilst pushing href to router: %O', v));
            } else {
                window.open(href, '_blank');
            }
        },
        [router]
    );

    const onUploadImage = useCallback(
        async (file: File, id?: string) => {
            const data = new FormData();
            data.append('file', file);
            const result = await request<FormData, { url: string }>(
                {
                    method: 'POST',
                    url: `/api/upload?id=${id}`,
                },
                data
            );
            if (!result) {
                toast(error, 'error');
                throw Error(error);
            }
            return result.url;
        },
        [error, request, toast]
    );

    const { preview, linkToolbar } = PortalState.useContainer();

    const onHoverLink = useCallback(
        (event: MouseEvent | ReactMouseEvent) => {
            if (!isBrowser || editorEl.current?.props.readOnly) {
                return true;
            }
            const link = event.target as HTMLLinkElement;
            const href = link.getAttribute('href');
            if (link.classList.contains('bookmark')) {
                return true;
            }
            if (href) {
                if (isNoteLink(href)) {
                    preview.close();
                    preview.setData({ id: href.slice(1) });
                    preview.setAnchor(link);
                } else {
                    linkToolbar.setData({ href, view: editorEl.current?.view });
                    linkToolbar.setAnchor(link);
                }
            } else {
                preview.setData({ id: undefined });
            }
            return true;
        },
        [isBrowser, preview, linkToolbar]
    );

    const [backlinks, setBackLinks] = useState<NoteCacheItem[]>();

    const getBackLinks = useCallback(async () => {
        console.log(note?.id);
        const linkNotes: NoteCacheItem[] = [];
        if (!note?.id) return linkNotes;
        setBackLinks([]);
        await noteCache.iterate<NoteCacheItem, void>((value) => {
            if (value.linkIds?.includes(note.id)) {
                linkNotes.push(value);
            }
        });
        setBackLinks(linkNotes);
    }, [note?.id]);

    const onEditorChange = useCallback(
        (value: () => string): void => {
            onNoteChange.callback({ content: value() })
                ?.catch((v) => console.error('Error whilst updating note: %O', v));
        },
        [onNoteChange]
    );

    return {
        onCreateLink,
        onSearchLink,
        onClickLink,
        onUploadImage,
        onHoverLink,
        getBackLinks,
        onEditorChange,
        onNoteChange,
        backlinks,
        editorEl,
        note,
    };
};

const EditorState = createContainer(useEditor);

export default EditorState;
