import { NoteModel } from 'libs/shared/note';
import { useState, useCallback } from 'react';
import RichMarkdownEditor from '@notea/rich-markdown-editor';
import { createContainer } from 'unstated-next';

const useModalInstance = () => {
    const [visible, setVisible] = useState(false);

    const open = useCallback(() => {
        setVisible(true);
    }, []);

    const close = useCallback(() => {
        setVisible(false);
    }, []);

    return { visible, open, close };
};

const useAnchorInstance = <T>() => {
    const [anchor, setAnchor] = useState<Element | null>(null);
    const [data, setData] = useState<T>();
    const [visible, setVisible] = useState(false);

    const open = useCallback(() => {
        setVisible(true);
    }, []);

    const close = useCallback(() => {
        setVisible(false);
    }, []);

    return { anchor, open, close, data, setData, visible, setAnchor };
};

const useModal = () => {
    return {
        search: useModalInstance(),
        trash: useModalInstance(),
        menu: useAnchorInstance<NoteModel>(),
        share: useAnchorInstance<NoteModel>(),
        preview: useAnchorInstance<{ id?: string }>(),
        linkToolbar: useAnchorInstance<{
            href: string;
            view?: RichMarkdownEditor['view'];
        }>(),
    };
};

const PortalState = createContainer(useModal);

export default PortalState;
