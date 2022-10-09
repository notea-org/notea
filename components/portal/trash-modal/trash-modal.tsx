import { FC, useCallback, useEffect } from 'react';
import FilterModal from 'components/portal/filter-modal/filter-modal';
import FilterModalInput from 'components/portal/filter-modal/filter-modal-input';
import FilterModalList from 'components/portal/filter-modal/filter-modal-list';
import TrashItem from './trash-item';
import { NoteModel } from 'libs/shared/note';
import TrashState from 'libs/web/state/trash';
import PortalState from 'libs/web/state/portal';
import { useRouter } from 'next/router';
import useI18n from 'libs/web/hooks/use-i18n';

const TrashModal: FC = () => {
    const { t } = useI18n();
    const { filterNotes, keyword, list } = TrashState.useContainer();
    const {
        trash: { visible, close },
    } = PortalState.useContainer();
    const router = useRouter();

    const onEnter = useCallback(
        (item: NoteModel) => {
            router.push(`/${item.id}`, `/${item.id}`, { shallow: true })
                ?.catch((v) => console.error('Error whilst pushing to router: %O', v));
            close();
        },
        [router, close]
    );

    useEffect(() => {
        if (visible) {
            filterNotes()
                ?.catch((v) => console.error('Error whilst filtering notes: %O', v));
        }
    }, [visible, filterNotes]);

    return (
        <FilterModal open={visible} onClose={close}>
            <FilterModalInput
                placeholder={t('Search note in trash')}
                doFilter={filterNotes}
                keyword={keyword}
                onClose={close}
            />
            <FilterModalList<NoteModel>
                onEnter={onEnter}
                items={list ?? []}
                ItemComponent={(item, props) => (
                    <TrashItem
                        note={item}
                        keyword={keyword}
                        key={item.id}
                        {...props}
                    />
                )}
            />
        </FilterModal>
    );
};

export default TrashModal;
