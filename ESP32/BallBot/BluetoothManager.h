#ifndef BLUETOOTH_H
#define BLUETOOTH_H

#include <BLEDevice.h>
#include <BLEServer.h>
#include <BLEUtils.h>
#include <BLE2902.h>

#define SERVICE_UUID "74a575e4-ffdd-4a90-8cb3-de2e85648de7"
#define RECEIVE_POSITION_UUID "7bd70539-5e32-4b6b-91b0-50b2b5af7937"

typedef void (*onReceiveValueCallback)(const char *newValue);

class MyCallbacks : public BLECharacteristicCallbacks {
public:
  MyCallbacks(onReceiveValueCallback callback) : onReceiveValueFunc(callback) {}

  void onWrite(BLECharacteristic *pCharacteristic) override {
    String value = pCharacteristic->getValue();
    if (!value.isEmpty() && onReceiveValueFunc != nullptr) {
      onReceiveValueFunc(value.c_str());  // Call the user-defined callback with the received value
    }
  }

private:
  onReceiveValueCallback onReceiveValueFunc;  // Store the callback function
};

void setupBluetooth(onReceiveValueCallback callback) {
  // Initialize the BLE device with the name "BallBot"
  BLEDevice::init("BallBot");

  // Create a BLE server to manage connections
  BLEServer *receiveServer = BLEDevice::createServer();

  // Create a new service on the BLE server with a unique service UUID
  BLEService *receiveService = receiveServer->createService(SERVICE_UUID);

  // Create a characteristic within the service for receiving position data
  // BLECharacteristic::PROPERTY_WRITE    -> Allows clients to write data to it
  // BLECharacteristic::PROPERTY_WRITE_NR -> Allows writing without response
  BLECharacteristic *receivePositionCharacteristic = receiveService->createCharacteristic(
    RECEIVE_POSITION_UUID,
    BLECharacteristic::PROPERTY_WRITE | BLECharacteristic::PROPERTY_WRITE_NR);

  // Add a descriptor to enable notifications and indications
  receivePositionCharacteristic->addDescriptor(new BLE2902());

  // Start the service to make it available to clients
  receiveService->start();

  // Configure BLE advertising to broadcast the service UUID, enabling discovery by clients
  BLEAdvertising *receiveAdvertising = BLEDevice::getAdvertising();
  receiveAdvertising->addServiceUUID(SERVICE_UUID);
  receiveAdvertising->setScanResponse(true);  // Respond with additional data in scan response
  receiveAdvertising->setMinPreferred(0x06);  // Set preferred advertising interval minimum
  receiveAdvertising->setMaxPreferred(0x12);  // Set preferred advertising interval maximum

  // Start advertising to allow clients to connect to the device
  BLEDevice::startAdvertising();
  Serial.println("\nallBot Bluetooth service has started.");

  // Set the callback for receiving data
  receivePositionCharacteristic->setCallbacks(new MyCallbacks(callback));
}

#endif