const events = require('events')
const eventEmitter = new events.EventEmitter()
const ModbusRTU = require('modbus-serial')
let model = require('./model.json')

let timeoutRunRef = null
let timeoutRate = 200
let timeoutConnectRef = null
const writeOps = []
const networkErrors = [
    'ESOCKETTIMEDOUT',
    'ETIMEDOUT',
    'ECONNRESET',
    'ECONNREFUSED',
    'EHOSTUNREACH',
    'ENETRESET',
    'ECONNABORTED',
    'ENETUNREACH',
    'ENOTCONN',
    'ESHUTDOWN',
    'EHOSTDOWN',
    'ENETDOWN',
    'EWOULDBLOCK',
    'EAGAIN'
]

let client = new ModbusRTU()

// check error, and reconnect if needed
function checkError (e) {
    if (e.errno && networkErrors.includes(e.errno)) {
        console.log('Reconnect')

        // close port
        client.close()

        // re open client
        client = new ModbusRTU()
        timeoutConnectRef = setTimeout(connect, timeoutRate)
    }
}

console.log('Connect to IP ' + model.mbHost + ' at port ' + model.mbPort)

// open connection
function connect () {
    //io = socket
    // clear pending timeouts
    clearTimeout(timeoutConnectRef)

    // if client already open, just run
    if (client.isOpen) {
        run()
    }

    // if client closed, open a new connection
    client.connectTCP(model.mbHost, { port: model.mbPort })
        .then(setClient)
        .then(function () {
            console.log('Connected')
        })
        .catch(function (e) {
            checkError(e)
            console.log(e.message)
        })
}

function setClient () {
    // set the client's unit id
    // set a timout for requests default is null (no timeout)
    client.setID(1)
    client.setTimeout(1000)

    run()
}

function run () {
    // clear pending timeouts
    clearTimeout(timeoutRunRef)
    if (writeOps.length > 0) {
        const dataToWrite = writeOps.shift()
        console.log('CMD: ', dataToWrite)
        if (dataToWrite === 'RESET')
            client.writeRegisters(0, Array.from({ length: 99 }, (_, i) => 0))
                .then(function (d) {
                    console.log('OK writeRegisters 1: 0 to ALL input registers', d)
                })
                .then(function () {
                    timeoutRunRef = setTimeout(run, timeoutRate)
                })
                .catch(function (e) {
                    checkError(e)
                    console.log('ERROR in writeRegisters 1: ', e.message)
                })
        else if (dataToWrite === 'RESET_PHASES') {
            client.writeRegisters(60, Array.from({ length: 18 }, (_, i) => 0))
                .then(function (d) {
                    console.log('OK writeRegisters 2: 0 to 60->77 input registers', d)
                })
                .then(function () {
                    timeoutRunRef = setTimeout(run, timeoutRate)
                })
                .catch(function (e) {
                    checkError(e)
                    console.log('ERROR in writeRegisters 2: ', e.message)
                })
        }
        else
            if (dataToWrite.length === 2)
                client.writeRegisters(dataToWrite[0], [dataToWrite[1]])
                    .then(function (d) {
                        console.log('OK writeRegisters 3: ', d)
                    })
                    .then(function () {
                        timeoutRunRef = setTimeout(run, timeoutRate)
                    })
                    .catch(function (e) {
                        checkError(e)
                        console.log('ERROR in writeRegisters 3: ', e.message)
                    })
            else
                client.writeRegisters(60, dataToWrite)
                    .then(function (d) {
                        console.log('OK writeRegisters 4: ', d)
                    })
                    .then(function () {
                        timeoutRunRef = setTimeout(run, timeoutRate)
                    })
                    .catch(function (e) {
                        checkError(e)
                        console.log('ERROR in writeRegisters 4: ', e.message)
                    })
    }
    else {
        client.readHoldingRegisters(0, 100) //leggo tutti i registri
            .then(function (data) {
                console.log(data)
            })
            .then(function () {
                process.exit(0)
                //timeoutRunRef = setTimeout(run, timeoutRate)
            })
            .catch(function (e) {
                checkError(e)
                console.log('ERROR in readHoldingRegisters 1: ', e.message)
            })
    }
}

function addCmd (cmd) {
    writeOps.push(cmd)
}

module.exports = {
    connect: connect,
    addCmd: addCmd,
    // event: eventEmitter 
}
