import { ContextProps as I18nContextProps } from 'libs/web/utils/i18n-provider';
import pino from 'pino';
import { isProbablyError } from 'libs/shared/util';

export enum IssueCategory {
    CONFIG = "config",
    MISC = "misc",
    STORE = "store",
}
export enum IssueSeverity {
    /**
     * Suggestions are issues that suggest things the user can do to improve
     * their experience with Notea.
     */
    SUGGESTION = 0,
    /**
     * Warnings are issues that aren't severe enough to cause major issues by
     * themselves, but that *could* cause worse issues.
     */
    WARNING = 1,
    /**
     * Errors are issues that are severe enough to cause major issues by themselves.
     * They don't necessarily cause the entire instance to stop working though.
     */
    ERROR = 2,
    /**
     * Fatal errors are issues that must be resolved before Notea starts working.
     */
    FATAL_ERROR = 3
}
export function getNameFromSeverity(severity: IssueSeverity, { t }: I18nContextProps) {
    switch (severity) {
        case IssueSeverity.SUGGESTION:
            return t('Suggestion');
        case IssueSeverity.WARNING:
            return t('Warning');
        case IssueSeverity.ERROR:
            return t('Error');
        case IssueSeverity.FATAL_ERROR:
            return t('Fatal error');
    }
}

export enum IssueFixRecommendation {
    NEUTRAL,
    RECOMMENDED,
    NOT_ADVISED
}
export function getNameFromRecommendation(recommendation: IssueFixRecommendation, { t }: I18nContextProps) {
    switch (recommendation) {
        case IssueFixRecommendation.NEUTRAL:
            return t('Neutral');
        case IssueFixRecommendation.RECOMMENDED:
            return t('Recommended');
        case IssueFixRecommendation.NOT_ADVISED:
            return t('Not advised');
    }
}

export interface IssueFix {
    recommendation: IssueFixRecommendation;
    description: string;
    steps?: Array<string>;
}

export interface ErrorLike {
    name?: string;
    message?: string;
    stack?: string;
}

export interface Issue {
    name: string;
    description?: string;
    category: IssueCategory;
    severity: IssueSeverity;
    fixes: Array<IssueFix>;
    cause?: string | ErrorLike;
    isRuntime?: boolean;
}

export interface LogLike {
    name: string;
    msg: string;
    pid: number;
    time: number;
    level: number;
}
export interface DebugInformation {
    issues: Array<Issue>;
    logs: Array<LogLike>; // TODO: Logging
}

export function logLevelToString(level: number) {
    return pino.levels.labels[level];
}

export function coerceToValidCause(e: any): Issue['cause'] {
    if (isProbablyError(e)) {
        return toErrorLike(e);
    }
    return String(e);
}

// NOTE(tecc): This has to be done because otherwise Next just does not play nice
export function toErrorLike(e: Error): ErrorLike {
    return {
        name: e.name,
        stack: e.stack,
        message: e.message
    };
}