import { FC, useEffect, useState } from 'react';

const QUOTES = [
    {
        text: 'Start where you are. Use what you have. Do what you can.',
        author: 'Arthur Ashe',
    },
    {
        text: 'The secret of getting ahead is getting started.',
        author: 'Mark Twain',
    },
    {
        text: "It always seems impossible until it's done.",
        author: 'Nelson Mandela',
    },
    { text: 'Quality is not an act, it is a habit.', author: 'Aristotle' },
    {
        text: "You don't have to be great to start, but you have to start to be great.",
        author: 'Zig Ziglar',
    },
    {
        text: 'Either write something worth reading or do something worth writing.',
        author: 'Benjamin Franklin',
    },
    {
        text: 'The scariest moment is always just before you start.',
        author: 'Stephen King',
    },
    {
        text: 'A word after a word after a word is power.',
        author: 'Margaret Atwood',
    },
    {
        text: 'There is no greater agony than bearing an untold story inside you.',
        author: 'Maya Angelou',
    },
];

const MotivationalQuote: FC = () => {
    const [quote, setQuote] = useState(QUOTES[0]);

    useEffect(() => {
        const randomQuote = QUOTES[Math.floor(Math.random() * QUOTES.length)];
        setQuote(randomQuote);
    }, []);

    return (
        <div className="mt-8 max-w-lg mx-auto text-center px-4">
            <blockquote className="text-xl font-medium text-gray-700 italic font-serif">
                &ldquo;{quote.text}&rdquo;
            </blockquote>
            <div className="mt-2 text-gray-500 font-medium">
                — {quote.author}
            </div>
        </div>
    );
};

export default MotivationalQuote;
