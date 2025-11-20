import DOMPurify from "dompurify";

interface SanitizerConfig {
  allowedTags?: string[];
  allowedAttributes?: string[];
  allowedCss?: Record<string, RegExp>;
  enableListStyling?: boolean;
  enableSpacingPreservation?: boolean;
}

const DEFAULT_CONFIG: SanitizerConfig = {
  allowedTags: [
    // Headings
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    // Text formatting
    "p",
    "br",
    "div",
    "span",
    "section",
    "article",
    "strong",
    "em",
    "b",
    "i",
    "u",
    "s",
    "sub",
    "sup",
    "mark",
    "small",
    "del",
    "ins",
    // Lists - IMPORTANT: Keep these for numbering
    "ul",
    "ol",
    "li",
    "dl",
    "dt",
    "dd",
    // Links and media
    "a",
    "img",
    "figure",
    "figcaption",
    // Code and quotes
    "blockquote",
    "cite",
    "q",
    "pre",
    "code",
    "kbd",
    "samp",
    // Tables
    "table",
    "thead",
    "tbody",
    "tfoot",
    "tr",
    "th",
    "td",
    "caption",
    "colgroup",
    "col",
    // Other common elements
    "hr",
    "address",
    "time",
  ],
  allowedAttributes: [
    // Links
    "href",
    "target",
    "rel",
    "title",
    // Media
    "src",
    "alt",
    "width",
    "height",
    "loading",
    // General - IMPORTANT: These preserve Quill formatting
    "class",
    "id",
    "style",
    "data-*",
    // Tables
    "colspan",
    "rowspan",
    "scope",
    // Lists - IMPORTANT: These attributes preserve list numbering
    "start",
    "type",
    "reversed",
    // Time
    "datetime",
  ],
  allowedCss: {
    "text-align": /^(left|right|center|justify)$/,
    "font-weight": /^(bold|normal|\d+)$/,
    "font-style": /^(italic|normal)$/,
    "text-decoration": /^(underline|line-through|none)$/,
    color: /^#[0-9a-f]{3,6}$/i,
    "background-color": /^#[0-9a-f]{3,6}$/i,
    margin: /^[\d\s.%px-]+$/,
    padding: /^[\d\s.%px-]+$/,
    "list-style-type":
      /^(decimal|lower-alpha|upper-alpha|lower-roman|upper-roman|disc|circle|square|none)$/,
    "margin-left": /^[\d.%px-]+$/,
    "padding-left": /^[\d.%px-]+$/,
    // Add spacing-related CSS properties
    "min-height": /^[\d.%px-]+$/,
    display: /^(block|inline|inline-block|list-item|none)$/,
    content: /^['"].*['"]$/,
    "margin-top": /^[\d.%px-]+$/,
    "margin-bottom": /^[\d.%px-]+$/,
    "line-height": /^[\d.%px-]+$/,
  },
  enableListStyling: true,
  enableSpacingPreservation: true,
};

/**
 * Sanitizes HTML content using DOMPurify with a secure configuration
 * @param htmlContent - The HTML content to sanitize
 * @param customConfig - Optional custom configuration to override defaults
 * @returns Sanitized HTML string
 */
export function sanitizeHtmlContent(
  htmlContent: string,
  customConfig: Partial<SanitizerConfig> = {}
): string {
  if (!htmlContent || typeof htmlContent !== "string") {
    return "";
  }

  // Merge custom config with defaults
  const config = { ...DEFAULT_CONFIG, ...customConfig };

  const dompurifyConfig = {
    ALLOWED_TAGS: config.allowedTags,
    ALLOWED_ATTR: config.allowedAttributes,
    ALLOWED_CSS: config.allowedCss,
    ALLOWED_URI_REGEXP:
      /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
    ADD_ATTR: ["target"],
    FORBID_ATTR: [
      "onerror",
      "onload",
      "onclick",
      "onmouseover",
      "onmouseout",
      "onfocus",
      "onblur",
    ],
    KEEP_CONTENT: true,
    RETURN_DOM_FRAGMENT: false,
    RETURN_DOM: false,
    ALLOW_DATA_ATTR: true,
    ALLOW_UNKNOWN_PROTOCOLS: false,
  };

  try {
    let sanitized = DOMPurify.sanitize(htmlContent, dompurifyConfig);

    // Post-processing to enhance list styling and spacing if enabled
    if (config.enableListStyling || config.enableSpacingPreservation) {
      sanitized = enhanceSpacingAndLists(
        sanitized,
        config.enableListStyling,
        config.enableSpacingPreservation
      );
    }

    return sanitized;
  } catch (error) {
    console.error("DOMPurify sanitization error:", error);
    // Return empty string on error for safety
    return "";
  }
}

/**
 * Enhances list styling and spacing preservation in sanitized HTML
 * @param htmlContent - The sanitized HTML content
 * @param enableListStyling - Whether to enhance list styling
 * @param enableSpacingPreservation - Whether to preserve spacing
 * @returns HTML with enhanced styling and spacing
 */
function enhanceSpacingAndLists(
  htmlContent: string,
  enableListStyling: boolean = true,
  enableSpacingPreservation: boolean = true
): string {
  let enhanced = htmlContent;

  // Apply list styling enhancements
  if (enableListStyling) {
    enhanced = enhanced
      // Ensure ordered lists have proper styling
      .replace(
        /<ol(?![^>]*style)/g,
        '<ol style="list-style-type: decimal; padding-left: 1.5rem; margin: 1rem 0;"'
      )
      .replace(
        /<ol([^>]*style="[^"]*?)"/g,
        '<ol$1; list-style-type: decimal; padding-left: 1.5rem; margin: 1rem 0;"'
      )
      // Ensure unordered lists have proper styling
      .replace(
        /<ul(?![^>]*style)/g,
        '<ul style="list-style-type: disc; padding-left: 1.5rem; margin: 1rem 0;"'
      )
      .replace(
        /<ul([^>]*style="[^"]*?)"/g,
        '<ul$1; list-style-type: disc; padding-left: 1.5rem; margin: 1rem 0;"'
      )
      // Ensure list items have proper styling
      .replace(
        /<li(?![^>]*style)/g,
        '<li style="margin: 0.25rem 0; display: list-item;"'
      )
      .replace(
        /<li([^>]*style="[^"]*?)"/g,
        '<li$1; margin: 0.25rem 0; display: list-item;"'
      );
  }

  // Apply spacing preservation enhancements
  if (enableSpacingPreservation) {
    enhanced = enhanced
      // Preserve empty paragraphs with proper spacing
      .replace(
        /<p><\/p>/g,
        '<p style="min-height: 1.5em; margin: 0.5em 0;">&#8203;</p>'
      )
      .replace(
        /<p>\s*<\/p>/g,
        '<p style="min-height: 1.5em; margin: 0.5em 0;">&#8203;</p>'
      )
      .replace(
        /<p\s+style="([^"]*)">\s*<\/p>/g,
        '<p style="$1; min-height: 1.5em; margin: 0.5em 0;">&#8203;</p>'
      )
      // Ensure br tags have proper display and spacing
      .replace(
        /<br\s*\/?>/gi,
        "<br style=\"display: block; margin: 0.5em 0; content: ' ';\" />"
      )
      // Handle multiple consecutive br tags
      .replace(/(<br[^>]*>[\s]*){2,}/gi, match => {
        const count = (match.match(/<br/gi) || []).length;
        return Array(count)
          .fill(
            "<br style=\"display: block; margin: 0.5em 0; content: ' ';\" />"
          )
          .join("\n");
      })
      // Preserve paragraphs with only whitespace
      .replace(
        /<p>(\s+)<\/p>/g,
        '<p style="min-height: 1.5em; margin: 0.5em 0; white-space: pre-wrap;">$1</p>'
      )
      // Add spacing to empty divs
      .replace(
        /<div><\/div>/g,
        '<div style="min-height: 1.5em; margin: 0.5em 0;">&#8203;</div>'
      )
      .replace(
        /<div>\s*<\/div>/g,
        '<div style="min-height: 1.5em; margin: 0.5em 0;">&#8203;</div>'
      );
  }

  return enhanced;
}

