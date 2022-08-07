type AllowedEnvs =
    | 'PASSWORD'
    | 'STORE_ACCESS_KEY'
    | 'STORE_SECRET_KEY'
    | 'STORE_BUCKET'
    | 'STORE_END_POINT'
    | 'STORE_REGION'
    | 'STORE_FORCE_PATH_STYLE'
    | 'COOKIE_SECURE'
    | 'BASE_URL'
    | 'DISABLE_PASSWORD'
    | 'DIRECT_RESPONSE_ATTACHMENT'
    | 'IS_DEMO'
    | 'STORE_PREFIX'

export function getEnv<T>(
    env: AllowedEnvs,
    defaultValue?: any,
    required = false
): T {
    const value = process.env[env];

    if (!value) {
        if (required && !defaultValue) {
            throw new Error(`[Notea] \`${env}\` is required`);
        }

        return defaultValue;
    }

    const v = value.toLocaleLowerCase();
    let result;

    if (v === 'false') {
        result = false;
    } else if (v === 'true') {
        result = true;
    } else if (/^\d+$/.test(v)) {
        result = (v as any) * 1;
    } else {
        result = value;
    }

    return (result as unknown) as T;
}
