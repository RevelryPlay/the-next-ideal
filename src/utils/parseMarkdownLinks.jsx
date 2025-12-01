/**
 * Parse markdown-style links [text](url) in a string and return React elements
 * @param {string} text - Text potentially containing markdown links
 * @returns {Array} Array of strings and link elements
 */
export const parseMarkdownLinks = (text) => {
    if (!text) return text;

    // Regex to match markdown links: [text](url)
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;

    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = linkRegex.exec(text)) !== null) {
        // Add text before the link
        if (match.index > lastIndex) {
            parts.push(text.substring(lastIndex, match.index));
        }

        // Add the link element
        const linkText = match[1];
        const url = match[2];

        parts.push(
            <a
                key={match.index}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-stormlight-gold dark:text-stormlight-gold hover:underline font-medium"
            >
                {linkText}
            </a>
        );

        lastIndex = match.index + match[0].length;
    }

    // Add remaining text after the last link
    if (lastIndex < text.length) {
        parts.push(text.substring(lastIndex));
    }

    // If no links were found, return the original text
    return parts.length === 0 ? text : parts;
};
