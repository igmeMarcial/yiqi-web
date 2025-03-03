/*
  Warnings:

  - A unique constraint covering the columns `[userId,registrationId]` on the table `NetworkingMatch` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "NetworkingMatch_userId_registrationId_key" ON "NetworkingMatch"("userId", "registrationId");
