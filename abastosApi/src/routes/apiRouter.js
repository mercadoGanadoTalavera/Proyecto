const apirouter = require("express").Router();
const middleware = require("./middleware");

// Variables
//const userRouter = require("./userRouter");
const categoriaRouter = require("./categoriaRouter");
const precioRouter = require("./precioRouter");
const productoRouter = require("./productoRouter");
const tipoRouter = require("./tipoRouter");


// Rutas
//POSIBLE ENTIDAD USUARIO
//apirouter.use("/usuarios", userRouter);

apirouter.use("/categorias", categoriaRouter);
apirouter.use("/precios", precioRouter);
apirouter.use("/productos", productoRouter);
apirouter.use("/tipos",tipoRouter);


/* 
USO DE CHECKTOKEN
apirouter.use("/categorias", middleware.checkToken, categoriaRouter);
apirouter.use("/precios", middleware.checkToken, precioRouter);
apirouter.use("/productoes", middleware.checkToken, productoRouter);
apirouter.use("/tipos", middleware.checkToken, tipoRouter);
 */
module.exports = apirouter;