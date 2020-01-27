// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
window.addEventListener('DOMContentLoaded', () => {
  const SerialPort = require('serialport');
  // the serialPort will return promise so we are using then
  SerialPort.list().then(function (data) {
      console.log(data);
  });
})
