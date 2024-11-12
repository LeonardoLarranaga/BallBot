#include "BluetoothManager.h"

void onReceiveValue(const char*);

void setup() {
  Serial.begin(115200);
  setupBluetooth(onReceiveValue);
}

void loop() {
}

void onReceiveValue(const char* newValue) {
  Serial.println(newValue);
}