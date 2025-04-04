
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

// Crear un nuevo precio con validación
const createPrecio = async (req, res) => {
    try {
        const {
            precio_actual,
            precio_anterior,
            precio_actual_min,
            precio_actual_max,
            precio_anterior_min,
            precio_anterior_max
        } = req.body;

        // Validar que se usen solo los campos correctos según tipo_precio (esto debe hacerse mejor desde registro)
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
    createPrecio,
    updatePrecio,
    deletePrecio
};
