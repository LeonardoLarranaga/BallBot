// To program the BallBot Camera:
// - Tools -> Board -> ESP32 Dev Module
// - Tools -> Upload Speed -> 460800
// - Tools -> PSRAM -> Enabled

#include "CameraConfiguration.h"
#include "WebSocket.h"
#include <WiFi.h>

const char *ssid = "BallBot Camera";

void setup() {
  Serial.begin(115200);

  camera_config_t cameraConfiguration = createCameraConfiguration();
  
  esp_err_t cameraStatus = esp_camera_init(&cameraConfiguration);
  if (cameraStatus != ESP_OK) {
    Serial.printf("BallBot Camera initialization failed. Error status code: 0x%x", cameraStatus);
    return;
  }

  sensor_t *sensor = esp_camera_sensor_get();
  sensor->set_vflip(sensor, 1);

  WiFi.softAP(ssid);
  delay(100);
  IPAddress Ip(192, 168, 39, 12);
  IPAddress NMask(255, 255, 255, 0);
  WiFi.softAPConfig(Ip, Ip, NMask);
  
  startWebSocketServer();
  Serial.print("WebSocket started at: ");
  Serial.println(WiFi.softAPIP());
}

void loop() {
  handleWebSocket();

  camera_fb_t *frame = esp_camera_fb_get();
  if (!frame) return;

  sendFrameBufferOverWebSocket(frame->buf, frame->len);

  // Free frame to avoid memory leak.
  esp_camera_fb_return(frame);
}
