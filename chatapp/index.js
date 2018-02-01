var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var sqlHelper = require('./dbhelper');

var clients = 0;
var userList = []
var messageList = []

io.on('connection', function(socket){
    console.log('a user connected');
    console.log(userList.length)
    clients++;

    updateUserList();

    io.sockets.emit('broadcast',{ description: clients + ' clients connected!'});
   
      socket.on('disconnect',function(){
        console.log('user disconnected');
        io.sockets.emit('broadcast',{ description: clients - ' clients connected!'});
      });

      socket.on('chat message', function(msg,type){
        console.log('message: ' + msg);
        console.log(socket.id)
        var message = {}
        message["message"] = msg;
        message["userId"] = socket.id
        sqlHelper.insertMessage(message, function(err,result){
          if(type == 1){
            io.emit('add message', msg);
          }
          else{
            io.emit('add message', message);
          }
     
       });
      
       
      });   

      socket.on('getUserData',function(){


        updateUserList();
       
      
      });

      socket.on("connectUser", function(clientNickname) {
        var message = "User " + clientNickname + " was connected.";
        console.log(message);
        console.log(socket.id);
       
        
        var userInfo = {};
        var foundUser = false;
        for (var i=0; i<userList.length; i++) {
          if (userList[i]["name"] == clientNickname) {
           
            foundUser = true;
         
            break;
          }
        }
  
        if (!foundUser) {
          userInfo["id"] = socket.id;
          userInfo["name"] = clientNickname;
          userInfo["isConnected"] = 1
          sqlHelper.insertObject(userInfo);
        
        
          updateUserList();
          
        }
  
        io.emit("user", userInfo);
       
    });
    
    socket.on('updateStatus',function(id,status){
      var userInfo = {};
      userInfo["id"] = id;  
      if(status == true){
        userInfo["isConnected"] = 1
      }  
      else{
        userInfo["isConnected"] = 0
      }     
     
      sqlHelper.updateObject(userInfo,function(err,result){
         if(!err){
           io.emit("status", status);
         }
         else{
          io.emit("error", "Failed to update data");
         }

      });
});

  
  });



  
  http.listen(3000, function(){
    console.log('listening on *:3000');
  });

app.get('/', function(req, res){
    res.sendFile(__dirname +'/views' + '/index.html');
});

app.get('/list',function(req,res){
  res.sendFile(__dirname +'/views' + '/index.html');
});

function updateUserList(){
  sqlHelper.getData(function(err,result){
    console.log(result);

    if(!err){
      let userList = result             
      io.emit("userList", userList);
    }
    else{
      io.emit("userList", userList);
    }

   
  });
}

function getAllMessages(){
  sqlHelper.getAllMessages(function(err,result){
    if(!err){
      messageList = result;
     
    }

});
}

     