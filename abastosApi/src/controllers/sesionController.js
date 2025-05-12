const sesionService = require("../services/sesionService");

const getSesionesPorFecha = async (req, res) => {
  try {
    const { fecha } = req.query;
    if (!fecha) return res.status(400).json({ error: "Parámetro 'fecha' requerido" });

    const sesiones = await sesionService.getSesionesPorFecha(fecha);
    res.status(200).json(sesiones);
  } catch (error) {
    console.error("Error en getSesionesPorFecha:", error);
    res.status(500).json({ error: error.message });
  }
};

const getProductosPorSesion = async (req, res) => {
  try {
    const { id_sesion } = req.params;
    const productos = await sesionService.getProductosPorSesion(id_sesion);
    res.status(200).json(productos);
  } catch (error) {
    console.error("Error en getProductosPorSesion:", error);
    res.status(500).json({ error: error.message });
  }
};

// NUEVA FUNCIÓN
const crearSesionYPrecios = async (req, res) => {
  try {
    const data = req.body;
    const resultado = await sesionService.crearSesionYPrecios(data);
    res.status(201).json(resultado);
  } catch (error) {
    console.error("Error en crearSesionYPrecios:", error);
    res.status(500).json({ error: "No se pudo guardar la sesión y precios" });
  }
};

module.exports = {
  getSesionesPorFecha,
  getProductosPorSesion,
  crearSesionYPrecios
};
