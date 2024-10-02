export const parseMDXFileName = (
  fileName: string
): { section: string; segments: string[] } => {
  const allSegments = fileName.split(".");
  const [section, ...segments] = allSegments;

  return {
    section,
    segments
  };
};
