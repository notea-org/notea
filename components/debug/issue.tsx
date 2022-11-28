import { FC } from 'react';
import {
    getNameFromRecommendation,
    getNameFromSeverity,
    Issue as IssueInfo,
    IssueFix,
    IssueSeverity
} from 'libs/shared/debugging';
import {
    Accordion as MuiAccordion,
    AccordionDetails as MuiAccordionDetails,
    AccordionSummary as MuiAccordionSummary,
    withStyles
} from '@material-ui/core';
import { ChevronDownIcon } from '@heroicons/react/outline';
import useI18n from 'libs/web/hooks/use-i18n';
import { errorToString, isProbablyError } from 'libs/shared/util';

const Accordion = withStyles({
    root: {
        boxShadow: 'none',
        '&:not(:last-child)': {
            borderBottom: 0,
        },
        '&:before': {
            display: 'none',
        },
        '&$expanded': {
            margin: 'auto 0',
        },
    },
    expanded: {
    },
})(MuiAccordion);

const AccordionSummary = withStyles({
    root: {
        backgroundColor: 'rgba(0, 0, 0, .03)',
        borderBottom: '1px solid rgba(0, 0, 0, .125)',
        borderTopRightRadius: 'inherit',
        borderBottomRightRadius: 'inherit',
        marginBottom: -1,
        minHeight: 56,
        '&$expanded': {
            minHeight: 56,
            borderBottomRightRadius: '0'
        },
    },
    content: {
        '&$expanded': {
            margin: '12px 0',
        }
    },
    expanded: {},
})(MuiAccordionSummary);

const AccordionDetails = withStyles((theme) => ({
    root: {
        padding: theme.spacing(2),
    },
}))(MuiAccordionDetails);

interface FixProps {
    id: string;
    fix: IssueFix;
}
const Fix: FC<FixProps> = ({ id, fix }) => {
    const i18n = useI18n();
    const { t } = i18n;
    const steps = fix.steps ?? [];
    return (
        <Accordion key={id} className={"bg-gray-300"}>
            <AccordionSummary
                expandIcon={<ChevronDownIcon width=".8em"/>}
                aria-controls={`${id}-details`}
                id={`${id}-summary`}
            >
                <div className={"flex flex-col"}>
                    {fix.recommendation !== 0 && (
                        <span className={"text-xs uppercase"}>{getNameFromRecommendation(fix.recommendation, i18n)}</span>
                    )}
                    <span className={"font-bold"}>{fix.description}</span>
                </div>
            </AccordionSummary>
            <AccordionDetails className={"rounded-[inherit]"}>
                {steps.length > 0 ? (
                    <ol className="list-decimal list-inside">
                        {steps.map((step, i) => {
                            const stepId = `${id}-step-${i}`;
                            return (
                                <li key={stepId}>{step}</li>
                            );
                        })}
                    </ol>
                ) : (
                    <span>{t('No steps were provided by Notea to perform this fix.')}</span>
                )}
            </AccordionDetails>
        </Accordion>
    );
};

interface IssueProps {
    issue: IssueInfo;
    id: string;
}

export const Issue: FC<IssueProps> = function (props) {
    const { issue, id } = props;
    const i18n = useI18n();
    const { t } = i18n;

    let borderColour: string;
    switch (issue.severity) {
        case IssueSeverity.SUGGESTION:
            borderColour = "border-gray-500";
            break;
        case IssueSeverity.WARNING:
            borderColour = "border-yellow-100";
            break;
        case IssueSeverity.ERROR:
            borderColour = "border-red-500";
            break;
        case IssueSeverity.FATAL_ERROR:
            borderColour = "border-red-300";
            break;
    }

    const Cause: FC<{ value: IssueInfo['cause'] }> = ({ value }) => {
        if (typeof value === 'string') {
            return (
                <div className={"flex flex-row my-1"}>
                    <span className={"font-bold"}>{t('Cause')}</span>
                    <span className={"font-mono ml-1"}>{value}</span>
                </div>
            );
        }

        if (isProbablyError(value)) {
            return (
                <div className={"flex flex-col my-1"}>
                    <span className={"font-bold"}>{t('Cause')}</span>
                    <pre className={"font-mono whitespace-pre"}>{errorToString(value)}</pre>
                </div>
            );
        }

        throw new Error("Invalid value type");
    };

    return (
        <Accordion className={`border-l-4 ${borderColour} bg-gray-200`}>
            <AccordionSummary
                className={"bg-gray-100"}
                expandIcon={<ChevronDownIcon width=".8em"/>}
                aria-controls={`${id}-details`}
                id={`${id}-summary`}
            >
                <div className={"flex flex-col bg-transparent"}>
                    <span className={"text-xs uppercase"}>
                        {issue.isRuntime === true ? 'Runtime ' : ''}
                        {getNameFromSeverity(issue.severity, i18n)}
                    </span>
                    <span className={"font-bold"}>{issue.name}</span>
                </div>
            </AccordionSummary>
            <AccordionDetails className={"flex flex-col"}>
                <span>{issue.description ?? t('No description was provided for this issue.')}</span>
                {issue.cause && <Cause value={issue.cause}/>}

                {issue.fixes.length > 0 ? (
                    <div className={"mt-1 flex flex-col"}>
                        <span className={"font-bold"}>{t('Potential fixes')}</span>
                        <div>
                            {issue.fixes.map((fix, i) => {
                                const fixId = `${id}-fix-${i}`;
                                return (
                                    <Fix
                                        key={fixId}
                                        id={fixId}
                                        fix={fix}
                                    />
                                );
                            })}
                        </div>
                    </div>
                ) : (
                    <span>{t('No fixes are known by Notea for this issue.')}</span>
                )}
            </AccordionDetails>
        </Accordion>
    );
};