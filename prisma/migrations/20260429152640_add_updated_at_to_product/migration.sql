-- AlterTable
-- Add updatedAt column with default value of now() for existing rows
ALTER TABLE "Product" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- Update existing rows to have updatedAt set to createdAt
UPDATE "Product" SET "updatedAt" = "createdAt";

-- Remove the default value so @updatedAt decorator takes over
ALTER TABLE "Product" ALTER COLUMN "updatedAt" DROP DEFAULT;
