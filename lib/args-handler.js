var argv = require('yargs')
    .usage('Usage: dashboard -p [server-port]')
    .help('help')
    .alias('help', 'h')
    .option('port', {
          alias: 'p',
          demand: false,
          describe: 'HTTP Server Port.',
          type: 'string'
      })
    .default('port', 80)
    .example('dashboard -p 8080', 'Start the dashboard server on the specified port')
    .argv;

module.exports = argv;
