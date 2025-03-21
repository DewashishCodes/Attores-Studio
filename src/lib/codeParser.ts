
export const extractCodeFromResponse = (response: string): string => {
  // Extract code between delimiters
  const codeDelimiterRegex = /###CODE_START###([\s\S]*?)###CODE_END###/;
  const match = response.match(codeDelimiterRegex);
  
  if (match && match[1]) {
    return match[1].trim();
  }
  
  // Alternative detection - look for code blocks with ```
  const codeBlockRegex = /```(?:python)?\n([\s\S]*?)```/;
  const blockMatch = response.match(codeBlockRegex);
  
  if (blockMatch && blockMatch[1]) {
    return blockMatch[1].trim();
  }
  
  // If no code block is found, return empty string
  return '';
};

export const stripCodeDelimiters = (response: string): string => {
  // Remove code delimiters from the response for clean display
  return response.replace(/###CODE_START###[\s\S]*?###CODE_END###/g, '')
    .replace(/```(?:python)?\n[\s\S]*?```/g, '')
    .trim();
};
