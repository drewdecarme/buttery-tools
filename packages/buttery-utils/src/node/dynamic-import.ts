/**
 * Dynamically import a module through cache busting the import
 * cache by adding a number representation of Date.now(). This forces
 * import to go out and fetch a new instance every time it's called.
 */
export async function importCommand(modulePath: string) {
  // Construct a new import specifier with a unique URL timestamp query parameter
  const timestamp = new Date().getTime();
  const importSpecifier = `${modulePath}?t=${timestamp}`;

  // Import the module fresh
  return await import(importSpecifier);
}
