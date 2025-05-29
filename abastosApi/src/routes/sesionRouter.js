const express = require("express");
const router = express.Router();

const {
  getAllSesiones,
  getSesionesPorFecha,
  getProductosDeSesion,
  getComentariosPorSesion,
  crearSesionYPrecios,
  descargarPDF
} = require("../controllers/sesionController");

router.get("/", getAllSesiones); // con filtro ?categoria=
router.get("/fecha", getSesionesPorFecha);
router.get("/:id_sesion/productos", getProductosDeSesion);
router.get("/:id_sesion/comentarios", getComentariosPorSesion); // ruta para comentarios (nuevo)
router.post("/", crearSesionYPrecios);
router.get("/:id_sesion/pdf", descargarPDF);

module.exports = router;
