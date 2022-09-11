import yaml from 'js-yaml';
import { getEnv } from 'libs/shared/env';
import { existsSync, readFileSync } from 'fs';

export type BasicUser = { username: string; password: string };
type BasicMultiUserConfiguration = {
    username?: never;
    password?: never;
    users: BasicUser[];
};
type BasicSingleUserConfiguration = { username?: string; password: string } & {
    users?: never;
};
export type BasicAuthConfiguration = { type: 'basic' } & (
    | BasicSingleUserConfiguration
    | BasicMultiUserConfiguration
);
export type AuthConfiguration = { type: 'none' } | BasicAuthConfiguration;

export interface S3StoreConfiguration {
    accessKey: string;
    secretKey: string;
    bucket: string;
    endpoint: string;
    region: string;
    forcePathStyle: boolean;
    prefix: string;
}

export type StoreConfiguration = S3StoreConfiguration;

export interface Configuration {
    auth: AuthConfiguration;
    store: StoreConfiguration;
    baseUrl?: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
let loaded: Configuration | undefined = undefined;

export function loadConfig() {
    const configFile = String(getEnv('CONFIG_FILE', './notea.yml'));

    let baseConfig: Configuration = {} as Configuration;
    if (existsSync(configFile)) {
        const data = readFileSync(configFile, 'utf-8');
        baseConfig = yaml.load(data) as Configuration;
    }

    const disablePassword = getEnv<boolean>('DISABLE_PASSWORD', undefined);

    let auth: AuthConfiguration;
    if (disablePassword === undefined || !disablePassword) {
        const envPassword = getEnv<string>('PASSWORD', undefined, false);
        if (baseConfig.auth === undefined) {
            if (envPassword === undefined) {
                throw new Error('Authentication undefined');
            } else {
                auth = {
                    type: 'basic',
                    password: envPassword.toString(),
                };
            }
        } else {
            auth = baseConfig.auth;
            if (envPassword !== undefined) {
                throw new Error(
                    'Cannot specify PASSWORD when auth config section is present'
                );
            }
            if (auth.type === 'basic') {
                if (auth.users) {
                    // TEMPORARILY;
                    throw new Error("Multiple users are not yet supported");

                    /*for (const user of auth.users) {
                        user.username = user.username.toString();
                        user.password = user.password.toString();
                    }*/
                } else {
                    auth.username = auth.username?.toString();
                    auth.password = auth.password.toString();
                }
            }
        }
    } else {
        auth = { type: 'none' };
    }

    let store: StoreConfiguration;

    if (!baseConfig.store) {
        store = {} as StoreConfiguration;
    } else {
        store = baseConfig.store;
    }
    // for now, this works
    {
        store.accessKey = getEnv<string>(
            'STORE_ACCESS_KEY',
            store.accessKey,
            !store.accessKey
        ).toString();
        store.secretKey = getEnv<string>(
            'STORE_SECRET_KEY',
            store.secretKey,
            !store.secretKey
        ).toString();
        store.bucket = getEnv<string>(
            'STORE_BUCKET',
            store.bucket ?? 'notea',
            false
        ).toString();
        store.forcePathStyle = getEnv<boolean>(
            'STORE_FORCE_PATH_STYLE',
            store.forcePathStyle ?? false,
            !store.forcePathStyle
        );
        store.endpoint = getEnv<string>(
            'STORE_END_POINT',
            store.endpoint,
            !store.endpoint
        );
        store.region = getEnv<string>(
            'STORE_REGION',
            store.region ?? 'us-east-1',
            false
        ).toString();
        store.prefix = getEnv<string>(
            'STORE_PREFIX',
            store.prefix ?? '',
            false
        );
    }

    loaded = {
        auth,
        store,
        baseUrl: getEnv<string>('BASE_URL')?.toString() ?? baseConfig.baseUrl,
    };
}

export function config(): Configuration {
    if (!loaded) {
        loadConfig();
    }

    return loaded as Configuration;
}
