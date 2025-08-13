-- CreateEnum
CREATE TYPE "public"."JobStatus" AS ENUM ('OPEN', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "public"."ApplicationStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "public"."NotificationType" ADD VALUE 'JOB_POSTED';
ALTER TYPE "public"."NotificationType" ADD VALUE 'JOB_APPLICATION_RECEIVED';
ALTER TYPE "public"."NotificationType" ADD VALUE 'JOB_APPLICATION_APPROVED';
ALTER TYPE "public"."NotificationType" ADD VALUE 'JOB_APPLICATION_REJECTED';

-- DropForeignKey
ALTER TABLE "public"."Notification" DROP CONSTRAINT "Notification_projectId_fkey";

-- AlterTable
ALTER TABLE "public"."Notification" ADD COLUMN     "jobId" TEXT,
ALTER COLUMN "projectId" DROP NOT NULL;

-- CreateTable
CREATE TABLE "public"."Professional" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "profession" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "availability" BOOLEAN NOT NULL DEFAULT true,
    "hourlyRate" DOUBLE PRECISION,
    "experience" INTEGER,
    "skills" TEXT[],
    "bio" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Professional_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ContractorJob" (
    "id" TEXT NOT NULL,
    "contractorId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "budget" DOUBLE PRECISION NOT NULL,
    "requiredProfession" TEXT NOT NULL,
    "estimatedDuration" INTEGER NOT NULL,
    "status" "public"."JobStatus" NOT NULL DEFAULT 'OPEN',
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContractorJob_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."JobApplication" (
    "id" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "professionalId" TEXT NOT NULL,
    "contractorId" TEXT NOT NULL,
    "coverLetter" TEXT NOT NULL,
    "proposedRate" DOUBLE PRECISION NOT NULL,
    "estimatedStartDate" TIMESTAMP(3) NOT NULL,
    "estimatedEndDate" TIMESTAMP(3) NOT NULL,
    "status" "public"."ApplicationStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JobApplication_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Professional_userId_key" ON "public"."Professional"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "JobApplication_jobId_professionalId_key" ON "public"."JobApplication"("jobId", "professionalId");

-- AddForeignKey
ALTER TABLE "public"."Professional" ADD CONSTRAINT "Professional_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ContractorJob" ADD CONSTRAINT "ContractorJob_contractorId_fkey" FOREIGN KEY ("contractorId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."JobApplication" ADD CONSTRAINT "JobApplication_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "public"."ContractorJob"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."JobApplication" ADD CONSTRAINT "JobApplication_professionalId_fkey" FOREIGN KEY ("professionalId") REFERENCES "public"."Professional"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."JobApplication" ADD CONSTRAINT "JobApplication_contractorId_fkey" FOREIGN KEY ("contractorId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Notification" ADD CONSTRAINT "Notification_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Notification" ADD CONSTRAINT "Notification_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "public"."ContractorJob"("id") ON DELETE SET NULL ON UPDATE CASCADE;
