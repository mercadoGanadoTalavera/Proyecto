const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");

const Sesion = require("../database/models/Sesion");
const Categoria = require("../database/models/Categoria");
const Producto = require("../database/models/Producto");
const Tipo = require("../database/models/Tipo");
const Precio = require("../database/models/Precio");
const SesionAlmacenanTipo = require("../database/models/SesionAlmacenanTipo");
const { Op } = require("sequelize");



function formatearPrecio(valor) {
  if (valor === null || valor === undefined || valor === 0 || valor === "0.00" || valor === 0.0) {
    return "S/C";
  }
  const num = parseFloat(valor);
  return isNaN(num) ? "S/C" : num.toFixed(2).replace(".", ",");
}

function formatearFecha(fechaStr) {
  const [a, m, d] = fechaStr.split("-");
  return `${d}/${m}/${a}`;
}

function limpiarNombre(str) {
  return str
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .toLowerCase();
}

const MARGIN_LEFT = 40;
const MARGIN_RIGHT = 40;
const MARGIN_TOP = 15;
const PAGE_WIDTH = 595.28;
const PAGE_HEIGHT = 841.89;

const colWidthsCereal = [170, 90, 90, 90, 90]; // Sin unidad_medida
const colWidthsOtros = [170, 70, 70, 70, 70, 60]; // Con unidad_medida
const colWidthFrutosSecos = [170, 70, 70, 70, 70, 60]; // Con unidad_medida y tres columnas en tipos


const ROW_HEIGHT = 16;
const HEADER_HEIGHT = 20;

function drawTableHeaderTop(doc, y, id_categoria) {
  const azul = "#003366";
  let x = MARGIN_LEFT;
  const isCereal = id_categoria === 1;
  const isFrutosSecos = id_categoria === 4 || id_categoria === 5; // pistachos y almendras son frutos secos
  const colWidths = isCereal ? colWidthsCereal : colWidthsOtros;
  const totalWidth = colWidths.reduce((a, b) => a + b, 0);

  doc.rect(x, y, totalWidth, HEADER_HEIGHT).fill(azul);
  doc.fillColor("white").font("Helvetica-Bold").fontSize(9);

  doc.text("TIPO", x, y + 6, { width: colWidths[0], align: "center" });
  doc.text("PRECIO ANTERIOR", x + colWidths[0], y + 6, { width: colWidths[1] + colWidths[2], align: "center" });
  doc.text("PRECIO ACTUAL", x + colWidths[0] + colWidths[1] + colWidths[2], y + 6, { width: colWidths[3] + colWidths[4], align: "center" });

  if (!isCereal) {
    doc.text("UNIDAD ", x + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3] + colWidths[4], y + 6, { width: colWidths[5], align: "center" });
  }

  return y + HEADER_HEIGHT;
}

function drawTableHeaderBottom(doc, y, id_categoria) {
  const azul = "#003366";
  let x = MARGIN_LEFT;
  const isCereal = id_categoria === 1;
  const colWidths = isCereal ? colWidthsCereal : colWidthsOtros;
  const totalWidth = colWidths.reduce((a, b) => a + b, 0);

  doc.rect(x, y, totalWidth, HEADER_HEIGHT).fill(azul);
  doc.fillColor("white").font("Helvetica-Bold").fontSize(9);

  doc.text("", x, y + 6, { width: colWidths[0], align: "left" });

  const xMinMax = x + colWidths[0];
  doc.text("MIN", xMinMax, y + 6, { width: colWidths[1], align: "center" });
  doc.text("MAX", xMinMax + colWidths[1], y + 6, { width: colWidths[2], align: "center" });
  doc.text("MIN", xMinMax + colWidths[1] + colWidths[2], y + 6, { width: colWidths[3], align: "center" });
  doc.text("MAX", xMinMax + colWidths[1] + colWidths[2] + colWidths[3], y + 6, { width: colWidths[4], align: "center" });

  if (!isCereal) {
    doc.text("MEDIDA", xMinMax + colWidths[1] + colWidths[2] + colWidths[3] + colWidths[4], y + 6, { width: colWidths[5], align: "center" });
  }

  for (let i = 1; i < colWidths.length; i++) {
    let posX = x + colWidths.slice(0, i).reduce((a, b) => a + b, 0);
    doc.moveTo(posX, y).lineTo(posX, y + HEADER_HEIGHT).stroke();
  }

  doc.moveTo(x, y + HEADER_HEIGHT).lineTo(x + totalWidth, y + HEADER_HEIGHT).stroke();

  return y + HEADER_HEIGHT;
}

