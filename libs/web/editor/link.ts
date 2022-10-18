import RichMarkdownEditor from '@notea/rich-markdown-editor';
import type { Mark } from 'prosemirror-model';

type Node = RichMarkdownEditor['view']['state']['doc'];

/**
 * From https://github.com/outline/rich-markdown-editor/blob/3540af9f811a687c46ea82e0274a6286181da4f2/src/commands/createAndInsertLink.ts#L5-L33
 */
export function findPlaceholderLink(doc: Node, href: string) {
    let result: { node: Node; pos: number } | undefined;

    function findLinks(node: Node, pos = 0) {
        // get text nodes
        if (node.type.name === 'text') {
            // get marks for text nodes
            node.marks.forEach((mark: Mark) => {
                // any of the marks links?
                if (mark.type.name === 'link') {
                    // any of the links to other docs?
                    if (mark.attrs.href === href) {
                        result = { node, pos };
                        if (result) return false;
                    }
                }
            });
        }

        if (!node.content.size) {
            return;
        }

        node.descendants(findLinks);
    }

    findLinks(doc);
    return result;
}
