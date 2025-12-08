import React, { useMemo } from 'react';
import EditorState from 'libs/web/state/editor';

const EditorStats = () => {
    const { note } = EditorState.useContainer();
    const content = note?.content || '';

    const stats = useMemo(() => {
        // Simple markdown strip to get closer to actual readable text
        const text = content
            .replace(/!\[.*?\]\(.*?\)/g, '') // Remove images
            .replace(/\[.*?\]\(.*?\)/g, '$1') // Keep link text
            .replace(/[#*`]/g, '') // Remove simple markdown syntax
            .trim();

        const words = text.split(/\s+/).filter((w) => w.length > 0).length;
        const chars = text.length;
        // Average reading speed: 200-250 wpm. Using 200.
        const readingTime = Math.max(1, Math.ceil(words / 200));

        return { words, chars, readingTime };
    }, [content]);

    if (!content) return null;

    return (
        <div className="flex items-center space-x-4 text-gray-400 text-xs mt-2 select-none border-t border-gray-100 dark:border-gray-800 pt-4 mb-8">
            <span>{stats.words} words</span>
            <span>{stats.chars} characters</span>
            <span>{stats.readingTime} min read</span>
        </div>
    );
};

export default EditorStats;
