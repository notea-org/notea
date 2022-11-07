import { api } from 'libs/server/connect';
import { useAuth } from 'libs/server/middlewares/auth';
import { useStore } from 'libs/server/middlewares/store';
import { getPathSettings } from 'libs/server/note-path';
import { formatSettings, Settings } from 'libs/shared/settings';
import { isEqual } from 'lodash';
import { tryJSON } from 'libs/shared/str';
import { StoreProvider } from 'libs/server/store';
import { IssueCategory, IssueFixRecommendation, IssueSeverity, reportRuntimeIssue } from 'libs/server/debugging';

export async function getSettings(store: StoreProvider): Promise<Settings> {
    const settingsPath = getPathSettings();
    let settings;
    try {
        if (await store.hasObject(settingsPath)) {
            settings = tryJSON<Settings>(
                await store.getObject(settingsPath)
            );
        }
    } catch (e) {
        reportRuntimeIssue({
            category: IssueCategory.STORE,
            severity: IssueSeverity.FATAL_ERROR,
            name: "Could not get settings",
            cause: String(e),
            fixes: [
                {
                    description: "Make sure Notea can connect to the store.",
                    recommendation: IssueFixRecommendation.RECOMMENDED
                }
            ]
        });
        throw e;
    }
    const formatted = formatSettings(settings || {});

    if (!settings || !isEqual(settings, formatted)) {
        await store.putObject(getPathSettings(), JSON.stringify(formatted));
        return formatted;
    }
    return settings;
}

export default api()
    .use(useAuth)
    .use(useStore)
    .post(async (req, res) => {
        const { body } = req;
        const prev = await getSettings(req.state.store);
        const settings = formatSettings({
            ...prev,
            ...body,
        });

        await req.state.store.putObject(
            getPathSettings(),
            JSON.stringify(settings)
        );
        res.status(204).end();
    })
    .get(async (req, res): Promise<void> => {
        const settings = await getSettings(req.state.store);

        res.json(settings);
    });
