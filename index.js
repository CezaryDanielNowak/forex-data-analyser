
const express = require('express');
const app = express();
const initAPI = require('./api.js');
const responseTime = require('response-time');
const config = require('./config');
const cors = require('cors');

var corsOptionsDelegate = function (req, callback) {
  const origin = req.header('Origin') || req.header('origin');
  var corsOptions = {
    origin: config.CORS_WHITELIST.includes(origin)
  };

  callback(null, corsOptions)
}

app.use(cors(corsOptionsDelegate));

initAPI({
  app,
});

app.use(express.static(config.ASSETS_DIR, {
  dotfiles: 'ignore',
  maxAge: '8h',
}));

app.listen(config.SERVER_PORT, () => {
  const printAddr = (addr) => `http${config.HTTPS ? 's' : ''}://${addr}:${config.SERVER_PORT}`;

  let serverStartedMsg = `-------------------\nAPI STARTED`;

  serverStartedMsg += '\nDetected network address:';
  getLocalIpAddresses().forEach((addr) => {
    serverStartedMsg += `\n${printAddr(addr)}`;
  });
  console.log(serverStartedMsg);
});


function getLocalIpAddresses() {
	const os = require('os');
  const netInterfaces = os.networkInterfaces();
  const addresses = [];
  Object.keys(netInterfaces).forEach((netInterface) => {
    // omit virtual interfaces.
    if (netInterface.includes('VMware') || netInterface.includes('vboxnet')) return;

    netInterfaces[netInterface].forEach((netAddrObj) => {
      if (netAddrObj.family === 'IPv4') {
        addresses.push(netAddrObj.address);
      }
    });
  });
  return addresses;
}

