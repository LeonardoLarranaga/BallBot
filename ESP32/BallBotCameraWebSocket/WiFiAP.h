#ifndef WIFIAP_H
#define WIFIAP_H

#include <WiFi.h>

const char *ssid = "BallBot Camera";

void WiFiEvent(WiFiEvent_t event) {
  switch (event) {
    case ARDUINO_EVENT_WIFI_AP_STACONNECTED:
      Serial.println("A device has connected to the WiFi AP.");
      break;

    case ARDUINO_EVENT_WIFI_AP_STADISCONNECTED:
      Serial.println("A device has disconnected to the WiFi AP.");
      break;
  }
}

void setupWiFiAP() {
  WiFi.onEvent(WiFiEvent);
  WiFi.softAP(ssid);
  delay(100);
  IPAddress Ip(192, 168, 39, 12);
  IPAddress NMask(255, 255, 255, 0);
  WiFi.softAPConfig(Ip, Ip, NMask);
}

#endif