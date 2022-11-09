import { loadConfigAndListErrors } from 'libs/server/config';
import pino from 'pino';
import pinoPretty from 'pino-pretty';
import * as path from 'path';
import * as fs from 'fs';
import { coerceToValidCause, DebugInformation, Issue, IssueCategory, IssueSeverity } from 'libs/shared/debugging';
import Logger = pino.Logger;

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

    try {
        const cfg = loadConfigAndListErrors();
        issues.push(...cfg.errors);
    } catch (e) {
        issues.push({
            severity: IssueSeverity.FATAL_ERROR,
            category: IssueCategory.CONFIG,
            name: "Cannot load config",
            cause: coerceToValidCause(e),
            fixes: []
        });
    }

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