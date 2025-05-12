const express = require("express");
const router = express.Router();
const sesionController = require("../controllers/sesionController");

router.get("/:id_sesion/productos", sesionController.getProductosPorSesion);
router.get("/fecha", sesionController.getSesionesPorFecha);

// NUEVA RUTA PARA GUARDAR SESIÓN Y PRECIOS
router.post("/", sesionController.crearSesionYPrecios);

module.exports = router;
