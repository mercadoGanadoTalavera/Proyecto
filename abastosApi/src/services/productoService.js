const Producto = require("../models/Producto");
const Categoria = require("../models/Categoria");
const Tipo = require("../models/Tipo");

// Obtener todos los productos
const getAllProductos = async () => {
    try {
        return await Producto.findAll({
            include: [
                { model: Categoria, attributes: ["nombre"] }, // Incluye nombre de la categoría
                { model: Tipo, attributes: ["nombre"] } // Incluye nombre del tipo
            ],
            order: [['nombre', 'ASC']]
        });
    } catch (error) {
        console.error("Error obteniendo productos:", error);
        throw error;
    }
};

// Obtener un producto por ID
const getProductoById = async (id) => {
    try {
        return await Producto.findOne({
            where: { id_producto: id },
            include: [
                { model: Categoria, attributes: ["nombre"] },
                { model: Tipo, attributes: ["nombre"] }
            ]
        });
    } catch (error) {
        console.error("Error obteniendo producto:", error);
        throw error;
    }
};

// Crear un nuevo producto
const createProducto = async (data) => {
    try {
        return await Producto.create(data);
    } catch (error) {
        console.error("Error creando producto:", error);
        throw error;
    }
};

// Actualizar un producto
const updateProducto = async (id, data) => {
    try {
        const [updated] = await Producto.update(data, { where: { id_producto: id } });
        return updated ? "Producto actualizado correctamente" : "Producto no encontrado";
    } catch (error) {
        console.error("Error actualizando producto:", error);
        throw error;
    }
};

// Eliminar un producto
const deleteProducto = async (id) => {
    try {
        const deleted = await Producto.destroy({ where: { id_producto: id } });
        return deleted ? "Producto eliminado correctamente" : "Producto no encontrado";
    } catch (error) {
        console.error("Error eliminando producto:", error);
        throw error;
    }
};

// Exportar funciones
module.exports = {
    getAllProductos,
    getProductoById,
    createProducto,
    updateProducto,
    deleteProducto
};
