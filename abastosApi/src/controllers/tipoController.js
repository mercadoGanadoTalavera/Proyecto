const tipoService = require("../services/tipoService");

// Obtener todos los tipos
const getAllTipos = async (req, res) => {
    try {
        const tipos = await tipoService.getAllTipos();
        res.status(200).json(tipos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener un tipo por ID
const getTipoById = async (req, res) => {
    try {
        const tipo = await tipoService.getTipoById(req.params.id);
        tipo
            ? res.status(200).json(tipo)
            : res.status(404).json({ message: "Tipo no encontrado" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Crear un nuevo tipo
const createTipo = async (req, res) => {
    try {
        const tipo = await tipoService.createTipo(req.body);
        res.status(201).json(tipo);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Actualizar un tipo
const updateTipo = async (req, res) => {
    try {
        const result = await tipoService.updateTipo(req.params.id, req.body);
        res.status(200).json({ message: result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Eliminar un tipo
const deleteTipo = async (req, res) => {
    try {
        const result = await tipoService.deleteTipo(req.params.id);
        res.status(200).json({ message: result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Exportar funciones
module.exports = {
    getAllTipos,
    getTipoById,
    createTipo,
    updateTipo,
    deleteTipo
};
