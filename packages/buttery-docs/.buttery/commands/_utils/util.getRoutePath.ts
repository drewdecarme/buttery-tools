export function getRoutePath(filename: string) {
  // TODO: Needs more scenarios and testing
  if (filename === "_index") {
    return "/";
  }
  return "/".concat(filename.split(".").join("/"));
}
