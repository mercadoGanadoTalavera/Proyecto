const Precio = require("../database/models/Precio");
const Producto = require("../database/models/Producto");
const Sesion = require("../database/models/Sesion");

// Obtener todos los precios con su producto y sesión
const getAllPrecios = async () => {
    try {
        return await Precio.findAll({
            include: [
                { model: Producto, attributes: ["nombre"] },
                { model: Sesion }
            ],
            order: [['id_precio', 'DESC']]
        });
    } catch (error) {
        console.error("Error obteniendo precios:", error);
        throw error;
    }
};

// Obtener un precio por ID
const getPrecioById = async (id) => {
    try {
        return await Precio.findByPk(id, {
            include: [
                { model: Producto, attributes: ["nombre"] },
                { model: Sesion }
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

// Obtener todos los precios de un producto
const getPreciosByProducto = async (id_producto) => {
    try {
        return await Precio.findAll({
            where: { id_producto },
            include: [
                { model: Sesion },
                { model: Producto, attributes: ['nombre'] }
            ],
            order: [['id_precio', 'DESC']]
        });
    } catch (error) {
        console.error("Error obteniendo precios por producto:", error);
        throw error;
    }
};

module.exports = {
    getAllPrecios,
    getPrecioById,
    getPreciosByProducto,
    createPrecio,
    updatePrecio,
    deletePrecio
};
