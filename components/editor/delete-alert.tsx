import { Alert } from '@material-ui/lab';
import { NOTE_DELETED } from 'libs/shared/meta';
import NoteState from 'libs/web/state/note';
import useI18n from 'libs/web/hooks/use-i18n';

const Inner = () => {
    const { t } = useI18n();
    const { note } = NoteState.useContainer();

    if (note?.deleted !== NOTE_DELETED.DELETED) {
        return null;
    }

    return (
        <Alert
            icon={false}
            severity="error"
            classes={{
                root: 'mt-10 rounded-none p-2',
                message: 'p-0 m-auto space-x-4',
            }}
        >
            <span>{t('This page is in trash')}</span>
        </Alert>
    );
};

export default function DeleteAlert() {
    return <Inner />;
}
