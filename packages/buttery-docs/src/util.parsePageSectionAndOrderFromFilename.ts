const startDelimiter = "[";
const endDelimiter = "]";

export const parsePageSectionAndOrderFromFilename = (
  fileName: string
): string[] => {
  const startIndex = fileName.indexOf(startDelimiter) + startDelimiter.length;
  const endIndex = fileName.indexOf(endDelimiter);
  if (startIndex !== -1 && endIndex !== -1 && endIndex > startIndex) {
    const extractedText = fileName.substring(startIndex, endIndex);
    return extractedText.split(":");
  }
  throw `Cannot parse the section name from "${fileName}". This file will not put in any particular section.`;
};
