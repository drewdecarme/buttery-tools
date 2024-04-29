// check if the entry file exists
// delete the entry file
// re-create the entry file
export async function buildEntryFile() {
  try {
    console.log("Building entry file...");
    console.log("Building entry file... done.");
  } catch (error) {
    throw new Error(`Error building CLI entry file: ${error}`);
  }
}
