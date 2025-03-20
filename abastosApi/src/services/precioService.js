const Precio = require("../models/Precio");
const Producto = require("../models/Producto");

// Obtener todos los precios
const getAllPrecios = async () => {
    try {
        return await Precio.findAll({
            include: [
                { model: Producto, attributes: ["nombre"] }, // Incluye el nombre del producto
            ],
            order: [['fecha', 'DESC']]
        });
    } catch (error) {
        console.error("Error obteniendo precios:", error);
        throw error;
    }
};

// Obtener un precio por ID
const getPrecioById = async (id) => {
    try {
        return await Precio.findOne({
            where: { id_precio: id },
            include: [
                { model: Producto, attributes: ["nombre"] },
            ]
        });
    } catch (error) {
        console.error("Error obteniendo precio:", error);
        throw error;
    }
};

// Crear un nuevo precio
const createPrecio = async (data) => {
    try {
        return await Precio.create(data);
    } catch (error) {
        console.error("Error creando precio:", error);
        throw error;
    }
};

// Actualizar un precio
const updatePrecio = async (id, data) => {
    try {
        const precio = await Precio.findByPk(id);
        if (!precio) return "Precio no encontrado";

        await precio.update(data);
        return "Precio actualizado correctamente";
    } catch (error) {
        console.error("Error actualizando precio:", error);
        throw error;
    }
};

// Eliminar un precio
const deletePrecio = async (id) => {
    try {
        const deleted = await Precio.destroy({ where: { id_precio: id } });
        return deleted ? "Precio eliminado correctamente" : "Precio no encontrado";
    } catch (error) {
        console.error("Error eliminando precio:", error);
        throw error;
    }
};

// Exportar funciones
module.exports = {
    getAllPrecios,
    getPrecioById,
    createPrecio,
    updatePrecio,
    deletePrecio
};
