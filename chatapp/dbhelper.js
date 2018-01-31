var mysql = require('mysql');



var con = mysql.createConnection({
                                 host: "localhost",
                                 user: "root",
                                 password: "swarupa123"
                                 });

con.connect(function(err) {
            if (err) throw err;
            console.log("Connected!");
            
            
            con.query("use Chat");
         
            });

function getData(callback){
    con.query('select * from Chat.User', function (err, result) {
              if (err) throw err;
              console.log("Result: " + result);
              callback(err,result);
              });
}

function insert(name,callback){
    var sql = 'INSERT INTO Chat.User (Name) VALUES ("' + name +'")';
    console.log(sql);
    con.query(sql, function (err, result) {
              if (err) throw err;
              callback(err,result)
              });
}


function insertObject(object){
    var sql = 'INSERT INTO Chat.User set ?';
    console.log(sql);
    con.query(sql,object, function (err, result) {
              if (err) throw err;
             // callback(err,result)
              });
}

function insertMessage(object,callback){
    var sql = 'INSERT INTO Chat.Message set ?';
    console.log(sql);
    con.query(sql,object, function (err, result) {
              if (err) throw err;
                 callback(err,result)
              });
}

function getAllMessages(callback){
    con.query('select * from Chat.Message', function (err, result) {
              if (err) throw err;
              console.log("Result: " + result);
              callback(err,result);
              });
}

function updateObject(object,callback){
    var sql = 'UPDATE user SET isConnected = ? WHERE id = ?'
    con.query(sql,[object["isConnected"],object["id"]],function(err,result){

        if (err) throw err;
        callback(err,result);
    });
    
}

module.exports = {
insert:insert,
insertObject:insertObject,
getData:getData,
updateObject:updateObject,
insertMessage:insertMessage,
getAllMessages:getAllMessages
}
