const apirouter = require("express").Router();
const middleware = require("./middleware");

const categoriaRouter = require("./categoriaRouter");
const precioRouter = require("./precioRouter");
const productoRouter = require("./productoRouter");
const tipoRouter = require("./tipoRouter");
const sesionRouter = require("./sesionRouter"); 
const almacenRouter = require("./almacenRouter");

apirouter.use("/categorias", categoriaRouter);
apirouter.use("/precios", precioRouter);
apirouter.use("/productos", productoRouter);
apirouter.use("/tipos", tipoRouter);
apirouter.use("/sesiones", sesionRouter);
apirouter.use("/almacenes", almacenRouter); 

module.exports = apirouter;



/* 
USO DE CHECKTOKEN
apirouter.use("/categorias", middleware.checkToken, categoriaRouter);
apirouter.use("/precios", middleware.checkToken, precioRouter);
apirouter.use("/productoes", middleware.checkToken, productoRouter);
apirouter.use("/tipos", middleware.checkToken, tipoRouter);
apirouter.use("/registros", middleware.checkToken, registroRouter);
 */
module.exports = apirouter;