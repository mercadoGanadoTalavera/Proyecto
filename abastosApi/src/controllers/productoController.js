const productoService = require("../services/productoService");

// Obtener todos los productos
const getAllProductos = async (req, res) => {
    try {
        const productos = await productoService.getAllProductos();
        res.status(200).json(productos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener un producto por ID
const getProductoById = async (req, res) => {
    try {
        const producto = await productoService.getProductoById(req.params.id);
        producto
            ? res.status(200).json(producto)
            : res.status(404).json({ message: "Producto no encontrado" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Crear un nuevo producto
const createProducto = async (req, res) => {
    try {
        const producto = await productoService.createProducto(req.body);
        res.status(201).json(producto);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Actualizar un producto
const updateProducto = async (req, res) => {
    try {
        const result = await productoService.updateProducto(req.params.id, req.body);
        res.status(200).json({ message: result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Eliminar un producto
const deleteProducto = async (req, res) => {
    try {
        const result = await productoService.deleteProducto(req.params.id);
        res.status(200).json({ message: result });
    } catch (error) {
        res.status(500).json({ error: error.message });
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
