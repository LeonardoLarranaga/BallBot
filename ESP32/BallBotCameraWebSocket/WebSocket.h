#ifndef WEBSOCKET_H
#define WEBSOCKET_H

#include <WebSocketsServer.h>  // WebSockets by Markus Sattler

WebSocketsServer webSocket = WebSocketsServer(13);

void onWebSocketEvent(uint8_t num, WStype_t type, uint8_t *payload, size_t length) {
  switch (type) {
    case WStype_CONNECTED:
      Serial.println("WebSocket client connected.");
      break;

    case WStype_ERROR:
      Serial.println("WebSocket Error.");
      break;

    case WStype_DISCONNECTED:
      Serial.println("WebSocket Client Disconencted.");
      break;
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