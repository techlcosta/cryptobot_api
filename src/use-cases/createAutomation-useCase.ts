import { AutomationAlredyExistsError } from '@/errors/automation-alredy-exists-error'
import { type AutomationsRepositoryInterface } from '@/repositories/interfaces/automations-repository'
import { type Automations } from '@prisma/client'

interface CreateAutomationUseCaseRequest {
  name: string
  symbol: string
  user_id: string
  conditions: string
  schedule?: string
  is_active: boolean
  indexes: string[]
}

interface CreateAutomationUseCaseResponse {
  automation: Automations
}

export class CreateAutomationUseCase {
  constructor (
    private readonly automationsRepository: AutomationsRepositoryInterface
  ) {}

  async execute ({ name, symbol, user_id, conditions, schedule, is_active, indexes }: CreateAutomationUseCaseRequest): Promise<CreateAutomationUseCaseResponse> {
    if (await this.automationsRepository.findByUserIdAndSymbolAndName({ name, symbol, user_id })) throw new AutomationAlredyExistsError()

    const automation = await this.automationsRepository.create({
      name,
      symbol,
      user_id,
      conditions,
      schedule,
      is_active,
      indexes
    })

    return { automation }
  }
}
