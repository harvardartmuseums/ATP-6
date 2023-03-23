# Art Forest | ATP-6

Another scrappy demo project by HAM DIET. This is another interation of the Art Forest project. This version was created for [ArtTechPsyche](https://arttechpsyche.org/) on March 24, 2023.

## About

The controller folder contains code for a custom controller built on an Arduino. 

The interface folder contains code for web interface. This interface connects with the Arduino-based controller using the [Web Serial API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Serial_API).

## Setup

* Clone this repo
* Open a terminal and run `npm install`
* Get a [HAM API](http://hvrd.art/api) key
* Copy .env-template to .env
* Open .env in a text editor and set `HAM_APIKEY` to your new HAM API key

## Runnin the App

* Open a terminal and run `npm start`
* Open a browser window to http://localhost:3000
* Open a second browser window to http://localhost:3000/forest

## References

https://whatwebcando.today/serial.html