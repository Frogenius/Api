const mysql = require("mysql2");

const express = require('express');
const router = express.Router();



router.get('/', (request, response) => {
    response.send({
        message: 'Node.js and Express REST API'
    });
});

router.get('/users', (request, response) => {
    //const mysql = require("mysql2");
    const connection = mysql.createConnection({
      host: "localhost",
      port: "3303",
      user: "node",
      database: "expapi",
      password: "111111"
    });
    connection.execute("SELECT * FROM users",
  function(err, results, fields) {
    console.log(err);
    response.send(results); // собственно данные
    //console.log(fields); // мета-данные полей 
});
connection.end();

  console.log("Подключение закрыто");
});


router.post('/check', (request, response) => {  //проверка пароля сощтветствие логину
    
    let userName=request.body.name+""; //перевод в строку (вместо toString)
    let userPass=request.body.pass+"";
    var flag=true;

    if (userName.indexOf("'")>=0 || userName.indexOf(";")>=0 || userName.length==0){
        flag=false;
        response.send(flag);        
        return;        
    }
  
    if (userPass.indexOf("'")>=0 || userPass.indexOf(";")>=0 || userPass.length==0){
        flag=false;
        response.send(flag);        
        return;
    }
    if(flag){
        //const mysql = require("mysql2");    
        const connection = mysql.createConnection({  //подключение к базе
        host: "localhost",
        port: "3303",
        user: "node",
        database: "expapi",
        password: "111111"
        });
            
        const sqlSel = "SELECT count(*) as cc FROM users WHERE name='"+userName+"' and pass= '"+userPass+"' ";
        //
        try{ //проверка на ошибку
            connection.execute (sqlSel,function(err, results){ //выполняем селект
                var cc=results[0].cc;
                console.log("Данные CC:"+cc);
                
                if(cc>0){
                    response.send(flag);       
                }else{
                    flag=false;
                    response.send(flag);        
                }

            });
        }catch( Exeptions   ){
            console.log("Exeption DB: "+Exeptions);
        }finally{
            connection.end;

        }

    }    
});



router.post('/ins_user', (request, response) => {  //завеление нового пользователя
    if(!request.body) return response.sendStatus(400);
    //console.log(request.body);
    //console.log(`${request.body.userName} - 
    //${request.body.userPhone} -
    //${request.body.userEMail} -
    //${request.body.userPassword} -
    //${request.body.userRePassword} -
    //`);


//

let teststring=request.body.userName+""; // проверка на правильность поля(sql инъекция)
if (teststring.indexOf("'")>=0 || teststring.indexOf(";")>=0 || teststring.length==0){
    response.send("ВВедите корректное имя");
    return;
}
teststring=request.body.userPhone+""; 
if (teststring.indexOf("'")>=0 || teststring.indexOf(";")>=0 || teststring.length==0){
    response.send("ВВедите корректный телефон");
    return;
}
teststring=request.body.userEMail+""; 
if (teststring.indexOf("'")>=0 || teststring.indexOf(";")>=0 || teststring.length==0){
    response.send("ВВедите корректный mail");
    return;
}
teststring=request.body.userPassword+""; 
if (teststring.indexOf("'")>=0 || teststring.indexOf(";")>=0 || teststring.length==0){
    response.send("ВВедите корректный Password");
    return;
}

let repassword = request.body.userRePassword+"";
if (repassword.indexOf("'")>=0 || repassword.indexOf(";")>=0 || repassword.length==0){
    response.send("ВВедите корректный rePassword");
    return;
}



//сравнить пароли - если не похожи надо вывести ошибку
if (!(teststring == repassword) ){
    response.send("ваши пароли разлтчаются");
    return;
}else{
    console.log("ваши пароли НЕ разлтчаются");
   
}

 
    const connection = mysql.createConnection({
      host: "localhost",
      port: "3303",
      user: "node",
      database: "expapi",
      password: "111111"
    });
    
    //запрос на повторяющиеся записи 
    const sqlSel = "SELECT count(*) as cc FROM users WHERE name='"+request.body.userName+"' ";
    //

    connection.execute (sqlSel,function(err, results){  //execute запуск выборки select sql
    var cc=results[0].cc; //вытаскиваем результат
    console.log("Данные CC:"+cc);

    if(cc>0){  //если данные сузествуют
        console.log("Данные CC>0: "+cc);

        response.send("пользователь зарегистрирован");
        return;
    }else{ //если записи нет , то добавим 
        const user = [request.body.userName, request.body.userPhone, request.body.userEMail, request.body.userPassword ];

        const sql = "INSERT INTO users(name, phone, mail, pass) VALUES(?, ?, ?, ?)";
    
        connection.query(sql, user, function(err, results) {
            if(err) console.log(err);
            else console.log("Данные добавлены");
        });
        response.send("Данные добавлены");
    }

    });


    connection.end; //закрываем конбекцию


});

router.get('/register', (request, response) => { //вызов html страницы, 2 вариант сделать через постман
    const http = require("http");
    const fs = require("fs");

    const filePath = "register.html";
    // смотрим, есть ли такой файл
    fs.access(filePath, fs.constants.R_OK, err => {
        // если произошла ошибка - отправляем статусный код 404
        if(err){
            response.statusCode = 404;
            response.end("Resourse register.html not found!");
        }
        else{
            fs.createReadStream(filePath).pipe(response);
        }
      });

});

router.post('/user', (request, response) => {
    

 const userIndex = request.query.userid
 console.log("Данные request:"+userIndex);

 if (userIndex === -1) return res.status(404).json({})

 if (userIndex.indexOf("'")>=0 || userIndex.indexOf(";")>=0 || userIndex.length==0){
    response.send("ВВедите корректное userIndex");
    return;
}


const connection = mysql.createConnection({
    host: "localhost",
    port: "3303",
    user: "node",
    database: "expapi",
    password: "111111"
  });
  

const sqlSel = "DELETE FROM users WHERE iduser='"+userIndex+"'  ";
        //
    try{ //проверка на ошибку           
           connection.execute (sqlSel,function(err, results){ //выполняем селект
           if(err) console.log(err);
           else console.log("Данные удалены");
           
        });
    }catch( Exeptions   ){
        console.log("Exeption DB: "+Exeptions);
    }finally{
        connection.end;

    }

//console.log("Данные userIndex:"+userIndex);


response.send("Данные удалены");
 //users.splice(userIndex, 1)
 //res.json(users)
})
// Export the router
module.exports = router;