-- DropIndex
DROP INDEX "Admin_email_key";

-- AlterTable: agregar nullable primero
ALTER TABLE "Admin" ADD COLUMN "username" TEXT;

-- Llenar registros existentes
UPDATE "Admin" SET "username" = 'admin_' || substring("id"::text, 1, 8) WHERE "username" IS NULL;

-- Aplicar NOT NULL y eliminar email
ALTER TABLE "Admin" ALTER COLUMN "username" SET NOT NULL;
ALTER TABLE "Admin" DROP COLUMN "email";

-- CreateIndex
CREATE UNIQUE INDEX "Admin_username_key" ON "Admin"("username");