export const getSeverityLevel = (category: string) => {
    const severityMap: Record<string, 'Critical' | 'High' | 'Medium' | 'Info'> = {
      error: 'Critical',
      contrast: 'High',
      alert: 'Medium'
    };
    return severityMap[category] || 'Info';
  };
  
  export const getSeverityStyle = (severity: string): string => {
    const styles: Record<string, string> = {
      Critical: 'bg-red-100 text-red-800 border-red-300',
      High: 'bg-orange-100 text-orange-800 border-orange-300',
      Medium: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      Info: 'bg-blue-100 text-blue-800 border-blue-300'
    };
    return styles[severity] || styles.Info;
  };