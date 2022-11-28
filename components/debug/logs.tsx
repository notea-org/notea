import { FC } from 'react';
import { logLevelToString, LogLike } from 'libs/shared/debugging';

interface LogsProps {
    logs: Array<LogLike>
}

export const Logs: FC<LogsProps> = (props) => {
    return (
        <div className={"flex flex-col space-y-1"}>
            {props.logs.length > 0 ? props.logs.map((log, i) => {
                return (
                    <div className={"flex flex-col border-l pl-2"} key={i}>
                        <span className={"text-sm uppercase"}>
                            {logLevelToString(log.level)} at {new Date(log.time ?? 0).toLocaleString()} from <b>{log.name}</b>
                        </span>
                        <span className={"font-mono"}>
                            {log.msg}
                        </span>
                    </div>
                );
            }) : (
                <span>No logs.</span>
            )}
        </div>
    );
};