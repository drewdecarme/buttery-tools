-- RedefineTables
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "first_name" TEXT,
    "last_name" TEXT
);
INSERT INTO "new_User" ("first_name", "id", "last_name") SELECT "first_name", "id", "last_name" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
