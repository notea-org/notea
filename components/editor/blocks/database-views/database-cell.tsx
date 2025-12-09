import { FC, useState } from 'react';
import { DatabaseProperty, PropertyType, SelectOption, BlockType, DatabaseBlock } from 'libs/shared/block';
import { nanoid } from 'nanoid';
import { XIcon, ArrowsExpandIcon } from '@heroicons/react/solid';
import dayjs from 'dayjs';
import BlockState from 'libs/web/state/block';

interface CellProps {
    block: any;
    property: DatabaseProperty;
    onUpdate: (value: any) => void;
    onPropertyUpdate?: (property: DatabaseProperty) => void;
    onOpen?: () => void;
}

const SelectCell: FC<CellProps> = ({ block, property, onUpdate, onPropertyUpdate }) => {
    const value = block.data.properties?.[property.id];
    const [newOptionName, setNewOptionName] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        onUpdate(e.target.value);
    };

    return (
        <div className="relative group">
            <select 
                className="w-full bg-transparent border-none focus:ring-0 p-0 text-sm appearance-none cursor-pointer"
                value={value || ''}
                onChange={handleChange}
            >
                <option value="">Empty</option>
                {property.options?.map((opt) => (
                    <option key={opt.id} value={opt.id}>{opt.name}</option>
                ))}
            </select>
            {/* Simplified select creation for now - ideally use a proper combobox */}
            {!property.options?.find((o) => o.id === value) && value && (
                <span className="text-xs text-red-500">Invalid option</span>
            )}
            <div className="hidden group-hover:block absolute z-10 bg-white shadow-lg rounded p-2 border min-w-[200px] left-0 mt-1">
                <div className="text-xs font-semibold mb-1 text-gray-500">Add Option</div>
                <div className="flex items-center space-x-1">
                    <input 
                        className="border rounded text-xs p-1 flex-1"
                        value={newOptionName}
                        onChange={(e) => setNewOptionName(e.target.value)}
                        placeholder="Option name"
                    />
                    <button 
                        className="bg-primary-500 text-white text-xs px-2 py-1 rounded"
                        onClick={() => {
                            if (!newOptionName) return;
                            const newOption: SelectOption = {
                                id: nanoid(),
                                name: newOptionName,
                                color: 'gray'
                            };
                            onPropertyUpdate?.({
                                ...property,
                                options: [...(property.options || []), newOption]
                            });
                            setNewOptionName('');
                        }}
                    >
                        Add
                    </button>
                </div>
            </div>
        </div>
    );
};

