import useI18n from 'libs/web/hooks/use-i18n';
import { useMemo } from 'react';

export const useDictionary = () => {
    const { t } = useI18n();

    const dictionary = useMemo(
        () => ({
            addColumnAfter: t('Insert column after'),
            addColumnBefore: t('Insert column before'),
            addRowAfter: t('Insert row after'),
            addRowBefore: t('Insert row before'),
            alignCenter: t('Align center'),
            alignLeft: t('Align left'),
            alignRight: t('Align right'),
            bulletList: t('Bulleted list'),
            checkboxList: t('Todo list'),
            codeBlock: t('Code block'),
            codeCopied: t('Copied to clipboard'),
            codeInline: t('Code'),
            createLink: t('Create link'),
            createLinkError: t('Sorry, an error occurred creating the link'),
            createNewDoc: t('Create a new note'),
            deleteColumn: t('Delete column'),
            deleteRow: t('Delete row'),
            deleteTable: t('Delete table'),
            deleteImage: t('Delete image'),
            em: t('Italic'),
            embedInvalidLink: t(
                'Sorry, that link won’t work for this embed type'
            ),
            findOrCreateDoc: t('Find or create a note…'),
            h1: t('Big heading'),
            h2: t('Medium heading'),
            h3: t('Small heading'),
            heading: t('Heading'),
            hr: t('Divider'),
            image: t('Image'),
            imageUploadError: t('Sorry, an error occurred uploading the image'),
            info: t('Info'),
            infoNotice: t('Info notice'),
            link: t('Link'),
            linkCopied: t('Link copied to clipboard'),
            mark: t('Highlight'),
            newLineEmpty: t("Type '/' to insert…"),
            newLineWithSlash: t('Keep typing to filter…'),
            noResults: t('No results'),
            openLink: t('Open link'),
            orderedList: t('Ordered list'),
            pageBreak: t('Page break'),
            pasteLink: t('Paste a link…'),
            pasteLinkWithTitle: (title: string): string =>
                t(`Paste a {{title}} link…`, { title }),
            placeholder: t('Placeholder'),
            quote: t('Quote'),
            removeLink: t('Remove link'),
            searchOrPasteLink: t('Search or paste a link…'),
            strikethrough: t('Strikethrough'),
            strong: t('Bold'),
            subheading: t('Subheading'),
            table: t('Table'),
            tip: t('Tip'),
            tipNotice: t('Tip notice'),
            warning: t('Warning'),
            warningNotice: t('Warning notice'),
            editorPlaceholder: t('Write something nice…'),
        }),
        [t]
    );

    return dictionary;
};
