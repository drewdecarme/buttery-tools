/**
 * Combines class names based on given arguments of strings, numbers, arrays, or objects.
 *
 * @param {...(string | number | boolean | null | undefined | Record<string, boolean> | Array<string | number | boolean | null | undefined | Record<string, boolean>>)} args - Arguments that can be strings, numbers, objects, arrays or boolean values.
 * @returns {string} - A single string with all valid class names concatenated.
 *
 * @example
 * // Basic usage with strings
 * classes('foo', 'bar'); // returns "foo bar"
 *
 * @example
 * // Usage with object notation
 * classes('foo', { bar: true, baz: false }); // returns "foo bar"
 *
 * @example
 * // Usage with arrays
 * classes(['foo', 'bar']); // returns "foo bar"
 *
 * @example
 * // Combined usage with nested arrays and objects
 * classes(['foo', { bar: true, baz: false }]); // returns "foo bar"
 */
export declare function classes(...args: (string | number | boolean | null | undefined | Record<string, boolean> | Array<string | number | boolean | null | undefined | Record<string, boolean>>)[]): string;
//# sourceMappingURL=classes.d.ts.map