const MultiSelectCell: FC<CellProps> = ({ block, property, onUpdate, onPropertyUpdate }) => {
    const value = block.data.properties?.[property.id];
    const selectedIds: string[] = Array.isArray(value) ? value : [];
    const [newOptionName, setNewOptionName] = useState('');
    
    return (
        <div className="flex flex-wrap gap-1 items-center min-h-[24px]">
            {selectedIds.map((id) => {
                const opt = property.options?.find((o) => o.id === id);
                if (!opt) return null;
                return (
                    <span key={id} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                        {opt.name}
                        <button 
                            onClick={() => onUpdate(selectedIds.filter((pid) => pid !== id))}
                            className="ml-1 text-gray-400 hover:text-gray-600"
                        >
                            <XIcon className="w-3 h-3" />
                        </button>
                    </span>
                );
            })}
            
            <div className="relative group inline-block">
                <button className="text-gray-400 hover:text-gray-600 text-xs px-1">+</button>
                <div className="hidden group-hover:block absolute z-10 bg-white shadow-lg rounded p-2 border min-w-[200px] left-0 mt-1">
                    <div className="max-h-32 overflow-y-auto mb-2">
                        {property.options?.filter((o) => !selectedIds.includes(o.id)).map((opt) => (
                            <div 
                                key={opt.id} 
                                className="cursor-pointer hover:bg-gray-100 p-1 text-xs rounded"
                                onClick={() => onUpdate([...selectedIds, opt.id])}
                            >
                                {opt.name}
                            </div>
                        ))}
                        {(!property.options || property.options.length === 0) && (
                            <div className="text-gray-400 text-xs p-1">No options</div>
                        )}
                    </div>
                    <div className="border-t pt-2">
                        <div className="text-xs font-semibold mb-1 text-gray-500">New Option</div>
                        <div className="flex items-center space-x-1">
                            <input 
                                className="border rounded text-xs p-1 flex-1"
                                value={newOptionName}
                                onChange={(e) => setNewOptionName(e.target.value)}
                                placeholder="Name"
                            />
                            <button 
                                className="bg-primary-500 text-white text-xs px-2 py-1 rounded"
                                onClick={() => {
                                    if (!newOptionName) return;
                                    const newOption: SelectOption = {
                                        id: nanoid(),
                                        name: newOptionName,
                                        color: 'gray'
                                    };
                                    onPropertyUpdate?.({
                                        ...property,
                                        options: [...(property.options || []), newOption]
                                    });
                                    setNewOptionName('');
                                }}
                            >
                                Add
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const RelationCell: FC<CellProps> = ({ block, property, onUpdate }) => {
    const blockState = BlockState.useContainer();
    const { blocks, createBlock, updateBlock } = blockState;
    const value = block.data.properties?.[property.id];
    const isMultiple = property.relationType === 'multiple';
    const selectedIds: string[] = isMultiple ? (Array.isArray(value) ? value : (value ? [value] : [])) : (value ? [value] : []);
    const [searchTerm, setSearchTerm] = useState('');
    
    const relatedDbId = property.relationId;
    const relatedDb = relatedDbId ? blocks[relatedDbId] as DatabaseBlock : null;

    if (!relatedDb || relatedDb.type !== BlockType.DATABASE) {
        return <span className="text-gray-400 text-xs">Invalid Relation</span>;
    }

    const rows = relatedDb.data.rows || [];
    const relatedRows = ((relatedDb.children && relatedDb.children.length > 0) 
        ? relatedDb.children 
        : rows.map((id) => blocks[id]).filter(Boolean))
        .filter((b) => !relatedDb.data.templates?.includes(b.id));

    const filteredRows = relatedRows.filter((r) => {
        const text = r.data.text || '';
        return text.toLowerCase().includes(searchTerm.toLowerCase());
    });

    return (
        <div className="flex flex-wrap gap-1 items-center min-h-[24px]">
            {selectedIds.map((id) => {
                const row = blocks[id];
                if (!row) return null;
                return (
                    <span key={id} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary-100 text-primary-800">
                        {row.data.text || 'Untitled'}
                        <button 
                            onClick={() => {
                                const newSelectedIds = selectedIds.filter((pid) => pid !== id);
                                onUpdate(newSelectedIds);
                                
                                // Remove bidirectional linking
                                const backRefProperty = relatedDb.data.properties.find((p) => 
                                    p.type === PropertyType.RELATION && p.relationId === block.parentId
                                );
                                if (backRefProperty && row.data.properties?.[backRefProperty.id]) {
                                    const currentBackRefs = row.data.properties[backRefProperty.id];
                                    const backRefIds = Array.isArray(currentBackRefs) ? currentBackRefs : (currentBackRefs ? [currentBackRefs] : []);
                                    const updatedBackRefs = backRefIds.filter((backId) => backId !== block.id);
                                    
                                    if (backRefProperty.relationType === 'multiple') {
                                        // For multiple relations, remove from array
                                        updateBlock(row.id, {
                                            properties: {
                                                ...row.data.properties,
                                                [backRefProperty.id]: updatedBackRefs.length > 0 ? updatedBackRefs : undefined
                                            }
                                        });
                                    } else {
                                        // For single relations, clear the reference
                                        updateBlock(row.id, {
                                            properties: {
                                                ...row.data.properties,
                                                [backRefProperty.id]: undefined
                                            }
                                        });
                                    }
                                }
                            }}
                            className="ml-1 text-primary-400 hover:text-primary-600"
                        >
                            <XIcon className="w-3 h-3" />
                        </button>
                    </span>
                );
            })}
            
            <div className="relative group inline-block">
                <button className="text-gray-400 hover:text-gray-600 text-xs px-1">+</button>
                <div className="hidden group-hover:block absolute z-10 bg-white shadow-lg rounded p-2 border min-w-[200px] left-0 mt-1">
                    <input 
                        className="w-full border rounded text-xs p-1 mb-2"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    
                    <div className="max-h-48 overflow-y-auto">
                        {filteredRows.length === 0 && !searchTerm && <div className="text-gray-400 text-xs p-1">No items found</div>}
                        
                        {filteredRows.filter((r) => !selectedIds.includes(r.id)).map((row) => (
                            <div 
                                key={row.id} 
                                className="cursor-pointer hover:bg-gray-100 p-1 text-xs rounded"
                                onClick={() => {
                                    const newSelectedIds = isMultiple ? [...selectedIds, row.id] : [row.id];
                                    onUpdate(isMultiple ? newSelectedIds : row.id);
                                    
                                    // Add bidirectional linking - find back-reference property
                                    const backRefProperty = relatedDb.data.properties.find((p) => 
                                        p.type === PropertyType.RELATION && p.relationId === block.parentId
                                    );
                                    if (backRefProperty) {
                                        const currentBackRefs = row.data.properties?.[backRefProperty.id] || [];
                                        const backRefIds = Array.isArray(currentBackRefs) ? currentBackRefs : (currentBackRefs ? [currentBackRefs] : []);
                                        
                                        if (isMultiple) {
                                            // For multiple relations, add to existing
                                            if (!backRefIds.includes(block.id)) {
                                                updateBlock(row.id, {
                                                    properties: {
                                                        ...row.data.properties,
                                                        [backRefProperty.id]: [...backRefIds, block.id]
                                                    }
                                                });
                                            }
                                        } else {
                                            // For single relations, replace existing
                                            updateBlock(row.id, {
                                                properties: {
                                                    ...row.data.properties,
                                                    [backRefProperty.id]: block.id
                                                }
                                            });
                                        }
                                    }
                                    
                                    setSearchTerm('');
                                }}
                            >
                                {row.data.text || 'Untitled'}
                            </div>
                        ))}
                        
                        {searchTerm && filteredRows.length === 0 && (
                            <div 
                                className="cursor-pointer hover:bg-primary-50 text-primary-600 p-1 text-xs rounded font-medium"
                                onClick={() => {
                                    const newBlock = createBlock(BlockType.DATABASE_ROW, { text: searchTerm }, relatedDb.id);
                                    const newSelectedIds = isMultiple ? [...selectedIds, newBlock.id] : [newBlock.id];
                                    onUpdate(isMultiple ? newSelectedIds : newBlock.id);
                                    
                                    // Add bidirectional linking for newly created row
                                    const backRefProperty = relatedDb.data.properties.find((p) => 
                                        p.type === PropertyType.RELATION && p.relationId === block.parentId
                                    );
                                    if (backRefProperty) {
                                        const currentBackRefs = newBlock.data.properties?.[backRefProperty.id] || [];
                                        const backRefIds = Array.isArray(currentBackRefs) ? currentBackRefs : (currentBackRefs ? [currentBackRefs] : []);
                                        
                                        if (isMultiple) {
                                            // For multiple relations, add to existing
                                            if (!backRefIds.includes(block.id)) {
                                                updateBlock(newBlock.id, {
                                                    properties: {
                                                        ...newBlock.data.properties,
                                                        [backRefProperty.id]: [...backRefIds, block.id]
                                                    }
                                                });
                                            }
                                        } else {
                                            // For single relations, replace existing
                                            updateBlock(newBlock.id, {
                                                properties: {
                                                    ...newBlock.data.properties,
                                                    [backRefProperty.id]: block.id
                                                }
                                            });
                                        }
                                    }
                                    
                                    setSearchTerm('');
                                }}
                            >
                                + Create &quot;{searchTerm}&quot;
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export const Cell: FC<CellProps> = (props) => {
    const { block, property, onUpdate, onOpen } = props;
    const value = block.data.properties?.[property.id];

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        onUpdate(e.target.value);
    };

    switch (property.type) {
        case PropertyType.TITLE:
            return (
                <div className="group flex items-center w-full">
                    <input 
                        type="text" 
                        className="w-full bg-transparent border-none focus:ring-0 p-0 text-sm font-medium text-gray-900"
                        value={value || ''}
                        onChange={handleChange}
                        placeholder="Untitled"
                    />
                    {onOpen && (
                        <button 
                            className="hidden group-hover:block p-1 text-gray-400 hover:text-gray-600 rounded hover:bg-gray-100"
                            onClick={onOpen}
                            title="Open as page"
                        >
                            <ArrowsExpandIcon className="w-3 h-3" />
                        </button>
                    )}
                </div>
            );
        case PropertyType.RELATION:
            return <RelationCell {...props} />;
        case PropertyType.TEXT:
        case PropertyType.URL:
        case PropertyType.EMAIL:
        case PropertyType.PHONE:
            return (
                <input 
                    type="text" 
                    className="w-full bg-transparent border-none focus:ring-0 p-0 text-sm"
                    value={value || ''}
                    onChange={handleChange}
                    placeholder="Empty"
                />
            );
        case PropertyType.NUMBER:
            return (
                <input 
                    type="number" 
                    className="w-full bg-transparent border-none focus:ring-0 p-0 text-sm"
                    value={value || ''}
                    onChange={handleChange}
                    placeholder="Empty"
                />
            );
        case PropertyType.DATE:
            return (
                <input 
                    type="date" 
                    className="w-full bg-transparent border-none focus:ring-0 p-0 text-sm"
                    value={value ? dayjs(value).format('YYYY-MM-DD') : ''}
                    onChange={(e) => {
                        onUpdate(e.target.value ? new Date(e.target.value).toISOString() : null);
                    }}
                />
            );
        case PropertyType.SELECT:
            return <SelectCell {...props} />;
        case PropertyType.MULTI_SELECT:
            return <MultiSelectCell {...props} />;
        case PropertyType.CHECKBOX:
            return (
                <input 
                    type="checkbox" 
                    checked={!!value}
                    onChange={(e) => onUpdate(e.target.checked)}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 h-4 w-4"
                />
            );
        default:
            return <span className="text-gray-400 text-xs">Unsupported</span>;
    }
};

export default Cell;
