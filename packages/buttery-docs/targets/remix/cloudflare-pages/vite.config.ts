/**
 * NOTE: This is only here to ensure that the remix
 * functions don't bomb out when running develop. Remix requires
 * that there be a vite config at the root of the project, however
 * we're invoking the `vite.createServer` function using node outside
 * the bounds of the remix CLI... therefore we can just add this here to ensure
 * that the remix vite plugin passes the checks. The vite app will instead
 * run on the
 */
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({});
