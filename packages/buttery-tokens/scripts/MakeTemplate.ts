import type { TokensConfig } from "../lib/types";

export type CompileFunctionParams = {
  config: TokensConfig;
  methods: MakeTemplate["methods"];
  variableBody: string;
  cssVarPrefix: string;
  functionName: string;
};
export type CompileFunction = (params: CompileFunctionParams) => string;

export type MakeTemplateOptions = {
  functionName: string;
  variableBody: string;
  template: CompileFunction;
  css: CompileFunction;
};

export class MakeTemplate {
  functionName: string;
  variableBody: string;
  template: CompileFunction;
  css: CompileFunction;
  private methods: { createTypeUnion: (arr: string[]) => string };

  constructor(options: MakeTemplateOptions) {
    this.functionName = options.functionName;
    this.variableBody = options.variableBody;

    this.template = options.template;
    this.css = options.css;
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
    const compileArgs: CompileFunctionParams = {
      config,
      functionName: this.functionName,
      variableBody: this.variableBody,
      cssVarPrefix: `--${config.prefix}-${this.variableBody}`,
      methods: this.methods
    };
    return {
      compiledFunctionContent: this.template(compileArgs),
      compiledCSSVars: this.css(compileArgs)
    };
  }
}
