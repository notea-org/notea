import IconButton from 'components/icon-button';
import useI18n from 'libs/web/hooks/use-i18n';
import EditorState from 'libs/web/state/editor';
import Link from 'next/link';
import React, { FC, useEffect } from 'react';

const Backlinks: FC = () => {
    const { getBackLinks, onHoverLink, backlinks } = EditorState.useContainer();
    const { t } = useI18n();

    useEffect(() => {
        getBackLinks()
            ?.catch((v) => console.error('Error whilst getting backlinks: %O', v));
    }, [getBackLinks]);

    if (!backlinks?.length) {
        return null;
    }

    return (
        <div className="mb-40">
            <h4 className="text-xs px-2 text-gray-400">
                {t('Linked to this page')}
            </h4>
            <ul className="bg-gray-100 mt-2 rounded overflow-hidden">
                {backlinks?.map((link) => (
                    <li key={link.id}>
                        <Link href={link.id} shallow>
                            <a
                                className="p-2 flex items-center hover:bg-gray-300 truncate"
                                onMouseEnter={onHoverLink}
                            >
                                <IconButton
                                    className="mr-1"
                                    icon="DocumentText"
                                ></IconButton>
                                <span className="flex-1 truncate">
                                    {link.title}
                                </span>
                            </a>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};
export default Backlinks;
