import { FC, memo, ReactNode } from 'react';
import { searchRangeText } from 'libs/web/utils/search';

const MarkText: FC<{
    text?: string;
    keyword?: string;
    maxLen?: number;
}> = memo(({ text = '', keyword = '', maxLen = 80 }) => {
    if (!text || !keyword) return <span>{text}</span>;

    const texts: ReactNode[] = [];
    const { re, match } = searchRangeText({
        text,
        keyword,
        maxLen,
    });
    let block: RegExpExecArray | null;
    let index = 0;

    while ((block = re.exec(match))) {
        texts.push(
            match.slice(index, block.index),
            <mark
                className="font-bold text-gray-800 bg-transparent"
                key={index}
            >
                {block[0]}
            </mark>
        );
        index = block.index + block[0].length;
    }
    texts.push(match.slice(index));

    return <span>{texts}</span>;
});

export default MarkText;
