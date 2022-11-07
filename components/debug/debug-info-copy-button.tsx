import { Button } from '@material-ui/core';
import useI18n from 'libs/web/hooks/use-i18n';
import { FC } from 'react';
import { logLevelToString, DebugInformation } from 'libs/shared/debugging';

export const DebugInfoCopyButton: FC<{
    debugInfo: DebugInformation;
}> = ({ debugInfo }) => {
    const { t } = useI18n();

    function generateDebugInfo(): string {
        let data =
            'Notea debug information' +
            '\nTime ' +
            new Date(Date.now()).toISOString() +
            '\n\n';
        function ensureNewline() {
            if (!data.endsWith('\n') && data.length >= 1) {
                data += '\n';
            }
        }

        if (debugInfo.issues.length > 0) {
            ensureNewline();
            data += 'Configuration errors: ';
            let i = 1;
            const prefixLength = debugInfo.issues.length.toString().length;
            for (const issue of debugInfo.issues) {
                const prefix = i.toString().padStart(prefixLength, ' ') + ': ';
                const empty = ' '.repeat(prefixLength + 2);

                data += prefix + issue.name;
                data += empty + '// ' + issue.cause;
                data += empty + issue.description;
                i++;
            }
        } else {
            data += 'No detected configuration errors.';
        }

        if (debugInfo.logs.length > 0) {
            ensureNewline();
            for (const log of debugInfo.logs) {
                data += `[${new Date(log.time).toISOString()} ${log.name}] ${logLevelToString(log.level)}: ${log.msg}`;
            }
        }



        return data;
    }

    function copyDebugInfo() {
        const text = generateDebugInfo();

        navigator.clipboard
            .writeText(text)
            .then(() => {
                // nothing
            })
            .catch((e) => {
                console.error(
                    'Error when trying to copy debugging information to clipboard: %O',
                    e
                );
            });
    }

    return (
        <Button variant="contained" onClick={copyDebugInfo}>
            {t('Copy debugging information')}
        </Button>
    );
};
