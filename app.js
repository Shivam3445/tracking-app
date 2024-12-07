const express = require('express');
const app = express()
const path = require("path")
//socktio basic starting code
const http = require("http")
const socketio = require('socket.io')//socketio run on http server

const server = http.createServer(app);
const io = socketio(server);
//end of basic code
app.set("view engine","ejs");
app.use(express.static(path.join(__dirname,"public")));

io.on("connection", function(socket){
    socket.on("send-location",function(data){
        io.emit("receive-location", {id:socket.id, ...data})
    })
    socket.on("disconnect",function(){
        io.emit("user-disconnected",socket.id)
    })
    console.log("connected:");
})

app.get('/',function(req,res){
    res.render("index")
})

server.listen(3000)