const Categoria = require("../database/models/Categoria");

// Obtener todas las categorías
const getAllCategorias = async () => {
    try {
        return await Categoria.findAll({ order: [['nombre', 'ASC']] }); // Ordenamos alfabéticamente
    } catch (error) {
        console.error("Error obteniendo categorías:", error);
        throw error;
    }
};

// Obtener una categoría por ID
const getCategoriaById = async (id) => {
    try {
        return await Categoria.findOne({ where: { id_categoria: id } });
    } catch (error) {
        console.error("Error obteniendo categoría:", error);
        throw error;
    }
};

// Crear una nueva categoría
const createCategoria = async (data) => {
    try {
        return await Categoria.create(data);
    } catch (error) {
        console.error("Error creando categoría:", error);
        throw error;
    }
};

// Actualizar una categoría
const updateCategoria = async (id, data) => {
    try {
        const [updated] = await Categoria.update(data, { where: { id_categoria: id } });
        return updated ? "Categoría actualizada correctamente" : "Categoría no encontrada";
    } catch (error) {
        console.error("Error actualizando categoría:", error);
        throw error;
    }
};

// Eliminar una categoría
const deleteCategoria = async (id) => {
    try {
        const deleted = await Categoria.destroy({ where: { id_categoria: id } });
        return deleted ? "Categoría eliminada correctamente" : "Categoría no encontrada";
    } catch (error) {
        console.error("Error eliminando categoría:", error);
        throw error;
    }
};

// Exportar funciones
module.exports = {
    getAllCategorias,
    getCategoriaById,
    createCategoria,
    updateCategoria,
    deleteCategoria
};
