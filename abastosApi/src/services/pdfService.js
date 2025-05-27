const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");

const Sesion = require("../database/models/Sesion");
const Categoria = require("../database/models/Categoria");
const Producto = require("../database/models/Producto");
const Tipo = require("../database/models/Tipo");
const Precio = require("../database/models/Precio");
const SesionAlmacenanTipo = require("../database/models/SesionAlmacenanTipo");

function formatearPrecio(valor) {
  if (valor === null || valor === undefined || valor === 0 || valor === '0.00' || valor === 0.00) {
    return "S/C";
  }
  return parseFloat(valor).toFixed(2).replace(".", ",");
}


function formatearFecha(fechaStr) {
  const [a, m, d] = fechaStr.split("-");
  return `${d}/${m}/${a}`;
}



function format(contribuye, ...valores) {
  if (contribuye === false) return "S/C";

  const todosInvalidos = valores.every(v =>
    v === null || v === undefined || v === "" || isNaN(v) || parseFloat(v) === 0
  );

  if (todosInvalidos) return "S/C";

  const valor = valores.find(v =>
    v !== null && v !== undefined && v !== "" && !isNaN(v) && parseFloat(v) !== 0
  );

  return parseFloat(valor).toFixed(2).replace(".", ",");
}

function drawTableHeaders(doc) {
  const azul = "#003366";
  const ancho = [160, 70, 70, 70, 70];
  let x = 40;
  let y = doc.y;

  // Primera fila
  doc.fillColor(azul).rect(x, y, ancho.reduce((a, b) => a + b, 0), 15).fill();
  doc.fillColor("white").font("Helvetica-Bold").fontSize(8);
  doc.text("TIPOS DE CEREAL", x + 3, y + 3, { width: ancho[0], align: "left" });
  doc.text("PRECIO ANTERIOR", x + ancho[0], y + 3, { width: ancho[1] + ancho[2], align: "center" });
  doc.text("PRECIO ACTUAL", x + ancho[0] + ancho[1] + ancho[2], y + 3, { width: ancho[3] + ancho[4], align: "center" });

  // Segunda fila
  y += 15;
  doc.fillColor(azul).rect(x, y, ancho.reduce((a, b) => a + b, 0), 15).fill();
  doc.fillColor("white").font("Helvetica-Bold").fontSize(8);
  doc.text("", x, y + 3, { width: ancho[0] });
  doc.text("MIN", x + ancho[0], y + 3, { width: ancho[1], align: "center" });
  doc.text("MAX", x + ancho[0] + ancho[1], y + 3, { width: ancho[2], align: "center" });
  doc.text("MIN", x + ancho[0] + ancho[1] + ancho[2], y + 3, { width: ancho[3], align: "center" });
  doc.text("MAX", x + ancho[0] + ancho[1] + ancho[2] + ancho[3], y + 3, { width: ancho[4], align: "center" });

  doc.moveDown(2);
}

function drawRow(doc, cols) {
  const colWidths = [160, 70, 70, 70, 70];
  let x = 40;
  const y = doc.y;
  doc.font("Helvetica").fontSize(8).fillColor("black");

  for (let i = 0; i < cols.length; i++) {
    doc.rect(x, y, colWidths[i], 15).stroke();
    doc.text(cols[i], x + 3, y + 4, { width: colWidths[i] - 6, align: i === 0 ? "left" : "right" });
    x += colWidths[i];
  }

  doc.moveDown();
}

const obtenerDatosParaPDF = async (id_sesion) => {
  const sesion = await Sesion.findByPk(id_sesion, {
    include: [{ model: Categoria, attributes: ["nombre"] }]
  });

  const productos = await Producto.findAll({
    include: [
      { model: Tipo },
      {
        model: Precio,
        where: { id_sesion },
        required: true
      }
    ]
  });

  const comentarios = await SesionAlmacenanTipo.findAll({ where: { id_sesion } });

  const tiposMap = {};
  productos.forEach(p => {
    const tipo = p.Tipo?.nombre || "Sin tipo";
    if (!tiposMap[tipo]) tiposMap[tipo] = { nombre: tipo, productos: [] };
    const precio = p.Precios[0];
tiposMap[tipo].productos.push({
  nombre: p.nombre,
  contribuye: precio.contribuye,
  anterior_min: format(precio.contribuye, precio.precio_anterior_min ?? precio.precio_anterior),
  anterior_max: format(precio.contribuye, precio.precio_anterior_max ?? precio.precio_anterior),
  actual_min: format(precio.contribuye, precio.precio_actual_min ?? precio.precio_actual),
  actual_max: format(precio.contribuye, precio.precio_actual_max ?? precio.precio_actual)
});
  });

  comentarios.forEach(c => {
    const tipo = productos.find(p => p.id_tipo === c.id_tipo)?.Tipo?.nombre;
    if (tipo && tiposMap[tipo]) {
      tiposMap[tipo].comentario = c.comentario;
    }
  });

  return {
    fecha: sesion.fecha,
    categoria: sesion.Categorium?.nombre || "",
    tipos: Object.values(tiposMap)
  };
};

const generarPDFPorSesion = async (id_sesion) => {
  const datos = await obtenerDatosParaPDF(id_sesion);
  const nombreArchivo = `mesa_${datos.categoria}_${datos.fecha}.pdf`.replace(/\s+/g, "_");

  // << IMPORTANTE: CAMBIO AQUÍ >>
  const ruta = path.join(__dirname, "../../public/pdf", nombreArchivo);

  if (!fs.existsSync(path.dirname(ruta))) {
    fs.mkdirSync(path.dirname(ruta), { recursive: true });
  }

  const doc = new PDFDocument({ margin: 40 });
  doc.pipe(fs.createWriteStream(ruta));

  doc.fontSize(14).fillColor("#000").font("Helvetica-Bold").text("Mercado Nacional de Ganado");
  doc.font("Helvetica").fontSize(10).text("Talavera de la Reina");
  doc.text("Paseo Fernando de los Ríos, s/n · Telf: 925 721 830");
  doc.fillColor("blue").text("www.mercadoganado.talavera.es", { underline: true });
  doc.moveDown(1.5);

  doc.fillColor("black").font("Helvetica-Bold").fontSize(12);
  doc.text(`Precios Lonja de ${datos.categoria} para el día ${formatearFecha(datos.fecha)}`, { align: "center" });
  doc.font("Helvetica").fontSize(9).text(
    "Precios en origen agricultor sobre camión en Euros/Tonelada, condiciones de calidad O.C.M. Campaña 2024-2025",
    { align: "center" }
  );
  doc.moveDown();

  drawTableHeaders(doc);

  datos.tipos.forEach(t => {
    doc.moveDown(0.5);
    doc.font("Helvetica-Bold").fontSize(9).fillColor("black").text(`Tipo: ${t.nombre}`);
    doc.moveDown(0.2);

    t.productos.forEach(p => {
      drawRow(doc, [
        p.nombre,
        p.anterior_min,
        p.anterior_max,
        p.actual_min,
        p.actual_max
      ]);
    });

    if (t.comentario) {
      doc.moveDown(0.3).font("Helvetica-Oblique").fontSize(8).fillColor("gray").text(`Comentario: ${t.comentario}`);
    }
  });

  doc.end();
  return ruta;
};

module.exports = {
  generarPDFPorSesion
};