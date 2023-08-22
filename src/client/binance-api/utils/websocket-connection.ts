import WebSocket, { type RawData } from 'ws'
import { HttpConnection } from './http-connection'

interface WebSocketInstance {
  wss: WebSocket
  reconnect: boolean
  isAlive: boolean
}

interface HeartbeatInput {
  ID: string
}

interface OnSockectOpenInput {
  wss: WebSocket
  ID: string
}

interface OnSockectCloseInput {
  ID: string
  reconnectFn: () => void
  code: string | number
}

interface OnSocketErrorInput {
  error: Error
  ID: string
}

interface SubscribeInput {
  streamURL: string
  endpoint: string
  reconnectFn: () => void
  callback: (data: RawData, isBinary?: boolean) => void
  ID: string
}

interface UnsubscribeInput {
  ID: string
}

export class WebSocketConnection extends HttpConnection {
  private readonly subscriptions = new Map<string, WebSocketInstance>()
  private heartbeatInterval: NodeJS.Timer | undefined

  private handleHeartbeat ({ ID }: HeartbeatInput): void {
    const current = this.subscriptions.get(ID)

    if (current) current.isAlive = true
  }

  private onSocketOpen ({ wss, ID }: OnSockectOpenInput): void {
    if (wss.readyState === wss.OPEN) console.log(`WebSocket subscribed on ${ID}...`)

    if (this.subscriptions.size && this.heartbeatInterval === undefined) {
      this.heartbeatInterval = setInterval(() => {
        this.subscriptions.forEach(subscription => {
          if (subscription.isAlive) {
            subscription.isAlive = false

            if (subscription.wss.readyState === subscription.wss.OPEN) subscription.wss.ping(() => {})
          } else {
            console.log(`Close inactive/broken WebSocket: ${ID}`)
            if (subscription.wss.readyState === subscription.wss.OPEN) subscription.wss.terminate()
          }
        })
      }, 60000)
    }
  }

  private onSocketClose ({ ID, reconnectFn, code }: OnSockectCloseInput): void {
    const reconnect = this.subscriptions.get(ID)?.reconnect ?? false

    this.subscriptions.delete(ID)

    if (this.subscriptions.size === 0) {
      clearInterval(this.heartbeatInterval)
      this.heartbeatInterval = undefined
    }

    if (reconnect) {
      try {
        console.log(`WebSocket: try reconnecting on ${ID}...`)
        reconnectFn()
      } catch (error) {
        if (error instanceof Error) console.error(`WebSocket reconnect error: ${error.message}`)
      }
    } else {
      console.log(`WebSocket: unsubscribed on ${ID} (${code})`)
    }
  }

  private onSocketError ({ error, ID }: OnSocketErrorInput): void {
    console.error(`Error: ${error.message} on ${ID}`)
  }

  protected subscribe ({ streamURL, endpoint, reconnectFn, callback, ID }: SubscribeInput): WebSocket {
    const URL = `${streamURL}${endpoint}`

    const wss = new WebSocket(URL)

    wss.on('open', () => { this.onSocketOpen({ wss, ID }) })
    wss.on('pong', () => { this.handleHeartbeat({ ID }) })
    wss.on('close', (code) => { this.onSocketClose({ ID, reconnectFn, code }) })
    wss.on('message', callback)
    wss.on('error', (error) => { this.onSocketError({ error, ID }) })

    this.subscriptions.set(ID, {
      wss,
      reconnect: true,
      isAlive: true
    })

    return wss
  }

  protected unsubscribe ({ ID }: UnsubscribeInput): void {
    const current = this.subscriptions.get(ID)

    if (current) {
      current.wss.removeAllListeners('message')
      current.reconnect = false
      current.wss.terminate()
    }
  }
}
