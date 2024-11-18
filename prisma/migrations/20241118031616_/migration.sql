/*
  Warnings:

  - You are about to drop the column `transciptionId` on the `Message` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[transcriptionId]` on the table `Message` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `transcriptionId` to the `Message` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_transciptionId_fkey";

-- DropIndex
DROP INDEX "Message_transciptionId_key";

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "transciptionId",
ADD COLUMN     "transcriptionId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Message_transcriptionId_key" ON "Message"("transcriptionId");

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_transcriptionId_fkey" FOREIGN KEY ("transcriptionId") REFERENCES "Transcription"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
