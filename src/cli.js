const cli = require('vorpal')();
const chalk = cli.chalk;
const config = require('./util/config');

const cliConfig = {
  delimiter: config.get('cli.delimiter'),
  commands: [
    [
      'checkin <roomId> <name> [isSwap]',
      'Checkin a guest with specific guest name.\n  ' +
      'isSwap: true|false (default: false)\n  ' +
      'ex) checkin 2201 "Mrs. Pearl Brooks"\n  ' +
      'ex) checkin 2201 "Mrs. Pearl Brooks" true',
      require('./command/checkin'),
    ],
    [
      'checkin2 <roomId> <name> <lang_nationality> <email> <checkout_date> [phone]',
      'Checkin a guest with name, language & nationality code, email, expected checkout date, phone. \n  ' +
      'ex) checkin2 2201 "Mrs. Pearl Brooks" en_US lge123@lge.com 20220808\n  ' +
      'ex) checkin2 2201 "Mrs. Pearl Brooks" de_DE lge123@lge.com 20220808 010-1234-5678\n  ',
      require('./command/checkin'),
    ],
    [
      'checkout <roomId> [isSwap]',
      'Checkout a guest in the room.\n  ' +
      'isSwap: true|false (default: false)\n  ' +
      'ex) checkout 2201\n  ' +
      'ex) checkout 2201 true',
      require('./command/checkout'),
    ],
    [
      'room [roomId]',
      'Get room list or specific rooms\'s detail.\n  ' +
      'ex) room\n  ' +
      'ex) room 2201',
      require('./command/room'),
    ],
    [
      'folio <roomId> <account> <amount> <desc>',
      'Add a folio item to the room.\n  ' +
      'ex) folio 2201 2201-1 10.99 "TV SHOW"',
      require('./command/folio'),
    ],
    [
      'message <roomId> <text>',
      'Send a message to the room.\n  ' +
      'text: message text \n  ' +
      'ex) message 2201 "Hello, Guest"',
      require('./command/message'),
    ],
    [
      'pms [status]',
      'Set PMS interface(link) status.\n  ' +
      'status: up|down',
      require('./command/pms'),
    ],
    [
      'site [id] [name] [currency]',
      'Get or Set Site ID, name and currency of PMS.\n  ' +
      'currency: USD, KRW, ...',
      require('./command/site'),
    ],
    [
      'host [fromHost] [toHost]',
      'Get PCN and PMS host URI.\n ' +
      'fromHost: original callback host address from subscription\n ' +
      'toHost: changed callback host address to fix\n ' +
      'ex) host https://192.168.56.1:60080 https://127.0.0.1:60080',
      require('./command/host'),
    ],
    [
      'move <fromRoomId> <toRoomId>',
      'Change the room.\n  ' +
      'fromRoomId: original room id\n  '+
      'toRoomId: changed room id\n  '+
      'ex) move 201 501',
      require('./command/move'),
    ],
  ],
};

cliConfig.commands.forEach(command => {
  cli.command(command[0], command[1]).action(command[2]);
});

cli.delimiter(chalk.yellow(cliConfig.delimiter)).show();

process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;
