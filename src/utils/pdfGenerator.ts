import { findById as findUserById } from "../models/user.model";
import PDFDocument = require("pdfkit");
type PDFDoc = InstanceType<typeof PDFDocument>; 

import { getRutinaConVersiones, getRutinasById } from "../services/rutina.service";
import { Readable } from "stream";
import { obtenerVersionesByIdRutina } from "../models/rutinaVersion.model";
import { getActivitiesByRoutineVersionId } from "../services/activity.service";
import { Activity } from "../models/interfaces/activity.interfaces";

interface TablaOptions {
  title?: string;
  startY?: number;
  col1Width?: number;
  col2Width?: number;
  rowHeight?: number;
  columnCount?: number;
}

const diasSemana = [
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
  "Domingo",
];

let paginaActual = 1;

export async function pdfRutinasUtil(id: number): Promise<Readable> {

    const rutinaRes = await getRutinasById(id);
    if (!rutinaRes) throw new Error("No se encontró la rutina");
    const rutina = rutinaRes[0];

    const usuario = await findUserById(rutina.users_id);
    if (!usuario) throw new Error("No se encontró el usuario");

    const versiones = await obtenerVersionesByIdRutina(id);

    const doc = new PDFDocument({ margin: 50 });
    const stream = new Readable({ read() {} });

    doc.on("data", (chunk) => stream.push(chunk));
    doc.on("end", () => stream.push(null));

    generarCabecera(doc, usuario);

    generarTablaUsuario(doc, usuario);

    generarInfoRutina(doc, rutina, versiones.length);

    await generarInfoVersion(doc, versiones);
    doc.end();
    return stream;
}


export function generarCabecera(doc: PDFDoc, usuario: any) {
  doc
    .fillColor("#2c3e50")
    .fontSize(24)
    .font("Helvetica-Bold")
    .text("INFORME DE RUTINATOR", { align: "center" });

  doc.moveDown(0.5);
  doc
    .fontSize(12)
    .fillColor("gray")
    .font("Helvetica")
    .text(`Generado para el usuario: ${usuario.name}`, { align: "center" });

  doc.text(`Fecha de generación de informe: ${new Date().toLocaleDateString()}`, {
    align: "center",
  });

  doc.moveDown(1);
  doc
    .moveTo(doc.page.margins.left, doc.y)
    .lineTo(doc.page.width - doc.page.margins.right, doc.y)
    .strokeColor("#ccc")
    .lineWidth(1)
    .stroke();

  doc.moveDown(1.5);
}

function generarTablaUsuario(doc: PDFDoc, usuario: any) {
    generarTituloSeccion(doc, "Datos del Usuario");
    doc.moveDown(1);

    generarTabla(
        doc,
        [
        ["Nombre ", usuario.name],
        ["Email ", usuario.email],
        ["Usuario ", usuario.username],
        ],
        { columnCount: 3 }
    );
    doc.moveDown(1);

}

function generarInfoRutina(doc: PDFDoc, rutina: any, nVersiones: number) {

    generarTituloSeccion(doc, "Datos de la Rutina");

    doc.moveDown(1);
    generarTabla(
      doc,
      [
        ["ID", rutina.id.toString()],
        ["Nombre", rutina.name],
        ["Descripción", rutina.description],
        ["Fecha de creación: ", rutina.created_at.toLocaleDateString()],
        ["¿Frecuente?", rutina.is_frequent ? "Sí" : "No"],
        ["Nº de Versiones", nVersiones.toString()],
      ],
      { columnCount: 3 }
    );
}

async function generarInfoVersion(doc: PDFDoc, versions: any) {

  const bottomMargin = doc.page.height - doc.page.margins.bottom;

  for (const version of versions) {
    const activities: Activity[] = await getActivitiesByRoutineVersionId(
      version.id
    );
    activities.sort((a, b) => Number(a.day_of_week) - Number(b.day_of_week));

    doc.moveDown(1);

    if (doc.y + 100 > bottomMargin) {
      doc.addPage();
    }
    generarSubTituloSeccion(
      doc,
      "Versión v." + version.version_number.toString()
    );

    try {

      if (activities.length > 0) {
        const headers = [
          "Título",
          "Descripción",
          "Día de la semana",
          "Hora de inicio",
          "Hora de fin",
        ];
        generarTablaVariasFilas(doc, activities,headers);
      } else {
        doc
          .fontSize(12)
          .fillColor("gray")
          .font("Helvetica")
          .text("No hay actividades registradas para esta versión.", {
            align: "center",
          });

        doc.moveDown(1.5);
      }
    } catch (error) {
      doc
        .fontSize(12)
        .fillColor("red")
        .font("Helvetica")
        .text("Error al cargar actividades para esta versión.", {
          align: "center",
        });
    }
  }
}
  
  
export function generarTabla(
  doc: PDFDoc,
  data: [string, string | number | boolean | null | undefined][],
  options: TablaOptions = {}
) {
  const { startY = doc.y, columnCount = 2 } = options;

  const tableX = doc.page.margins.left;
  let y = startY;

  const totalWidth =
    doc.page.width - doc.page.margins.left - doc.page.margins.right;
  const colWidth = totalWidth / columnCount;

  const rows: [string, string | number | boolean | null | undefined][][] = [];
  for (let i = 0; i < data.length; i += columnCount) {
    rows.push(data.slice(i, i + columnCount));
  }

  const claveHeight = 20; 
  const paddingVertical = 6; 

  rows.forEach((row) => {
    const values = row.map(([_, value]) => String(value ?? "—"));

    doc.font("Helvetica").fontSize(10);
    const valueHeights = values.map((text) =>
      doc.heightOfString(text, {
        width: colWidth - 10,
        align: "left",
      })
    );

    const maxValueHeight = Math.max(...valueHeights) + paddingVertical;
    const totalRowHeight = claveHeight + maxValueHeight;

    row.forEach(([key], i) => {
      const x = tableX + i * colWidth;
      doc
        .fillColor("#606160")
        .rect(x, y, colWidth, claveHeight)
        .fill()
        .strokeColor("#333")
        .lineWidth(1)
        .rect(x, y, colWidth, claveHeight)
        .stroke()
        .font("Helvetica-Bold")
        .fontSize(10)
        .fillColor("#fff")
        .text(key, x + 5, y + 5, {
          width: colWidth - 10,
          align: "left",
        });
    });

    y += claveHeight;

    row.forEach(([_, value], i) => {
      const x = tableX + i * colWidth;
      doc
        .strokeColor("#333")
        .lineWidth(1)
        .rect(x, y, colWidth, maxValueHeight)
        .stroke()
        .font("Helvetica")
        .fontSize(10)
        .fillColor("black")
        .text(String(value ?? "—"), x + 5, y + 5, {
          width: colWidth - 10,
          align: "left",
        });
    });

    y += maxValueHeight;
    doc.y = y;
  });

  doc.moveDown(1.5);
}