function drawRow(doc, y, producto, isOdd, id_categoria) {
  let x = MARGIN_LEFT;
  const isCereal = id_categoria === 1;
  const colWidths = isCereal ? colWidthsCereal : colWidthsOtros;

  if (isOdd) {
    doc.rect(x, y, colWidths.reduce((a, b) => a + b, 0), ROW_HEIGHT).fill("#f9f9f9");
  } else {
    doc.rect(x, y, colWidths.reduce((a, b) => a + b, 0), ROW_HEIGHT).fill("white");
  }

  doc.fillColor("black").font("Helvetica").fontSize(8);
  doc.strokeColor("#ccc").lineWidth(0.5);

  doc.rect(x, y, colWidths[0], ROW_HEIGHT).stroke();
  doc.text(producto.nombre, x + 5, y + 4, { width: colWidths[0] - 10, align: "left" });
  x += colWidths[0];

  doc.rect(x, y, colWidths[1], ROW_HEIGHT).stroke();
  doc.text(producto.anterior_min, x, y + 4, { width: colWidths[1], align: "center" });
  x += colWidths[1];

  doc.rect(x, y, colWidths[2], ROW_HEIGHT).stroke();
  doc.text(producto.anterior_max, x, y + 4, { width: colWidths[2], align: "center" });
  x += colWidths[2];

  doc.rect(x, y, colWidths[3], ROW_HEIGHT).stroke();
  doc.text(producto.actual_min, x, y + 4, { width: colWidths[3], align: "center" });
  x += colWidths[3];

  doc.rect(x, y, colWidths[4], ROW_HEIGHT).stroke();
  doc.text(producto.actual_max, x, y + 4, { width: colWidths[4], align: "center" });
  x += colWidths[4];

  if (!isCereal) {
    doc.rect(x, y, colWidths[5], ROW_HEIGHT).stroke();
    doc.text(producto.unidad_medida || "", x, y + 4, { width: colWidths[5], align: "center" });
  }
}

