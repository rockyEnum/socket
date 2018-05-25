var http = require('http')
var express = require('express');
var fs = require('fs');
// var io = require('socket.io');
var app = express();
let util = require('util')
// app.use(express.static(__dirname)) //把当前目录作为静态服务器
app.get('/', function (req, res) {
    //访问的文件目录，并发送给客户端
    // res.sendFile(path.resove('./index.html'))
    //指定相对路径的话，需要指定root目录
    res.sendFile('./index.html', {root: __dirname})
})
var server = http.createServer(app);
var io = require('socket.io')(server);
// console.log(io)
//服务器监听客户端的请求 socket是服务器与客户端通信的对象
io.on('connection', function (socket) {
    console.log(socket.handshake.headers.origin)
    var currentRooms = [];
    //向对方发送消息
    socket.send('欢迎来到韩国信的聊天室');
    socket.emit('欢迎来到韩国信的聊天室', function () {

    })
    //监听客户端发过来的消息
    socket.on('message', function (msg) {
        console.log(socket.handshake.headers.origin)
        //todo 首先判断此用户是否在某个房间内，如果此用户在大厅，则向所有的用户发消息，如果               在某些房间内，则只向他所在的房间发消息
        console.log(msg)
        if (currentRooms.length > 0) {
            //向他所在的房间内发消息
            for (var i = 0; i < currentRooms.length; i++) {
                //通过广播的形式向所有连接到服务器的人发消息
                io.in(currentRooms[i]).emit('message', msg)
            }
        } else {
            //通过广播的形式向所有连接到服务器的人发消息
            io.emit('message', msg)
        }
        console.log(util.types.isAnyArrayBuffer(msg))
        createImg(msg)

    })
    socket.on('join', function (room) {
        //让此socket键入该房间，同一个socket可以同时加入多个房间
        socket.join(room);
        var index = currentRooms.indexOf(room);
        //判断用户是否在此房间内
        if (index === -1) {
            currentRooms.push(room)
        }
        console.log(currentRooms)
    })

    socket.on('leave',function (room) {

        socket.leave(room)
        currentRooms = currentRooms.filter(function (r) {
            return r !=room;
        })
    })
    // socket.join('chat');//进入chat房间
    // socket.leave('chat');//离开chat房间
})
const createImg = function(data){
  let path = './img/1.png'
  fs.writeFile(path,data,(error)=>{
    console.log(error)
  })
}
server.listen(9090,()=>{
    console.log('9090 port 开启成功')
})