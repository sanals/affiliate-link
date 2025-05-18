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
    // Attempt to resolve the short URL by following redirects
    const response = await fetch(shortUrl, {
      method: 'HEAD',
      redirect: 'follow',
    });

    if (!response.ok) {
      throw new Error(`Failed to resolve short link: ${response.statusText}`);
    }

    // The response.url will contain the final URL after all redirects
    const resolvedUrl = response.url;

    if (!resolvedUrl.includes('amazon.in') && !resolvedUrl.includes('amzn.in')) {
      throw new Error('Resolved URL is not a valid Amazon URL');
    }

    return resolvedUrl;
  } catch (error) {
    // Handle CORS errors or network failures
    console.error('Error resolving short URL:', error);
    
    throw new Error(
      'Unable to resolve short link due to browser security restrictions. ' +
      'Please open the link in your browser and paste the full URL here.'
    );
  }
}; 