function drawComentario(doc, y, ancho, comentario) {
  const texto = comentario?.trim() || "Sin comentarios";
  const textOptions = { width: ancho - 10, align: "left" };
  const textHeight = doc.heightOfString(`Comentario: ${texto}`, textOptions);

  const boxHeight = Math.max(textHeight + 15, ROW_HEIGHT * 2);

  doc.rect(MARGIN_LEFT, y, ancho, boxHeight).lineWidth(1).strokeColor("black").stroke();

  doc.font("Helvetica-Oblique").fontSize(8).fillColor("gray")
    .text(`Comentario: ${texto}`, MARGIN_LEFT + 5, y + 8, { ...textOptions, height: boxHeight - 10 });

  return boxHeight;
}
async function generarPDFPistachos(datos) {
  const nombreArchivo = `mesa_pistachos_${limpiarNombre(datos.fecha)}.pdf`;
  const ruta = path.join(__dirname, "../../public/pdf", nombreArchivo);
  if (!fs.existsSync(path.dirname(ruta))) {
    fs.mkdirSync(path.dirname(ruta), { recursive: true });
  }

  const doc = new PDFDocument({ margin: MARGIN_TOP, size: "A4" });
  doc.pipe(fs.createWriteStream(ruta));
  let currentY = MARGIN_TOP;
  let pageNum = 1;

  const rutaLogo = path.join(__dirname, "../../public/img/escudo_talavera.png");
  if (fs.existsSync(rutaLogo)) {
    doc.image(rutaLogo, PAGE_WIDTH - MARGIN_RIGHT - 60, 20, { width: 60 });
  }

  doc.font("Helvetica-Bold").fontSize(16).fillColor("#003366");
  doc.text("MERCADO NACIONAL DE GANADO", MARGIN_LEFT, currentY, {
    align: "center",
    width: PAGE_WIDTH - MARGIN_LEFT - MARGIN_RIGHT,
  });
  currentY += 25;
  doc.font("Helvetica").fontSize(10).fillColor("black");
  doc.text("Talavera de la Reina", MARGIN_LEFT, currentY, { align: "center" });
  currentY += 15;
  doc.text("Paseo Fernando de los Ríos, s/n · Telf: 925 721 830", MARGIN_LEFT, currentY, { align: "center" });
  currentY += 15;
  doc.fillColor("blue").text("www.mercadoganado.talavera.es", MARGIN_LEFT, currentY, {
    underline: true,
    align: "center"
  });
  currentY += 30;

  doc.font("Helvetica-Bold").fontSize(14).fillColor("#003366");
  doc.text(`Mesa de precios de PISTACHOS para el día ${formatearFecha(datos.fecha)}`, MARGIN_LEFT, currentY, {
    align: "center",
  });
  currentY += 25;

  const colWidths = [80, 80, 110, 80, 80, 50];
  const tableWidth = colWidths.reduce((a, b) => a + b, 0);

  for (const tipo of datos.tipos) {
    if (currentY + 100 > PAGE_HEIGHT - 70) {
      doc.addPage(); pageNum++; currentY = MARGIN_TOP;
    }

    const tipoLineas = tipo.nombre.toUpperCase().split(" - ");
    const alturaBloque = 20 * tipoLineas.length;
    doc.rect(MARGIN_LEFT, currentY, PAGE_WIDTH - MARGIN_LEFT - MARGIN_RIGHT, alturaBloque).fill("#003366");
    // Título del tipo
    doc.font("Helvetica-Bold").fontSize(12).fillColor("white");
    tipoLineas.forEach((linea, i) => {
      doc.text(linea, MARGIN_LEFT, currentY + (i * 20) + 5, { align: "center" });
    });
    currentY += alturaBloque + 10;
// Cabecera de la tabla
    doc.rect(MARGIN_LEFT, currentY, tableWidth, ROW_HEIGHT).fill("#003366");
    doc.fillColor("white").font("Helvetica-Bold").fontSize(9);
    doc.text("Nombre 1", MARGIN_LEFT + 2, currentY + 4, { width: colWidths[0] });
    doc.text("Nombre 2", MARGIN_LEFT + colWidths[0], currentY + 4, { width: colWidths[1] });
    doc.text("Nombre 3", MARGIN_LEFT + colWidths[0] + colWidths[1], currentY + 4, { width: colWidths[2] });
    doc.text("Anterior", MARGIN_LEFT + colWidths[0] + colWidths[1] + colWidths[2], currentY + 4, { width: colWidths[3], align: "center" });
    doc.text("Actual", MARGIN_LEFT + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3], currentY + 4, { width: colWidths[4], align: "center" });
    doc.text("€/Kg", MARGIN_LEFT + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3] + colWidths[4], currentY + 4, { width: colWidths[5], align: "center" });
    currentY += ROW_HEIGHT;
// Agrupar productos por nombres
    const grupos = {};
    for (const p of tipo.productos) {
      const key1 = p.nombres?.nombre_1 || "";
      const key2 = p.nombres?.nombre_2 || "";
      if (!grupos[key1]) grupos[key1] = {};
      if (!grupos[key1][key2]) grupos[key1][key2] = [];
      grupos[key1][key2].push(p);
    }