function generarTablaVariasFilas(doc: PDFDoc, lista: any[], headers: string[]) {
  const tableX = doc.page.margins.left;
  const colCount = headers.length;
  const totalWidth =
    doc.page.width - doc.page.margins.left - doc.page.margins.right;
  const colWidth = totalWidth / colCount;
  const minRowHeight = 20;
  const bottomMargin = doc.page.height - doc.page.margins.bottom;

  let y = doc.y;

  // Función para imprimir cabecera (para usar en cada página nueva)
  const imprimirCabecera = () => {
    headers.forEach((text, i) => {
      const x = tableX + i * colWidth;
      doc
        .strokeColor("#333")
        .lineWidth(1)
        .rect(x, y, colWidth, minRowHeight)
        .fillAndStroke("#606160", "#333")
        .fillColor("white")
        .font("Helvetica-Bold")
        .fontSize(10)
        .text(text, x + 5, y + 7, { width: colWidth - 10 });
    });
    y += minRowHeight;
    doc.y = y;
  };

  imprimirCabecera();

  // Dibujar cada fila
  lista.forEach((a) => {
    const fila = [
      a.title,
      a.description,
      diasSemana[Number(a.day_of_week ?? 1)],
      a.start_time,
      a.end_time,
    ];

    // Establecer fuente antes de medir
    doc.font("Helvetica").fontSize(10);

    // Calcular altura de cada celda
    const alturas = fila.map((value) =>
      doc.heightOfString(String(value ?? "—"), {
        width: colWidth - 10,
        align: "left",
      })
    );

    const actualRowHeight = Math.max(...alturas) + 14;

    // Verificar si cabe en la página
    if (y + actualRowHeight > bottomMargin) {
      y = doc.page.margins.top;
      doc.y = y;
      doc.addPage();
      imprimirCabecera();
    }

    // Pintar fila
    fila.forEach((value, i) => {
      const x = tableX + i * colWidth;
      doc
        .strokeColor("#333")
        .lineWidth(1)
        .rect(x, y, colWidth, actualRowHeight)
        .stroke()
        .fillColor("black")
        .font("Helvetica")
        .fontSize(10)
        .text(String(value ?? "—"), x + 5, y + 7, {
          width: colWidth - 10,
          align: "left",
        });
    });

    y += actualRowHeight;
    doc.y = y;
  });

  doc.moveDown(1.5);
}



export function generarTituloSeccion(
  doc: PDFDoc,
  texto: string,
  color: string = "#34495e"
) {
  const x = doc.page.margins.left;
  const y = doc.y;

  doc.fontSize(16).fillColor(color).font("Helvetica-Bold").text(texto, x, y); 

  const lineY = y + 20;
  doc
    .moveTo(x, lineY)
    .lineTo(doc.page.width - doc.page.margins.right, lineY)
    .strokeColor("#ccc")
    .lineWidth(1)
    .stroke();

  doc.y = lineY + 10; 
}
  
export function generarSubTituloSeccion(
  doc: PDFDoc,
  texto: string,
  color: string = "#666666"
) {
  const x = doc.page.margins.left;
  const y = doc.y;

  doc.fontSize(14).fillColor(color).font("Helvetica-Bold").text(texto, x, y);

  const lineY = y + 16;
  doc
    .moveTo(x, lineY)
    .lineTo(doc.page.width - doc.page.margins.right, lineY)
    .strokeColor("#e0e0e0")
    .lineWidth(0.5)
    .stroke();

  doc.y = lineY + 8;
}
  
function imprimirPieDePagina(doc: PDFKit.PDFDocument) {
  const bottom = doc.page.height - doc.page.margins.bottom + 10;
  const pageWidth = doc.page.width;

  doc.fontSize(8).fillColor("gray");

  // Centrado: "Desarrollado por RUTINATOR"
  doc
    .font("Helvetica-Oblique")
    .text("Desarrollado por RUTINATOR", pageWidth / 2, bottom, {
      align: "center",
    });

  // Derecha: Número de página usando propiedad privada
  doc.font("Helvetica").text(`Página ${(doc as any)._pageBuffer.length}`);
}

function saltarSiNoCabe(doc: PDFDoc, alturaNecesaria: number = 80) {
  const bottomMargin = doc.page.height - doc.page.margins.bottom;
  if (doc.y + alturaNecesaria > bottomMargin) {
    doc.addPage();
  }
}
