export type ButteryConfigCommands = {
  /**
   * The name of the CLI that the buttery commands will build. This
   * is also the name of the execution string that will trigger the
   * binary
   */
  name: string;
  /**
   * The description of the CLI that the buttery commands will build
   * into the CLI program
   */
  description: string;
  /**
   * The version of the CLI that buttery commands will build into
   * the CLI program
   */
  version?: string;
  /**
   * The name of the commands directory relative to the .buttery/
   * directory
   * @default commands
   */
  commandsDir?: string;
};
