/**
 * Contains utility functions for resolving shortened Amazon URLs
 */

/**
 * Resolves a shortened Amazon URL (amzn.to) to its full form
 * @param shortUrl The shortened Amazon URL to resolve
 * @returns Promise that resolves to the full Amazon URL
 */
export const resolveShortUrl = async (shortUrl: string): Promise<string> => {
  // Check if it's an amzn.to URL
  if (!shortUrl.includes('amzn.to/')) {
    // If it's not a short URL, just return it as is
    return shortUrl;
  }

  try {
    // Validate URL format before attempting to resolve
    try {
      new URL(shortUrl);
    } catch (error) {
      throw new Error('Invalid URL format. Please check the URL and try again.');
    }

    // Attempt to resolve the short URL by following redirects
    const response = await fetch(shortUrl, {
      method: 'HEAD',
      redirect: 'follow',
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('The short link is invalid or has expired.');
      } else if (response.status === 429) {
        throw new Error('Too many requests. Please try again in a few minutes.');
      } else {
        throw new Error(`Failed to resolve short link: ${response.statusText}`);
      }
    }

    // The response.url will contain the final URL after all redirects
    const resolvedUrl = response.url;

    if (!resolvedUrl.includes('amazon.in') && !resolvedUrl.includes('amzn.in')) {
      throw new Error('The resolved URL is not a valid Amazon India URL.');
    }

    return resolvedUrl;
  } catch (error) {
    // Handle specific error types
    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      throw new Error(
        'Network error: Please check your internet connection and try again.'
      );
    } else if (error instanceof Error && error.message.includes('CORS')) {
      throw new Error(
        'Browser security restriction: Please open the link in your browser and paste the full URL here.'
      );
    } else if (error instanceof Error) {
      throw error;
    } else {
      throw new Error('An unexpected error occurred while resolving the short link.');
    }
  }
}; 