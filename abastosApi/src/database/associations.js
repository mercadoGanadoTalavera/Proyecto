
const Categoria = require("./models/Categoria");
const Producto = require("./models/Producto");
const Precio = require("./models/Precio");
const Tipo = require("./models/Tipo");
const Registro = require("./models/Registro");

// Categoría - Producto
Categoria.hasMany(Producto, { foreignKey: 'id_categoria' });
Producto.belongsTo(Categoria, { foreignKey: 'id_categoria' });

// Tipo - Producto
Tipo.hasMany(Producto, { foreignKey: 'id_tipo' });
Producto.belongsTo(Tipo, { foreignKey: 'id_tipo' });

// Producto - Registro
Producto.hasMany(Registro, { foreignKey: 'id_producto' });
Registro.belongsTo(Producto, { foreignKey: 'id_producto' });

// Precio - Registro
Precio.hasMany(Registro, { foreignKey: 'id_precio' });
Registro.belongsTo(Precio, { foreignKey: 'id_precio' });

module.exports = { Categoria, Producto, Precio, Tipo, Registro };
