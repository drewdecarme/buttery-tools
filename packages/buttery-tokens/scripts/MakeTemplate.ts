import type { TokensConfig } from "../lib/types";

export type TemplateFunction = (
  config: TokensConfig,
  methods: MakeTemplate["methods"],
  functionName: string
) => string;

export type MakeTemplateOptions = {
  functionName: string;
  template: TemplateFunction;
};

export class MakeTemplate {
  functionName: string;
  template: TemplateFunction;
  private methods: { createTypeUnion: (arr: string[]) => string };

  constructor(options: MakeTemplateOptions) {
    this.functionName = options.functionName;
    this.template = options.template;
    this.methods = {
      createTypeUnion: this.createUnionType
    };
  }

  private createUnionType(arr: string[]): string {
    return arr.reduce<string>((accum, val, i, origArr) => {
      accum.concat(`"${val}"`);
      if (i < origArr.length - 1) {
        return accum.concat(`"${val}" | `);
      }
      return accum.concat(`"${val}"`);
    }, "");
  }

  compile(config: TokensConfig) {
    return this.template(config, this.methods, this.functionName);
  }
}
