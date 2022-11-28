import { FC } from 'react';
import { Issue } from 'libs/shared/debugging';
import { Issue as IssueDisplay } from './issue';

export const IssueList: FC<{
    issues: Array<Issue>;
}> = ({ issues }) => {
    return (
        <div className="flex flex-col">
            {issues.map((v, i) => {
                return (
                    <IssueDisplay key={i} issue={v} id={`issue-${i}`}/>
                );
            })}
        </div>
    );
};
