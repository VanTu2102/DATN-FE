/*
  Warnings:

  - Changed the type of `type` on the `Conversation` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Conversation" DROP COLUMN "type",
ADD COLUMN     "type" INTEGER NOT NULL;