for (const nombre1 in grupos) {
  const grupo1 = grupos[nombre1];
  const totalFilasNombre1 = Object.values(grupo1).reduce((acc, productos) => acc + productos.length, 0);
  const alturaNombre1 = totalFilasNombre1 * ROW_HEIGHT;

  // Salto de página si no cabe
  if (currentY + alturaNombre1 > PAGE_HEIGHT - 70) {
    doc.addPage(); pageNum++; currentY = MARGIN_TOP;
  }

  // Primero dibujamos todas las celdas (rectángulos blancos)
  let tempY = currentY;
  for (const nombre2 in grupo1) {
    const productos = grupo1[nombre2];
    for (let i = 0; i < productos.length; i++) {
      doc.rect(MARGIN_LEFT, tempY, tableWidth, ROW_HEIGHT).fill("white").strokeColor("#ccc").lineWidth(0.5).stroke();
      tempY += ROW_HEIGHT;
    }
  }

  // Luego escribimos el texto
  let bloqueY = currentY;
  for (const nombre2 in grupo1) {
    const productos = grupo1[nombre2];
    const alturaNombre2 = productos.length * ROW_HEIGHT;

    for (let i = 0; i < productos.length; i++) {
      const p = productos[i];
      const filaY = bloqueY + i * ROW_HEIGHT;

      doc.font("Helvetica").fontSize(8).fillColor("black");

      // nombre1 solo una vez, centrado verticalmente
      if (i === 0 && nombre2 === Object.keys(grupo1)[0]) {
        doc.text(nombre1, MARGIN_LEFT + 2, currentY + alturaNombre1 / 2 - 4, {
          width: colWidths[0], align: "center"
        });
      }

      // nombre2 solo una vez por subgrupo, centrado verticalmente
      if (i === 0) {
        doc.text(nombre2, MARGIN_LEFT + colWidths[0] + 2, bloqueY + alturaNombre2 / 2 - 4, {
          width: colWidths[1], align: "center"
        });
      }

      // Datos
      doc.text(p.nombres?.nombre_3 || "", MARGIN_LEFT + colWidths[0] + colWidths[1], filaY + 4, { width: colWidths[2] });
      doc.text(formatearPrecio(p.anterior_min), MARGIN_LEFT + colWidths[0] + colWidths[1] + colWidths[2], filaY + 4, { width: colWidths[3], align: "center" });
      doc.text(formatearPrecio(p.actual_min), MARGIN_LEFT + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3], filaY + 4, { width: colWidths[4], align: "center" });
      doc.text("€/Kg", MARGIN_LEFT + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3] + colWidths[4], filaY + 4, { width: colWidths[5], align: "center" });
    }

    bloqueY += alturaNombre2;
  }

  currentY += alturaNombre1;
}

  // Comentario del tipo

    const texto = tipo.comentario?.trim() || "Sin comentarios";
    const textOptions = { width: tableWidth - 10, align: "left" };
    const textHeight = doc.heightOfString(`Comentario: ${texto}`, textOptions);
    const boxHeight = Math.max(textHeight + 15, ROW_HEIGHT * 2);
    doc.rect(MARGIN_LEFT, currentY, tableWidth, boxHeight).strokeColor("black").lineWidth(1).stroke();
    doc.font("Helvetica-Oblique").fontSize(8).fillColor("gray")
      .text(`Comentario: ${texto}`, MARGIN_LEFT + 5, currentY + 8, textOptions);
    currentY += boxHeight + 15;
  }

  const footerY = PAGE_HEIGHT - 40;
  doc.font("Helvetica").fontSize(9).fillColor("black");
  doc.text(
    "Paseo Fernando de los Ríos, s/n · Telf: 925 721 830 · www.mercadoganado.talavera.es",
    MARGIN_LEFT,
    footerY,
    { width: PAGE_WIDTH - MARGIN_LEFT - MARGIN_RIGHT, align: "center" }
  );
  doc.font("Helvetica-Oblique").fontSize(8).fillColor("gray");
  doc.text(`Página ${pageNum}`, MARGIN_LEFT, footerY + 12, {
    width: PAGE_WIDTH - MARGIN_LEFT - MARGIN_RIGHT,
    align: "center",
  });

  doc.end();
  return ruta;
}






