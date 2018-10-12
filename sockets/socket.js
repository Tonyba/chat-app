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

        const personas = usuarios.addPersona(client.id, data.nombre, data.sala);
        client.broadcast.to(data.sala).emit('listPersonas', usuarios.getPersonasPorSala(data.sala));
        callback(usuarios.getPersonasPorSala(data.sala));

    });

    client.on('makeMensaje', (data) => {
        const persona = usuarios.getPersona(client.id);

        const mensaje = crearMensaje(persona.nombre, data.mensaje);
        client.broadcast.to(data.sala).emit('makeMensaje', mensaje);
    });


    client.on('disconnect', (data) => {
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