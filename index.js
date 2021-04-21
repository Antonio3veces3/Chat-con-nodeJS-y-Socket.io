var app= require('express')();
var http= require('http').Server(app);
var io= require('socket.io')(http);
app.get('/',(req,res)=>{ //funcion que redirecciona localhost a chat.html
    res.sendFile(__dirname+'/chat.html');
});

io.on('connection',(socket)=>{ //crea la conexion del usuario
    console.log('Se ha conectado un usuario');

    var username;
    socket.on('crearUser',(data)=>{ //crea un usuario
        username= data;
    });

    socket.on('msjNuevo', (data)=>{ //crea el nuevo mensaje
        socket.emit('mensaje',{
           usuario: username,
           mensaje: data 
        })
    })
});

http.listen(3000,()=>{ //arranca el servidor
    console.log("Escuchando server en puerto 3000");
})