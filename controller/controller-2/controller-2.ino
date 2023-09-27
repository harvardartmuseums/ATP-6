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
#define PIN_BUTTON_ACTION_3 10

// Replies (serial output)
#define REP_CAST 'C' 
#define REP_RESET 'R' 
#define REP_SNAPSHOT 'S' 
#define REP_NEXT 'N' 
#define REP_PREVIOUS 'P' 

//Misc.
#define DEBOUNCE 300 //milliseconds of debounce
#define TOLERANCE 20
#define STOP_CHAR "~"

// Accelerometer 
MMA8452Q accel; // Default MMA8452Q object create. (Address = 0x1D)
byte currentAccelval;
byte oldAccelVal;
String accelAlias[2] = {"A-0-A-", "A-0-T~"};
String accelOutput = "";


// Button Control
long button_time; //timers for debounce and timeout
String btnOutput[3] = {"B-0-A~", "B-1-A~", "B-2-A~"};

// Analog Control
int currentVals[1];
int oldVals[1];
int diffs[1]; 
String output[1];
String aliases[1] = {"P-0-A-"};

// the setup routine runs once when you press reset:
void setup() {
  accel.init();

  pinMode(PIN_BUTTON_ACTION_1, INPUT_PULLUP);
  pinMode(PIN_BUTTON_ACTION_2, INPUT_PULLUP);
  pinMode(PIN_BUTTON_ACTION_3, INPUT_PULLUP);

  // initialize serial communication at 9600 bits per second:
  Serial.begin(9600);
}

// the loop routine runs over and over again forever:
void loop() {
  button_task();
  serial_input_task();
  accel_task();
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
  
  // Action button 3
  button_input = digitalRead(PIN_BUTTON_ACTION_3);
  if (button_input == LOW && millis()-button_time > DEBOUNCE) {
    Serial.print(btnOutput[2]);
    button_time = millis();
  }    

}

void serial_input_task() {

  // read the input on analog pin 0:
  currentVals[0] = analogRead(A0);
  currentVals[0] = map(currentVals[0], 0, 1023, 1023, 0);

  delay(15);
  
  for (int i = 0; i <= 0; i++) {
    diffs[i] = abs(currentVals[i] - oldVals[i]);
    if (diffs[i] > TOLERANCE) {
      oldVals[i] = currentVals[i];

      // print out the value you read:
      output[i] = aliases[i];
      output[i].concat(currentVals[i]);
      output[i].concat(STOP_CHAR);
      Serial.print(output[i]);
      Serial.flush();
    }
  }
}

void accel_task() {
  if (accel.available()) { 
    if (accel.readTap() > 0) {
      accelOutput = accelAlias[1];
      Serial.print(accelOutput);
      Serial.flush();
    }

    currentAccelval = accel.readPL();
    if (currentAccelval != oldAccelVal) {
      oldAccelVal = currentAccelval;

      accelOutput = accelAlias[0];
      accelOutput.concat(currentAccelval);
      accelOutput.concat(STOP_CHAR);      
      Serial.print(accelOutput);
      Serial.flush();

      // switch (currentAccelval)
      // {
      // case PORTRAIT_U:
      //     Serial.print("Portrait Up");
      //     break;
      // case PORTRAIT_D:
      //     Serial.print("Portrait Down");
      //     break;
      // case LANDSCAPE_R:
      //     Serial.print("Landscape Right");
      //     break;
      // case LANDSCAPE_L:
      //     Serial.print("Landscape Left");
      //     break;
      // case LOCKOUT:
      //     Serial.print("Flat");
      //     break;
      // }
    }
  }
}
