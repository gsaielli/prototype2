// Per farlo andare sulla porta 80
// sudo apt-get install libcap2-bin 
// sudo setcap cap_net_bind_service=+ep `readlink -f \`which node\`` 

console.log(`.env.${process.env.NODE_ENV}`)
//console.log (process.env)

require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` })
const app = require('express')()
const http = require('http').Server(app)
const io = require('socket.io')(http, { cors: { origin: "*", methods: ["GET", "POST"] } })
const fs = require('fs')
// const ip = require('./ip')
// const dataJson = require('./data.json')
// const configJson = require('./config.json')
// const stateMachineAPI = require('./stateMachineAPI')
const modbus = require('./modbus')

const port = process.env.PORT || 3000

app.all('*', (req, res) => {
  res.sendFile(__dirname + req.url)
})

// let testdev1 = false
// let testdev2 = false
// let testpump = false
// let testdosi = false
// let testalar = false

// stateMachineAPI.event.on('data', function (data) {
//   io.emit('data', data)
// })
// stateMachineAPI.event.on('progress', function (data) {
//   io.emit('progress', data)
// })
// stateMachineAPI.event.on('sysStatus', function (data) {
//   io.emit('sysStatus', data)
// })

// io.on('connection', (socket) => {
//   console.log('CONNECTION')

//   socket.on('MBWrite', data => {
//     stateMachineAPI.addCmd(data)
//   })
//   socket.on('send', event => {
//     stateMachineAPI.send(event)
//   })
//   socket.on('phaseEnd', () => {
//     stateMachineAPI.phaseEnd()
//   })
//   socket.on('phaseAdvance', () => {
//     stateMachineAPI.phaseAdvance()
//   })
//   socket.on('startWashMachine', () => {
//     stateMachineAPI.startWashMachine()
//   })
//   socket.on('countUpdate', val => {
//     stateMachineAPI.countUpdate(val)
//   })
//   socket.on('tresholdUpdate', val => {
//     stateMachineAPI.tresholdUpdate(val)
//   })
//   socket.on('startSimulation', () => {
//     stateMachineAPI.startSimulation()
//   })

//   socket.on('getConfig', _ => {
//     if (!rodirect.isDemo())
//       rodirect.write('SendJSONConfig')
//     else
//       io.emit('data', JSON.stringify(configJson))
//   })
//   socket.on('save', name => {
//     rodirect.write(name)
//   })
//   socket.on('startupInit', _ => {
//     rodirect.write('startup1000001')
//   })
//   socket.on('startupEnd', _ => {
//     rodirect.write('startup1000000')
//   })
//   socket.on('sequenz', i => {
//     rodirect.write(`sequenz${i}000001`)
//   })
//   socket.on('startupMode', mode => {
//     let i
//     switch (mode) {
//       case 'testdev100000':
//         testdev1 = !testdev1
//         i = testdev1
//         break
//       case 'testdev200000':
//         testdev2 = !testdev2
//         i = testdev2
//         break
//       case 'testpump00000':
//         testpump = !testpump
//         i = testpump
//         break
//       case 'testdosi00000':
//         testdosi = !testdosi
//         i = testdosi
//         break
//       case 'testalar00000':
//         testalar = !testalar
//         i = testalar
//         break
//       default:
//         break
//     }
//     rodirect.write(mode + (i ? 1 : 0))
//   })

//   socket.on('writeLog', data => {
//     fs.writeFileSync(`${__dirname}/data.json`, data)
//   })
//   socket.on('readLog', _ => {
//     const data = fs.readFileSync(`${__dirname}/data.json`, 'utf8')
//     socket.emit('readLog', data)
//   })
//   socket.on('writeConfig', data => {
//     if (data.length === 1236) {
//       fs.writeFileSync(`${__dirname}/config.json`, data)
//     }
//   })
//   socket.on('readModel', _ => {
//     const data = fs.readFileSync(`${__dirname}/model.json`, 'utf8')
//     socket.emit('readModel', data)
//   })
//   socket.on('writeModel', model => {
//     fs.writeFileSync(`${__dirname}/model.json`, model)
//   })
//   socket.on('setDHCP', hn => {
//     ip.setDHCP()
//   })
//   socket.on('setIP', data => {
//     ip.setStatic(data)
//   })
//   socket.on('getIPConfig', () => {
//     ip.getIpConfig(function (ipConfig) { io.emit('ipConfig', ipConfig) })
//   })
// })

http.listen(port, () => {
  console.log(`Socket.IO server running at port: ${port}`)
})

// const rodirect = require('./rodirect')
// rodirect.init(io)

modbus.connect()

// modbus.event.on('data', function (data) {
//     eventEmitter.emit('data', data)
// })

modbus.addCmd('RESET')
modbus.addCmd([66, 1])