/**
 * Legacy function for backward compatibility
 * Enhances list styling in sanitized HTML
 * @param htmlContent - The sanitized HTML content
 * @returns HTML with enhanced list styling
 */
function enhanceListStyling(htmlContent: string): string {
  return enhanceSpacingAndLists(htmlContent, true, false);
}

/**
 * Sanitizes blog content with specific configuration for blog posts
 * @param blogContent - The blog content to sanitize
 * @returns Sanitized blog content
 */
export function sanitizeContent(blogContent: string): string {
  return sanitizeHtmlContent(blogContent, {
    enableListStyling: true,
    enableSpacingPreservation: true,
  });
}

/**
 * Sanitizes product descriptions with specific configuration
 * @param productDescription - The product description to sanitize
 * @returns Sanitized product description
 */
export function sanitizeProductDescription(productDescription: string): string {
  return sanitizeHtmlContent(productDescription, {
    // Product-specific customizations
    allowedTags: [
      "p",
      "br",
      "div",
      "span",
      "strong",
      "em",
      "b",
      "i",
      "u",
      "ul",
      "ol",
      "li",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
    ],
    enableListStyling: true,
    enableSpacingPreservation: true,
  });
}

/**
 * Basic sanitization for user-generated content
 * @param userContent - The user content to sanitize
 * @returns Sanitized user content
 */
export function sanitizeUserContent(userContent: string): string {
  return sanitizeHtmlContent(userContent, {
    allowedTags: ["p", "br", "strong", "em", "b", "i"],
    allowedAttributes: [],
    enableListStyling: false,
    enableSpacingPreservation: true,
  });
}
