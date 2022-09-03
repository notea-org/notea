import { FC } from 'react';

export const SettingsHeader: FC<{
    title: string;
    id: string;
    description?: string;
}> = ({ title, id, description }) => {
    return (
        <>
            <h3 className="my-2" id={id}>
                <a href={`#${id}`}>{title}</a>
            </h3>
            <p className="text-gray-500 text-sm">{description}</p>
        </>
    );
};
