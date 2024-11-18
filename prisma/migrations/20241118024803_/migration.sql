/*
  Warnings:

  - You are about to drop the column `data` on the `Transcription` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Transcription" DROP COLUMN "data";

-- CreateTable
CREATE TABLE "Message" (
    "id" SERIAL NOT NULL,
    "speaker" TEXT NOT NULL,
    "transcript" TEXT NOT NULL,
    "start_time" DOUBLE PRECISION NOT NULL,
    "end_time" DOUBLE PRECISION NOT NULL,
    "transciptionId" INTEGER NOT NULL,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Message_transciptionId_key" ON "Message"("transciptionId");

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_transciptionId_fkey" FOREIGN KEY ("transciptionId") REFERENCES "Transcription"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
