import { Settings } from 'libs/shared/settings';
import useSettingsAPI from 'libs/web/api/settings';
import { useState, useCallback } from 'react';

export default function useSettings(initData = {} as Settings) {
    const [settings, setSettings] = useState<Settings>(initData);
    const { mutate } = useSettingsAPI();

    const updateSettings = useCallback(
        async (body: Partial<Settings>) => {
            await mutate(body);

            setSettings((prev) => {
                return {
                    ...prev,
                    ...body,
                };
            });
        },
        [mutate]
    );

    return { settings, updateSettings, setSettings };
}
