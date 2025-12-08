import { FC, useMemo } from 'react';
import { DatabaseProperty, Block as BlockInterface, PropertyType } from 'libs/shared/block';
import { PlusIcon } from '@heroicons/react/solid';

interface DatabaseBoardViewProps {
    properties: DatabaseProperty[];
    processedRows: BlockInterface[];
    handleAddRow: (initialProps?: Record<string, any>) => void;
    onUpdateBlock: (id: string, data: any) => void;
    onUpdateProperties: (properties: DatabaseProperty[]) => void;
    groupBy?: string;
    onGroupByChange?: (propertyId: string) => void;
    onOpenRow?: (id: string) => void;
}

export const DatabaseBoardView: FC<DatabaseBoardViewProps> = ({
    properties,
    processedRows,
    handleAddRow,
    onUpdateBlock: _onUpdateBlock,
    onUpdateProperties: _onUpdateProperties,
    groupBy,
    onGroupByChange,
    onOpenRow
}) => {
    // Find valid group-by properties (Select or Multi-select)
    const groupableProperties = useMemo(() =>
        properties.filter((p) => p.type === PropertyType.SELECT || p.type === PropertyType.MULTI_SELECT),
        [properties]
    );

    // If no groupBy is provided, try to pick the first one
    const activeGroupBy = groupBy || (groupableProperties.length > 0 ? groupableProperties[0].id : undefined);

    const groupedProperty = properties.find((p) => p.id === activeGroupBy);

    // Group rows by options
    const groups = useMemo(() => {
        if (!groupedProperty) return { options: [], map: {} };

        const options = groupedProperty.options || [];
        const groupsMap: Record<string, BlockInterface[]> = {};
        
        // Initialize groups for each option
        options.forEach((opt) => {
            groupsMap[opt.id] = [];
        });
        groupsMap['uncategorized'] = [];

        // Distribute rows
        processedRows.forEach((row) => {
            const val = row.data.properties?.[groupedProperty.id];
            if (!val || (Array.isArray(val) && val.length === 0)) {
                groupsMap['uncategorized'].push(row);
            } else if (Array.isArray(val)) {
                // For multi-select, add to first matching group (simplification)
                const firstId = val[0];
                if (groupsMap[firstId]) {
                    groupsMap[firstId].push(row);
                } else {
                    groupsMap['uncategorized'].push(row);
                }
            } else {
                if (groupsMap[val]) {
                    groupsMap[val].push(row);
                } else {
                    groupsMap['uncategorized'].push(row);
                }
            }
        });

        return {
            options,
            map: groupsMap
        };
    }, [processedRows, groupedProperty]);

    if (!activeGroupBy || !groupedProperty) {
        return (
            <div className="p-8 text-center bg-gray-50 rounded border border-dashed text-gray-500">
                <p>To use Board view, add a Select or Multi-select property.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col space-y-4 h-full">
            {/* View Controls */}
            <div className="flex items-center space-x-2 px-1">
                <span className="text-xs text-gray-500 font-medium">Group by:</span>
                <select 
                    className="text-xs border-gray-300 rounded p-1 py-0.5"
                    value={activeGroupBy}
                    onChange={(e) => onGroupByChange?.(e.target.value)}
                >
                    {groupableProperties.map((p) => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                </select>
            </div>

            <div className="flex overflow-x-auto pb-4 space-x-4 h-full min-h-[400px]">
                {/* Uncategorized Column */}
                <div className="flex-shrink-0 w-72 flex flex-col bg-gray-50 rounded-md max-h-[600px]">
                    <div className="p-3 font-medium text-sm text-gray-500 flex items-center justify-between sticky top-0 bg-gray-50 z-10">
                        <span className="bg-gray-200 px-2 py-0.5 rounded text-xs">No Status</span>
                        <span className="text-gray-400 text-xs">{groups.map['uncategorized'].length}</span>
                    </div>
                    <div className="p-2 space-y-2 flex-1 overflow-y-auto">
                        {groups.map['uncategorized'].map((row) => (
                            <BoardCard 
                                key={row.id} 
                                row={row} 
                                properties={properties}
                                groupPropertyId={groupedProperty.id}
                                onOpenRow={onOpenRow}
                            />
                        ))}
                        <button 
                            className="w-full text-left p-2 text-gray-400 hover:bg-gray-100 rounded text-sm flex items-center"
                            onClick={handleAddRow}
                        >
                            <PlusIcon className="w-4 h-4 mr-1" /> New
                        </button>
                    </div>
                </div>

                {/* Option Columns */}
                {groups.options.map((opt) => (
                    <div key={opt.id} className="flex-shrink-0 w-72 flex flex-col bg-gray-50 rounded-md max-h-[600px]">
                        <div className="p-3 font-medium text-sm text-gray-700 flex items-center justify-between sticky top-0 bg-gray-50 z-10">
                            <span className="px-2 py-0.5 rounded text-xs" style={{ backgroundColor: opt.color || '#e5e7eb' }}>
                                {opt.name}
                            </span>
                            <span className="text-gray-400 text-xs">{groups.map[opt.id].length}</span>
                        </div>
                        <div className="p-2 space-y-2 flex-1 overflow-y-auto">
                            {groups.map[opt.id].map((row) => (
                                <BoardCard 
                                    key={row.id} 
                                    row={row} 
                                    properties={properties}
                                    groupPropertyId={groupedProperty.id}
                                    onOpenRow={onOpenRow}
                            />
                        ))}
                        <button 
                            className="w-full text-left p-2 text-gray-400 hover:bg-gray-100 rounded text-sm flex items-center"
                            onClick={() => handleAddRow({ [groupedProperty.id]: groupedProperty.type === PropertyType.MULTI_SELECT ? [opt.id] : opt.id })}
                        >
                            <PlusIcon className="w-4 h-4 mr-1" /> New
                        </button>
                    </div>
                </div>
            ))}
        </div>
    </div>
    );
};

const BoardCard: FC<{
    row: BlockInterface;
    properties: DatabaseProperty[];
    groupPropertyId: string;
    onOpenRow?: (id: string) => void;
}> = ({ row, properties, groupPropertyId, onOpenRow }) => {
    return (
        <div 
            className="bg-white p-3 rounded shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => onOpenRow?.(row.id)}
        >
            <div className="font-medium text-gray-900 mb-2">
                {properties.length > 0 ? (
                    <span className="text-sm">
                        {row.data.properties?.[properties[0].id] || 'Untitled'}
                    </span>
                ) : 'Untitled'}
            </div>
            <div className="space-y-1">
               {properties.slice(1).map((prop) => {
                   if (prop.id === groupPropertyId) return null;
                   const val = row.data.properties?.[prop.id];
                   if (!val) return null;
                   
                   return (
                       <div key={prop.id} className="text-xs text-gray-500 truncate">
                            <span className="mr-1 text-gray-400">{prop.name}:</span>
                            {String(val)}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default DatabaseBoardView;
