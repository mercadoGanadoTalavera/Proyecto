
const precioRouter = require("express").Router();
const precio = require("../controllers/precioController");

precioRouter.get("/all", precio.getAllPrecios);
precioRouter.get("/:id", precio.getPrecioById);
precioRouter.post("/create", precio.createPrecio);
precioRouter.put("/modify/:id", precio.updatePrecio);
precioRouter.delete("/delete/:id", precio.deletePrecio);

module.exports = precioRouter;
