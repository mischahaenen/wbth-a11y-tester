export const extractDomain = (url: string): string => {
  try {
    const parsedUrl = new URL(url.startsWith('http') ? url : `https://${url}`);
    const hostname = parsedUrl.hostname;
    
    // Extract the main domain and TLD
    const parts = hostname.split('.');
    if (parts.length >= 2) {
      // Get the last two parts (main domain and TLD)
      return parts.slice(-2).join('.');
    }
    return hostname;
  } catch {
    // If URL parsing fails, try a simple regex to get the domain
    const match = url.match(/[^.]*\.[^.]{2,3}(?:\.[^.]{2,3})?$/);
    return match ? match[0] : url;
  }
};