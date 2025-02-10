export const formatSelector = (selector: string | undefined): string => {
    if (!selector) return 'Unknown location';
    if (selector === '#') return 'Document root';
    
    return selector
      .replace(/\s*>\s*/g, ' → ')
      .replace(/:first-child/g, '')
      .replace(/\[.*?\]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  };