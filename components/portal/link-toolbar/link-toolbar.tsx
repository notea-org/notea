import { Paper } from '@material-ui/core';
import HotkeyTooltip from 'components/hotkey-tooltip';
import IconButton from 'components/icon-button';
import useI18n from 'libs/web/hooks/use-i18n';
import PortalState from 'libs/web/state/portal';
import Popover from 'components/popover';
import { useCallback } from 'react';
import { findPlaceholderLink } from 'libs/web/editor/link';

const LinkToolbar = () => {
    const { t } = useI18n();
    const {
        linkToolbar: { anchor, open, close, visible, data, setAnchor },
    } = PortalState.useContainer();

    const openLink = useCallback(() => {
        if (data?.href) {
            window.open(data.href, '_blank');
        }
    }, [data?.href]);

    const createEmbed = useCallback(
        (type: 'bookmark' | 'embed') => {
            const { view, href } = data ?? {};
            if (!view || !href) {
                return;
            }
            const { dispatch, state } = view;
            const result = findPlaceholderLink(state.doc, href);

            if (!result) {
                return;
            }
            const bookmarkUrl = `/api/extract?type=${type}&url=${encodeURIComponent(
                href
            )}`;
            const transaction = state.tr.replaceWith(
                result.pos,
                result.pos + result.node.nodeSize,
                state.schema.nodes.embed.create({
                    href: bookmarkUrl,
                    matches: bookmarkUrl,
                })
            );

            dispatch(transaction);
            setAnchor(null);
            close();
        },
        [close, data, setAnchor]
    );

    return (
        <Popover
            placement="bottom"
            anchorEl={anchor}
            open={visible}
            handleClose={close}
            handleOpen={open}
            setAnchor={setAnchor}
            delay={0}
        >
            <Paper className="relative bg-gray-50 flex p-1 space-x-1">
                <HotkeyTooltip text={t('Open link')}>
                    <IconButton
                        onClick={openLink}
                        icon={'ExternalLink'}
                    ></IconButton>
                </HotkeyTooltip>
                <HotkeyTooltip text={t('Create bookmark')}>
                    <IconButton
                        onClick={() => createEmbed('bookmark')}
                        icon={'BookmarkAlt'}
                    ></IconButton>
                </HotkeyTooltip>
                <HotkeyTooltip text={t('Create embed')}>
                    <IconButton
                        onClick={() => createEmbed('embed')}
                        icon={'Puzzle'}
                    ></IconButton>
                </HotkeyTooltip>
            </Paper>
        </Popover>
    );
};

export default LinkToolbar;
