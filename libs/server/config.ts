import yaml from 'js-yaml';
import * as env from 'libs/shared/env';
import { existsSync, readFileSync } from 'fs';
import {
    coerceToValidCause,
    createLogger,
    Issue,
    IssueCategory,
    IssueFixRecommendation,
    IssueSeverity
} from 'libs/server/debugging';

const logger = createLogger("config");

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
    proxyAttachments: boolean;
}

export type StoreConfiguration = S3StoreConfiguration;

export interface ServerConfiguration {
    useSecureCookies: boolean;
    baseUrl?: string;
}

export interface Configuration {
    auth: AuthConfiguration;
    store: StoreConfiguration;
    server: ServerConfiguration;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
let loaded: Configuration | undefined = undefined;

enum ErrTitle {
    CONFIG_FILE_READ_FAIL = 'Failed to load configuration file',
    INVALID_AUTH_CONFIG = 'Invalid authorisation configuration',
    CONFIG_FILE_PARSE_FAIL = 'Could not parse configuration file',
    INVALID_STORE_CONFIG = 'Invalid store configuration',
}

export function loadConfigAndListErrors(): {
    config?: Configuration;
    errors: Array<Issue>;
} {
    logger.debug("Loading configuration from scratch (loadConfigAndListErrors)");
    // TODO: More config errors
    const configFile = env.getEnvRaw('CONFIG_FILE', false) ?? './notea.yml';
    const errors: Array<Issue> = [];

    let baseConfig: Configuration = {} as Configuration;
    if (existsSync(configFile)) {
        let data;
        try {
            data = readFileSync(configFile, 'utf-8');
        } catch (e) {
            errors.push({
                name: ErrTitle.CONFIG_FILE_READ_FAIL,
                description: "The configuration file couldn't be read.",
                cause: coerceToValidCause(e),
                severity: IssueSeverity.WARNING,
                category: IssueCategory.CONFIG,
                fixes: [
                    {
                        description: "Make sure Notea has read access to the configuration file",
                        recommendation: IssueFixRecommendation.NEUTRAL,
                    },
                    {
                        description: 'Make sure no other programme is using the configuration file',
                        recommendation: IssueFixRecommendation.NEUTRAL
                    }
                ],
            });
        }
        if (data) {
            try {
                baseConfig = yaml.load(data) as Configuration;
            } catch (e) {
                errors.push({
                    name: ErrTitle.CONFIG_FILE_PARSE_FAIL,
                    description:
                        'The configuration file could not be parsed, probably due to a syntax error.',
                    severity: IssueSeverity.WARNING,
                    category: IssueCategory.CONFIG,
                    cause: coerceToValidCause(e),
                    fixes: [
                        {
                            description: 'Check your configuration file for syntax errors.',
                            recommendation: IssueFixRecommendation.RECOMMENDED
                        }
                    ],
                });
            }
        }
    }

    const disablePassword = env.parseBool(
        env.getEnvRaw('DISABLE_PASSWORD', false),
        false
    );

    let auth: AuthConfiguration = { type: 'none' };
    if (!disablePassword) {
        const envPassword = env.getEnvRaw('PASSWORD', false);
        if (baseConfig.auth === undefined) {
            if (envPassword === undefined) {
                errors.push({
                    name: ErrTitle.INVALID_AUTH_CONFIG,
                    description:
                        'Neither the configuration file, the PASSWORD environment variable, nor the DISABLE_PASSWORD environment variable was set.',
                    severity: IssueSeverity.FATAL_ERROR,
                    category: IssueCategory.CONFIG,
                    fixes: [
                        {
                            description: 'Include an auth section the configuration file',
                            recommendation: IssueFixRecommendation.RECOMMENDED,
                        },
                        {
                            description: 'Set the password using the environment variable',
                            recommendation: IssueFixRecommendation.NEUTRAL,
                        },
                        {
                            description: 'Disable authentication',
                            recommendation: IssueFixRecommendation.NOT_ADVISED
                        }
                    ],
                });
            } else {
                auth = {
                    type: 'basic',
                    password: envPassword.toString(),
                };
            }
        } else {
            auth = baseConfig.auth;
            if (envPassword !== undefined) {
                errors.push({
                    name: ErrTitle.INVALID_AUTH_CONFIG,
                    description:
                        'The PASSWORD environment variable cannot be set when the file configuration contains an auth section.',
                    category: IssueCategory.CONFIG,
                    severity: IssueSeverity.FATAL_ERROR,
                    fixes: [
                        {
                            description: "Don't set the PASSWORD environment variable prior to running Notea.",
                            recommendation: IssueFixRecommendation.RECOMMENDED
                        },
                        {
                            description: 'Remove the auth section from your file configuration.',
                            recommendation: IssueFixRecommendation.NEUTRAL
                        }
                    ],
                });
            }
            if (auth.type === 'basic') {
                if (auth.users) {
                    // TEMPORARILY;
                    errors.push({
                        name: ErrTitle.INVALID_AUTH_CONFIG,
                        description: 'Multiple users are not yet supported',
                        severity: IssueSeverity.FATAL_ERROR,
                        category: IssueCategory.CONFIG,
                        fixes: [
                            {
                                description: "Change to a single-user configuration.",
                                recommendation: IssueFixRecommendation.RECOMMENDED
                            }
                        ]
                    });

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
    try {
        store.detectCredentials ??= true;
        store.accessKey = env.getEnvRaw(
            'STORE_ACCESS_KEY',
            !store.detectCredentials && !store.accessKey
        ) ?? store.accessKey;
        store.secretKey = env.getEnvRaw(
            'STORE_SECRET_KEY',
            !store.detectCredentials && !store.secretKey
        ) ?? store.secretKey;
        store.bucket = env.getEnvRaw(
            'STORE_BUCKET',
            false
        ) ?? 'notea';
        store.forcePathStyle = env.parseBool(env.getEnvRaw(
            'STORE_FORCE_PATH_STYLE',
            false
        )) ?? store.forcePathStyle ?? false;
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
        store.proxyAttachments = env.parseBool(
            env.getEnvRaw('DIRECT_RESPONSE_ATTACHMENT', false),
            store.proxyAttachments ?? false
        );
    } catch (e) {
        errors.push({
            name: ErrTitle.INVALID_STORE_CONFIG,
            description: 'Could not load configuration for store',
            severity: IssueSeverity.FATAL_ERROR,
            category: IssueCategory.CONFIG,
            cause: coerceToValidCause(e),
            fixes: []
        });
    }

    let server: ServerConfiguration;
    if (!baseConfig.server) {
        server = {} as ServerConfiguration;
    } else {
        server = baseConfig.server;
    }
    {
        server.useSecureCookies = env.parseBool(
            env.getEnvRaw('COOKIE_SECURE', false),
            server.useSecureCookies ?? process.env.NODE_ENV === 'production'
        );
        server.baseUrl = env.getEnvRaw('BASE_URL', false) ?? server.baseUrl;
    }

    return {
        config: {
            auth,
            store,
            server,
        },
        errors,
    };
}

const MAX_ERRORS = 2;
export function loadConfig() {
    const result = loadConfigAndListErrors();

    if (!result.config) {
        const { errors } = result;
        let name = errors
            .slice(0, MAX_ERRORS)
            .map((v) => v.name)
            .join(', ');
        if (errors.length > MAX_ERRORS) {
            const rest = errors.length - MAX_ERRORS;
            name += ' and ' + rest + ' other error' + (rest > 1 ? 's' : '');
        }
        throw new Error(name);
    }

    loaded = result.config;

    return loaded;
}

export function config(): Configuration {
    if (!loaded) {
        logger.debug("Loading configuration");
        loadConfig();
        logger.debug("Successfully loaded configuration");
    }

    return loaded as Configuration;
}
