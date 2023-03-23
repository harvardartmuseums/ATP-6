/*
  AnalogReadSerial

  Reads an analog input on pin 0, prints the result to the Serial Monitor.
  Graphical representation is available using Serial Plotter (Tools > Serial Plotter menu).
  Attach the center pin of a potentiometer to pin A0, and the outside pins to +5V and ground.

  This example code is in the public domain.

  https://www.arduino.cc/en/Tutorial/BuiltInExamples/AnalogReadSerial
*/

// Pins
#define PIN_BUTTON_NEXT 8
#define PIN_BUTTON_PREVIOUS 9
#define PIN_BUTTON_CAST 10
#define PIN_BUTTON_RESET 12
#define PIN_BUTTON_SNAPSHOT 11

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

// Button Control
long button_time; //timers for debounce and timeout
String btnOutput[5] = {"B-0-N~", "B-1-P~", "B-2-C~", "B-3-S~", "B-4-R~"};

// Analog Control
int currentVals[6];
int oldVals[6];
int diffs[6];
String output[6];
String aliases[6] = {"P-0-x-", "P-0-y-", "P-0-s-", "P-1-x-", "P-1-y-", "P-1-s-"};

// the setup routine runs once when you press reset:
void setup() {
  pinMode(PIN_BUTTON_CAST, INPUT_PULLUP);
  pinMode(PIN_BUTTON_RESET, INPUT_PULLUP);
  pinMode(PIN_BUTTON_SNAPSHOT, INPUT_PULLUP);
  pinMode(PIN_BUTTON_NEXT, INPUT_PULLUP);
  pinMode(PIN_BUTTON_PREVIOUS, INPUT_PULLUP);

  // initialize serial communication at 9600 bits per second:
  Serial.begin(9600);
}

// the loop routine runs over and over again forever:
void loop() {
  button_task();
  serial_input_task();
}

void button_task() {
  int button_input = HIGH;
  
  // Cast button
  button_input = digitalRead(PIN_BUTTON_CAST);
  if (button_input == LOW && millis()-button_time > DEBOUNCE) {
    Serial.print(btnOutput[2]);
    button_time = millis();
  }  

  // Reset button
  button_input = digitalRead(PIN_BUTTON_RESET);
  if (button_input == LOW && millis()-button_time > DEBOUNCE) {
    Serial.print(btnOutput[4]);
    button_time = millis();
  }    

  // Snapshot button
  button_input = digitalRead(PIN_BUTTON_SNAPSHOT);
  if (button_input == LOW && millis()-button_time > DEBOUNCE) {
    Serial.print(btnOutput[3]);
    button_time = millis();
  }   

  // Next button
  button_input = digitalRead(PIN_BUTTON_NEXT);
  if (button_input == LOW && millis()-button_time > DEBOUNCE) {
    Serial.print(btnOutput[0]);
    button_time = millis();
  }    

  // Previous button
  button_input = digitalRead(PIN_BUTTON_PREVIOUS);
  if (button_input == LOW && millis()-button_time > DEBOUNCE) {
    Serial.print(btnOutput[1]);
    button_time = millis();
  }           
}

void serial_input_task() {

  // read the input on analog pin 0:
  currentVals[0] = analogRead(A0);
  currentVals[0] = map(currentVals[0], 0, 1023, 750, 0);

  currentVals[1] = analogRead(A1);
  currentVals[1] = map(currentVals[1], 0, 1023, 750, 0);

  currentVals[2] = analogRead(A2);
  currentVals[2] = map(currentVals[2], 0, 1023, 750, 1);

  currentVals[3] = analogRead(A3);
  currentVals[3] = map(currentVals[3], 0, 1023, 750, 0);

  currentVals[4] = analogRead(A4);
  currentVals[4] = map(currentVals[4], 0, 1023, 750, 0);

  currentVals[5] = analogRead(A5);
  currentVals[5] = map(currentVals[5], 0, 1023, 750, 1);  

  delay(15);
  
  for (int i = 0; i <= 5; i++) {
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
