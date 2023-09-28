#include <Wire.h>
#include <SparkFun_MMA8452Q.h>

/*
  AnalogReadSerial

  Reads an analog input on pin 0, prints the result to the Serial Monitor.
  Graphical representation is available using Serial Plotter (Tools > Serial Plotter menu).
  Attach the center pin of a potentiometer to pin A0, and the outside pins to +5V and ground.

  This example code is in the public domain.

  https://www.arduino.cc/en/Tutorial/BuiltInExamples/AnalogReadSerial
*/

// Pins
#define PIN_BUTTON_ACTION_1 8
#define PIN_BUTTON_ACTION_2 9

//Misc.
#define DEBOUNCE 300 //milliseconds of debounce
#define TOLERANCE 20
#define STOP_CHAR "~"

// Button Control
long button_time; //timers for debounce and timeout
String btnOutput[3] = {"B-0-A~", "B-1-A~", "B-2-A~"};


// the setup routine runs once when you press reset:
void setup() {

  pinMode(PIN_BUTTON_ACTION_1, INPUT_PULLUP);
  pinMode(PIN_BUTTON_ACTION_2, INPUT_PULLUP);

  // initialize serial communication at 9600 bits per second:
  Serial.begin(9600);
}

// the loop routine runs over and over again forever:
void loop() {
  button_task();

}

void button_task() {
  int button_input = HIGH;
  
  // Action button 1
  button_input = digitalRead(PIN_BUTTON_ACTION_1);
  if (button_input == LOW && millis()-button_time > DEBOUNCE) {
    Serial.print(btnOutput[0]);
    button_time = millis();
  }    
  
  // Action button 2
  button_input = digitalRead(PIN_BUTTON_ACTION_2);
  if (button_input == LOW && millis()-button_time > DEBOUNCE) {
    Serial.print(btnOutput[1]);
    button_time = millis();
  }    
}

