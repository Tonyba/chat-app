var socket = io();

var params = new URLSearchParams(window.location.search);

if (!params.has('nombre') || !params.has('sala')) {
    window.location = 'index.html';
    throw new Error('el nombre y la sala son necesarios');
}

var usuario = {
    nombre: params.get('nombre'),
    sala: params.get('sala')
}

socket.on('connect', function() {
    socket.emit('entrarChat', usuario, function(resp) {
        renderizarUsuarios(resp);
    });
});

socket.on('makeMensaje', function(data) {
    renderizarMensajes(data, false);
    scrollBottom();

});

// escuchar cambios de usuarios
// cuando un usuario entra o sale
socket.on('listPersonas', function(data) {
    renderizarUsuarios(data);
});

// mensajes privados
socket.on('messagePrivado', function(mensaje) {
    console.log("mensaje privado", mensaje);
});