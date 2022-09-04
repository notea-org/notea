import { FC, useCallback, useState } from 'react';
import useI18n from 'libs/web/hooks/use-i18n';
import { ButtonProps } from './type';
import { ROOT_ID } from 'libs/shared/tree';
import Link from 'next/link';
import { ButtonProgress } from 'components/button-progress';

export const ExportButton: FC<ButtonProps> = ({ parentId = ROOT_ID }) => {
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
        <Link href={`/api/export?pid=${parentId}`}>
            <ButtonProgress onClick={handleClick} loading={loading}>
                {t('Export')}
            </ButtonProgress>
        </Link>
    );
};
