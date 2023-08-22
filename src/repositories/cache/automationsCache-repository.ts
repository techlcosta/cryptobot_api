import { type Automations } from '@prisma/client'

interface KeyFactoryInput {
  user_id: string
  index: string
}

class _AutomationsCacheRepository {
  private readonly activeAutomations = new Map<string, Automations>()
  private readonly invertedIndex = new Map<string, Set<string> >()
  private static readonly instances = new Map<string, _AutomationsCacheRepository>()

  private constructor () {}

  static getInstance (user_id?: string): _AutomationsCacheRepository {
    if (user_id) {
      const currentInstance = _AutomationsCacheRepository.instances.get(user_id)

      if (currentInstance) {
        return currentInstance
      } else {
        const binanceStreamInstance = new _AutomationsCacheRepository()
        _AutomationsCacheRepository.instances.set(user_id, binanceStreamInstance)

        return binanceStreamInstance
      }
    } else {
      return new _AutomationsCacheRepository()
    }
  }

  update (automation: Automations): void {
    this.activeAutomations.set(automation.id, automation)

    automation.indexes.forEach((index) => {
      const indexKey = this.keyFactory({ user_id: automation.user_id, index })
      const invertedIndex = this.invertedIndex.get(indexKey)
      if (invertedIndex) invertedIndex.add(automation.id)

      else this.invertedIndex.set(indexKey, new Set(automation.id))
    })
  }

  private keyFactory ({ user_id, index }: KeyFactoryInput): string {
    return `${user_id}&${index}`
  }
}

export function binanceStreamFactory (user_id: string): _AutomationsCacheRepository {
  return _AutomationsCacheRepository.getInstance(user_id)
}
