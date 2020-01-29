// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.


const SerialPort = require('serialport');
const parsers = SerialPort.parsers

// Use a `\r\n` as a line terminator
const parser = new parsers.Readline({
  delimiter: '\r\n',
})

port = null;
comPath = null;

window.addEventListener('DOMContentLoaded', () => {
  window.Bridge = {
    openSerialConnection: openSerialConnection,
    onDataReceive: console.log,
    updateEvents: updateEvents,
    sendMessage: sendMessage,
    getSerialCOMsList: getSerialCOMsList,
    setCOMPath: setCOMPath,
    onOpen: onOpen,
  };
})

function onOpen() {
  console.log(comPath + " port opened!");
}

function setCOMPath(path){
  comPath = path;
}

function getSerialCOMsList() {
  // the serialPort will return promise so we are using then
  return SerialPort.list();
}

function sendMessage(message) {
  if (port.isOpen) {
    port.write(message);
  } else {
    console.error("Tried to send message but port wasn't open!");
  }
}

function updateEvents() {
  parser.removeAllListeners("data");
    port.removeAllListeners("open");
  parser.on('data', window.Bridge.onDataReceive);
    port.on('open', window.Bridge.onOpen);
}

function openSerialConnection() {
  if (port == null || !port.isOpen) {
    if (comPath != null) {
      port = new SerialPort(comPath, {
        baudRate: 115200,
        autoOpen: false,
      });
      port.pipe(parser);
    } else {
      console.error("Tried to open port but comPath isn't even set!");
    }

    port.open(function (err) {
      if (err) {
        return console.error('Error opening port: ', err.message)
      }
    });

    updateEvents();
  } else {
    console.log("Port is already open!");
  }
}
