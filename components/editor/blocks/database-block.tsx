import { FC, useState, useMemo, MouseEvent } from 'react';
import { BlockComponentProps } from './block-renderer';
import BlockState from 'libs/web/state/block';
import { DatabaseBlock as DatabaseBlockInterface, DatabaseProperty, PropertyType, BlockType, FilterGroup, SortConfig, FilterOperator, ViewType, Block, TemplateCategory } from 'libs/shared/block';
import { PlusIcon, FilterIcon, SortAscendingIcon, XIcon, TableIcon, ViewBoardsIcon, CalendarIcon, PhotographIcon, ChevronDownIcon, DocumentDuplicateIcon, PencilIcon, TrashIcon, EyeIcon } from '@heroicons/react/solid';
import { Menu, MenuItem, ListItemIcon, ListItemText, Button, ButtonGroup, Dialog } from '@material-ui/core';
import dynamic from 'next/dynamic';

const BlockEditor = dynamic(() => import('./block-editor'), { ssr: false });
import { nanoid } from 'nanoid';
import { DatabaseTableView } from './database-views/database-table-view';
import { DatabaseBoardView } from './database-views/database-board-view';
import { DatabaseCalendarView } from './database-views/database-calendar-view';
import { DatabaseGalleryView } from './database-views/database-gallery-view';