async function obtenerPistachosParaPDF(id_sesion) {
  const sesion = await Sesion.findByPk(id_sesion, {
    include: [{ model: Categoria, as: "Categoria", attributes: ["nombre", "id_categoria"] }],
  });

  const productos = await Producto.findAll({
    where: { id_categoria: 4 },
    include: [
      { model: Tipo },
      {
        model: Precio,
        as: "Precios",
        where: { id_sesion },
        required: false,
      },
      {
        model: require("../database/models/NombreSecundario"),
        as: "nombres",
        attributes: ["nombre_1", "nombre_2", "nombre_3"],
        required: false,
      }
    ],
  });

  const comentarios = await SesionAlmacenanTipo.findAll({ where: { id_sesion } });

  const tiposMap = {};
  for (const p of productos) {
    const tipoNombre = p.Tipo?.nombre?.toLowerCase() || "sin tipo";

    if (!tiposMap[tipoNombre]) tiposMap[tipoNombre] = { nombre: p.Tipo.nombre, productos: [] };

    const precioActual = p.Precios?.[0];

    let anterior_min = "S/C";
    let anterior_max = "S/C";

    const precioAnterior = await Precio.findOne({
      where: {
        id_producto: p.id_producto,
        id_sesion: { [Op.lt]: id_sesion },
      },
      order: [["id_sesion", "DESC"]],
    });

    if (precioAnterior) {
      anterior_min = p.tipo_precio === 0
        ? formatearPrecio(precioAnterior.precio_actual)
        : formatearPrecio(precioAnterior.precio_actual_min);
      anterior_max = p.tipo_precio === 0
        ? formatearPrecio(precioAnterior.precio_actual)
        : formatearPrecio(precioAnterior.precio_actual_max);
    }

    tiposMap[tipoNombre].productos.push({
      nombre: p.nombre,
      nombres: p.nombres, // <-- nombres secundarios aquí
      contribuye: precioActual?.contribuye ?? true,
      anterior_min,
      anterior_max,
      actual_min: formatearPrecio(precioActual?.precio_actual_min ?? precioActual?.precio_actual),
      actual_max: formatearPrecio(precioActual?.precio_actual_max ?? precioActual?.precio_actual),
      tipo_precio: p.tipo_precio,
      unidad_medida: p.unidad_medida,
    });
  }

  comentarios.forEach((c) => {
    const tipo = productos.find((p) => p.id_tipo === c.id_tipo)?.Tipo?.nombre?.toLowerCase();
    if (tipo && tiposMap[tipo]) {
      tiposMap[tipo].comentario = c.comentario;
    }
  });

  return {
    fecha: sesion.fecha,
    categoria: "Pistachos",
    id_categoria: 4,
    tipos: Object.values(tiposMap),
  };
}

async function obtenerDatosParaPDF(id_sesion, tiposFiltrar = null) {
  const sesion = await Sesion.findByPk(id_sesion, {
    include: [{ model: Categoria, as: "Categoria", attributes: ["nombre", "id_categoria"] }],
  });

  const productos = await Producto.findAll({
    where: { id_categoria: sesion.id_categoria },
    include: [
      { model: Tipo },
      {
        model: Precio,
        as: "Precios",
        where: { id_sesion },
        required: false,
      },
    ],
  });

  const comentarios = await SesionAlmacenanTipo.findAll({ where: { id_sesion } });

  const tiposMap = {};
  for (const p of productos) {
    const tipoNombre = p.Tipo?.nombre?.toLowerCase() || "sin tipo";

    if (sesion.Categoria.nombre === "Frutos Secos" && tiposFiltrar && !tiposFiltrar.includes(tipoNombre)) {
      continue;
    }

    if (!tiposMap[tipoNombre]) tiposMap[tipoNombre] = { nombre: p.Tipo.nombre, productos: [] };

    const precioActual = p.Precios?.[0];

    let anterior_min = "S/C";
    let anterior_max = "S/C";

    const precioAnterior = await Precio.findOne({
      where: {
        id_producto: p.id_producto,
        id_sesion: { [Op.lt]: id_sesion },
      },
      order: [["id_sesion", "DESC"]],
    });

    if (precioAnterior) {
      if (p.tipo_precio === 0) {
        anterior_min = anterior_max = formatearPrecio(precioAnterior.precio_actual);
      } else {
        anterior_min = formatearPrecio(precioAnterior.precio_actual_min);
        anterior_max = formatearPrecio(precioAnterior.precio_actual_max);
      }
    }

    tiposMap[tipoNombre].productos.push({
      nombre: p.nombre,
      contribuye: precioActual?.contribuye ?? true,
      anterior_min,
      anterior_max,
      actual_min: formatearPrecio(precioActual?.precio_actual_min ?? precioActual?.precio_actual),
      actual_max: formatearPrecio(precioActual?.precio_actual_max ?? precioActual?.precio_actual),
      tipo_precio: p.tipo_precio,
      unidad_medida: p.unidad_medida, // añadimos unidad_medida aquí
    });
  }

  comentarios.forEach((c) => {
    const tipo = productos.find((p) => p.id_tipo === c.id_tipo)?.Tipo?.nombre?.toLowerCase();
    if (tipo && tiposMap[tipo]) {
      tiposMap[tipo].comentario = c.comentario;
    }
  });

  return {
    fecha: sesion.fecha,
    categoria: sesion.Categoria?.nombre || "",
    id_categoria: sesion.Categoria?.id_categoria || 0,
    tipos: Object.values(tiposMap),
  };
}

