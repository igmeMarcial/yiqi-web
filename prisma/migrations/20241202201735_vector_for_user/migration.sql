-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "vector";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "embedding" vector(3072),
ADD COLUMN     "userContentPreferences" TEXT,
ADD COLUMN     "userDetailedProfile" TEXT,
ADD COLUMN     "userEmbeddableProfile" TEXT;
