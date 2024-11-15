/*
  Warnings:

  - Added the required column `type` to the `Conversation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Conversation" ADD COLUMN     "type" TEXT NOT NULL;
