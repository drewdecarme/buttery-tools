export type GitLabRepoTreeNode = {
  id: string;
  name: string;
  type: "tree" | "blob";
  path: string;
  mode: string;
};
export type GitLabRepoBlob = {
  size: number;
  encoding: string;
  content: string;
  sha: string;
};

export type Template = {
  contentType: string;
  path: string;
  content: GitLabRepoBlob["content"];
};

export type TemplateMeta = {
  name: string;
  description: string;
};

export type TemplateManifestEntry = Template & TemplateMeta;

export type TemplateManifest = {
  [key: string]: TemplateManifestEntry;
};
