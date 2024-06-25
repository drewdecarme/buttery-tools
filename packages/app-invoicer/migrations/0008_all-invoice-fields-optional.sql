-- RedefineTables
CREATE TABLE "new_Invoice" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "client_id" INTEGER NOT NULL,
    "subject" TEXT,
    "issue_date" DATETIME,
    "due_date" DATETIME,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "invoice_status_id" TEXT DEFAULT 'DRAFT',
    CONSTRAINT "Invoice_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "Client" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Invoice_invoice_status_id_fkey" FOREIGN KEY ("invoice_status_id") REFERENCES "InvoiceStatus" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Invoice" ("client_id", "created_at", "due_date", "id", "invoice_status_id", "issue_date", "subject", "updated_at") SELECT "client_id", "created_at", "due_date", "id", "invoice_status_id", "issue_date", "subject", "updated_at" FROM "Invoice";
DROP TABLE "Invoice";
ALTER TABLE "new_Invoice" RENAME TO "Invoice";
