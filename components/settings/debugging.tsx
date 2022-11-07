import { IssueList } from 'components/debug/issue-list';
import type { FC } from 'react';
import { DebugInfoCopyButton } from 'components/debug/debug-info-copy-button';
import { DebugInformation, Issue } from 'libs/shared/debugging';

export const Debugging: FC<{
    debugInfo: DebugInformation;
}> = (props) => {
    const issues: Array<Issue> = [...props.debugInfo.issues].sort((a, b) => b.severity - a.severity);
    return (
        <div className="my-2">
            <IssueList
                issues={issues}
            />
            <div className={'flex flex-row my-2'}>
                <DebugInfoCopyButton debugInfo={props.debugInfo} />
            </div>
        </div>
    );
};
