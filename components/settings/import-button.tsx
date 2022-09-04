import { ChangeEvent, FC, useCallback, useEffect } from 'react';
import useI18n from 'libs/web/hooks/use-i18n';
import { ButtonProps } from './type';
import useFetcher from 'libs/web/api/fetcher';
import { useToast } from 'libs/web/hooks/use-toast';
import { ButtonProgress } from 'components/button-progress';
import { IMPORT_FILE_LIMIT_SIZE } from 'libs/shared/const';
import { useRouter } from 'next/router';
import { ROOT_ID } from 'libs/shared/tree';

export const ImportButton: FC<ButtonProps> = ({ parentId = ROOT_ID }) => {
    const { t } = useI18n();
    const { request, loading, error } = useFetcher();
    const toast = useToast();
    const router = useRouter();

    const onSelectFile = useCallback(
        async (event: ChangeEvent<HTMLInputElement>) => {
            const data = new FormData();

            if (!event.target.files?.length) {
                return toast(t('Please select zip file'), 'error');
            }

            const file = event.target.files[0];

            if (file.size > IMPORT_FILE_LIMIT_SIZE) {
                return toast(
                    t('File size must be less than {{n}}mb', {
                        n: IMPORT_FILE_LIMIT_SIZE / 1024 / 1024,
                    }),
                    'error'
                );
            }

            data.append('file', file);

            const result = await request<
                FormData,
                { total: number; imported: number }
            >(
                {
                    method: 'POST',
                    url: '/api/import?pid=' + parentId,
                },
                data
            );

            event.target.value = '';
            if (!result) return;
            if (!result?.imported) {
                return toast(t('Not found markdown file'), 'warning');
            }
            toast(
                t('Successfully imported {{n}} markdown files', {
                    n: result?.imported,
                }),
                'success'
            );
            /**
             * @todo fetch tree without reload page
             */
            router.reload();
        },
        [parentId, request, router, t, toast]
    );

    useEffect(() => {
        if (error) {
            toast(error, 'error');
        }
    }, [error, toast]);

    return (
        <label htmlFor="import-button">
            <input
                hidden
                accept="zip,application/octet-stream,application/zip,application/x-zip,application/x-zip-compressed"
                id="import-button"
                type="file"
                onChange={onSelectFile}
            />
            <ButtonProgress loading={loading}>{t('Import')}</ButtonProgress>
        </label>
    );
};
