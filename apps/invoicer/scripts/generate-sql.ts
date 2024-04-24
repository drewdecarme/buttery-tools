/**
 * This script will generate the command that needs to be run
 * when using prisma to generate sql with Cloudflare D1
 */

import path from "path";
import fs from "fs-extra";
import { input, select } from "@inquirer/prompts";

const __dirname = import.meta.dirname;

let prismaSchemaPath = path.resolve(__dirname, "../prisma/schema.prisma");
const migrationsDirectory = path.resolve(__dirname, "../migrations");
const rootDir = path.resolve(__dirname, "../");

(async () => {
  let command = "npx prisma migrate diff";

  try {
    // Check for migrations
    const migrations = await fs.readdir(migrationsDirectory);

    if (migrations.length === 0) {
      throw new Error(
        "No migrations present. Please run `yarn migrations:create`"
      );
    }

    if (migrations.length === 1) {
      command = command.concat(" --from-empty");
    }

    if (migrations.length > 1) {
      command = command.concat(" --from-local-d1");
    }

    // Locate Prisma Schema
    const doesPrismaExist = fs.pathExistsSync(prismaSchemaPath);
    if (!doesPrismaExist) {
      prismaSchemaPath = await input({
        message: "Please type the relative path of your prisma schema",
      });
    }
    const relativePrismaPath = path.relative(rootDir, prismaSchemaPath);
    command = command.concat(` --to-schema-datamodel ${relativePrismaPath}`);

    const migrationPath = await select({
      message: "Please select a migration to create SQL for",
      default: migrations[migrations.length - 1],
      choices: migrations.map((migration) => ({
        value: migration,
      })),
    });

    command = command.concat(
      ` --script --output ${path.relative(
        rootDir,
        migrationsDirectory
      )}/${migrationPath}`
    );
    console.log(`
Migration Script:

    ${command}

Copy this into the terminal and then run it to auto insert the SQL for this migration.
    
`);
  } catch (error) {
    console.error(error);
  }
})();
