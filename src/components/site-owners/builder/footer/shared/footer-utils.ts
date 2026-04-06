/**
 * Processes the copyright string to replace dynamic placeholders.
 * Currently supports:
 * - {year}: Replaced with the current full year (e.g., 2026)
 *
 * @param copyright - The copyright string from footer data
 * @param companyName - Optional company name to use in default copyright if string is empty
 * @returns The processed copyright string
 */
export const getProcessedCopyright = (
  copyright: string,
  companyName: string = "",
  businessName: string = ""
): string => {
  const currentYear = new Date().getFullYear().toString();

  const isPlaceholder = (text?: string) => {
    if (!text) return true;
    const placeholders = ["brand", "your brand"];
    return placeholders.includes(text.toLowerCase().trim());
  };

  const finalName = !isPlaceholder(companyName)
    ? companyName
    : businessName || companyName || "Brand";

  let result = copyright;

  if (!result || isPlaceholder(result)) {
    result = `© {year} ${finalName}. All Rights Reserved.`;
  } else {
    // If the copyright string contains placeholders, replace them with the final name
    const lower = result.toLowerCase();
    if (lower.includes("your brand")) {
      result = result.replace(/your brand/gi, finalName);
    } else if (lower.includes("brand") && !lower.includes("branding")) {
      // Use word boundary to avoid accidental replacements in words like "Branding"
      result = result.replace(/\bbrand\b/gi, finalName);
    }
  }

  return result.replace(/{year}/g, currentYear);
};