const DatabaseBlock: FC<BlockComponentProps> = ({
    block,
    isSelected,
    onUpdate,
}) => {
    const { blocks, createBlock, updateBlock, duplicateBlock, deleteBlock } = BlockState.useContainer();
    const dbBlock = block as DatabaseBlockInterface;
    const { properties = [], rows = [], templates = [], templateCategories = [] } = dbBlock.data;
    
    // Local state for view, filter and sort
    const [activeView, setActiveView] = useState<ViewType>(ViewType.TABLE);
    const [filterGroup, setFilterGroup] = useState<FilterGroup>({
        operator: 'and',
        conditions: []
    });
    const [sortConfig, setSortConfig] = useState<SortConfig[]>([]);
    const [showFilterMenu, setShowFilterMenu] = useState(false);
    const [showSortMenu, setShowSortMenu] = useState(false);
    const [newMenuAnchor, setNewMenuAnchor] = useState<null | HTMLElement>(null);
    const [groupBy, setGroupBy] = useState<string | undefined>();
    const [editingBlockId, setEditingBlockId] = useState<string | null>(null);
    const [showTemplateManager, setShowTemplateManager] = useState(false);
    const [previewTemplateId, setPreviewTemplateId] = useState<string | null>(null);
    const [templateSearchQuery, setTemplateSearchQuery] = useState('');
    const [templateSortBy, setTemplateSortBy] = useState<'name' | 'date' | 'blocks'>('name');
    const [templateSortOrder, setTemplateSortOrder] = useState<'asc' | 'desc'>('asc');
    const [templateFilterCategory, setTemplateFilterCategory] = useState<string>('all');

    // Get row blocks. Use children if available, otherwise fall back to rows array
    // We prefer children because createBlock automatically manages the parent-child relationship
    // Filter out templates
    const rowBlocks = ((block.children && block.children.length > 0) 
        ? block.children 
        : rows.map((id) => blocks[id]).filter(Boolean))
        .filter((b) => !templates.includes(b.id));

    const templateBlocks = templates.map((id) => blocks[id]).filter(Boolean);

    // Apply filters and sorts
    const processedRows = useMemo(() => {
        let result = [...rowBlocks];

        // Filter
        if (filterGroup.conditions.length > 0) {
            result = result.filter((row) => {
                const results = filterGroup.conditions.map((condition) => {
                    const prop = properties.find((p) => p.id === condition.propertyId);
                    if (!prop) return true;
                    const val = row.data.properties?.[prop.id];

                    switch (condition.operator) {
                        case FilterOperator.EQUALS:
                            return val == condition.value;
                        case FilterOperator.NOT_EQUALS:
                            return val != condition.value;
                        case FilterOperator.CONTAINS:
                            return String(val || '').toLowerCase().includes(String(condition.value || '').toLowerCase());
                        case FilterOperator.NOT_CONTAINS:
                            return !String(val || '').toLowerCase().includes(String(condition.value || '').toLowerCase());
                        case FilterOperator.IS_EMPTY:
                            return !val || val === '';
                        case FilterOperator.IS_NOT_EMPTY:
                            return !!val && val !== '';
                        default:
                            return true;
                    }
                });

                return filterGroup.operator === 'and' 
                    ? results.every((r) => r) 
                    : results.some((r) => r);
            });
        }

        // Sort
        if (sortConfig.length > 0) {
            result.sort((a, b) => {
                for (const sort of sortConfig) {
                    const prop = properties.find((p) => p.id === sort.propertyId);
                    if (!prop) continue;
                    
                    const valA = a.data.properties?.[prop.id];
                    const valB = b.data.properties?.[prop.id];
                    
                    if (valA === valB) continue;
                    if (valA === undefined || valA === null) return 1;
                    if (valB === undefined || valB === null) return -1;
                    
                    let comparison = 0;
                    if (prop.type === PropertyType.NUMBER) {
                        comparison = Number(valA) - Number(valB);
                    } else {
                        comparison = String(valA).localeCompare(String(valB));
                    }
                    
                    if (comparison !== 0) {
                        return sort.direction === 'asc' ? comparison : -comparison;
                    }
                }
                return 0;
            });
        }

        return result;
    }, [rowBlocks, filterGroup, sortConfig, properties]);

    const handleAddRow = (initialProps?: Record<string, any>) => {
        // Create a new row block as a child of this database block
        const newRow = createBlock(BlockType.DATABASE_ROW, initialProps || {}, block.id);
        
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

    const handleUpdateProperties = (newProperties: DatabaseProperty[]) => {
        onUpdate?.({ properties: newProperties });
    };

    const handleUpdateBlock = (id: string, data: any) => {
        updateBlock(id, data);
    };

    const handleNewMenuOpen = (event: MouseEvent<HTMLButtonElement>) => {
        setNewMenuAnchor(event.currentTarget);
    };

    const handleNewMenuClose = () => {
        setNewMenuAnchor(null);
    };

    const handleCreateTemplate = () => {
        // Create a new row block to serve as a template
        const newTemplate = createBlock(BlockType.DATABASE_ROW, {
            text: 'Untitled Template',
            properties: {}
        }, block.id);

        // Add to templates list
        onUpdate?.({ templates: [...templates, newTemplate.id] });
        handleNewMenuClose();
        
        // Open the template for editing
        setEditingBlockId(newTemplate.id);
    };

    const handleInstantiateTemplate = (templateId: string) => {
        // Duplicate the template block
        // duplicateBlock handles deep copying of children
        // The new block will be a sibling of the template (child of database)
        // Since it's not in the 'templates' list, it will appear as a row
        duplicateBlock(templateId, block.id);
        handleNewMenuClose();
    };

    const handleDeleteTemplate = (templateId: string, e: MouseEvent) => {
        e.stopPropagation();
        // Remove from templates list
        onUpdate?.({ templates: templates.filter((id) => id !== templateId) });
        // Remove from categories
        const updatedCategories = templateCategories.map((cat) => ({
            ...cat,
            templateIds: cat.templateIds.filter((id) => id !== templateId)
        })).filter((cat) => cat.templateIds.length > 0);
        onUpdate?.({ templateCategories: updatedCategories });
        // Delete the block
        deleteBlock(templateId);
    };

    const handleCreateTemplateCategory = () => {
        const newCategory = {
            id: nanoid(),
            name: 'New Category',
            color: '#3b82f6',
            templateIds: []
        };
        onUpdate?.({ templateCategories: [...templateCategories, newCategory] });
    };

    const handleUpdateTemplateCategory = (categoryId: string, updates: Partial<TemplateCategory>) => {
        const updatedCategories = templateCategories.map((cat) => 
            cat.id === categoryId ? { ...cat, ...updates } : cat
        );
        onUpdate?.({ templateCategories: updatedCategories });
    };

    // Template filtering and sorting functions
    const getFilteredAndSortedTemplates = (templates: Block[]) => {
        let filtered = templates;

        // Apply category filter
        if (templateFilterCategory !== 'all') {
            if (templateFilterCategory === 'uncategorized') {
                filtered = filtered.filter((template) => 
                    !templateCategories.some((cat) => cat.templateIds.includes(template.id))
                );
            } else {
                const category = templateCategories.find((cat) => cat.id === templateFilterCategory);
                if (category) {
                    filtered = filtered.filter((template) => 
                        category.templateIds.includes(template.id)
                    );
                }
            }
        }

        // Apply search filter
        if (templateSearchQuery.trim()) {
            const query = templateSearchQuery.toLowerCase().trim();
            filtered = filtered.filter((template) => {
                const title = (template.data.text || '').toLowerCase();
                const blockTypes = template.children?.map((child: Block) => child.type?.toLowerCase() || '') || [];
                
                return title.includes(query) || blockTypes.some((type) => type.includes(query));
            });
        }

        // Apply sorting
        filtered.sort((a, b) => {
            let aValue: any, bValue: any;
            
            switch (templateSortBy) {
                case 'name':
                    aValue = (a.data.text || 'Untitled Template').toLowerCase();
                    bValue = (b.data.text || 'Untitled Template').toLowerCase();
                    break;
                case 'date':
                    // Use creation time if available, otherwise use ID as fallback
                    aValue = a.createdAt || a.id;
                    bValue = b.createdAt || b.id;
                    break;
                case 'blocks':
                    aValue = a.children?.length || 0;
                    bValue = b.children?.length || 0;
                    break;
                default:
                    return 0;
            }

            if (aValue < bValue) return templateSortOrder === 'asc' ? -1 : 1;
            if (aValue > bValue) return templateSortOrder === 'asc' ? 1 : -1;
            return 0;
        });

        return filtered;
    };

    const handleDeleteTemplateCategory = (categoryId: string) => {
        const updatedCategories = templateCategories.filter((cat) => cat.id !== categoryId);
        onUpdate?.({ templateCategories: updatedCategories });
    };

    const handleAssignTemplateToCategory = (templateId: string, categoryId: string) => {
        const updatedCategories = templateCategories.map((cat) => {
            if (cat.id === categoryId) {
                return { ...cat, templateIds: [...cat.templateIds.filter((id) => id !== templateId), templateId] };
            } else {
                return { ...cat, templateIds: cat.templateIds.filter((id) => id !== templateId) };
            }
        });
        onUpdate?.({ templateCategories: updatedCategories });
    };

    return (
        <div className={`database-block my-4 ${isSelected ? 'ring-2 ring-blue-200 rounded' : ''}`}>
            <div className="database-header flex items-center justify-between mb-2 px-2">
                <div className="flex items-center space-x-2">
                    <span className="font-medium text-gray-700">
                        {dbBlock.data.text || 'Untitled Database'}
                    </span>
                    <div className="flex items-center bg-gray-100 rounded p-0.5 ml-4">
                        <button
                            className={`p-1 rounded ${activeView === ViewType.TABLE ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                            onClick={() => setActiveView(ViewType.TABLE)}
                            title="Table View"
                        >
                            <TableIcon className="w-4 h-4" />
                        </button>
                        <button
                            className={`p-1 rounded ${activeView === ViewType.BOARD ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                            onClick={() => setActiveView(ViewType.BOARD)}
                            title="Board View"
                        >
                            <ViewBoardsIcon className="w-4 h-4" />
                        </button>
                        <button
                            className={`p-1 rounded ${activeView === ViewType.CALENDAR ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                            onClick={() => setActiveView(ViewType.CALENDAR)}
                            title="Calendar View"
                        >
                            <CalendarIcon className="w-4 h-4" />
                        </button>
                        <button
                            className={`p-1 rounded ${activeView === ViewType.GALLERY ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                            onClick={() => setActiveView(ViewType.GALLERY)}
                            title="Gallery View"
                        >
                            <PhotographIcon className="w-4 h-4" />
                        </button>
                    </div>
                </div>
                <div className="database-controls flex items-center space-x-2">
                    <button 
                        className={`p-1 rounded hover:bg-gray-100 ${showFilterMenu ? 'bg-gray-200' : ''}`}
                        onClick={() => setShowFilterMenu(!showFilterMenu)}
                        title="Filter"
                    >
                        <FilterIcon className="w-4 h-4 text-gray-500" />
                    </button>
                    <button 
                        className={`p-1 rounded hover:bg-gray-100 ${showSortMenu ? 'bg-gray-200' : ''}`}
                        onClick={() => setShowSortMenu(!showSortMenu)}
                        title="Sort"
                    >
                        <SortAscendingIcon className="w-4 h-4 text-gray-500" />
                    </button>
                    <button 
                        className={`p-1 rounded hover:bg-gray-100 ${showTemplateManager ? 'bg-gray-200' : ''}`}
                        onClick={() => setShowTemplateManager(!showTemplateManager)}
                        title="Template Manager"
                    >
                        <PencilIcon className="w-4 h-4 text-gray-500" />
                    </button>
                    <div className="relative">
                        <ButtonGroup size="small" variant="contained" color="primary" disableElevation>
                            <Button onClick={handleAddRow} style={{ textTransform: 'none' }}>
                                New
                            </Button>
                            <Button size="small" onClick={handleNewMenuOpen}>
                                <ChevronDownIcon className="w-4 h-4" />
                            </Button>
                        </ButtonGroup>
                        <Menu
                            anchorEl={newMenuAnchor}
                            open={Boolean(newMenuAnchor)}
                            onClose={handleNewMenuClose}
                            getContentAnchorEl={null}
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                        >
                            {templateBlocks.length > 0 && (
                                <div className="px-2 py-1">
                                    <input
                                        type="text"
                                        placeholder="Search templates..."
                                        value={templateSearchQuery}
                                        onChange={(e) => setTemplateSearchQuery(e.target.value)}
                                        className="w-full px-2 py-1 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                </div>
                            )}
                            <MenuItem onClick={() => { handleAddRow(); handleNewMenuClose(); }}>
                                <ListItemIcon>
                                    <DocumentDuplicateIcon className="w-5 h-5" />
                                </ListItemIcon>
                                <ListItemText primary="Empty page" />
                            </MenuItem>
                            
                            {templateBlocks.length > 0 && <div className="border-t my-1" />}
                            
                            {templateCategories.length > 0 ? (
                                // Show categorized templates
                                templateCategories.map((category) => {
                                    const categoryTemplates = getFilteredAndSortedTemplates(templateBlocks).filter((t) => 
                                        category.templateIds.includes(t.id)
                                    );
                                    if (categoryTemplates.length === 0) return null;
                                    
                                    return (
                                        <div key={category.id} className="px-2 py-1">
                                            <div className="flex items-center justify-between mb-1">
                                                <div className="flex items-center space-x-2">
                                                    <div 
                                                        className="w-3 h-3 rounded-full"
                                                        style={{ backgroundColor: category.color }}
                                                    />
                                                    <span className="text-xs font-medium text-gray-600">
                                                        {category.name}
                                                    </span>
                                                </div>
                                                <span className="text-xs text-gray-400">
                                                    {categoryTemplates.length}
                                                </span>
                                            </div>
                                            {categoryTemplates.map((template) => (
                                                <MenuItem 
                                                    key={template.id} 
                                                    onClick={() => handleInstantiateTemplate(template.id)}
                                                    className="pl-6"
                                                >
                                                    <ListItemText primary={template.data.text || 'Untitled Template'} />
                                                    <div 
                                                        className="ml-2 p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-blue-500"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setEditingBlockId(template.id);
                                                            handleNewMenuClose();
                                                        }}
                                                        title="Edit template"
                                                    >
                                                        <PencilIcon className="w-4 h-4" />
                                                    </div>
                                                    <div 
                                                        className="ml-1 p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-red-500"
                                                        onClick={(e) => handleDeleteTemplate(template.id, e)}
                                                        title="Delete template"
                                                    >
                                                        <XIcon className="w-4 h-4" />
                                                    </div>
                                                </MenuItem>
                                            ))}
                                        </div>
                                    );
                                })
                            ) : (
                                // Show uncategorized templates
                                getFilteredAndSortedTemplates(templateBlocks).map((template) => (
                                    <MenuItem key={template.id} onClick={() => handleInstantiateTemplate(template.id)}>
                                        <ListItemText primary={template.data.text || 'Untitled Template'} />
                                        <div 
                                            className="ml-2 p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-blue-500"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setEditingBlockId(template.id);
                                                handleNewMenuClose();
                                            }}
                                            title="Edit template"
                                        >
                                            <PencilIcon className="w-4 h-4" />
                                        </div>
                                        <div 
                                            className="ml-1 p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-red-500"
                                            onClick={(e) => handleDeleteTemplate(template.id, e)}
                                            title="Delete template"
                                        >
                                            <XIcon className="w-4 h-4" />
                                        </div>
                                    </MenuItem>
                                ))
                            )}
                            
                            <div className="border-t my-1" />
                            
                            <MenuItem onClick={handleCreateTemplate}>
                                <ListItemIcon>
                                    <PlusIcon className="w-5 h-5" />
                                </ListItemIcon>
                                <ListItemText primary="New template" />
                            </MenuItem>
                        </Menu>
                    </div>
                </div>
            </div>

            {/* Filter Panel */}
            {showFilterMenu && (
                <div className="bg-gray-50 border-t border-b p-2 space-y-2 text-sm">
                    {filterGroup.conditions.map((condition, idx) => (
                        <div key={idx} className="flex items-center space-x-2">
                            <span className="text-gray-500 w-16">{idx === 0 ? 'Where' : filterGroup.operator}</span>
                            <select 
                                className="border-gray-300 rounded text-sm p-1"
                                value={condition.propertyId}
                                onChange={(e) => {
                                    const newConditions = [...filterGroup.conditions];
                                    newConditions[idx] = { ...condition, propertyId: e.target.value };
                                    setFilterGroup({ ...filterGroup, conditions: newConditions });
                                }}
                            >
                                {properties.map((p) => (
                                    <option key={p.id} value={p.id}>{p.name}</option>
                                ))}
                            </select>
                            <select
                                className="border-gray-300 rounded text-sm p-1"
                                value={condition.operator}
                                onChange={(e) => {
                                    const newConditions = [...filterGroup.conditions];
                                    newConditions[idx] = { ...condition, operator: e.target.value as FilterOperator };
                                    setFilterGroup({ ...filterGroup, conditions: newConditions });
                                }}
                            >
                                <option value={FilterOperator.EQUALS}>Is</option>
                                <option value={FilterOperator.NOT_EQUALS}>Is not</option>
                                <option value={FilterOperator.CONTAINS}>Contains</option>
                                <option value={FilterOperator.NOT_CONTAINS}>Does not contain</option>
                                <option value={FilterOperator.IS_EMPTY}>Is empty</option>
                                <option value={FilterOperator.IS_NOT_EMPTY}>Is not empty</option>
                            </select>
                            {![FilterOperator.IS_EMPTY, FilterOperator.IS_NOT_EMPTY].includes(condition.operator) && (
                                <input
                                    className="border-gray-300 rounded text-sm p-1 flex-1"
                                    value={condition.value}
                                    onChange={(e) => {
                                        const newConditions = [...filterGroup.conditions];
                                        newConditions[idx] = { ...condition, value: e.target.value };
                                        setFilterGroup({ ...filterGroup, conditions: newConditions });
                                    }}
                                    placeholder="Type a value..."
                                />
                            )}
                            <button onClick={() => {
                                const newConditions = filterGroup.conditions.filter((_, i) => i !== idx);
                                setFilterGroup({ ...filterGroup, conditions: newConditions });
                            }}>
                                <XIcon className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                            </button>
                        </div>
                    ))}
                    <button 
                        className="text-gray-500 hover:text-gray-700 flex items-center space-x-1"
                        onClick={() => {
                            if (properties.length > 0) {
                                setFilterGroup({
                                    ...filterGroup,
                                    conditions: [...filterGroup.conditions, {
                                        propertyId: properties[0].id,
                                        operator: FilterOperator.CONTAINS,
                                        value: ''
                                    }]
                                });
                            }
                        }}
                    >
                        <PlusIcon className="w-3 h-3" />
                        <span>Add filter</span>
                    </button>
                </div>
            )}

            {editingBlockId && (
                <Dialog 
                    open={!!editingBlockId} 
                    onClose={() => setEditingBlockId(null)}
                    fullWidth
                    maxWidth="md"
                >
                    <div className="p-8 h-[80vh] overflow-y-auto bg-white">
                        <div className="mb-4 border-b pb-2">
                            <h2 className="text-xl font-bold">
                                {blocks[editingBlockId]?.data.text || 'Untitled'}
                            </h2>
                            <p className="text-sm text-gray-500">
                                {templates.includes(editingBlockId) ? 'Editing Template' : 'Editing Page'}
                            </p>
                        </div>
                        <BlockEditor 
                            parentId={editingBlockId}
                            roots={blocks[editingBlockId]?.children?.map((b: Block) => b.id) || []}
                        />
                        {(!blocks[editingBlockId]?.children || blocks[editingBlockId]?.children.length === 0) && (
                            <div className="mt-8">
                                <div className="text-gray-400 mb-4 text-sm font-medium">Start with a template:</div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div 
                                        className="p-4 border rounded hover:shadow-md cursor-pointer hover:border-blue-300 transition-all"
                                        onClick={() => createBlock(BlockType.PARAGRAPH, {}, editingBlockId)}
                                    >
                                        <div className="font-medium mb-1">Empty Page</div>
                                        <div className="text-xs text-gray-400">Start writing from scratch</div>
                                    </div>
                                    {templateBlocks.map((template) => (
                                        <div 
                                            key={template.id}
                                            className="p-4 border rounded hover:shadow-md cursor-pointer hover:border-blue-300 transition-all"
                                            onClick={() => {
                                                if (template.children) {
                                                    template.children.forEach((child: Block) => {
                                                        duplicateBlock(child.id, editingBlockId);
                                                    });
                                                }
                                            }}>
                                            <div className="font-medium mb-1">{template.data.text || 'Untitled Template'}</div>
                                            <div className="text-xs text-gray-400 mb-2">Apply this layout</div>
                                            
                                            {/* Template Preview */}
                                            <div className="text-xs text-gray-600 bg-gray-50 rounded p-2 max-h-16 overflow-hidden">
                                                {template.children && template.children.length > 0 ? (
                                                    <div className="space-y-1">
                                                        {template.children.slice(0, 2).map((child: Block) => (
                                                            <div key={child.id} className="flex items-center space-x-1">
                                                                <div className="w-2 h-2 bg-gray-300 rounded-full" />
                                                                <span className="truncate text-xs">
                                                                    {child.data.text || child.type || 'Block'}
                                                                </span>
                                                            </div>
                                                        ))}
                                                        {template.children.length > 2 && (
                                                            <div className="text-gray-400 text-xs">
                                                                +{template.children.length - 2} more
                                                            </div>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <div className="text-gray-400 italic text-xs">Empty template</div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </Dialog>
            )}

            {/* Sort Panel */}
            {showSortMenu && (
                <div className="bg-gray-50 border-t border-b p-2 space-y-2 text-sm">
                    {sortConfig.map((sort, idx) => (
                        <div key={idx} className="flex items-center space-x-2">
                            <span className="text-gray-500 w-16">{idx === 0 ? 'Sort by' : 'Then by'}</span>
                            <select 
                                className="border-gray-300 rounded text-sm p-1"
                                value={sort.propertyId}
                                onChange={(e) => {
                                    const newSorts = [...sortConfig];
                                    newSorts[idx] = { ...sort, propertyId: e.target.value };
                                    setSortConfig(newSorts);
                                }}
                            >
                                {properties.map((p) => (
                                    <option key={p.id} value={p.id}>{p.name}</option>
                                ))}
                            </select>
                            <select
                                className="border-gray-300 rounded text-sm p-1"
                                value={sort.direction}
                                onChange={(e) => {
                                    const newSorts = [...sortConfig];
                                    newSorts[idx] = { ...sort, direction: e.target.value as 'asc' | 'desc' };
                                    setSortConfig(newSorts);
                                }}
                            >
                                <option value="asc">Ascending</option>
                                <option value="desc">Descending</option>
                            </select>
                            <button onClick={() => {
                                const newSorts = sortConfig.filter((_, i) => i !== idx);
                                setSortConfig(newSorts);
                            }}>
                                <XIcon className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                            </button>
                        </div>
                    ))}
                    <button 
                        className="text-gray-500 hover:text-gray-700 flex items-center space-x-1"
                        onClick={() => {
                            if (properties.length > 0) {
                                setSortConfig([...sortConfig, {
                                    propertyId: properties[0].id,
                                    direction: 'asc'
                                }]);
                            }
                        }}
                    >
                        <PlusIcon className="w-3 h-3" />
                        <span>Add sort</span>
                    </button>
                </div>
            )}

            {/* Template Manager Panel */}
            {showTemplateManager && (
                <div className="bg-blue-50 border-t border-b p-4 space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-blue-900">Template Manager</h3>
                        
                        {/* Search and Filter Controls */}
                        <div className="flex items-center space-x-3">
                            {/* Search Input */}
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search templates..."
                                    value={templateSearchQuery}
                                    onChange={(e) => setTemplateSearchQuery(e.target.value)}
                                    className="pl-8 pr-3 py-1 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                />
                                <div className="absolute left-2 top-1/2 transform -translate-y-1/2">
                                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                            </div>
                            
                            {/* Category Filter */}
                            <select
                                value={templateFilterCategory}
                                onChange={(e) => setTemplateFilterCategory(e.target.value)}
                                className="px-2 py-1 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                            >
                                <option value="all">All Categories</option>
                                {templateCategories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                                <option value="uncategorized">Uncategorized</option>
                            </select>
                            
                            {/* Sort Options */}
                            <div className="flex items-center space-x-1">
                                <select
                                    value={templateSortBy}
                                    onChange={(e) => setTemplateSortBy(e.target.value as 'name' | 'date' | 'blocks')}
                                    className="px-2 py-1 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                >
                                    <option value="name">Sort by Name</option>
                                    <option value="date">Sort by Date</option>
                                    <option value="blocks">Sort by Blocks</option>
                                </select>
                                <button
                                    onClick={() => setTemplateSortOrder(templateSortOrder === 'asc' ? 'desc' : 'asc')}
                                    className="p-1 text-gray-600 hover:text-blue-600"
                                    title={`Sort ${templateSortOrder === 'asc' ? 'Descending' : 'Ascending'}`}
                                >
                                    {templateSortOrder === 'asc' ? (
                                        <SortAscendingIcon className="w-4 h-4" />
                                    ) : (
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() => handleCreateTemplateCategory()}
                                className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 flex items-center space-x-1"
                            >
                                <PlusIcon className="w-4 h-4" />
                                <span>Add Category</span>
                            </button>
                            <button
                                onClick={() => handleCreateTemplate()}
                                className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 flex items-center space-x-1"
                            >
                                <PlusIcon className="w-4 h-4" />
                                <span>New Template</span>
                            </button>
                        </div>
                    </div>

                    {/* Category Management */}
                    {templateCategories.length > 0 && (
                        <div className="space-y-3">
                            <h4 className="text-sm font-medium text-gray-700">Categories</h4>
                            {templateCategories.map((category) => (
                                <div key={category.id} className="bg-white rounded-lg p-3 border">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center space-x-2">
                                            <div 
                                                className="w-4 h-4 rounded-full"
                                                style={{ backgroundColor: category.color }}
                                            />
                                            <input
                                                type="text"
                                                value={category.name}
                                                onChange={(e) => handleUpdateTemplateCategory(category.id, { name: e.target.value })}
                                                className="font-medium bg-transparent border-none outline-none focus:bg-white focus:px-2 focus:py-1 focus:rounded"
                                            />
                                        </div>
                                        <button
                                            onClick={() => handleDeleteTemplateCategory(category.id)}
                                            className="text-red-500 hover:text-red-700 p-1"
                                        >
                                            <TrashIcon className="w-4 h-4" />
                                        </button>
                                    </div>
                                    
                                    <div className="text-xs text-gray-500 mb-2">
                                        {category.templateIds.length} templates
                                    </div>

                                    <div className="space-y-1">
                                        {getFilteredAndSortedTemplates(templateBlocks)
                                            .filter((template) => category.templateIds.includes(template.id))
                                            .map((template) => (
                                                <div key={template.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                                    <span className="text-sm">{template.data.text || 'Untitled Template'}</span>
                                                    <div className="flex items-center space-x-1">
                                                        <button
                                                            onClick={() => setEditingBlockId(template.id)}
                                                            className="text-blue-500 hover:text-blue-700 p-1"
                                                            title="Edit template"
                                                        >
                                                            <PencilIcon className="w-3 h-3" />
                                                        </button>
                                                        <button
                                                            onClick={(e) => handleDeleteTemplate(template.id, e)}
                                                            className="text-red-500 hover:text-red-700 p-1"
                                                            title="Delete template"
                                                        >
                                                            <XIcon className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))
                                        }
                                        {getFilteredAndSortedTemplates(templateBlocks).filter((template) => category.templateIds.includes(template.id)).length === 0 && (
                                            <div className="text-xs text-gray-400 p-2 text-center">
                                                No templates in this category
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Uncategorized Templates */}
                    <div className="space-y-3">
                        <h4 className="text-sm font-medium text-gray-700">
                            {templateCategories.length > 0 ? 'Uncategorized Templates' : 'All Templates'}
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {getFilteredAndSortedTemplates(templateBlocks)
                                .filter((template) => !templateCategories.some((cat) => cat.templateIds.includes(template.id)))
                                .map((template) => (
                                    <div 
                                        key={template.id} 
                                        className="bg-white rounded-lg p-3 border hover:shadow-md transition-shadow relative"
                                        onMouseEnter={() => setPreviewTemplateId(template.id)}
                                        onMouseLeave={() => setPreviewTemplateId(null)}
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <h5 className="font-medium text-sm truncate">
                                                {template.data.text || 'Untitled Template'}
                                            </h5>
                                            <div className="flex items-center space-x-1">
                                                <button
                                                    onClick={() => setPreviewTemplateId(previewTemplateId === template.id ? null : template.id)}
                                                    className={`p-1 ${previewTemplateId === template.id ? 'text-blue-600' : 'text-gray-400 hover:text-blue-500'}`}
                                                    title="Preview template"
                                                >
                                                    <EyeIcon className="w-3 h-3" />
                                                </button>
                                                <button
                                                    onClick={() => setEditingBlockId(template.id)}
                                                    className="text-blue-500 hover:text-blue-700 p-1"
                                                    title="Edit template"
                                                >
                                                    <PencilIcon className="w-3 h-3" />
                                                </button>
                                                <button
                                                    onClick={(e) => handleDeleteTemplate(template.id, e)}
                                                    className="text-red-500 hover:text-red-700 p-1"
                                                    title="Delete template"
                                                >
                                                    <XIcon className="w-3 h-3" />
                                                </button>
                                            </div>
                                        </div>
                                        
                                        {templateCategories.length > 0 && (
                                            <div className="mb-2">
                                                <select
                                                    className="w-full text-xs border rounded p-1"
                                                    onChange={(e) => {
                                                        if (e.target.value) {
                                                            handleAssignTemplateToCategory(template.id, e.target.value);
                                                        }
                                                    }}
                                                    defaultValue=""
                                                >
                                                    <option value="">Assign to category...</option>
                                                    {templateCategories.map((cat) => (
                                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        )}

                                        <div className="text-xs text-gray-500 mb-2">
                                            {template.children?.length || 0} blocks
                                        </div>
                                        
                                        {/* Template Preview */}
                                        <div className="text-xs text-gray-600 bg-gray-50 rounded p-2 max-h-20 overflow-hidden">
                                            {template.children && template.children.length > 0 ? (
                                                <div className="space-y-1">
                                                    {template.children.slice(0, 3).map((child: Block) => (
                                                        <div key={child.id} className="flex items-center space-x-1">
                                                            <div className="w-2 h-2 bg-gray-300 rounded-full" />
                                                            <span className="truncate">
                                                                {child.data.text || child.type || 'Block'}
                                                            </span>
                                                        </div>
                                                    ))}
                                                    {template.children.length > 3 && (
                                                        <div className="text-gray-400 text-xs">
                                                            +{template.children.length - 3} more blocks
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="text-gray-400 italic">Empty template</div>
                                            )}
                                        </div>
                                        
                                        {/* Hover Preview Tooltip */}
                                        {previewTemplateId === template.id && (
                                            <div className="absolute z-10 bg-white border rounded-lg shadow-lg p-3 w-64 -top-2 left-full ml-2">
                                                <div className="font-medium text-sm mb-2">{template.data.text || 'Untitled Template'}</div>
                                                <div className="text-xs text-gray-600 max-h-32 overflow-y-auto">
                                                    {template.children && template.children.length > 0 ? (
                                                        <div className="space-y-1">
                                                            {template.children.slice(0, 5).map((child: Block) => (
                                                                <div key={child.id} className="flex items-center space-x-2">
                                                                    <div className="w-2 h-2 bg-blue-400 rounded-full" />
                                                                    <span className="truncate">
                                                                        {child.data.text || child.type || 'Block'}
                                                                    </span>
                                                                </div>
                                                            ))}
                                                            {template.children.length > 5 && (
                                                                <div className="text-gray-400 text-xs mt-1">
                                                                    +{template.children.length - 5} more blocks
                                                                </div>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <div className="text-gray-400 italic">Empty template</div>
                                                    )}
                                                </div>
                                                <div className="text-xs text-gray-500 mt-2 pt-2 border-t">
                                                    {template.children?.length || 0} total blocks
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))
                            }
                        </div>
                        {getFilteredAndSortedTemplates(templateBlocks).filter((template) => !templateCategories.some((cat) => cat.templateIds.includes(template.id))).length === 0 && (
                            <div className="text-center text-gray-500 py-8">
                                <DocumentDuplicateIcon className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                                <p className="text-sm">No templates available</p>
                                <button
                                    onClick={handleCreateTemplate}
                                    className="mt-2 text-blue-600 hover:text-blue-800 text-sm"
                                >
                                    Create your first template
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Active View */}
            {activeView === ViewType.TABLE && (
                <DatabaseTableView 
                    properties={properties}
                    processedRows={processedRows}
                    rowBlocks={rowBlocks}
                    databaseId={block.id}
                    handleAddProperty={handleAddProperty}
                    handleAddRow={handleAddRow}
                    onUpdateBlock={handleUpdateBlock}
                    onUpdateProperties={handleUpdateProperties}
                    onOpenRow={(id) => setEditingBlockId(id)}
                />
            )}

            {activeView === ViewType.BOARD && (
                <DatabaseBoardView 
                    properties={properties}
                    processedRows={processedRows}
                    handleAddRow={handleAddRow}
                    onUpdateBlock={handleUpdateBlock}
                    onUpdateProperties={handleUpdateProperties}
                    groupBy={groupBy}
                    onGroupByChange={setGroupBy}
                    onOpenRow={(id) => setEditingBlockId(id)}
                />
            )}

            {activeView === ViewType.CALENDAR && (
                <DatabaseCalendarView 
                    properties={properties}
                    processedRows={processedRows}
                    handleAddRow={handleAddRow}
                    onUpdateBlock={handleUpdateBlock}
                    onUpdateProperties={handleUpdateProperties}
                    onOpenRow={(id) => setEditingBlockId(id)}
                />
            )}

            {activeView === ViewType.GALLERY && (
                <DatabaseGalleryView 
                    properties={properties}
                    processedRows={processedRows}
                    handleAddRow={handleAddRow}
                    onUpdateBlock={handleUpdateBlock}
                    onUpdateProperties={handleUpdateProperties}
                    onOpenRow={(id) => setEditingBlockId(id)}
                />
            )}

            <style jsx>{`
                .database-block {
                    /* Custom styles if needed */
                }
            `}</style>
        </div>
    );
};

export default DatabaseBlock;
