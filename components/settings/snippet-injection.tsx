import { ChangeEvent, FC, FocusEvent, useCallback, useEffect } from 'react';
import useI18n from 'libs/web/hooks/use-i18n';
import { TextField } from '@material-ui/core';
import { defaultFieldConfig } from './settings-container';
import UIState from 'libs/web/state/ui';
import { DEMO_INJECTION } from 'libs/shared/const';
import Link from 'next/link';
import { QuestionMarkCircleIcon } from '@heroicons/react/outline';

export const SnippetInjection: FC = () => {
    const { t } = useI18n();
    const {
        settings: { settings, updateSettings, setSettings },
        IS_DEMO,
    } = UIState.useContainer();

    const saveValue = useCallback(
        async (event: FocusEvent<HTMLInputElement>) => {
            await updateSettings({
                injection: event.target.value,
            });
        },
        [updateSettings]
    );

    const updateValue = useCallback(
        (event: ChangeEvent<HTMLTextAreaElement>) => {
            setSettings((prev) => ({ ...prev, injection: event.target.value }));
        },
        [setSettings]
    );

    useEffect(() => {
        if (IS_DEMO && settings.injection !== DEMO_INJECTION) {
            updateSettings({ injection: DEMO_INJECTION })
                ?.catch((v) => console.error('Error whilst updating settings: %O', v));
            setSettings((prev) => ({ ...prev, injection: DEMO_INJECTION }));
        }
    }, [settings.injection, IS_DEMO, updateSettings, setSettings]);

    return (
        <div>
            <TextField
                {...defaultFieldConfig}
                multiline
                disabled={IS_DEMO}
                label={t('Snippet injection')}
                placeholder="HTML"
                value={settings.injection}
                onChange={updateValue}
                onBlur={saveValue}
                minRows={8}
                helperText={
                    <span className="flex items-center">
                        <span>
                            {t(
                                'Inject analytics or other scripts into the HTML of your sharing page. '
                            ) +
                                (IS_DEMO
                                    ? t('Disable editing in the demo.')
                                    : '')}
                        </span>
                        <Link href="https://github.com/QingWei-Li/notea/wiki/Snippet-Injection">
                            <a target="_blank" rel="noreferrer">
                                <QuestionMarkCircleIcon className="w-4 text-gray-500 hover:text-gray-700" />
                            </a>
                        </Link>
                    </span>
                }
            ></TextField>
        </div>
    );
};
