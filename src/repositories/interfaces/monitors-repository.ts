import { type Indexes, type Monitors, type Prisma } from '@prisma/client'

export enum MonitorTypes {
  chart = 'CHART'
}

export interface FindByUserIdAndSymbolAndIntervalInput {
  user_id: string
  symbol: string
  interval: string
}

export interface PrismaMonitorsUpdateInput extends Prisma.MonitorsUncheckedUpdateInput {
  id: string
}

export interface PrismaMonitorsCreateInput extends Prisma.MonitorsUncheckedCreateWithoutIndexesInput {
  indexes: Prisma.IndexesUncheckedCreateWithoutMonitorInput[]
}

export type MonitorsOut = Monitors & { indexes: Indexes[] }

export interface MonitorsRepositoryInterface {
  create: (data: PrismaMonitorsCreateInput) => Promise<MonitorsOut>
  update: (data: PrismaMonitorsUpdateInput) => Promise<Monitors>
  findByUserId: (user_id: string) => Promise<MonitorsOut[]>
  findById: (id: string) => Promise<MonitorsOut | null>
  getActiveMonitorsByUserId: (user_id: string) => Promise<MonitorsOut[]>
  findByUserIdAndSymbolAndInterval: (data: FindByUserIdAndSymbolAndIntervalInput) => Promise<MonitorsOut | null>
}
