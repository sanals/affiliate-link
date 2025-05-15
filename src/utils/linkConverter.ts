/**
 * Contains utility functions for converting Amazon links to affiliate links
 */

// Constant for affiliate tag to be used
export const AFFILIATE_TAG = "syrez-21";

/**
 * Validates the input URL and prepends https:// if needed
 * @param url Input URL to validate
 * @returns A valid URL with https:// prepended if needed
 */
export const validateAndNormalizeUrl = (url: string): string => {
  if (!url || url.trim() === "") {
    throw new Error("Please enter a URL");
  }

  let normalizedUrl = url.trim();

  // Check if the URL has a protocol, if not add https://
  if (
    !normalizedUrl.startsWith("http://") &&
    !normalizedUrl.startsWith("https://")
  ) {
    // Only prepend https:// for known Amazon domains
    if (
      normalizedUrl.startsWith("amzn.in") ||
      normalizedUrl.startsWith("www.amazon.in") ||
      normalizedUrl.startsWith("amzn.to")
    ) {
      normalizedUrl = `https://${normalizedUrl}`;
    } else {
      throw new Error("Not a valid Amazon URL");
    }
  }

  // Check if it's an Amazon URL
  if (
    !normalizedUrl.includes("amazon.in") &&
    !normalizedUrl.includes("amzn.in") &&
    !normalizedUrl.includes("amzn.to")
  ) {
    throw new Error("Not a valid Amazon URL");
  }

  try {
    // Validate URL format
    new URL(normalizedUrl);
    return normalizedUrl;
  } catch (error) {
    throw new Error("Invalid URL format");
  }
};

/**
 * Removes any existing tag parameter from the URL
 * @param url The URL to clean
 * @returns URL with any existing tag removed
 */
export const removeExistingTag = (url: string): string => {
  try {
    const urlObj = new URL(url);
    urlObj.searchParams.delete("tag");
    return urlObj.toString();
  } catch (error) {
    throw new Error("Failed to process URL");
  }
};

/**
 * Adds the affiliate tag to a URL
 * @param url The URL to add the affiliate tag to
 * @returns URL with affiliate tag added
 */
export const addAffiliateTag = (url: string): string => {
  try {
    const urlObj = new URL(url);
    urlObj.searchParams.set("tag", AFFILIATE_TAG);
    return urlObj.toString();
  } catch (error) {
    throw new Error("Failed to add affiliate tag");
  }
};

/**
 * Generates an affiliate link from a given Amazon URL
 * @param originalUrl The original Amazon URL
 * @returns The URL with the affiliate tag added
 */
export const generateAffiliateLink = (originalUrl: string): string => {
  try {
    // Validate and normalize URL
    const validUrl = validateAndNormalizeUrl(originalUrl);
    
    // Remove any existing tag parameter
    const cleanUrl = removeExistingTag(validUrl);
    
    // Add affiliate tag
    return addAffiliateTag(cleanUrl);
  } catch (error) {
    throw error;
  }
}; 