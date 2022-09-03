import { NextApiRequest } from 'next';
import {
    BasicAuthConfiguration,
    config,
    Configuration,
} from 'libs/server/config';

export const NO_UID = '' as const;
export type AuthenticationData = { uid: string };

export function basicAuthenticate(
    request: NextApiRequest
): AuthenticationData | false {
    const cfg = config().auth as BasicAuthConfiguration;
    if (cfg.users) {
        // Multi-user configuration takes precedence over single-user
        const { username, password } = request.body;
        if (!username || !password) {
            throw new Error('Username and password must be specified');
        }
        for (const user of cfg.users) {
            if (user.username !== username) {
                continue;
            }
            if (user.password !== password) {
                continue;
            }
            return { uid: username };
        }
        return false;
    } else {
        if (!!cfg.username && cfg.username !== request.body.username) {
            return false;
        }
        if (cfg.password !== request.body.password) {
            return false;
        }
        return { uid: NO_UID };
    }
}

// NOTE(tecc): It's async in case we want to expand later
export async function authenticate(
    request: NextApiRequest
): Promise<false | AuthenticationData> {
    const cfg = config();
    switch (cfg.auth.type) {
        case 'none':
            return { uid: NO_UID };
        case 'basic':
            return basicAuthenticate(request);

        default:
            // NOTE(tecc): Weird hack here to get around type restrictions
            throw new Error(
                `Cannot authenticate against authentication type ${
                    (cfg as Configuration).auth.type
                }`
            );
    }
}
