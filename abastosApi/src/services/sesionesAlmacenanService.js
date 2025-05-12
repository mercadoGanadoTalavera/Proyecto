const SesionAlmacenanTipo = require("../database/models/SesionAlmacenanTipo");
const Tipo = require("../database/models/Tipo");

// Obtener tipos almacenados en una sesión
const getTiposBySesion = async (id_sesion) => {
    return await SesionAlmacenanTipo.findAll({
        where: { id_sesion },
        include: [{ model: Tipo, attributes: ["nombre", "descripcion"] }]
    });
};

// Añadir tipo a sesión
const almacenarTipoEnSesion = async ({ id_tipo, id_sesion, comentario }) => {
    return await SesionAlmacenanTipo.create({ id_tipo, id_sesion, comentario });
};

// Eliminar tipo de sesión
const eliminarTipoDeSesion = async (id_sesion, id_tipo) => {
    const deleted = await SesionAlmacenanTipo.destroy({ where: { id_sesion, id_tipo } });
    return deleted ? "Tipo eliminado de la sesión correctamente" : "No se encontró la relación";
};

module.exports = {
    getTiposBySesion,
    almacenarTipoEnSesion,
    eliminarTipoDeSesion
};
