/*
  Warnings:

  - You are about to drop the `indexesOfAutomations` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `indexesOfMonitors` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "indexesOfAutomations" DROP CONSTRAINT "indexesOfAutomations_automation_id_fkey";

-- DropForeignKey
ALTER TABLE "indexesOfMonitors" DROP CONSTRAINT "indexesOfMonitors_monitor_id_fkey";

-- AlterTable
ALTER TABLE "automations" ADD COLUMN     "indexes" TEXT[];

-- DropTable
DROP TABLE "indexesOfAutomations";

-- DropTable
DROP TABLE "indexesOfMonitors";

-- CreateTable
CREATE TABLE "indexes" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "params" TEXT NOT NULL,
    "monitor_id" TEXT NOT NULL,

    CONSTRAINT "indexes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "indexes_type_params_monitor_id_key" ON "indexes"("type", "params", "monitor_id");

-- AddForeignKey
ALTER TABLE "indexes" ADD CONSTRAINT "indexes_monitor_id_fkey" FOREIGN KEY ("monitor_id") REFERENCES "monitors"("id") ON DELETE CASCADE ON UPDATE CASCADE;
