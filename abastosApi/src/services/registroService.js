
const Registro = require("../database/models/Registro");
const Producto = require("../database/models/Producto");
const Precio = require("../database/models/Precio");

// Obtener todos los registros
const getAllRegistros = async () => {
    try {
        return await Registro.findAll({
            include: [
                { model: Producto, attributes: ['nombre'] },
                { model: Precio }
            ],
            order: [['fecha', 'DESC']]
        });
    } catch (error) {
        console.error("Error obteniendo registros:", error);
        throw error;
    }
};

// Obtener registros por producto
const getRegistrosByProducto = async (id_producto) => {
    try {
        return await Registro.findAll({
            where: { id_producto },
            include: [{ model: Precio }],
            order: [['fecha', 'DESC']]
        });
    } catch (error) {
        console.error("Error obteniendo registros del producto:", error);
        throw error;
    }
};

// Obtener un registro por ID
const getRegistroById = async (id) => {
    try {
        return await Registro.findByPk(id, {
            include: [
                { model: Producto },
                { model: Precio }
            ]
        });
    } catch (error) {
        console.error("Error obteniendo registro:", error);
        throw error;
    }
};

// Crear un nuevo registro
const createRegistro = async (data) => {
    try {
        return await Registro.create(data);
    } catch (error) {
        console.error("Error creando registro:", error);
        throw error;
    }
};

// Eliminar un registro
const deleteRegistro = async (id) => {
    try {
        const deleted = await Registro.destroy({ where: { id_registro: id } });
        return deleted ? "Registro eliminado correctamente" : "Registro no encontrado";
    } catch (error) {
        console.error("Error eliminando registro:", error);
        throw error;
    }
};

module.exports = {
    getAllRegistros,
    getRegistrosByProducto,
    getRegistroById,
    createRegistro,
    deleteRegistro
};
