import { FC, useState, useRef } from 'react';
import { BlockComponentProps } from './block-renderer';
 

const CALLOUT_ICONS = {
  info: 'ℹ️',
  warning: '⚠️',
  success: '✅',
  error: '❌',
  tip: '💡',
  note: '📝',
};

const CALLOUT_COLORS = {
  info: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-800' },
  warning: { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-800' },
  success: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-800' },
  error: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-800' },
  tip: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-800' },
  note: { bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-800' },
};

const CalloutBlock: FC<BlockComponentProps> = ({
    block,
    isSelected,
    isEditable,
    onSelect,
    onUpdate,
    onDelete,
}) => {
    const [content, setContent] = useState(block.data.text || '');
    const [calloutType, setCalloutType] = useState<'info' | 'warning' | 'success' | 'error' | 'tip' | 'note'>(
        block.data.calloutType || 'info'
    );
    const [showIconPicker, setShowIconPicker] = useState(false);

    const contentRef = useRef(block.data.text || '');

  

    const handleCalloutTypeChange = (newType: typeof calloutType) => {
        setCalloutType(newType);
        if (onUpdate) {
            onUpdate({ text: content, calloutType: newType });
        }
    };

    const handleIconChange = (newIcon: string) => {
        if (onUpdate) {
            onUpdate({ text: content, calloutType, icon: newIcon });
        }
        setShowIconPicker(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            return;
        }

        if (e.key === 'Backspace' && content === '') {
            e.preventDefault();
            if (onDelete) {
                onDelete();
            }
        }
    };

    const colors = CALLOUT_COLORS[calloutType];
    const icon = block.data.icon || CALLOUT_ICONS[calloutType];

    return (
        <div
            className={`callout-block ${colors.bg} ${colors.border} ${colors.text} border-l-4 p-4 rounded-r-lg ${isSelected ? 'selected' : ''}`}
            onClick={onSelect}
        >
            <div className="callout-header flex items-start gap-3">
                <div className="callout-icon relative">
                    <button
                        className="text-xl hover:opacity-70 transition-opacity"
                        onClick={() => setShowIconPicker(!showIconPicker)}
                        disabled={!isEditable}
                    >
                        {icon}
                    </button>

                    {showIconPicker && isEditable && (
                        <div className="icon-picker absolute top-8 left-0 bg-white border rounded-lg shadow-lg p-2 z-10">
                            <div className="grid grid-cols-3 gap-1">
                                {Object.entries(CALLOUT_ICONS).map(([key, emoji]) => (
                                    <button
                                        key={key}
                                        className="p-2 hover:bg-gray-100 rounded text-xl"
                                        onClick={() => handleIconChange(emoji)}
                                    >
                                        {emoji}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

        <div className="callout-content flex-1">
          <div
            contentEditable={isEditable}
            onInput={(evt: React.FormEvent<HTMLDivElement>) => {
              const newContent = evt.currentTarget.textContent || '';
              setContent(newContent);
              contentRef.current = newContent;
              if (onUpdate) {
                onUpdate({ text: newContent, calloutType });
              }
            }}
            onKeyDown={handleKeyDown}
            className="callout-text min-h-[1.5rem] outline-none"
            data-placeholder="Type something..."
          >
            {content}
          </div>
        </div>
            </div>

            {isEditable && (
                <div className="callout-type-selector mt-2 flex gap-2">
                    {Object.keys(CALLOUT_COLORS).map((type) => (
                        <button
                            key={type}
                            className={`px-2 py-1 text-xs rounded ${calloutType === type ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
                            onClick={() => handleCalloutTypeChange(type as typeof calloutType)}
                        >
                            {type}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CalloutBlock;
