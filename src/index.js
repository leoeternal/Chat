var path=require("path");
var http=require("http");
var express=require("express");
var socketio=require("socket.io");
var Filter=require("bad-words");
var allmessages=require("./utils/messages");
var roommanaging=require("./utils/users");

var app=express();
var server=http.createServer(app); 
var io=socketio(server);

var publicDirectoryPath=path.join(__dirname,"../public");
app.use(express.static(publicDirectoryPath));

io.on("connection",function(socket)
{
    console.log("Welcome to chat app");
   
   
   socket.on("join",function(query) {
       roommanaging.addUser({
           id:socket.id,
           username:query.username,
           room:query.room
       });

       socket.join(query.room);
       socket.emit("message",allmessages.generateMessage("Admin","Welcome"));
   
   socket.broadcast.to(query.room).emit("message",allmessages.generateMessage(query.username+" has joined in"));
    io.to(query.room).emit("roomData",{
           room:query.room,
           users:roommanaging.getUsersInRoom(query.room)
       });
   
   })
   
   
   socket.on("messagefromclient",function(message,callback)
   {
       var filter=new Filter();
       if(filter.isProfane(message))
       {
           return callback("Profanity is not allowed");
       }
       var user=roommanaging.getUser(socket.id);
       
       io.to(user.room).emit("message",allmessages.generateMessage(user.username,message));
       callback();
   })
   
   socket.on("sendLocation",function(coords,callback) {
       var user=roommanaging.getUser(socket.id);
       io.to(user.room).emit("locationMessage",allmessages.generateLocationMessage(user.username,"https://google.com/maps?q="+coords.latitude+","+coords.longitude));
       callback();
   })
   
   socket.on("disconnect",function(){
       var user=roommanaging.removeUser(socket.id);
       if(user)
       {
       io.to(user.room).emit("message",allmessages.generateMessage(user.username+" has left"));    
       io.to(user.room).emit("roomData",{
           room:user.room,
           users:roommanaging.getUsersInRoom(user.room)
       });
       }
       
   })
})

server.listen(process.env.PORT,process.env.IP,function()
{
    console.log("Server has started");
})