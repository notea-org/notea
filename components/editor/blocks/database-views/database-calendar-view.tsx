import { FC, useMemo, useState } from 'react';
import { DatabaseProperty, Block as BlockInterface, PropertyType } from 'libs/shared/block';
import dayjs from 'dayjs';
import { ChevronLeftIcon, ChevronRightIcon, PlusIcon } from '@heroicons/react/solid';

interface DatabaseCalendarViewProps {
    properties: DatabaseProperty[];
    processedRows: BlockInterface[];
    handleAddRow: () => void;
    onUpdateBlock: (id: string, data: any) => void;
    onUpdateProperties: (properties: DatabaseProperty[]) => void;
    onOpenRow?: (id: string) => void;
}

export const DatabaseCalendarView: FC<DatabaseCalendarViewProps> = ({
    properties,
    processedRows,
    handleAddRow,
    onOpenRow
}) => {
    const [currentDate, setCurrentDate] = useState(dayjs());

    // Find the first Date property to use
    const dateProperty = useMemo(() =>
        properties.find((p) => p.type === PropertyType.DATE),
    [properties]
    );

    // Group rows by date
    const rowsByDate = useMemo(() => {
        if (!dateProperty) return {};

        const map: Record<string, BlockInterface[]> = {};
        
        processedRows.forEach((row) => {
            const val = row.data.properties?.[dateProperty.id];
            if (val) {
                // Assuming val is an ISO string or similar date string
                const dateStr = dayjs(val).format('YYYY-MM-DD');
                if (!map[dateStr]) {
                    map[dateStr] = [];
                }
                map[dateStr].push(row);
            }
        });

        return map;
    }, [processedRows, dateProperty]);

    if (!dateProperty) {
        return (
            <div className="p-8 text-center bg-gray-50 rounded border border-dashed text-gray-500">
                <p>To use Calendar view, add a Date property.</p>
            </div>
        );
    }

    const startOfMonth = currentDate.startOf('month');
    const endOfMonth = currentDate.endOf('month');
    const startDate = startOfMonth.startOf('week');
    const endDate = endOfMonth.endOf('week');

    const calendarDays: dayjs.Dayjs[] = [];
    let day = startDate;
    while (day.isBefore(endDate) || day.isSame(endDate, 'day')) {
        calendarDays.push(day);
        day = day.add(1, 'day');
    }

    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
        <div className="flex flex-col h-full bg-white border rounded-lg shadow-sm overflow-hidden">
            {/* Calendar Header */}
            <div className="flex items-center justify-between p-4 border-b">
                <div className="flex items-center space-x-4">
                    <h2 className="text-lg font-semibold text-gray-800">
                        {currentDate.format('MMMM YYYY')}
                    </h2>
                    <div className="flex items-center space-x-1">
                        <button 
                            className="p-1 hover:bg-gray-100 rounded"
                            onClick={() => setCurrentDate(currentDate.subtract(1, 'month'))}
                        >
                            <ChevronLeftIcon className="w-5 h-5 text-gray-600" />
                        </button>
                        <button 
                            className="p-1 hover:bg-gray-100 rounded"
                            onClick={() => setCurrentDate(dayjs())}
                        >
                            <span className="text-sm font-medium text-gray-600 px-2">Today</span>
                        </button>
                        <button 
                            className="p-1 hover:bg-gray-100 rounded"
                            onClick={() => setCurrentDate(currentDate.add(1, 'month'))}
                        >
                            <ChevronRightIcon className="w-5 h-5 text-gray-600" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Calendar Grid */}
            <div className="flex-1 flex flex-col min-h-[600px]">
                {/* Weekday Headers */}
                <div className="grid grid-cols-7 border-b bg-gray-50">
                    {weekDays.map((d) => (
                        <div key={d} className="p-2 text-center text-xs font-semibold text-gray-500 uppercase">
                            {d}
                        </div>
                    ))}
                </div>

                {/* Days */}
                <div className="grid grid-cols-7 flex-1 auto-rows-fr">
                    {calendarDays.map((d, idx) => {
                        const dateStr = d.format('YYYY-MM-DD');
                        const isCurrentMonth = d.month() === currentDate.month();
                        const isToday = d.isSame(dayjs(), 'day');
                        const dayRows = rowsByDate[dateStr] || [];

                        return (
                            <div 
                                key={dateStr} 
                                className={`
                                    border-b border-r p-1 min-h-[100px] flex flex-col group relative
                                    ${!isCurrentMonth ? 'bg-gray-50/50' : 'bg-white'}
                                    ${(idx + 1) % 7 === 0 ? 'border-r-0' : ''}
                                `}
                                onClick={() => {
                                    // Optional: Add item on this date
                                }}
                            >
                                <div className="flex justify-between items-start mb-1">
                                    <span className={`
                                        text-xs font-medium w-6 h-6 flex items-center justify-center rounded-full
                                        ${isToday ? 'bg-primary-500 text-white' : isCurrentMonth ? 'text-gray-700' : 'text-gray-400'}
                                    `}>
                                        {d.date()}
                                    </span>
                                    <button 
                                        className="opacity-0 group-hover:opacity-100 p-0.5 hover:bg-gray-200 rounded text-gray-500"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleAddRow();
                                            // TODO: Pre-fill date property with this date
                                            // This is tricky because handleAddRow creates a block but we don't get the ID back immediately here easily
                                            // or we need to update the block immediately after creation if we can intercept it.
                                            // For now, just adding a row is fine, user can set date.
                                        }}
                                    >
                                        <PlusIcon className="w-3 h-3" />
                                    </button>
                                </div>

                                <div className="space-y-1 flex-1 overflow-y-auto">
                                    {dayRows.map((row) => (
                                        <div 
                                            key={row.id}
                                            className="bg-white border rounded px-1.5 py-0.5 text-xs shadow-sm truncate cursor-pointer hover:bg-gray-50"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onOpenRow?.(row.id);
                                            }}
                                        >
                                            {properties.length > 0 ? (
                                                <span className={row.data.properties?.[properties[0].id] ? 'text-gray-900' : 'text-gray-400'}>
                                                    {row.data.properties?.[properties[0].id] || 'Untitled'}
                                                </span>
                                            ) : 'Untitled'}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default DatabaseCalendarView;
