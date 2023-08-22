import { prisma } from '@/lib/prisma'
import { type Automations, type Prisma } from '@prisma/client'
import { type AutomationsRepositoryInterface, type FindByUserIdAndSymbolAndNameInput } from '../interfaces/automations-repository'

export class PrismaAutomationsRepository implements AutomationsRepositoryInterface {
  async create (data: Prisma.AutomationsUncheckedCreateInput): Promise<Automations> {
    const automation = await prisma.automations.create({ data })

    return automation
  }

  async findByUserIdAndSymbolAndName (data: FindByUserIdAndSymbolAndNameInput): Promise<Automations | null> {
    const automation = await prisma.automations.findUnique({
      where: {
        symbol_name_user_id: data
      }
    })

    return automation
  }
}
