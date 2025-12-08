import { FC } from 'react';
import { DatabaseProperty, Block as BlockInterface, PropertyType } from 'libs/shared/block';
import { PlusIcon, PhotographIcon } from '@heroicons/react/solid';

interface DatabaseGalleryViewProps {
    properties: DatabaseProperty[];
    processedRows: BlockInterface[];
    handleAddRow: () => void;
    onUpdateBlock: (id: string, data: any) => void;
    onUpdateProperties: (properties: DatabaseProperty[]) => void;
    onOpenRow?: (id: string) => void;
}

export const DatabaseGalleryView: FC<DatabaseGalleryViewProps> = ({
    properties,
    processedRows,
    handleAddRow,
    onOpenRow
}) => {
    // Helper to find an image for the card
    const getCoverImage = (row: BlockInterface) => {
        // Check for URL property that looks like an image
        const urlProp = properties.find((p) => p.type === PropertyType.URL);
        if (urlProp) {
            const val = row.data.properties?.[urlProp.id];
            if (val && typeof val === 'string' && (val.match(/\.(jpeg|jpg|gif|png)$/) != null)) {
                return val;
            }
        }
        // TODO: Check for FILE property when implemented
        return null;
    };

    return (
        <div className="h-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pb-4">
                {processedRows.map((row) => {
                    const coverImage = getCoverImage(row);
                    
                    return (
                        <div 
                            key={row.id} 
                            className="group bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col cursor-pointer min-h-[200px]"
                            onClick={() => onOpenRow?.(row.id)}
                        >
                            {/* Cover Image Area */}
                            <div className="h-32 bg-gray-100 w-full relative">
                                {coverImage ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img 
                                        src={coverImage} 
                                        alt="Cover" 
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                                        <PhotographIcon className="w-8 h-8" />
                                    </div>
                                )}
                            </div>

                            {/* Content */}
                            <div className="p-3 flex-1 flex flex-col space-y-2">
                                <div className="font-medium text-gray-900 text-base">
                                     {properties.length > 0 ? (
                                         <span>
                                             {row.data.properties?.[properties[0].id] || 'Untitled'}
                                         </span>
                                     ) : 'Untitled'}
                                </div>
                                
                                <div className="space-y-1">
                                    {properties.slice(1, 4).map((prop) => {
                                        const val = row.data.properties?.[prop.id];
                                        if (!val) return null;
                                        
                                        return (
                                            <div key={prop.id} className="text-xs text-gray-500 truncate flex items-center">
                                                <span className="w-20 flex-shrink-0 text-gray-400">{prop.name}:</span>
                                                <span className="truncate">{String(val)}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    );
                })}

                {/* New Item Card */}
                <button 
                    className="bg-gray-50 rounded-lg border border-dashed border-gray-300 hover:bg-gray-100 hover:border-gray-400 transition-colors flex flex-col items-center justify-center min-h-[200px] text-gray-500"
                    onClick={handleAddRow}
                >
                    <PlusIcon className="w-8 h-8 mb-2" />
                    <span className="text-sm font-medium">New</span>
                </button>
            </div>
        </div>
    );
};

export default DatabaseGalleryView;
