const precioService = require("../services/precioService");

// Obtener todos los precios
const getAllPrecios = async (req, res) => {
    try {
        const precios = await precioService.getAllPrecios();
        res.status(200).json(precios);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener un precio por ID
const getPrecioById = async (req, res) => {
    try {
        const precio = await precioService.getPrecioById(req.params.id);
        precio
            ? res.status(200).json(precio)
            : res.status(404).json({ message: "Precio no encontrado" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener precios por producto
const getPreciosByProducto = async (req, res) => {
    try {
        const precios = await precioService.getPreciosByProducto(req.params.id);
        res.status(200).json(precios);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Crear un nuevo precio
const createPrecio = async (req, res) => {
    try {
        const precio = await precioService.createPrecio(req.body);
        res.status(201).json(precio);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Actualizar un precio
const updatePrecio = async (req, res) => {
    try {
        const result = await precioService.updatePrecio(req.params.id, req.body);
        res.status(200).json({ message: result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Eliminar un precio
const deletePrecio = async (req, res) => {
    try {
        const result = await precioService.deletePrecio(req.params.id);
        res.status(200).json({ message: result });
    } catch (error) {
        res.status(500).json({ error: error.message });
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
