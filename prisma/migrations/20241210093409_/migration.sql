/*
  Warnings:

  - You are about to drop the column `chunked` on the `Message` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Message" DROP COLUMN "chunked";

-- AlterTable
ALTER TABLE "Transcription" ADD COLUMN     "chunked" BOOLEAN NOT NULL DEFAULT false;
