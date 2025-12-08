import { FC } from 'react';
import { BlockComponentProps } from './block-renderer';
import BlockState from 'libs/web/state/block';
import { DatabaseBlock as DatabaseBlockInterface, DatabaseProperty, PropertyType, BlockType, SelectOption } from 'libs/shared/block';
import { PlusIcon } from '@heroicons/react/solid';
import { nanoid } from 'nanoid';

const DatabaseBlock: FC<BlockComponentProps> = ({
    block,
    isSelected,
    onUpdate,
}) => {
    const { blocks, createBlock, updateBlock } = BlockState.useContainer();
    const dbBlock = block as DatabaseBlockInterface;
    const { properties = [], rows = [] } = dbBlock.data;

    // Get row blocks. Use children if available, otherwise fall back to rows array
    // We prefer children because createBlock automatically manages the parent-child relationship
    const rowBlocks = (block.children && block.children.length > 0) 
        ? block.children 
        : rows.map((id) => blocks[id]).filter(Boolean);

    const handleAddRow = () => {
        // Create a new row block as a child of this database block
        const newRow = createBlock(BlockType.DATABASE_ROW, {}, block.id);
        
        // We don't strictly need to update 'rows' if we rely on children, 
        // but to keep the data structure consistent with the interface:
        onUpdate?.({ rows: [...rows, newRow.id] });
    };

    const handleAddProperty = () => {
        const newProperty: DatabaseProperty = {
            id: nanoid(),
            name: 'New Property',
            type: PropertyType.TEXT,
        };
        onUpdate?.({ properties: [...properties, newProperty] });
    };

    return (
        <div className={`database-block my-4 ${isSelected ? 'ring-2 ring-blue-200 rounded' : ''}`}>
            <div className="database-header flex items-center justify-between mb-2 px-2">
                <div className="flex items-center space-x-2">
                    <span className="font-medium text-gray-700">
                        {dbBlock.data.text || 'Untitled Database'}
                    </span>
                </div>
                <div className="database-controls">
                    {/* View switcher and other controls */}
                </div>
            </div>

            <div className="database-view border rounded-lg overflow-hidden bg-white shadow-sm">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-10">
                                    #
                                </th>
                                {properties.map((prop) => (
                                    <th key={prop.id} scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        <div className="flex items-center space-x-1">
                                            <span>{prop.name}</span>
                                            {/* Icon based on type */}
                                        </div>
                                    </th>
                                ))}
                                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-10">
                                    <button 
                                        onClick={handleAddProperty}
                                        className="text-gray-400 hover:text-gray-600"
                                    >
                                        <PlusIcon className="w-4 h-4" />
                                    </button>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {rowBlocks.map((row, index) => (
                                <tr key={row.id}>
                                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500 border-b border-gray-100">
                                        {index + 1}
                                    </td>
                                    {properties.map((prop) => (
                                        <td key={prop.id} className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 border-b border-gray-100">
                                            <Cell 
                                                block={row} 
                                                property={prop}
                                                onUpdate={(value) => {
                                                    const currentProps = row.data.properties || {};
                                                    updateBlock(row.id, {
                                                        data: {
                                                            ...row.data,
                                                            properties: {
                                                                ...currentProps,
                                                                [prop.id]: value
                                                            }
                                                        }
                                                    });
                                                }}
                                                onPropertyUpdate={(updatedProp) => {
                                                    const newProperties = properties.map(p => p.id === updatedProp.id ? updatedProp : p);
                                                    onUpdate?.({ properties: newProperties });
                                                }}
                                            />
                                        </td>
                                    ))}
                                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500 border-b border-gray-100">
                                    </td>
                                </tr>
                            ))}
                            {rowBlocks.length === 0 && (
                                <tr>
                                    <td colSpan={properties.length + 2} className="px-4 py-8 text-center text-sm text-gray-500">
                                        No items. Click + to add a new row.
                                    </td>
                                </tr>
                            )}
                            <tr>
                                <td colSpan={properties.length + 2} className="px-4 py-2 text-sm text-gray-500 border-t border-gray-100 cursor-pointer hover:bg-gray-50" onClick={handleAddRow}>
                                    <div className="flex items-center space-x-2 text-gray-400">
                                        <PlusIcon className="w-4 h-4" />
                                        <span>New</span>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <style jsx>{`
                .database-block {
                    /* Custom styles if needed */
                }
            `}</style>
        </div>
    );
};

