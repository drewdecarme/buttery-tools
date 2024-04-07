import fse from "fs-extra";

import path from "path";

import { getDirname } from "../utils/util.dirname.js";

const __dirname = getDirname(import.meta.url);

export type QueryParams = Record<
  string,
  string | number | boolean | null | undefined
>;
export type RequestBody = Record<string, unknown>;

export type Segments =
  | string
  | number
  | undefined
  | null
  | (string | number | null | undefined)[];

export type TokenResponse = {
  access_token: string;
  expires_in: number;
  token_type: "Bearer";
};

export type FetchVars = {
  tokenExpirationTime: number;
  token: string;
};

/**
 * Converts an object of query parameters to a URLSearchParams instance.
 *
 * @param {QueryParams} params - The object containing query parameters.
 * @returns {URLSearchParams} - The URLSearchParams instance representing the parameters.
 *
 * @example
 * // Usage:
 * const queryParams = {
 *   key1: 'value1',
 *   key2: 42,
 *   key3: true,
 *   key4: null,
 *   key5: undefined,
 * };
 * const searchParams = objectToSearchParams(queryParams);
 * console.log(searchParams.toString());
 */
export function parseQueryToURLSearchParams(
  params?: QueryParams
): URLSearchParams {
  const searchParams = new URLSearchParams();

  if (typeof params === "undefined") {
    return searchParams;
  }

  for (const key in params) {
    if (params.hasOwnProperty(key)) {
      const value = params[key];

      // Skip undefined and null values
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    }
  }

  return searchParams;
}

/**
 * Converts a value of type string | number | (string | number)[] to a string.
 *
 * @param value - The value to be converted.
 * @returns The resulting string.
 *
 * @example
 * // Usage:
 * const result = convertToString('abc');
 * console.log(result); // 'abc'
 *
 * const resultArray = convertToString([1, 'two', 3]);
 * console.log(resultArray); // '1two3'
 */
export function parseSegmentsToString(value: Segments): string {
  const segmentUrl = "/";
  if (typeof value === "undefined") return segmentUrl;
  if (typeof value === "string" || typeof value === "number") {
    return segmentUrl.concat(String(value)).concat("/");
  } else if (Array.isArray(value)) {
    return segmentUrl.concat(
      value
        .filter((item) => item !== null && item !== undefined)
        .map(String)
        .join("")
        .concat("/")
    );
  } else {
    throw new Error("Unsupported value type");
  }
}

const fetchVarsFilePath = path.resolve(__dirname, "./fetch.vars.json");

export async function readFetchVars() {
  try {
    const exists = await fse.pathExists(fetchVarsFilePath);

    if (!exists) {
      fse.writeJson(fetchVarsFilePath, "{}");
    }
    const json = await fse.readJson(fetchVarsFilePath);

    return json as Partial<FetchVars>;
  } catch (error) {
    throw error;
  }
}

export async function writeFetchVars(vars: FetchVars) {
  try {
    await fse.writeJson(fetchVarsFilePath, vars);
  } catch (error) {
    throw error;
  }
}
