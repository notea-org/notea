import { loadConfigAndListErrors } from 'libs/server/config';
import pino from 'pino';
import pinoPretty from 'pino-pretty';
import Logger = pino.Logger;
import * as path from 'path';
import * as fs from 'fs';
import { DebugInformation, Issue } from 'libs/shared/debugging';

export * from 'libs/shared/debugging'; // here's a lil' lesson in trickery

const runtimeIssues: Array<Issue> = [];
export function reportRuntimeIssue(issue: Issue) {
    runtimeIssues.push({
        ...issue,
        isRuntime: true
    });
}

export function findIssues(): Array<Issue> {
    const issues: Array<Issue> = [];

    const cfg = loadConfigAndListErrors();
    issues.push(...cfg.errors);

    issues.push(...runtimeIssues);

    return issues;
}

export function collectDebugInformation(): DebugInformation {
    const issues = findIssues();
    return {
        issues,
        logs: []
    };
}

function getLogFile(name: string) {
    const dir = path.resolve(process.cwd(), process.env.LOG_DIRECTORY ?? 'logs');

    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, {
            recursive: true
        });
    }

    return path.resolve(dir, `${name}.log`);
}

const loggerTransport: Parameters<typeof pino.multistream>[0] = [
    {
        stream: fs.createWriteStream(getLogFile('debug'), { flags: 'a' }),
        level: "debug"
    },
    {
        stream: pinoPretty(),
        level: "info"
    }
];

const multistream = pino.multistream(loggerTransport);

export function createLogger(name: string): Logger {
    return pino({
        name,
        level: "trace",
    }, multistream);
}