const generarPDFPorSesion = async (id_sesion, tiposFiltrar = null) => {
  const datos = await obtenerDatosParaPDF(id_sesion, tiposFiltrar);

  const nombreArchivo = `mesa_${limpiarNombre(datos.categoria)}_${limpiarNombre(datos.fecha)}.pdf`;
  const ruta = path.join(__dirname, "../../public/pdf", nombreArchivo);

  if (!fs.existsSync(path.dirname(ruta))) {
    fs.mkdirSync(path.dirname(ruta), { recursive: true });
  }

  const doc = new PDFDocument({ margin: MARGIN_TOP, size: "A4" });
  let currentY = MARGIN_TOP;
  let pageNum = 1;

  doc.pipe(fs.createWriteStream(ruta));
if (datos.id_categoria === 4) {
  const datosPistachos = await obtenerPistachosParaPDF(id_sesion);
  return await generarPDFPistachos(datosPistachos);
}

  // Logo a la derecha si existe
  const rutaLogo = path.join(__dirname, "../../public/img/escudo_talavera.png");
  if (fs.existsSync(rutaLogo)) {
    doc.image(rutaLogo, PAGE_WIDTH - MARGIN_RIGHT - 60, 20, { width: 60 });
  }

  // Títulos y datos generales arriba, con margen reducido
  doc.font("Helvetica-Bold").fontSize(16).fillColor("#003366");
  doc.text("MERCADO NACIONAL DE GANADO", MARGIN_LEFT, currentY, { align: "center", width: PAGE_WIDTH - MARGIN_LEFT - MARGIN_RIGHT });
  currentY += 25;

  doc.font("Helvetica").fontSize(10).fillColor("black");
  doc.text("Talavera de la Reina", MARGIN_LEFT, currentY, { align: "center", width: PAGE_WIDTH - MARGIN_LEFT - MARGIN_RIGHT });
  currentY += 15;

  doc.text("Paseo Fernando de los Ríos, s/n · Telf: 925 721 830", MARGIN_LEFT, currentY, { align: "center", width: PAGE_WIDTH - MARGIN_LEFT - MARGIN_RIGHT });
  currentY += 15;

  doc.fillColor("blue").text("www.mercadoganado.talavera.es", MARGIN_LEFT, currentY, { underline: true, align: "center", width: PAGE_WIDTH - MARGIN_LEFT - MARGIN_RIGHT });
  currentY += 30;

  doc.font("Helvetica-Bold").fontSize(14).fillColor("#003366");
  doc.text(`Precios Lonja de ${datos.categoria} para el día ${formatearFecha(datos.fecha)}`, MARGIN_LEFT, currentY, { align: "center", width: PAGE_WIDTH - MARGIN_LEFT - MARGIN_RIGHT });
  currentY += 25;

  doc.font("Helvetica").fontSize(9).fillColor("black");
  if (datos.categoria === "Cereales" || datos.categoria === "Ecológico") {
    doc.text(
      "Precios en origen agricultor sobre camión en Euros/Tonelada, condiciones de calidad O.C.M. Campaña 2024-2025",
      MARGIN_LEFT,
      currentY,
      { width: PAGE_WIDTH - MARGIN_LEFT - MARGIN_RIGHT, align: "center" }
    );
  } else if (datos.categoria === "Vacuno-Ovino") {
    doc.text(
      "Precios medios orientativos de los animales vendidos en el mercado semanal.",
      MARGIN_LEFT,
      currentY,
      { width: PAGE_WIDTH - MARGIN_LEFT - MARGIN_RIGHT, align: "center" }
    );
  } else if (datos.categoria === "Frutas") {
    doc.text(
      "Precios mayoristas de frutas en mercados centrales.",
      MARGIN_LEFT,
      currentY,
      { width: PAGE_WIDTH - MARGIN_LEFT - MARGIN_RIGHT, align: "center" }
    );
  } else if (datos.id_categoria === 4 || datos.id_categoria === 5) {
    doc.text(
      "Precios orientativos de frutos secos en mercados nacionales.",
      MARGIN_LEFT,
      currentY,
      { width: PAGE_WIDTH - MARGIN_LEFT - MARGIN_RIGHT, align: "center" }
    );
  } else {
    doc.text("Precios orientativos según información de mercado.", MARGIN_LEFT, currentY, {
      width: PAGE_WIDTH - MARGIN_LEFT - MARGIN_RIGHT,
      align: "center",
    });
  }
  currentY += 40;

  // Cabeceras según categoría
  currentY = drawTableHeaderTop(doc, currentY, datos.id_categoria);
  currentY = drawTableHeaderBottom(doc, currentY, datos.id_categoria);

  // Filas con datos y comentarios
  let filaPar = false;
  for (const t of datos.tipos) {
    if (currentY + ROW_HEIGHT * 4 > PAGE_HEIGHT - 70) {
      doc.addPage();
      pageNum++;
      currentY = MARGIN_TOP;
      currentY = drawTableHeaderTop(doc, currentY, datos.id_categoria);
      currentY = drawTableHeaderBottom(doc, currentY, datos.id_categoria);
    }

    doc.rect(MARGIN_LEFT, currentY, (datos.id_categoria === 1 ? colWidthsCereal : colWidthsOtros).reduce((a,b) => a+b, 0), ROW_HEIGHT).fill("#cce5ff");
    doc.fillColor("#003366").font("Helvetica-Bold").fontSize(10);
    doc.text(`TIPO: ${t.nombre.toUpperCase()}`, MARGIN_LEFT + 5, currentY + 3);

    currentY += ROW_HEIGHT;

    for (const p of t.productos) {
      if (currentY + ROW_HEIGHT > PAGE_HEIGHT - 70) {
        doc.addPage();
        pageNum++;
        currentY = MARGIN_TOP;
        currentY = drawTableHeaderTop(doc, currentY, datos.id_categoria);
        currentY = drawTableHeaderBottom(doc, currentY, datos.id_categoria);
      }
      drawRow(doc, currentY, p, filaPar, datos.id_categoria);
      currentY += ROW_HEIGHT;
      filaPar = !filaPar;
    }

    if (currentY + ROW_HEIGHT * 3 > PAGE_HEIGHT - 70) {
      doc.addPage();
      pageNum++;
      currentY = MARGIN_TOP;
      currentY = drawTableHeaderTop(doc, currentY, datos.id_categoria);
      currentY = drawTableHeaderBottom(doc, currentY, datos.id_categoria);
    }
    const anchoComentario = (datos.id_categoria === 1 ? colWidthsCereal : colWidthsOtros).reduce((a,b) => a+b, 0);
    const alturaComentario = drawComentario(doc, currentY, anchoComentario, t.comentario);
    currentY += alturaComentario + 10;
  }

  // Pie y número página
  const footerY = PAGE_HEIGHT - 40;
  doc.font("Helvetica").fontSize(9).fillColor("black");
  doc.text(
    "Paseo Fernando de los Ríos, s/n · Telf: 925 721 830 · www.mercadoganado.talavera.es",
    MARGIN_LEFT,
    footerY,
    { width: PAGE_WIDTH - MARGIN_LEFT - MARGIN_RIGHT, align: "center" }
  );
  doc.font("Helvetica-Oblique").fontSize(8).fillColor("gray");
  doc.text(`Página ${pageNum}`, MARGIN_LEFT, footerY + 12, {
    width: PAGE_WIDTH - MARGIN_LEFT - MARGIN_RIGHT,
    align: "center",
  });


  doc.end();
  return ruta;
};


module.exports = {
  generarPDFPorSesion,
};