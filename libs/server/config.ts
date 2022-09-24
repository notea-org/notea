import yaml from 'js-yaml';
import * as env from 'libs/shared/env';
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
    detectCredentials: boolean;
    accessKey?: string;
    secretKey?: string;
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
    const configFile = env.getEnvRaw('CONFIG_FILE', false) ?? './notea.yml';

    let baseConfig: Configuration = {} as Configuration;
    if (existsSync(configFile)) {
        const data = readFileSync(configFile, 'utf-8');
        baseConfig = yaml.load(data) as Configuration;
    }

    const disablePassword = env.parseBool(env.getEnvRaw('DISABLE_PASSWORD', false), false);

    let auth: AuthConfiguration;
    if (!disablePassword) {
        const envPassword = env.getEnvRaw('PASSWORD', false);
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
                    throw new Error('Multiple users are not yet supported');

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
        store.detectCredentials ??= true;
        store.accessKey = env.getEnvRaw(
            'STORE_ACCESS_KEY',
            !store.detectCredentials || !store.accessKey
        ) ?? store.accessKey;
        store.secretKey = env.getEnvRaw(
            'STORE_SECRET_KEY',
            !store.detectCredentials || !store.secretKey
        ) ?? store.secretKey;
        store.bucket = env.getEnvRaw(
            'STORE_BUCKET',
            false
        ) ?? 'notea';
        store.forcePathStyle = env.parseBool(env.getEnvRaw(
            'STORE_FORCE_PATH_STYLE',
            !store.forcePathStyle
        )) ?? store.forcePathStyle;
        store.endpoint = env.getEnvRaw(
            'STORE_END_POINT',
            store.endpoint == null
        ) ?? store.endpoint;
        store.region = env.getEnvRaw(
            'STORE_REGION',
            false
        ) ?? store.region ?? 'us-east-1';
        store.prefix = env.getEnvRaw(
            'STORE_PREFIX',
            false,
        ) ?? store.prefix ?? '';
    }

    loaded = {
        auth,
        store,
        baseUrl: env.getEnvRaw('BASE_URL', false) ?? baseConfig.baseUrl,
    };
}

export function config(): Configuration {
    if (!loaded) {
        loadConfig();
    }

    return loaded as Configuration;
}
