// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.

// In renderer process (web page).
const { ipcRenderer } = require('electron')

const SerialPort = require('serialport');
const parsers = SerialPort.parsers

// Use a `\r\n` as a line terminator
const parser = new parsers.Readline({
  delimiter: '\r\n',
})

port = null;
comPath = null;

window.addEventListener('DOMContentLoaded', () => {
  window.$ = window.jQuery = require('jquery');
  window.Bootstrap = require('bootstrap');
  window.Sortable = require('sortablejs');

  window.Bridge = {
    openSerialConnection: openSerialConnection,
    onDataReceive: console.log,
    updateEvents: updateEvents,
    sendMessage: sendMessage,
    getSerialCOMsList: getSerialCOMsList,
    setCOMPath: setCOMPath,
    isPortOpen: isOpen,
    onOpen: onOpen,
    onError: onError,
    checkDarkMode: checkDarkMode
  };
})

var isDarkMode = false;
// Send request...
isDarkMode = ipcRenderer.sendSync('isDarkMode', "gimme");

function checkDarkMode() {
  return isDarkMode;
}

function isOpen() {
  return (port != null && port.isOpen);
}

function onOpen() {
  console.log(comPath + " port opened!");
}

function onError(message) {
  console.error(message);
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
    window.Bridge.onError("Tried to send message but port wasn't open!");
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

      port.open(function (err) {
        if (err) {
          return window.Bridge.onError('Ein Fehler trat beim öffnen des seriellen Ports auf.', err.message)
        }
      });

      updateEvents();
    } else {
      window.Bridge.onError("Tried to open port but comPath isn't even set!");
    }
  } else {
    window.Bridge.onError("Port is already open!");
  }
}