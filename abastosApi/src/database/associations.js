const Categorias = require("./models/Categorias");
const Producto = require("./models/Producto");
const Precio = require("./models/Precio");
const Comentario = require("./models/Comentario");

// Relacion Categoria crea Producto

Categorias.hasMany(Producto, { foreignKey: 'id_categorias'});
Producto.belongsTo(Categorias, { foreignKey: 'id_categorias'});

// Relación Producto tiene Precio 1:N

Producto.hasMany(Precio, { foreignKey: 'id_Producto'});
Precio.belongsTo(Producto, { foreignKey: 'id_Producto'});

// Relación Precio tiene Comentario 1:N

Precio.hasMany(Comentario, { foreignKey: 'id_Precio', onDelete: 'CASCADE'});
Comentario.belongsTo(Precio, { foreignKey: 'id_Precio'});