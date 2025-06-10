const Categoria = require("./models/Categoria");
const Producto = require("./models/Producto");
const Precio = require("./models/Precio");
const Tipo = require("./models/Tipo");
const Sesion = require("./models/Sesion");
const SesionAlmacenanTipo = require("./models/SesionAlmacenanTipo");
const NombreSecundario = require("./models/NombreSecundario");

// Categoría - Producto
Categoria.hasMany(Producto, { foreignKey: 'id_categoria' });
Producto.belongsTo(Categoria, { foreignKey: 'id_categoria' });

// Tipo - Producto
Tipo.hasMany(Producto, { foreignKey: 'id_tipo' });
Producto.belongsTo(Tipo, { foreignKey: 'id_tipo' });

/* // Categoría - Sesion
Categoria.hasMany(Sesion, { foreignKey: 'id_categoria' });
Sesion.belongsTo(Categoria, { foreignKey: 'id_categoria' }); */

// Categoría - Sesion
Categoria.hasMany(Sesion, { foreignKey: 'id_categoria' });
Sesion.belongsTo(Categoria, { foreignKey: 'id_categoria', as: 'Categoria' });


// Producto - Precio (todos los precios)
Producto.hasMany(Precio, { foreignKey: 'id_producto', as: 'Precios' });

// Producto - Precio (último precio por sesión)
Producto.hasOne(Precio, { foreignKey: 'id_producto', as: 'ultimoPrecio' });

// Precio pertenece a Producto (solo UNA vez, con alias 'Producto')
Precio.belongsTo(Producto, { foreignKey: 'id_producto', as: 'Producto' });

// Sesion - Precio
Sesion.hasMany(Precio, { foreignKey: 'id_sesion' });
Precio.belongsTo(Sesion, { foreignKey: 'id_sesion' });

// Tipo <-> Sesion (relación N:M)
Tipo.belongsToMany(Sesion, {
    through: SesionAlmacenanTipo,
    foreignKey: 'id_tipo',
    otherKey: 'id_sesion'
});
Sesion.belongsToMany(Tipo, {
    through: SesionAlmacenanTipo,
    foreignKey: 'id_sesion',
    otherKey: 'id_tipo'
});
// Un producto tiene un nombre secundario
Producto.hasOne(NombreSecundario, {
  foreignKey: "id_producto",
  as: "nombres"
});

NombreSecundario.belongsTo(Producto, {
  foreignKey: "id_producto",
});

module.exports = {
  Categoria,
  Producto,
  Precio,
  Tipo,
  Sesion,
  SesionAlmacenanTipo
};
