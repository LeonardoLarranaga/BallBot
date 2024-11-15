import React, {createContext, useContext, useState} from "react"

interface WebSocketContextType {
    isConnected: boolean
    lastFrameBuffer: ArrayBuffer | null
    webSocketConsole: string
    connectWebSocket: () => void,
    getFrameUri: () => string
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined)

export const WebSocketProvider = ({children}: { children: React.ReactNode }) => {
    const [isConnected, setIsConnected] = useState(false)
    const [lastFrameBuffer, setLastFrameBuffer] = useState<ArrayBuffer | null>(null)
    const [webSocketConsole, setWebSocketConsole] = useState("Console")

    // Function to manually connect the WebSocket
    const connectWebSocket = () => {
        setWebSocketConsole("Connecting to WebSocket...")
        const ws = new WebSocket("ws://192.168.39.12:13")
        ws.binaryType = "arraybuffer"

        ws.onmessage = (event) => {
            if (event.data instanceof ArrayBuffer) {
                setLastFrameBuffer(event.data)
                setWebSocketConsole("Received frame")
            }
        }

        ws.onopen = () => {
            setIsConnected(true)
            setWebSocketConsole("WebSocket Connected")
        }

        ws.onclose = () => {
            setIsConnected(false)
            setWebSocketConsole("WebSocket Disconnected")
            setLastFrameBuffer(null)
        }

        ws.onerror = (error) => {
            setWebSocketConsole("WebSocket Error: " + error.toString())
            setLastFrameBuffer(null)
        }
    }

    const getFrameUri = () => {
        if (!lastFrameBuffer) return ""
        let binary = ""
        const bytes = new Uint8Array(lastFrameBuffer)
        const len = bytes.byteLength
        for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i])
        }
        return `data:image/jpeg;base64,${btoa(binary)}`
    }

    return (
        <WebSocketContext.Provider
            value={{
                isConnected,
                lastFrameBuffer,
                webSocketConsole,
                connectWebSocket,
                getFrameUri
            }}
        >
            {children}
        </WebSocketContext.Provider>
    )
}

export const useWebSocket = () => {
    const context = useContext(WebSocketContext)
    if (!context) {
        throw new Error("useWebSocket must be used within a WebSocketProvider")
    }
    return context
}