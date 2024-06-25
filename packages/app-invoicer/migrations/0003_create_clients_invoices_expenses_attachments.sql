-- CreateTable
CREATE TABLE "Client" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "address_line_1" TEXT NOT NULL,
    "address_line_2" TEXT,
    "address_line_3" TEXT,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "zip" INTEGER NOT NULL,
    "user_id" TEXT,
    CONSTRAINT "Client_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Invoice" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "invoice_identifier" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "due_date" DATETIME NOT NULL,
    "client_id" INTEGER,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Invoice_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "Client" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Expense" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "client_id" INTEGER,
    "invoice_id" INTEGER,
    "price" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "is_invoiced" BOOLEAN NOT NULL DEFAULT false,
    "terms_and_conditions" TEXT NOT NULL,
    CONSTRAINT "Expense_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "Client" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Expense_invoice_id_fkey" FOREIGN KEY ("invoice_id") REFERENCES "Invoice" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Attachment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "filename" TEXT NOT NULL,
    "cotent_type" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "storage_key" TEXT NOT NULL,
    "expense_id" INTEGER,
    CONSTRAINT "Attachment_expense_id_fkey" FOREIGN KEY ("expense_id") REFERENCES "Expense" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_invoice_identifier_key" ON "Invoice"("invoice_identifier");
