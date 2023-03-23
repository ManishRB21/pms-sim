# PMS Simulator

## Pre-requisites

- node.js >= 6.x.x
- yarn (node.js package manager)

```
$ npm intall -g yarn
```

## How to get start

#### Install dependencies and build
```
$ yarn
```

#### Start
```
$ npm run start
$ npm run cli
```

## Build
```
$ npm run build
```

## Initialize run environment
```
$ npm run init
```

## Unit Test
```
$ npm run test
```

## API
#### Start API server (debug)
```
# Start
$ npm run app
```

#### Start API server (production)
```
# Start with PM2
$ npm run start

# Stop
$ npm run stop
```

## CLI

#### Start command line tool
```
$ npm run cli
```

#### Commands:
```
checkin <roomId> <name> [isSwap]             Checkin a guest with specific name.
                                             isSwap: true/false (default: false)
                                             ex) checkin 2201 "Mrs. Pearl Brooks"
                                             ex) checkin 2201 "Mrs. Pearl Brooks" true

checkout <roomId> [isSwap]                   Checkout a guest in the room.
                                             isSwap: true/false (default: false)
                                             ex) checkout 2201
                                             ex) checkout 2201 true

room [roomId]                                Get room list or specific rooms's detail.
                                             ex) room
                                             ex) room 2201

folio <roomId> <account> <amount> <desc>     Add a folio item to the room.
                                             ex) folio 2201 2201-1 10.99 "TV SHOW"

message <roomId> <text>                      Send a message to the room.
                                             text: message text
                                             ex) message 2201 "Hello, Guest"

pms [status]                                 Set PMS interface(link) status.
                                             status: up|down

site [id] [name] [currency]                  Get or Set Site ID, name and currency of PMS.
                                             currency: USD, KRW, ...

host [target] [URI]                          Get or Set PCN and PMS host URI.
                                             target: pcn/pms
                                             URI format: "http://127.0.0.1:9888"

move <fromRoomId> <toRoomId>                 Change the room.
                                             fromRoomId: original room id
                                             toRoomId: changed room id
                                             ex) move 201 501

help [command...]                            Provides help for a given command.
exit                                         Exits application.
```
