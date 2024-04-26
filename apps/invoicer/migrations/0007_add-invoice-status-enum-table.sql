-- CreateTable
CREATE TABLE "InvoiceStatus" (
    "id" TEXT NOT NULL PRIMARY KEY
);

-- RedefineTables
CREATE TABLE "new_Client" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL DEFAULT '',
    "address_line_1" TEXT NOT NULL,
    "address_line_2" TEXT,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "zip" TEXT NOT NULL,
    "user_id" TEXT,
    CONSTRAINT "Client_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Client" ("address_line_1", "address_line_2", "city", "id", "name", "slug", "state", "user_id", "zip") SELECT "address_line_1", "address_line_2", "city", "id", "name", "slug", "state", "user_id", "zip" FROM "Client";
DROP TABLE "Client";
ALTER TABLE "new_Client" RENAME TO "Client";
CREATE UNIQUE INDEX "Client_slug_key" ON "Client"("slug");
CREATE TABLE "new_Invoice" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "subject" TEXT NOT NULL,
    "issue_date" DATETIME NOT NULL,
    "due_date" DATETIME NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "client_id" INTEGER NOT NULL,
    "invoice_status_id" TEXT DEFAULT 'DRAFT',
    CONSTRAINT "Invoice_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "Client" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Invoice_invoice_status_id_fkey" FOREIGN KEY ("invoice_status_id") REFERENCES "InvoiceStatus" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Invoice" ("client_id", "created_at", "due_date", "id", "subject", "updated_at") SELECT "client_id", "created_at", "due_date", "id", "subject", "updated_at" FROM "Invoice";
DROP TABLE "Invoice";
ALTER TABLE "new_Invoice" RENAME TO "Invoice";
CREATE TABLE "new_Expense" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "price" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "is_draft" BOOLEAN NOT NULL DEFAULT true,
    "is_invoiced" BOOLEAN NOT NULL DEFAULT false,
    "terms_and_conditions" TEXT NOT NULL,
    "client_id" INTEGER,
    "invoice_id" INTEGER,
    CONSTRAINT "Expense_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "Client" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Expense_invoice_id_fkey" FOREIGN KEY ("invoice_id") REFERENCES "Invoice" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Expense" ("client_id", "description", "id", "invoice_id", "is_invoiced", "price", "terms_and_conditions") SELECT "client_id", "description", "id", "invoice_id", "is_invoiced", "price", "terms_and_conditions" FROM "Expense";
DROP TABLE "Expense";
ALTER TABLE "new_Expense" RENAME TO "Expense";
