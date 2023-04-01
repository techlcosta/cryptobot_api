/*
  Warnings:

  - A unique constraint covering the columns `[user_id,symbol]` on the table `symbols` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "symbols_user_id_symbol_idx";

-- CreateIndex
CREATE UNIQUE INDEX "symbols_user_id_symbol_key" ON "symbols"("user_id", "symbol");
