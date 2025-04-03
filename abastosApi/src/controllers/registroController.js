
const registroService = require("../services/registroService");

// Obtener todos los registros
const getAllRegistros = async (req, res) => {
    try {
        const registros = await registroService.getAllRegistros();
        res.status(200).json(registros);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener un registro por ID
const getRegistroById = async (req, res) => {
    try {
        const registro = await registroService.getRegistroById(req.params.id);
        registro
            ? res.status(200).json(registro)
            : res.status(404).json({ message: "Registro no encontrado" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener registros por producto
const getRegistrosByProducto = async (req, res) => {
    try {
        const registros = await registroService.getRegistrosByProducto(req.params.id);
        res.status(200).json(registros);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Crear nuevo registro
const createRegistro = async (req, res) => {
    try {
        const registro = await registroService.createRegistro(req.body);
        res.status(201).json(registro);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Eliminar un registro
const deleteRegistro = async (req, res) => {
    try {
        const result = await registroService.deleteRegistro(req.params.id);
        res.status(200).json({ message: result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getAllRegistros,
    getRegistroById,
    getRegistrosByProducto,
    createRegistro,
    deleteRegistro
};
