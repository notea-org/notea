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
    | 'CONFIG_FILE';

/**
 * @deprecated This function should not be used. Prefer the `config()` system.
 */
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

    return result as unknown as T;
}

export function getEnvRaw(env: AllowedEnvs, required: true): string;
export function getEnvRaw(env: AllowedEnvs, required?: false): string | undefined;
export function getEnvRaw(env: AllowedEnvs, required?: boolean): string | undefined;
export function getEnvRaw(env: AllowedEnvs, required: boolean = false): string | undefined {
    const value = process.env[env];

    if (value == null) {
        if (required) {
            throw new Error(`[Notea] ${env} is undefined`);
        } else {
            return undefined;
        }
    }

    return String(value).toLocaleLowerCase();
}

export function parseBool(str: string, invalid?: boolean): boolean;
export function parseBool(str: null | undefined): undefined;
export function parseBool(str: string | null | undefined, invalid: boolean): boolean;
export function parseBool(str: string | null | undefined, invalid?: boolean): boolean | undefined;
export function parseBool(str: string | null | undefined, invalid?: boolean): boolean | undefined {
    if (str == null) {
        return invalid ?? undefined;
    }
    switch (str.toLowerCase()) {
        case "true":
        case "1":
        case "yes":
        case "on":
            return true;
        case "false":
        case "0":
        case "no":
        case "off":
            return false;
        default:
            if (invalid == null) throw new Error("Invalid boolean: " + str);
            else return invalid;
    }
}