const service = require("../services/sesionesAlmacenanService");

const getTiposBySesion = async (req, res) => {
    try {
        const tipos = await service.getTiposBySesion(req.params.id_sesion);
        res.status(200).json(tipos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const almacenarTipoEnSesion = async (req, res) => {
    try {
        const resultado = await service.almacenarTipoEnSesion(req.body);
        res.status(201).json(resultado);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const eliminarTipoDeSesion = async (req, res) => {
    try {
        const resultado = await service.eliminarTipoDeSesion(req.params.id_sesion, req.params.id_tipo);
        res.status(200).json({ message: resultado });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getTiposBySesion,
    almacenarTipoEnSesion,
    eliminarTipoDeSesion
};
