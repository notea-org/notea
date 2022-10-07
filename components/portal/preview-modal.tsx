import React, { FC, useCallback, useEffect, useState } from 'react';
import { Paper, Fade } from '@material-ui/core';
import PortalState from 'libs/web/state/portal';
import { useRouter } from 'next/router';
import { NoteCacheItem } from 'libs/web/cache';
import useNoteAPI from 'libs/web/api/note';
import { PostContainer } from 'components/container/post-container';
import IconButton from 'components/icon-button';
import HotkeyTooltip from 'components/hotkey-tooltip';
import useI18n from 'libs/web/hooks/use-i18n';
import Popover from 'components/popover';

const PreviewModal: FC = () => {
    const { t } = useI18n();
    const {
        preview: { anchor, open, close, visible, data, setAnchor },
    } = PortalState.useContainer();
    const router = useRouter();
    const { fetch: fetchNote } = useNoteAPI();
    const [note, setNote] = useState<NoteCacheItem>();

    const findNote = useCallback(
        async (id: string) => {
            setNote(await fetchNote(id));
        },
        [fetchNote]
    );

    const gotoLink = useCallback(() => {
        if (note?.id) {
            router.push(note.id, undefined, { shallow: true })
                ?.catch((v) => console.error('Error whilst pushing to router: %O', v));
        }
    }, [note?.id, router]);

    useEffect(() => {
        if (data?.id) {
            findNote(data?.id)
                ?.catch((v) => console.error('Error whilst finding note %s: %O', data.id, v));
        }
    }, [data?.id, findNote]);

    return (
        <Popover
            placement="bottom"
            anchorEl={anchor}
            open={visible}
            handleClose={close}
            handleOpen={open}
            setAnchor={setAnchor}
            transition
        >
            {({ TransitionProps }) => (
                <Fade
                    {...TransitionProps}
                    timeout={{
                        enter: 200,
                    }}
                >
                    <Paper className="relative bg-gray-50 text-gray-800 w-full h-96 md:w-96 dark:bg-gray-800">
                        <div className="absolute right-2 top-2">
                            <HotkeyTooltip text={t('Open link')}>
                                <IconButton
                                    onClick={gotoLink}
                                    icon="ExternalLink"
                                ></IconButton>
                            </HotkeyTooltip>
                        </div>
                        <div className="overflow-y-scroll h-full p-4">
                            <PostContainer
                                isPreview
                                note={note}
                            ></PostContainer>
                        </div>
                    </Paper>
                </Fade>
            )}
        </Popover>
    );
};

export default PreviewModal;
