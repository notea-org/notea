const extract = require('i18n-extract');
const { resolve, extname } = require('path');
const { sortBy, forEach } = require('lodash');
const { readdirSync, readFileSync, writeFileSync } = require('fs');

console.log(`[i18n] Extracting keys`);

const keys = extract.extractFromFiles([resolve(__dirname, '../**/*.tsx')], {
    marker: 't',
    parser: 'typescript',
});
const localesPath = resolve(__dirname, '../locales');
const files = readdirSync(localesPath);

forEach(files, (file) => {
    if (extname(file) === '.json') {
        const filePath = resolve(localesPath, file);
        const text = readFileSync(filePath).toString() || `{}`;
        const rawLocale = JSON.parse(text);
        const locale = {};

        forEach(sortBy(keys, 'key'), ({ key }) => {
            if (!locale[key]) {
                locale[key] = rawLocale[key] || key;
            }
        });

        writeFileSync(filePath, JSON.stringify(locale, null, '  '));
        console.log(`[i18n] Generated ${file}`);
    }
});
