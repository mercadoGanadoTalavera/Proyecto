const almacenRouter = require("express").Router();
const almacen = require("../controllers/sesionAlmacenanTipoController");

almacenRouter.get("/:id_sesion", almacen.getTiposBySesion);
almacenRouter.post("/create", almacen.almacenarTipoEnSesion);
almacenRouter.delete("/delete/:id_sesion/:id_tipo", almacen.eliminarTipoDeSesion);

module.exports = almacenRouter;
