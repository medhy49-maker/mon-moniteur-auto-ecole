-- CreateEnum
CREATE TYPE "SchoolRole" AS ENUM ('SCHOOL_ADMIN', 'INSTRUCTOR', 'STUDENT');

-- CreateEnum
CREATE TYPE "MembershipStatus" AS ENUM ('PENDING', 'ACTIVE', 'SUSPENDED');

-- AlterTable
ALTER TABLE "instructors" ADD COLUMN "schoolId" TEXT;

-- AlterTable
ALTER TABLE "lessons" ADD COLUMN "schoolId" TEXT;

-- AlterTable
ALTER TABLE "students" ADD COLUMN "schoolId" TEXT;

-- CreateTable
CREATE TABLE "driving_schools" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "driving_schools_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "school_memberships" (
    "id" TEXT NOT NULL,
    "role" "SchoolRole" NOT NULL,
    "status" "MembershipStatus" NOT NULL DEFAULT 'PENDING',
    "userId" TEXT NOT NULL,
    "schoolId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "school_memberships_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "school_memberships_userId_idx" ON "school_memberships"("userId");

-- CreateIndex
CREATE INDEX "school_memberships_schoolId_role_idx" ON "school_memberships"("schoolId", "role");

-- CreateIndex
CREATE UNIQUE INDEX "school_memberships_userId_schoolId_key" ON "school_memberships"("userId", "schoolId");

-- CreateIndex
CREATE INDEX "instructors_schoolId_idx" ON "instructors"("schoolId");

-- CreateIndex
CREATE INDEX "lessons_schoolId_idx" ON "lessons"("schoolId");

-- CreateIndex
CREATE INDEX "students_schoolId_idx" ON "students"("schoolId");

-- AddForeignKey
ALTER TABLE "school_memberships" ADD CONSTRAINT "school_memberships_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "school_memberships" ADD CONSTRAINT "school_memberships_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "driving_schools"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "instructors" ADD CONSTRAINT "instructors_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "driving_schools"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "driving_schools"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lessons" ADD CONSTRAINT "lessons_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "driving_schools"("id") ON DELETE SET NULL ON UPDATE CASCADE;