const Cell: FC<{
    block: any;
    property: DatabaseProperty;
    onUpdate: (value: any) => void;
    onPropertyUpdate?: (property: DatabaseProperty) => void;
}> = ({ block, property, onUpdate, onPropertyUpdate }) => {
    const value = block.data.properties?.[property.id];

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        onUpdate(e.target.value);
    };

    switch (property.type) {
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
                    value={value || ''}
                    onChange={handleChange}
                />
            );
        case PropertyType.CHECKBOX:
            return (
                <div className="flex justify-center">
                    <input 
                        type="checkbox" 
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                        checked={!!value}
                        onChange={(e) => onUpdate(e.target.checked)}
                    />
                </div>
            );
        case PropertyType.SELECT: {
            const optionMap = new Map(property.options?.map(o => [o.id, o]) || []);
            const selectedOption = optionMap.get(value);
            const displayValue = selectedOption ? selectedOption.name : (value || '');
            const dataListId = `datalist-${property.id}`;

            const handleSelectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                const newValue = e.target.value;
                // Check if it matches an existing option name
                const existingOption = property.options?.find(o => o.name === newValue);
                
                if (existingOption) {
                    onUpdate(existingOption.id);
                } else {
                    // Create new option?
                    // For now, let's just create it if it's not empty
                    if (newValue.trim()) {
                         const newOption = {
                             id: nanoid(),
                             name: newValue,
                             color: 'gray' // default color
                         };
                         // Update property with new option
                         onPropertyUpdate?.({
                             ...property,
                             options: [...(property.options || []), newOption]
                         });
                         // Update cell value
                         onUpdate(newOption.id);
                    } else {
                        onUpdate('');
                    }
                }
            };

            return (
                <div className="relative w-full">
                    <input 
                        list={dataListId}
                        className="w-full bg-transparent border-none focus:ring-0 p-0 text-sm"
                        value={displayValue}
                        onChange={handleSelectChange}
                        placeholder="Select or type..."
                    />
                    <datalist id={dataListId}>
                        {property.options?.map(opt => (
                            <option key={opt.id} value={opt.name} />
                        ))}
                    </datalist>
                </div>
            );
        }
        case PropertyType.MULTI_SELECT: {
             const selectedIds = (Array.isArray(value) ? value : []) as string[];
             const selectedNames = selectedIds.map(id => {
                 return property.options?.find(o => o.id === id)?.name || id;
             }).join(', ');
             
             const handleMultiChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                 const text = e.target.value;
                 const parts = text.split(',').map(s => s.trim()).filter(Boolean);
                 
                 const newIds: string[] = [];
                 const newOptions: SelectOption[] = [];
                 const currentOptions = [...(property.options || [])];
                 
                 parts.forEach(part => {
                     const existing = currentOptions.find(o => o.name === part);
                     if (existing) {
                         newIds.push(existing.id);
                     } else {
                         // Create new
                         const newOpt = {
                             id: nanoid(),
                             name: part,
                             color: 'gray'
                         };
                         currentOptions.push(newOpt);
                         newOptions.push(newOpt);
                         newIds.push(newOpt.id);
                     }
                 });
                 
                 if (newOptions.length > 0 && onPropertyUpdate) {
                      onPropertyUpdate({
                          ...property,
                          options: currentOptions
                      });
                 }
                 onUpdate(newIds);
             };

             return (
                 <input 
                    type="text"
                    className="w-full bg-transparent border-none focus:ring-0 p-0 text-sm"
                    value={selectedNames}
                    onChange={handleMultiChange}
                    placeholder="Type tags separated by comma..."
                 />
             );
        }
        default:
            return <span className="text-gray-400 text-sm">{String(value || '')}</span>;
    }
};

export default DatabaseBlock;
