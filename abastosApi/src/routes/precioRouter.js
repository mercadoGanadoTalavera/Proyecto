const precioRouter = require("express").Router();
const precio = require("../controllers/precioController");

precioRouter.get("/all", precio.getAllprecios);
precioRouter.get("/:id", precio.getUnprecio);
precioRouter.get("/producto/:id", precio.getPreciosByProducto);
precioRouter.post("/create", precio.createprecio);
precioRouter.put("/modify/:id", precio.updateprecio);
precioRouter.delete("/delete/:id", precio.deleteprecio);

module.exports = precioRouter;