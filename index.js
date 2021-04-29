var app= require('express')();
var http= require('http').Server(app);
var io= require('socket.io')(http);
const { connect } = require('http2');
var mysql= require('mysql'); 

var conn= mysql.createConnection({ //crear conexion con mysql
    host: 'localhost',
    database: 'chat',
    user: 'root',
    password: ''
})

conn.connect((err)=>{
    if(err)
    throw err;
    else
    console.log('Conexion exitosa');
})

app.get('/',(req,res)=>{ //funcion que redirecciona localhost a chat.html
    res.sendFile(__dirname+'/chat.html');
});

io.on('connection',(socket)=>{ //crea la conexion del usuario
    console.log('Se ha conectado un usuario');

    var username;
    socket.on('crearUser',(data)=>{ //crea un usuario
        username= data;
        conn.query('INSERT INTO usuarios(nombre_usuario,fecha) VALUES ("'+username+'", CURDATE())'); 
    });

    socket.on('msjNuevo', (data)=>{ //crea el nuevo mensaje
        socket.broadcast.emit('mensaje',{
            usuario: username,
            mensaje: data 
        });
        socket.emit('mensaje',{
           usuario: username,
           mensaje: data 
        })
    })
});

http.listen(3000,()=>{ //arranca el servidor
    console.log("Escuchando server en puerto 3000");
})