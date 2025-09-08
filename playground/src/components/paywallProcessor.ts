/**
 * Paywall Content Processor Utility
 *
 * A standalone utility function that processes ProseMirror JSON schema
 * to truncate content after a paywall separator and replace it with
 * a membership prompt.
 */

/**
 * Type definitions for ProseMirror JSON schema
 */
interface ProseMirrorNode {
    type: string;
    content?: ProseMirrorNode[];
    attrs?: Record<string, any>;
    text?: string;
    marks?: Array<{
        type: string;
        attrs?: Record<string, any>;
    }>;
}

interface ProseMirrorDocument {
    type: string;
    content: ProseMirrorNode[];
}

/**
 * Configuration options for the paywall processor
 */
interface PaywallProcessorOptions {
    /** Main heading text for the membership prompt */
    headingText?: string;
    /** Subtitle/description text (will be styled in gray) */
    subtitleText?: string;
    /** Link text to display */
    linkText?: string;
    /** Link URL for the membership/subscription page */
    linkUrl?: string;
    /** Whether to preserve the paywall separator in the output */
    preservePaywallSeparator?: boolean;
}

/**
 * Default configuration
 */
const DEFAULT_OPTIONS: Required<PaywallProcessorOptions> = {
    headingText: "Continue Reading",
    subtitleText: "Get unlimited access to premium content and exclusive articles",
    linkText: "Subscribe Now",
    linkUrl: "#",
    preservePaywallSeparator: false,
};

/**
 * Creates a centered heading node
 */
function createCenteredHeading(text: string): ProseMirrorNode {
    return {
        type: "heading",
        attrs: {
            level: 2,
            textAlign: "center",
            indent: 0,
            lineHeight: null,
            dir: "auto"
        },
        content: [
            {
                type: "text",
                text: text
            }
        ]
    };
}

/**
 * Creates a centered paragraph with gray text
 */
function createCenteredSubtitle(text: string): ProseMirrorNode {
    return {
        type: "paragraph",
        attrs: {
            textAlign: "center",
            indent: 0,
            lineHeight: null,
            dir: "auto"
        },
        content: [
            {
                type: "text",
                text: text,
                marks: [
                    {
                        type: "textStyle",
                        attrs: {
                            color: "#6b7280" // gray-500 equivalent
                        }
                    }
                ]
            }
        ]
    };
}

/**
 * Creates a centered paragraph with a link
 */
function createCenteredLink(linkText: string, linkUrl: string): ProseMirrorNode {
    return {
        type: "paragraph",
        attrs: {
            textAlign: "center",
            indent: 0,
            lineHeight: null,
            dir: "auto"
        },
        content: [
            {
                type: "text",
                text: linkText,
                marks: [
                    {
                        type: "link",
                        attrs: {
                            href: linkUrl,
                            target: "_blank",
                            rel: "noopener noreferrer"
                        }
                    },
                    {
                        type: "textStyle",
                        attrs: {
                            color: "#3b82f6" // blue-500 equivalent
                        }
                    }
                ]
            }
        ]
    };
}

/**
 * Creates the complete membership prompt section
 */
function createMembershipPrompt(options: Required<PaywallProcessorOptions>): ProseMirrorNode[] {
    const nodes: ProseMirrorNode[] = [];

    // Add some spacing before the prompt
    nodes.push({
        type: "paragraph",
        attrs: {
            textAlign: null,
            indent: 0,
            lineHeight: null,
            dir: "auto"
        },
        content: []
    });

    // Add heading
    nodes.push(createCenteredHeading(options.headingText));

    // Add subtitle
    nodes.push(createCenteredSubtitle(options.subtitleText));

    // Add link
    nodes.push(createCenteredLink(options.linkText, options.linkUrl));

    // Add some spacing after the prompt
    nodes.push({
        type: "paragraph",
        attrs: {
            textAlign: null,
            indent: 0,
            lineHeight: null,
            dir: "auto"
        },
        content: []
    });

    return nodes;
}


/**
 * Recursively processes content to remove paywall separator and everything after it
 */
