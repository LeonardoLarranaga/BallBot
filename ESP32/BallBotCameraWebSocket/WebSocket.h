#ifndef WEBSOCKET_H
#define WEBSOCKET_H

#include <WebSocketsServer.h> // WebSockets by Markus Sattler

WebSocketsServer webSocket = WebSocketsServer(13);

void onWebSocketEvent(uint8_t num, WStype_t type, uint8_t *payload, size_t length) {
  if (type == WStype_CONNECTED) {
    Serial.println("WebSocket client connected.");
    webSocket.sendTXT(num, "OK");
  } else {
    Serial.println("WebSocker client disconnected.");
  }
}

void startWebSocketServer() {
  webSocket.begin();
  webSocket.onEvent(onWebSocketEvent);
}

// Keep the socket alive...
void handleWebSocket() {
  webSocket.loop();
}

void sendFrameBufferOverWebSocket(uint8_t *buffer, size_t length) {
  if (webSocket.connectedClients() > 0) webSocket.sendBIN(0, buffer, length);
}

#endif