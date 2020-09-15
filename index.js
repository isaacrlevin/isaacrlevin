require('dotenv').config();
const Mustache = require('mustache');
const fetch = require('node-fetch');
const fs = require('fs');
var https = require('https');
const MUSTACHE_MAIN_DIR = './main.mustache';

let DATA = {
  refresh_date: new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    timeZoneName: 'short',
    timeZone: 'America/Los_Angeles',
  }),
};

async function getPresence() {
  https
    .get(`${process.env.PiUrl}`, response => {
      let availability = '';

      // called when a data chunk is received.
      response.on('data', chunk => {
        availability += chunk;
      });

      // called when the complete response is received.
      response.on('end', () => {
       DATA.availability= availability;
       fs.readFile(MUSTACHE_MAIN_DIR, (err, data) => {
        if (err) throw err;
        const output = Mustache.render(data.toString(), DATA);
        fs.writeFileSync('README.md', output);
      });
      });
    })
    .on('error', error => {
      console.log('Error: ' + error.message);
    });
}



async function action() {
  await getPresence();
}

action();
