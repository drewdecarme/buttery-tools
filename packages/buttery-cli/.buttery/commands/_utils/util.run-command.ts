import { exec } from "node:child_process";
import util from "node:util";
const execPromise = util.promisify(exec);

export async function runCommand(command: string) {
  try {
    const { stderr } = await execPromise(command);

    if (stderr) {
      console.error(`stderr: ${stderr}`);
      return;
    }
  } catch (error) {
    console.error(`Error executing command: ${(error as Error).message}`);
  }
}
