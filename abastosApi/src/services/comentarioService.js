const Comentario = require("../database/models/Comentario");

// Obtener todos los comentarios
const getAllComentarios = async () => {
    try {
        return await Comentario.findAll({ order: [['fecha', 'DESC']] }); // Ordenamos por fecha más reciente
    } catch (error) {
        console.error("Error obteniendo comentarios:", error);
        throw error;
    }
};

// Obtener un comentario por ID
const getComentarioById = async (id) => {
    try {
        return await Comentario.findOne({ where: { id_comentario: id } });
    } catch (error) {
        console.error("Error obteniendo comentario:", error);
        throw error;
    }
};

// Crear un nuevo comentario
const createComentario = async (data) => {
    try {
        return await Comentario.create(data);
    } catch (error) {
        console.error("Error creando comentario:", error);
        throw error;
    }
};

// Actualizar un comentario
const updateComentario = async (id, data) => {
    try {
        const [updated] = await Comentario.update(data, { where: { id_comentario: id } });
        return updated ? "Comentario actualizado correctamente" : "Comentario no encontrado";
    } catch (error) {
        console.error("Error actualizando comentario:", error);
        throw error;
    }
};

// Eliminar un comentario
const deleteComentario = async (id) => {
    try {
        const deleted = await Comentario.destroy({ where: { id_comentario: id } });
        return deleted ? "Comentario eliminado correctamente" : "Comentario no encontrado";
    } catch (error) {
        console.error("Error eliminando comentario:", error);
        throw error;
    }
};

// Exportar funciones
module.exports = {
    getAllComentarios,
    getComentarioById,
    createComentario,
    updateComentario,
    deleteComentario
};
