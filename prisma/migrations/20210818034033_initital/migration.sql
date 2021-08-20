-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "Period" AS ENUM ('FREQUENT', 'PERIODIC', 'ANNUAL');

-- CreateEnum
CREATE TYPE "Severity" AS ENUM ('CRITIAL', 'INFO');

-- CreateEnum
CREATE TYPE "DocumentNodeType" AS ENUM ('ITEM', 'SUBITEM', 'FORM', 'RECORD', 'ROOT', 'TYPE');

-- CreateEnum
CREATE TYPE "DocumentEdgeType" AS ENUM ('DEFICIENCY', 'INSPECTION', 'LINK', 'MAINTENANCE', 'RULE', 'SCHEDULE');

-- CreateEnum
CREATE TYPE "LogType" AS ENUM ('START', 'END');

-- CreateEnum
CREATE TYPE "InspectType" AS ENUM ('VEHICLE', 'CRANE');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "passwordDigest" VARCHAR(64) NOT NULL,
    "firstName" VARCHAR(24),
    "lastName" VARCHAR(24),
    "meta" JSONB NOT NULL,
    "roles" "Role"[],

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "token" VARCHAR(40) NOT NULL,
    "valid" BOOLEAN NOT NULL DEFAULT true,
    "ip" VARCHAR(40) NOT NULL,
    "userAgent" VARCHAR(200) NOT NULL,
    "userId" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Post" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT,
    "likes" INTEGER NOT NULL DEFAULT 0,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "authorId" INTEGER,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "comment" TEXT NOT NULL,
    "postId" INTEGER NOT NULL,
    "authorId" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DocumentNode" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "type" "DocumentNodeType" NOT NULL,
    "name" VARCHAR(24) NOT NULL,
    "text" VARCHAR(280),
    "meta" JSONB,
    "datetime" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "ownerId" INTEGER,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DocumentEdge" (
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" "DocumentEdgeType" NOT NULL,
    "meta" JSONB,
    "parentId" INTEGER NOT NULL,
    "childId" INTEGER NOT NULL,

    PRIMARY KEY ("parentId","childId")
);

-- CreateTable
CREATE TABLE "DailyInspect" (
    "id" SERIAL NOT NULL,
    "type" "InspectType" NOT NULL,
    "datetime" TIMESTAMP(3) NOT NULL,
    "hours" INTEGER NOT NULL,
    "meta" JSONB NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DailyLog" (
    "id" SERIAL NOT NULL,
    "type" "LogType" NOT NULL,
    "datetime" TIMESTAMP(3) NOT NULL,
    "miles" INTEGER NOT NULL,
    "meta" JSONB NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User.email_unique" ON "User"("email");

-- CreateIndex
CREATE INDEX "DocumentNode.type_index" ON "DocumentNode"("type");

-- CreateIndex
CREATE INDEX "DocumentEdge.type_index" ON "DocumentEdge"("type");

-- CreateIndex
CREATE INDEX "DailyInspect.type_index" ON "DailyInspect"("type");

-- AddForeignKey
ALTER TABLE "Session" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentNode" ADD FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentEdge" ADD FOREIGN KEY ("parentId") REFERENCES "DocumentNode"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentEdge" ADD FOREIGN KEY ("childId") REFERENCES "DocumentNode"("id") ON DELETE CASCADE ON UPDATE CASCADE;
