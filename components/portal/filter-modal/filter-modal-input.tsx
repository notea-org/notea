import { FC, useEffect, useRef } from 'react';
import { SearchIcon } from '@heroicons/react/outline';
import { useDebouncedCallback } from 'use-debounce';
import useI18n from 'libs/web/hooks/use-i18n';

const FilterModalInput: FC<{
    doFilter: (keyword: string) => void;
    keyword?: string;
    placeholder: string;
    onClose: () => void;
}> = ({ doFilter, keyword, placeholder, onClose }) => {
    const { t } = useI18n();
    const inputRef = useRef<HTMLInputElement>(null);
    const debouncedFilter = useDebouncedCallback((value: string) => {
        doFilter(value);
    }, 200);

    useEffect(() => {
        inputRef.current?.select();
    }, []);

    return (
        <div className="flex py-2 px-4">
            <SearchIcon width="20" />
            <input
                ref={inputRef}
                defaultValue={keyword}
                type="text"
                className="appearance-none flex-1 outline-none ml-2 bg-transparent"
                placeholder={placeholder}
                autoFocus
                onChange={(e) => debouncedFilter.callback(e.target.value)}
            />
            <button onClick={onClose}>{t('Cancel')}</button>
        </div>
    );
};

export default FilterModalInput;
