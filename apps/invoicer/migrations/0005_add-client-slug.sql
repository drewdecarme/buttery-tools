-- RedefineTables
CREATE TABLE "new_Client" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL DEFAULT '',
    "address_line_1" TEXT NOT NULL,
    "address_line_2" TEXT,
    "address_line_3" TEXT,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "zip" TEXT NOT NULL,
    "user_id" TEXT,
    CONSTRAINT "Client_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Client" ("address_line_1", "address_line_2", "address_line_3", "city", "id", "name", "state", "user_id", "zip") SELECT "address_line_1", "address_line_2", "address_line_3", "city", "id", "name", "state", "user_id", "zip" FROM "Client";
DROP TABLE "Client";
ALTER TABLE "new_Client" RENAME TO "Client";
