
const Tipo = require("../database/models/Tipo");

// Obtener todos los tipos
const getAllTipos = async () => {
    try {
        return await Tipo.findAll({ order: [['nombre', 'ASC']] });
    } catch (error) {
        console.error("Error obteniendo tipos:", error);
        throw error;
    }
};

// Obtener un tipo por ID
const getTipoById = async (id) => {
    try {
        return await Tipo.findOne({ where: { id_tipo: id } });
    } catch (error) {
        console.error("Error obteniendo tipo:", error);
        throw error;
    }
};

// Crear un nuevo tipo
const createTipo = async (data) => {
    try {
        return await Tipo.create(data);
    } catch (error) {
        console.error("Error creando tipo:", error);
        throw error;
    }
};

// Actualizar un tipo
const updateTipo = async (id, data) => {
    try {
        const [updated] = await Tipo.update(data, { where: { id_tipo: id } });
        return updated ? "Tipo actualizado correctamente" : "Tipo no encontrado";
    } catch (error) {
        console.error("Error actualizando tipo:", error);
        throw error;
    }
};

// Eliminar un tipo
const deleteTipo = async (id) => {
    try {
        const deleted = await Tipo.destroy({ where: { id_tipo: id } });
        return deleted ? "Tipo eliminado correctamente" : "Tipo no encontrado";
    } catch (error) {
        console.error("Error eliminando tipo:", error);
        throw error;
    }
};

module.exports = {
    getAllTipos,
    getTipoById,
    createTipo,
    updateTipo,
    deleteTipo
};
