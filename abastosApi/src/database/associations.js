const Categorias = require("./models/Categoria");
const Producto = require("./models/Producto");
const Precio = require("./models/Precio");
const Tipo = require("./models/Tipo");  

// Relación Categoría - Producto (1:N)
Categorias.hasMany(Producto, { foreignKey: 'id_categoria' });
Producto.belongsTo(Categorias, { foreignKey: 'id_categoria' });

// Relación Producto - Tipo (1:N opcional)
Tipo.hasMany(Producto, { foreignKey: 'id_tipo' });
Producto.belongsTo(Tipo, { foreignKey: 'id_tipo' });

// Relación Producto - Precio (1:N con eliminación en cascada)
Producto.hasMany(Precio, { foreignKey: 'id_producto', onDelete: 'CASCADE' });
Precio.belongsTo(Producto, { foreignKey: 'id_producto' });

module.exports = { Categorias, Producto, Precio, Tipo };
