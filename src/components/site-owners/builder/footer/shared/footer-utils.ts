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
  companyName: string = ""
): string => {
  const currentYear = new Date().getFullYear().toString();

  if (!copyright) {
    return `© ${currentYear} ${companyName}. All Rights Reserved.`;
  }

  return copyright.replace(/{year}/g, currentYear);
};
