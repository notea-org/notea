import { ChangeEvent, FC, useCallback, useEffect, useState } from 'react';
import useI18n from 'libs/web/hooks/use-i18n';
import Link from 'next/link';
import { ButtonProgress } from 'components/button-progress';
import { ButtonProps } from 'components/settings/type';
import useFetcher from 'libs/web/api/fetcher';
import { useToast } from 'libs/web/hooks/use-toast';
import { useRouter } from 'next/router';
import { IMPORT_FILE_LIMIT_SIZE } from 'libs/shared/const';

const CreateManualBackup: FC<ButtonProps> = () => {
    const { t } = useI18n();
    const [loading, setLoading] = useState(false);

    // Fake waiting time
    const handleClick = useCallback(() => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
        }, 2000);
    }, []);

    return (
        <Link href={`/api/export?type=notea`}>
            <ButtonProgress onClick={handleClick} loading={loading}>
                {t('Create manual backup')}
            </ButtonProgress>
        </Link>
    );
};

const RestoreBackup: FC<ButtonProps> = () => {
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
                    url: '/api/import?type=backup',
                },
                data
            );

            event.target.value = '';
            if (!result) return;
            if (!result?.imported) {
                return toast(t('Not found markdown file'), 'warning');
            }
            toast(
                t('Successfully restored {{n}} markdown files', {
                    n: result?.imported,
                }),
                'success'
            );
            /**
             * @todo fetch tree without reload page
             */
            router.reload();
        },
        [request, router, t, toast]
    );

    useEffect(() => {
        if (error) {
            toast(error, 'error');
        }
    }, [error, toast]);

    return (
        <label htmlFor="restore-button">
            <input
                hidden
                accept="zip,application/octet-stream,application/zip,application/x-zip,application/x-zip-compressed"
                id="restore-button"
                type="file"
                onChange={onSelectFile}
            />
            <ButtonProgress loading={loading}>{t('Restore')}</ButtonProgress>
        </label>
    );
};

export const Backups: FC = () => {
    const { t } = useI18n();
    // const { tree } = NoteTreeState.useContainer();
    // const options = useTreeOptions(tree);

    return (
        <div className="flex flex-col">
            <div>
                <h4 className="my-2">{t('Manual')}</h4>
                <div className="space-x-4 flex mt-2">
                    <CreateManualBackup/>
                    <RestoreBackup/>
                </div>
            </div>
            {/* TODO: Automatic stuff
            <div>
                <h4 className="my-2">{t('Automatic')}</h4>
            </div>*/}
        </div>
    );
};
