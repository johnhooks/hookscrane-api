/*
  Warnings:

  - The `roles` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "Period" AS ENUM ('FREQUENT', 'PERIODIC', 'ANNUAL');

-- CreateEnum
CREATE TYPE "Severity" AS ENUM ('CRITIAL', 'INFO');

-- CreateEnum
CREATE TYPE "DocumentEdgeType" AS ENUM ('CRITERIA', 'ITEM', 'RULE');

-- AlterTable
ALTER TABLE "User" DROP COLUMN "roles",
ADD COLUMN     "roles" "Role"[];

-- CreateTable
CREATE TABLE "DocumentNode" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" VARCHAR(24) NOT NULL,
    "description" VARCHAR(280),
    "meta" JSONB NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DocumentEdge" (
    "parentId" INTEGER NOT NULL,
    "childId" INTEGER NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" "DocumentEdgeType" NOT NULL,
    "meta" JSONB NOT NULL,

    PRIMARY KEY ("parentId","childId")
);

-- CreateTable
CREATE TABLE "Crane" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "make" VARCHAR(24) NOT NULL,
    "model" VARCHAR(24) NOT NULL,
    "year" VARCHAR(4) NOT NULL,
    "serial" VARCHAR(48) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Deficiency" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "severity" "Severity" NOT NULL,
    "meta" JSONB NOT NULL,
    "nodeId" INTEGER NOT NULL,
    "inspectionId" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InpectionDocument" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" VARCHAR(24) NOT NULL,
    "description" VARCHAR(280),
    "frequency" "Period" NOT NULL,
    "nodeId" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Inspection" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "datetime" TIMESTAMP NOT NULL,
    "hours" INTEGER NOT NULL,
    "miles" INTEGER,
    "authorId" INTEGER NOT NULL,
    "craneId" INTEGER NOT NULL,
    "documentId" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "DocumentEdge.type_index" ON "DocumentEdge"("type");

-- AddForeignKey
ALTER TABLE "DocumentEdge" ADD FOREIGN KEY ("parentId") REFERENCES "DocumentNode"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentEdge" ADD FOREIGN KEY ("childId") REFERENCES "DocumentNode"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Deficiency" ADD FOREIGN KEY ("nodeId") REFERENCES "DocumentNode"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Deficiency" ADD FOREIGN KEY ("inspectionId") REFERENCES "Inspection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InpectionDocument" ADD FOREIGN KEY ("nodeId") REFERENCES "DocumentNode"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inspection" ADD FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inspection" ADD FOREIGN KEY ("craneId") REFERENCES "Crane"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inspection" ADD FOREIGN KEY ("documentId") REFERENCES "InpectionDocument"("id") ON DELETE CASCADE ON UPDATE CASCADE;
