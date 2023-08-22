import { prisma } from '@/lib/prisma'
import { type Monitors } from '@prisma/client'
import { type FindByUserIdAndSymbolAndIntervalInput, type MonitorsOut, type MonitorsRepositoryInterface, type PrismaMonitorsCreateInput, type PrismaMonitorsUpdateInput } from '../interfaces/monitors-repository'

export class PrismaMonitorsRepository implements MonitorsRepositoryInterface {
  async create ({ user_id, symbol, type, indexes, interval, is_active, is_system_monitor }: PrismaMonitorsCreateInput): Promise<MonitorsOut> {
    const monitor = await prisma.monitors.create({
      data: {
        user_id,
        symbol,
        type,
        interval,
        is_active,
        is_system_monitor,
        indexes: {
          createMany: {
            data: indexes
          }
        }
      },
      include: { indexes: true }
    })

    return monitor
  }

  async update ({ id, ...rest }: PrismaMonitorsUpdateInput): Promise<Monitors> {
    const monitor = await prisma.monitors.update({
      where: { id },
      data: { ...rest }
    })

    return monitor
  }

  async findByUserId (user_id: string): Promise<MonitorsOut[]> {
    const monitors = await prisma.monitors.findMany({
      where: {
        user_id
      },
      include: {
        indexes: true
      }
    })

    return monitors
  }

  async findById (id: string): Promise<MonitorsOut | null> {
    const monitor = await prisma.monitors.findUnique({
      where: {
        id
      },
      include: {
        indexes: true
      }
    })

    return monitor
  }

  async getActiveMonitorsByUserId (user_id: string): Promise<MonitorsOut[]> {
    const monitors = await prisma.monitors.findMany({
      where: {
        user_id,
        is_active: true
      },
      include: {
        indexes: true
      }
    })

    return monitors
  }

  async findByUserIdAndSymbolAndInterval (data: FindByUserIdAndSymbolAndIntervalInput): Promise<MonitorsOut | null> {
    const monitor = await prisma.monitors.findUnique({
      where: {
        user_id_symbol_interval: data
      },
      include: {
        indexes: true
      }
    })

    return monitor
  }
}
