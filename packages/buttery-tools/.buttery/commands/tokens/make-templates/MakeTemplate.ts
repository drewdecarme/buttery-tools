import type { ButteryConfigTokens } from "../../../../lib/config";

export type CompileFunctionParams = {
  config: ButteryConfigTokens;
  methods: MakeTemplate["methods"];
  variableBody: string;
  cssVarPrefix: string;
  docs: {
    /**
     * The string that will display in the JSDocs as the import.
     * This is provided so when the library is built, the import
     * string will display in the JSDocs that is specific to the
     * package that is consuming the library
     */
    importClause: string;
    /**
     * The description of the make function
     */
    description: string;
  };
  functionName: string;
};
export type CompileFunction = (params: CompileFunctionParams) => string;

export type MakeTemplateOptions = {
  functionName: string;
  /**
   * The description of the make function. This will be added to the
   * JSDoc of the make function
   */
  functionDescription: string;
  variableBody: string;
  template: CompileFunction;
  css: CompileFunction;
};

/**
 * A class used to define and construct a `make` function and it's corresponding
 * CSS tokens.
 */
export class MakeTemplate {
  functionName: string;
  private functionDescription: string;
  variableBody: string;
  template: CompileFunction;
  css: CompileFunction;
  private methods: {
    createTypeUnion: (arr: string[]) => string;
    cssVar: (...args: string[]) => string;
  };

  constructor(options: MakeTemplateOptions) {
    this.functionName = options.functionName;
    this.functionDescription = options.functionDescription;
    this.variableBody = options.variableBody;
    this.template = options.template;
    this.css = options.css;
    this.methods = {
      createTypeUnion: this.createUnionType,
      cssVar: this.cssVar
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

  private cssVar(...args: string[]): string {
    return `var(${args.join("-")})`;
  }

  compile(config: ButteryConfigTokens) {
    const compileArgs: CompileFunctionParams = {
      config,
      docs: {
        description: this.functionDescription,
        importClause: `import { ${this.functionName} } from "@buttery/tokens${
          config.namespace ? `/${config.namespace}` : ""
        }";`
      },
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
