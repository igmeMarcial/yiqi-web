-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "backgroundColor" TEXT,
ADD COLUMN     "endTime" TEXT,
ADD COLUMN     "featuredIn" JSONB,
ADD COLUMN     "heroImage" TEXT,
ADD COLUMN     "hosts" JSONB,
ADD COLUMN     "startTime" TEXT,
ADD COLUMN     "subtitle" TEXT;