function processContentRecursively(content: ProseMirrorNode[]): {
    processedContent: ProseMirrorNode[];
    foundPaywall: boolean
} {
    const processedContent: ProseMirrorNode[] = [];

    for (let i = 0; i < content.length; i++) {
        const node = content[i];

        // If we encounter a paywall separator, stop processing
        if (node.type === "paywallSeparator") {
            return {
                processedContent,
                foundPaywall: true
            };
        }

        // If the node has nested content, process it recursively
        if (node.content && Array.isArray(node.content)) {
            const { processedContent: nestedContent, foundPaywall } = processContentRecursively(node.content);

            // Add the node with processed content
            processedContent.push({
                ...node,
                content: nestedContent
            });

            // If paywall was found in nested content, stop processing
            if (foundPaywall) {
                return {
                    processedContent,
                    foundPaywall: true
                };
            }
        } else {
            // Add the node as-is if it has no content
            processedContent.push(node);
        }
    }

    return {
        processedContent,
        foundPaywall: false
    };
}

/**
 * Validates that the input is a valid ProseMirror document
 */
function validateProseMirrorDocument(doc: any): doc is ProseMirrorDocument {
    if (!doc || typeof doc !== 'object') {
        return false;
    }

    if (doc.type !== 'doc') {
        return false;
    }

    if (!Array.isArray(doc.content)) {
        return false;
    }

    return true;
}

/**
 * Main processor function that truncates content after paywall separator
 *
 * @param document - ProseMirror JSON document
 * @param options - Configuration options
 * @returns Processed document with content truncated after paywall
 *
 * @example
 * ```typescript
 * const document = {
 *   type: "doc",
 *   content: [
 *     { type: "paragraph", content: [{ type: "text", text: "Free content" }] },
 *     { type: "paywallSeparator" },
 *     { type: "paragraph", content: [{ type: "text", text: "Premium content" }] }
 *   ]
 * };
 *
 * const processed = processPaywallContent(document, {
 *   headingText: "Unlock Premium Content",
 *   subtitleText: "Join our community of readers and get access to exclusive articles",
 *   linkText: "Start Your Subscription",
 *   linkUrl: "https://example.com/subscribe"
 * });
 * ```
 */
export function processPaywallContent(
    document: ProseMirrorDocument | any,
    options: PaywallProcessorOptions = {}
): ProseMirrorDocument {
    // Merge options with defaults
    const config = { ...DEFAULT_OPTIONS, ...options };

    // Validate input
    if (!validateProseMirrorDocument(document)) {
        throw new Error('Invalid ProseMirror document: Expected document with type "doc" and content array');
    }

    // Create a deep copy to avoid mutating the original
    const docCopy: ProseMirrorDocument = JSON.parse(JSON.stringify(document));

    // Process the content recursively
    const { processedContent, foundPaywall } = processContentRecursively(docCopy.content);

    // If no paywall was found, return the original document
    if (!foundPaywall) {
        return docCopy;
    }

    // Create the result with truncated content
    const result: ProseMirrorDocument = {
        type: "doc",
        content: [...processedContent]
    };

    // Add the formatted membership prompt
    const membershipPrompt = createMembershipPrompt(config);
    result.content.push(...membershipPrompt);

    return result;
}

/**
 * Utility function to check if a document contains a paywall separator
 *
 * @param document - ProseMirror JSON document
 * @returns boolean indicating if paywall separator exists
 */
export function hasPaywallSeparator(document: ProseMirrorDocument | any): boolean {
    if (!validateProseMirrorDocument(document)) {
        return false;
    }

    const { foundPaywall } = processContentRecursively(document.content);
    return foundPaywall;
}

/**
 * Utility function to get content before paywall separator
 *
 * @param document - ProseMirror JSON document
 * @returns Content that appears before the paywall separator
 */
export function getFreeContent(document: ProseMirrorDocument | any): ProseMirrorNode[] {
    if (!validateProseMirrorDocument(document)) {
        throw new Error('Invalid ProseMirror document');
    }

    const { processedContent } = processContentRecursively(document.content);
    return processedContent;
}

/**
 * Export the main processor as default
 */
export default processPaywallContent;