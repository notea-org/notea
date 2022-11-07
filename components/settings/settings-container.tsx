import { TextFieldProps } from '@material-ui/core';
import { FC } from 'react';
import { DailyNotes } from './daily-notes';
import { Language } from './language';
import { Theme } from './theme';
import { EditorWidth } from './editor-width';
import { ImportOrExport } from './import-or-export';
import { SnippetInjection } from './snippet-injection';
import useI18n from 'libs/web/hooks/use-i18n';
import { SettingsHeader } from './settings-header';
import { Debugging } from 'components/settings/debugging';
import { DebugInformation } from 'libs/shared/debugging';

export const defaultFieldConfig: TextFieldProps = {
    fullWidth: true,
    margin: 'normal',
    size: 'small',
    variant: 'outlined',
    InputLabelProps: {
        shrink: true,
    },
    classes: {
        root: 'text-lg',
    },
};

const HR = () => {
    return <hr className="my-10 border-gray-200" />;
};

export const SettingsContainer: FC<{
    debugInfo: DebugInformation
}> = (props) => {
    const { t } = useI18n();

    return (
        <section>
            <SettingsHeader id="basic" title={t('Basic')}></SettingsHeader>
            <DailyNotes></DailyNotes>
            <Language></Language>
            <Theme></Theme>
            <EditorWidth></EditorWidth>

            <HR />
            <SettingsHeader
                id="import-and-export"
                title={t('Import & Export')}
                description={t(
                    'Import a zip file containing markdown files to this location, or export all pages from this location.'
                )}
            ></SettingsHeader>
            <ImportOrExport></ImportOrExport>

            <HR />
            <SettingsHeader id="sharing" title={t('Sharing')}></SettingsHeader>
            <SnippetInjection></SnippetInjection>

            <HR />
            <SettingsHeader
                id="debug"
                title={t('Debugging')}
                description={t(
                    'Provides information about your Notea instance that can be helpful when trying to fix problems.'
                )}
            />
            <Debugging debugInfo={props.debugInfo} />
        </section>
    );
};
