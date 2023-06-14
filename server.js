// Per farlo andare sulla porta 80
// sudo apt-get install libcap2-bin 
// sudo setcap cap_net_bind_service=+ep `readlink -f \`which node\`` 

console.log(`.env.${process.env.NODE_ENV}`)

require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` })
const app = require('express')()
const http = require('http').Server(app)
const io = require('socket.io')(http, { cors: { origin: "*", methods: ["GET", "POST"] } })
const fs = require('fs')
const modbus = require('./modbus')

const port = process.env.PORT || 3000

app.all('*', (req, res) => {
  res.sendFile(__dirname + req.url)
})

http.listen(port, () => {
  console.log(`Socket.IO server running at port: ${port}`)
})

modbus.connect()

modbus.event.on('data', function (data) {
  io.emit('data', data)
})

io.on('connection', (socket) => {
  console.log('CONNECTION')
  
  socket.on('start', _ => {
    modbus.addCmd([1, 10, 100, 1000])
    console.log('START')
  })
  socket.on('stop', _ => {
    modbus.addCmd('RESET')
    console.log('STOP')
  })
  socket.on('test', data => {
    console.log('TEST')
    modbus.addCmd([data.Set_Rpm1_Utensile, 
      data.Set_Rpm2_Utensile, 
      data.On_Rpm_Utensile, 
      data.Off_Rpm_Utensile, 
      data.Tempo_Rpm_Utensile])
  })

})