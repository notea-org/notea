import SearchState from 'libs/web/state/search';
import { FC, useCallback } from 'react';
import FilterModal from 'components/portal/filter-modal/filter-modal';
import FilterModalInput from 'components/portal/filter-modal/filter-modal-input';
import FilterModalList from 'components/portal/filter-modal/filter-modal-list';
import SearchItem from './search-item';
import { NoteModel } from 'libs/shared/note';
import PortalState from 'libs/web/state/portal';
import useI18n from 'libs/web/hooks/use-i18n';
import { useRouter } from 'next/router';

const SearchModal: FC = () => {
    const { t } = useI18n();
    const { filterNotes, keyword, list } = SearchState.useContainer();
    const {
        search: { visible, close },
    } = PortalState.useContainer();
    const router = useRouter();

    const onEnter = useCallback(
        (item: NoteModel) => {
            router.push(`/${item.id}`, `/${item.id}`, { shallow: true })
                ?.catch((v) => console.error('Error whilst pushing item to router: %O', v));
            close();
        },
        [router, close]
    );

    return (
        <FilterModal open={visible} onClose={close}>
            <FilterModalInput
                placeholder={t('Search note')}
                doFilter={filterNotes}
                keyword={keyword}
                onClose={close}
            />
            <FilterModalList<NoteModel>
                onEnter={onEnter}
                items={list ?? []}
                ItemComponent={(item, props) => (
                    <SearchItem
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

export default SearchModal;
