export const getDefaultFontSize = (tag: string): string => {
  switch (tag) {
    case "title":
      return "3rem"; // ~40px
    case "h1":
      return "2.5rem"; // ~40px
    case "h2":
      return "2rem"; // ~32px
    case "h3":
      return "1.75rem"; // ~28px
    case "h4":
      return "1.5rem"; // ~24px
    case "h5":
      return "1.25rem"; // ~20px
    case "h6":
      return "1rem"; // ~16px
    case "p":
    case "div":
      return "1rem"; // 16px
    case "span":
      return "inherit";
    default:
      return "1rem";
  }
};

export const getDefaultLineHeight = (
  tag: string,
  fontSize?: string
): string => {
  // If fontSize is provided, calculate dynamic line height based on size
  if (fontSize) {
    let sizePx = 16;
    if (fontSize.includes("rem")) {
      sizePx = parseFloat(fontSize) * 16;
    } else if (fontSize.includes("px")) {
      sizePx = parseFloat(fontSize);
    }
    const isHeadingTag = ["h1", "h2", "h3", "h4", "h5", "h6", "title"].includes(
      tag
    );

    if (sizePx >= 41) return "1.1";
    if (sizePx >= 36) return "1.15";
    if (sizePx >= 31) return "1.2";
    if (sizePx >= 27) return "1.25";
    if (sizePx >= 23) return "1.3";
    if (sizePx >= 19) return "1.4";
    return isHeadingTag ? "1.4" : "1.5";
  }

  // Fallback to tag-based defaults if no font size or for smaller sizes
  switch (tag) {
    case "title":
    case "h1":
      return "1.1";
    case "h2":
      return "1.2";
    case "h3":
    case "h4":
      return "1.3";
    case "h5":
    case "h6":
      return "1.4";
    case "p":
      return "1.5";
    default:
      return "1.4";
  }
};

export const getDefaultFontWeight = (tag: string): string => {
  switch (tag) {
    case "title":
      return "normal";
    case "h1":
    case "h2":
    case "h3":
      return "bold";
    case "h4":
    case "h5":
    case "h6":
      return "600";
    default:
      return "normal";
  }
};
