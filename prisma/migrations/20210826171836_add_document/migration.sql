-- CreateEnum
CREATE TYPE "DocType" AS ENUM ('INSPECT_VEHICLE_DAILY', 'INSPECT_CRANE_FREQUENT', 'INSPECT_CRANE_PERIODIC', 'LOG_VEHICLE', 'MAINTAIN_INIT', 'MAINTAIN_COMPLETE');

-- CreateTable
CREATE TABLE "Document" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "type" "DocType" NOT NULL,
    "datetime" TIMESTAMP(3) NOT NULL,
    "hours" INTEGER,
    "miles" INTEGER,
    "meta" JSONB,
    "userId" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Document.type_index" ON "Document"("type");

-- AddForeignKey
ALTER TABLE "Document" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
