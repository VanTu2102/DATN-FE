-- CreateTable
CREATE TABLE "MessageVector" (
    "id" SERIAL NOT NULL,
    "chunk" DOUBLE PRECISION NOT NULL,
    "vector" DOUBLE PRECISION[],
    "messageId" INTEGER NOT NULL,

    CONSTRAINT "MessageVector_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MessageVector" ADD CONSTRAINT "MessageVector_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "Message"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
