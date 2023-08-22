-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "settings" (
    "id" TEXT NOT NULL,
    "apiURL" TEXT NOT NULL,
    "streamURL" TEXT NOT NULL,
    "apiKey" TEXT NOT NULL,
    "secretKey" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "settings_pkey" PRIMARY KEY ("id")
);

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
    "is_favorite" BOOLEAN NOT NULL DEFAULT false,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "symbols_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orders" (
    "id" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "order_id" INTEGER NOT NULL,
    "client_order_id" TEXT NOT NULL,
    "side" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "quantity" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "transaction_time" TEXT NOT NULL,
    "obs" TEXT,
    "limit_price" TEXT,
    "stop_price" TEXT,
    "commission" TEXT,
    "iceberg_quantity" TEXT,
    "automatio_id" TEXT,
    "average_price" DECIMAL(65,30),
    "net" DECIMAL(65,30),
    "is_maker" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "monitors" (
    "id" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "interval" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT false,
    "is_system_monitor" BOOLEAN NOT NULL DEFAULT false,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "monitors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "indexesOfMonitors" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "params" TEXT NOT NULL,
    "monitor_id" TEXT NOT NULL,

    CONSTRAINT "indexesOfMonitors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "indexesOfAutomations" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "params" TEXT NOT NULL,
    "automation_id" TEXT NOT NULL,

    CONSTRAINT "indexesOfAutomations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "automations" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "conditions" TEXT NOT NULL,
    "schedule" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "automations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "settings_user_id_key" ON "settings"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "symbols_user_id_symbol_key" ON "symbols"("user_id", "symbol");

-- CreateIndex
CREATE INDEX "orders_symbol_user_id_idx" ON "orders"("symbol", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "orders_user_id_order_id_client_order_id_key" ON "orders"("user_id", "order_id", "client_order_id");

-- CreateIndex
CREATE INDEX "monitors_symbol_user_id_idx" ON "monitors"("symbol", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "monitors_user_id_symbol_interval_key" ON "monitors"("user_id", "symbol", "interval");

-- CreateIndex
CREATE UNIQUE INDEX "indexesOfMonitors_type_params_monitor_id_key" ON "indexesOfMonitors"("type", "params", "monitor_id");

-- CreateIndex
CREATE UNIQUE INDEX "indexesOfAutomations_type_params_automation_id_key" ON "indexesOfAutomations"("type", "params", "automation_id");

-- CreateIndex
CREATE UNIQUE INDEX "automations_symbol_name_user_id_key" ON "automations"("symbol", "name", "user_id");

-- AddForeignKey
ALTER TABLE "settings" ADD CONSTRAINT "settings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "symbols" ADD CONSTRAINT "symbols_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "monitors" ADD CONSTRAINT "monitors_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "indexesOfMonitors" ADD CONSTRAINT "indexesOfMonitors_monitor_id_fkey" FOREIGN KEY ("monitor_id") REFERENCES "monitors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "indexesOfAutomations" ADD CONSTRAINT "indexesOfAutomations_automation_id_fkey" FOREIGN KEY ("automation_id") REFERENCES "automations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "automations" ADD CONSTRAINT "automations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
