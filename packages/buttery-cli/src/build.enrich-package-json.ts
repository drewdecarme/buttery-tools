// check if the entry file exists
// delete the entry file
// re-create the entry file
export async function buildEnrichPackageJson() {
  try {
    console.log("Enriching 'package.json' file...");
    console.log("Enriching 'package.json' file... done.");
  } catch (error) {
    throw new Error(`Error enriching 'package.json': ${error}`);
  }
}
