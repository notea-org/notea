import { FC, useState, useMemo, useCallback, useEffect } from 'react';
import FilterModal from 'components/portal/filter-modal/filter-modal';
import FilterModalInput from 'components/portal/filter-modal/filter-modal-input';
import FilterModalList from 'components/portal/filter-modal/filter-modal-list';
import PortalState from 'libs/web/state/portal';
import useI18n from 'libs/web/hooks/use-i18n';
import { useRouter } from 'next/router';
import CommandItem, { Command } from './command-item';
import { 
    PlusIcon, 
    SearchIcon, 
    CogIcon, 
    TrashIcon, 
    MenuIcon,
    HomeIcon
} from '@heroicons/react/outline';
import UIState from 'libs/web/state/ui';
import { useHotkeys } from 'react-hotkeys-hook';

const CommandPalette: FC = () => {
    const { t } = useI18n();
    const router = useRouter();
    const { 
        commandPalette: { visible, open, close },
        search,
        trash
    } = PortalState.useContainer();
    const { sidebar } = UIState.useContainer();
    const [keyword, setKeyword] = useState('');

    // Register global hotkey to open command palette
    useHotkeys('meta+k, ctrl+k', (e) => {
        e.preventDefault();
        open();
    }, { enableOnTags: ['INPUT', 'TEXTAREA', 'SELECT'] });

    const commands: Command[] = useMemo(() => [
        {
            id: 'create-page',
            title: t('Create new page'),
            icon: <PlusIcon className="w-5 h-5" />,
            action: () => router.push('/new'),
            shortcut: ['C']
        },
        {
            id: 'search',
            title: t('Search pages'),
            icon: <SearchIcon className="w-5 h-5" />,
            action: () => {
                close();
                setTimeout(() => search.open(), 100);
            },
            shortcut: ['Cmd', 'P']
        },
        {
            id: 'settings',
            title: t('Settings'),
            icon: <CogIcon className="w-5 h-5" />,
            action: () => router.push('/settings'),
        },
        {
            id: 'trash',
            title: t('Trash'),
            icon: <TrashIcon className="w-5 h-5" />,
            action: () => {
                close();
                setTimeout(() => trash.open(), 100);
            },
            shortcut: ['Cmd', 'Opt', 'T']
        },
        {
            id: 'toggle-sidebar',
            title: t('Toggle Sidebar'),
            icon: <MenuIcon className="w-5 h-5" />,
            action: () => sidebar.toggle(),
            shortcut: ['Cmd', '\\']
        },
        {
            id: 'home',
            title: t('Go to Home'),
            icon: <HomeIcon className="w-5 h-5" />,
            action: () => router.push('/'),
        }
    ], [t, router, search, trash, sidebar, close]);

    const filteredCommands = useMemo(() => {
        if (!keyword) return commands;
        const lowerKeyword = keyword.toLowerCase();
        return commands.filter((cmd) => 
            cmd.title.toLowerCase().includes(lowerKeyword) || 
            cmd.description?.toLowerCase().includes(lowerKeyword)
        );
    }, [keyword, commands]);

    const onEnter = useCallback((command: Command) => {
        command.action();
        close();
    }, [close]);

    // Reset keyword when opening
    useEffect(() => {
        if (visible) {
            setKeyword('');
        }
    }, [visible]);

    return (
        <FilterModal open={visible} onClose={close}>
            <FilterModalInput
                placeholder={t('Type a command...')}
                doFilter={async (k) => setKeyword(k || '')}
                keyword={keyword}
                onClose={close}
            />
            <FilterModalList<Command>
                onEnter={onEnter}
                items={filteredCommands}
                ItemComponent={(item, props) => (
                    <CommandItem
                        command={item}
                        onClick={() => onEnter(item)}
                        {...props}
                    />
                )}
            />
        </FilterModal>
    );
};

export default CommandPalette;
