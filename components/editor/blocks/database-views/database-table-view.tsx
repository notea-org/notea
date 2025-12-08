import { FC, useState, MouseEvent } from 'react';
import { DatabaseProperty, Block as BlockInterface, PropertyType, BlockType } from 'libs/shared/block';
import { PlusIcon, ChevronDownIcon, TrashIcon } from '@heroicons/react/solid';
import { Menu } from '@material-ui/core';
import BlockState from 'libs/web/state/block';
import Cell from './database-cell';

const TableHeader: FC<{ 
    property: DatabaseProperty; 
    onUpdate: (prop: DatabaseProperty) => void; 
    onDelete: () => void; 
    databaseId: string;
}> = ({ property, onUpdate, onDelete, databaseId }) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const blockState = BlockState.useContainer();
    const { blocks } = blockState;
    
    // Get all database blocks for relation selection
    const databases = Object.values(blocks).filter((b) => (b as BlockInterface).type === BlockType.DATABASE) as BlockInterface[];

    const handleMenuOpen = (event: MouseEvent<HTMLDivElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    return (
        <div className="flex items-center space-x-1 cursor-pointer hover:bg-gray-100 rounded px-1 py-0.5" onClick={handleMenuOpen}>
            <span>{property.name}</span>
            <ChevronDownIcon className="w-3 h-3 text-gray-400" />
            
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                getContentAnchorEl={null}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                transformOrigin={{ vertical: 'top', horizontal: 'left' }}
            >
                <div className="p-2 w-64 focus:outline-none">
                    <input 
                        className="w-full border rounded p-1 text-sm mb-2"
                        value={property.name}
                        onChange={(e) => onUpdate({ ...property, name: e.target.value })}
                        onClick={(e) => e.stopPropagation()}
                        placeholder="Property Name"
                    />
                    
                    <div className="text-xs text-gray-500 mb-1">Type</div>
                    <select 
                        className="w-full border rounded p-1 text-sm mb-2"
                        value={property.type}
                        onChange={(e) => {
                            const newType = e.target.value as PropertyType;
                            onUpdate({ ...property, type: newType });
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {Object.values(PropertyType).map((t) => (
                            <option key={t} value={t}>{t}</option>
                        ))}
                    </select>

                    {property.type === PropertyType.RELATION && (
                        <>
                            <div className="text-xs text-gray-500 mb-1">Related Database</div>
                            <select 
                                className="w-full border rounded p-1 text-sm mb-2"
                                value={property.relationId || ''}
                                onChange={(e) => onUpdate({ ...property, relationId: e.target.value })}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <option value="">Select Database...</option>
                                {databases.map((db) => (
                                    <option key={db.id} value={db.id}>{db.data.text || 'Untitled'}</option>
                                ))}
                            </select>
                            
                            <div className="text-xs text-gray-500 mb-1">Relation Type</div>
                            <select 
                                className="w-full border rounded p-1 text-sm mb-2"
                                value={property.relationType || 'single'}
                                onChange={(e) => onUpdate({ ...property, relationType: e.target.value as 'single' | 'multiple' })}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <option value="single">Single</option>
                                <option value="multiple">Multiple</option>
                            </select>
                            
                            {property.relationId && (
                                <>
                                    <div className="text-xs text-gray-500 mb-1">Back Reference</div>
                                    <select 
                                        className="w-full border rounded p-1 text-sm mb-2"
                                        value={property.backReferencePropertyId || ''}
                                        onChange={(e) => onUpdate({ ...property, backReferencePropertyId: e.target.value })}
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <option value="">No back reference</option>
                                        <option value="auto">Auto-create back reference</option>
                                        {(() => {
                                            if (!property.relationId) return null;
                                            const relatedDb = blocks[property.relationId];
                                            if (!relatedDb || relatedDb.type !== BlockType.DATABASE) return null;
                                            return relatedDb.data.properties
                                                .filter((p: DatabaseProperty) => p.type === PropertyType.RELATION && p.relationId === databaseId)
                                                .map((p: DatabaseProperty) => (
                                                    <option key={p.id} value={p.id}>{p.name}</option>
                                                ));
                                        })()}
                                    </select>
                                </>
                            )}
                        </>
                    )}

                    <div className="border-t my-1"></div>
                    <div 
                        className="flex items-center space-x-2 text-red-500 cursor-pointer p-1 hover:bg-red-50 rounded"
                        onClick={(e) => { 
                            e.stopPropagation();
                            onDelete(); 
                            handleMenuClose(); 
                        }}
                    >
                        <TrashIcon className="w-4 h-4" />
                        <span className="text-sm">Delete Property</span>
                    </div>
                </div>
            </Menu>
        </div>
    );
};

interface DatabaseTableViewProps {
    properties: DatabaseProperty[];
    processedRows: BlockInterface[];
    rowBlocks: BlockInterface[];
    databaseId: string;
    handleAddProperty: () => void;
    handleAddRow: () => void;
    onUpdateBlock: (id: string, data: any) => void;
    onUpdateProperties: (properties: DatabaseProperty[]) => void;
    onOpenRow?: (id: string) => void;
}

export const DatabaseTableView: FC<DatabaseTableViewProps> = ({
    properties,
    processedRows,
    rowBlocks,
    databaseId,
    handleAddProperty,
    handleAddRow,
    onUpdateBlock,
    onUpdateProperties,
    onOpenRow
}) => {
    return (
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
                                    <TableHeader 
                                        property={prop}
                                        databaseId={databaseId}
                                        onUpdate={(updatedProp) => {
                                            const newProperties = properties.map((p) => p.id === updatedProp.id ? updatedProp : p);
                                            onUpdateProperties(newProperties);
                                        }}
                                        onDelete={() => {
                                            const newProperties = properties.filter((p) => p.id !== prop.id);
                                            onUpdateProperties(newProperties);
                                        }}
                                    />
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
                        {processedRows.map((row, index) => (
                            <tr key={row.id}>
                                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500 border-b border-gray-100">
                                    {index + 1}
                                </td>
                                {properties.map((prop) => (
                                    <td key={prop.id} className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 border-b border-gray-100">
                                        <Cell 
                                            block={row} 
                                            property={prop}
                                            onOpen={prop.type === PropertyType.TITLE ? () => onOpenRow?.(row.id) : undefined}
                                            onUpdate={(value) => {
                                                const currentProps = row.data.properties || {};
                                                onUpdateBlock(row.id, {
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
                                                const newProperties = properties.map((p) => p.id === updatedProp.id ? updatedProp : p);
                                                onUpdateProperties(newProperties);
                                            }}
                                        />
                                    </td>
                                ))}
                                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500 border-b border-gray-100">
                                </td>
                            </tr>
                        ))}
                        {processedRows.length === 0 && (
                            <tr>
                                <td colSpan={properties.length + 2} className="px-4 py-8 text-center text-sm text-gray-500">
                                    {rowBlocks.length === 0 
                                        ? "No items. Click + to add a new row." 
                                        : "No matches found."}
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
    );
};

export default DatabaseTableView;
