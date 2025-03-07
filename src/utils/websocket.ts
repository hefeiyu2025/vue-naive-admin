type MessageHandler = (data: any) => void

class WebSocketClient {
  private ws: WebSocket | null = null
  private messageHandlers: Set<MessageHandler> = new Set()
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectTimeout = 3000

  constructor(private url: string) {}

  connect() {
    try {
      this.ws = new WebSocket(this.url)
      this.setupEventHandlers()
      this.reconnectAttempts = 0
    }
    catch (error) {
      console.error('WebSocket 连接失败:', error)
      this.handleReconnect()
    }
  }

  private setupEventHandlers() {
    if (!this.ws) return

    this.ws.onopen = () => {
      console.log('WebSocket 连接成功')
    }

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        this.messageHandlers.forEach(handler => handler(data))
      }
      catch (error) {
        console.error('消息解析失败:', error)
      }
    }

    this.ws.onclose = () => {
      console.log('WebSocket 连接关闭')
      this.handleReconnect()
    }

    this.ws.onerror = (error) => {
      console.error('WebSocket 错误:', error)
    }
  }

  private handleReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('WebSocket 重连次数超过限制')
      return
    }

    this.reconnectAttempts++
    console.log(`尝试重连 (${this.reconnectAttempts}/${this.maxReconnectAttempts})`)
    
    setTimeout(() => {
      this.connect()
    }, this.reconnectTimeout)
  }

  addMessageHandler(handler: MessageHandler) {
    this.messageHandlers.add(handler)
  }

  removeMessageHandler(handler: MessageHandler) {
    this.messageHandlers.delete(handler)
  }

  send(data: any) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data))
    }
    else {
      console.error('WebSocket 未连接')
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
    this.messageHandlers.clear()
  }
}

export const wsClient = new WebSocketClient(import.meta.env.VITE_WS_URL || 'ws://localhost:3000') 