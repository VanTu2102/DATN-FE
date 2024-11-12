-- CreateTable
CREATE TABLE "Transcription" (
    "id" SERIAL NOT NULL,
    "conversationId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "createdDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Transcription_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Transcription_conversationId_key" ON "Transcription"("conversationId");

-- AddForeignKey
ALTER TABLE "Transcription" ADD CONSTRAINT "Transcription_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
