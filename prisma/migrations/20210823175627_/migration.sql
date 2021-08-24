-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

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
    "meta" JSONB,
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
CREATE INDEX "DailyInspect.type_index" ON "DailyInspect"("type");

-- AddForeignKey
ALTER TABLE "Session" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
