-- CreateTable
CREATE TABLE "symbols" (
    "id" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "base" TEXT NOT NULL,
    "quote" TEXT NOT NULL,
    "base_precision" DOUBLE PRECISION NOT NULL,
    "quote_precision" DOUBLE PRECISION NOT NULL,
    "min_notional" TEXT NOT NULL,
    "min_lot_size" TEXT NOT NULL,
    "is_favorite" BOOLEAN NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "symbols_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "symbols" ADD CONSTRAINT "symbols_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
