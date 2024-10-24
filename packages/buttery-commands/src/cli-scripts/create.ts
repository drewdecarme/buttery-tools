import { LOG } from "../utils";

/**
 * Build's the @buttery/commands binary
 */
export async function create() {
  try {
    LOG.debug("TODO: Create a new buttery command");
  } catch (error) {
    throw LOG.fatal(new Error(error as string));
  }
}
