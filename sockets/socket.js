const { io } = require('../server/server');
const { Usuarios } = require('../classes/usuario');
const { crearMensaje } = require('../utilities/utilidades');

const usuarios = new Usuarios();

io.on('connection', (client) => {
    client.on('entrarChat', (data, callback) => {
        if (!data.nombre || !data.sala) {
            return callback({
                err: true,
                mensaje: 'el nombre y la sala son necesarios'
            })
        }

        client.join(data.sala);

        usuarios.addPersona(client.id, data.nombre, data.sala);
        client.broadcast.to(data.sala).emit('listPersonas', usuarios.getPersonasPorSala(data.sala));
        client.broadcast.to(data.sala).emit('makeMensaje', crearMensaje('admin', `${data.nombre} ha entrado a la sala`));

        callback(usuarios.getPersonasPorSala(data.sala));


    });

    client.on('makeMensaje', (data, callback) => {
        const persona = usuarios.getPersona(client.id);

        const mensaje = crearMensaje(persona.nombre, data.mensaje);
        client.broadcast.to(persona.sala).emit('makeMensaje', mensaje);

        callback(mensaje);
    });


    client.on('disconnect', () => {
        const personaBorrada = usuarios.deletePersona(client.id);

        client.broadcast.to(personaBorrada.sala).emit('makeMensaje', crearMensaje('admin', `${personaBorrada.nombre} se murio`));
        client.broadcast.to(personaBorrada.sala).emit('listPersonas', usuarios.getPersonasPorSala(personaBorrada.sala));

    });

    // mensajes privados

    client.on('messagePrivado', (data) => {
        const persona = usuarios.getPersona(cliend.id)
        client.broadcast.to(data.para).emit('messagePrivado', crearMensaje(persona.nombre, data.mensaje));
    });
});