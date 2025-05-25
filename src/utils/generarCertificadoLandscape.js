import jsPDF from "jspdf";

function loadImageFromUrl(imagePath) {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = imagePath;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      canvas.getContext("2d").drawImage(img, 0, 0);
      resolve(canvas.toDataURL("image/png"));
    };
  });
}

export async function generarCertificado(
  nombreModulo,
  nombreEstudiante,
  logoPath = "src/images/logo-skc.png"
) {
  const doc = new jsPDF("landscape", "pt", "A4");
  const width = doc.internal.pageSize.getWidth();
  const height = doc.internal.pageSize.getHeight();
  const fecha = new Date().toLocaleDateString();

  const logo = await loadImageFromUrl(logoPath);
  const tempImg = new Image();
  tempImg.src = logo;
  await new Promise((res) => (tempImg.onload = res));

  const imgWidth = 180;
  const aspectRatio = tempImg.height / tempImg.width;
  const imgHeight = imgWidth * aspectRatio;
  const posX = (width - imgWidth) / 2;
  const posY = 40;

  doc.setFillColor(40, 40, 40);
  doc.rect(posX - 10, posY - 10, imgWidth + 20, imgHeight + 20, "F");
  doc.addImage(logo, "PNG", posX, posY, imgWidth, imgHeight);

  let cursorY = posY + imgHeight + 60;

  doc.setFontSize(30);
  doc.setTextColor(40, 40, 40);
  doc.text("Certificado de Finalización", width / 2, cursorY, {
    align: "center",
  });

  cursorY += 40;
  doc.setFontSize(18);
  doc.setTextColor(60, 60, 60);
  doc.text("Se certifica que", width / 2, cursorY, { align: "center" });

  cursorY += 30;
  doc.setFontSize(24);
  doc.setTextColor(0, 102, 204);
  doc.text(nombreEstudiante, width / 2, cursorY, { align: "center" });

  cursorY += 30;
  doc.setFontSize(18);
  doc.setTextColor(60, 60, 60);
  doc.text("ha aprobado satisfactoriamente el módulo", width / 2, cursorY, {
    align: "center",
  });

  cursorY += 30;
  doc.setFontSize(22);
  doc.setTextColor(50, 50, 50);
  doc.text(nombreModulo, width / 2, cursorY, { align: "center" });

  cursorY += 30;
  doc.setFontSize(14);
  doc.setTextColor(100, 100, 100);
  doc.text(`Fecha de finalización: ${fecha}`, width / 2, cursorY, {
    align: "center",
  });

  // Firma
  const firmaY = height - 120;
  doc.setFontSize(20);
  doc.setTextColor(60, 60, 60);
  doc.text("_______________________________", width / 2, firmaY, {
    align: "center",
  });
  doc.setFontSize(12);
  doc.text("Firma autorizada", width / 2, firmaY + 20, { align: "center" });

  // Código único
  const codigo = `SKC-${
    nombreEstudiante.split(" ")[0]
  }-${new Date().getTime()}`;
  doc.setFontSize(10);
  doc.setTextColor(130, 130, 130);
  doc.text(`Código: ${codigo}`, width / 2, height - 40, { align: "center" });

  doc.save(`certificado-${nombreModulo}.pdf`);
}
