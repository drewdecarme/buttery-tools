export const parseFilename = (filename: string) => {
  const filenameArr = filename.split(".");
  const section = filenameArr[0];
  const route = filenameArr.splice(1).join(".");
  return {
    section,
    route: route === "" ? section : route,
  };
};
