export interface PdfSection {
  title: string;
  content: string[];
}

export async function generatePDF(title: string, dataSections: PdfSection[], action: 'save' | 'view' = 'save') {
  const jsPDF = (await import("jspdf")).default;
  const autoTable = (await import("jspdf-autotable")).default;

  const doc = new jsPDF("p", "mm", "a4");
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  const addImageToPdf = async (url: string, x: number, y: number, w: number, h: number) => {
    return new Promise<void>((resolve) => {
      const img = new window.Image();
      img.src = url;
      img.onload = () => {
        doc.addImage(img, "PNG", x, y, w, h);
        resolve();
      };
      img.onerror = () => {
        // Fail silently if image not found to not block PDF generation
        resolve();
      };
    });
  };

  // Logo Governo State Ceará (Proporcional 266x220)
  await addImageToPdf("/logo-vertical.png", pageWidth / 2 - 18, 10, 36, 30);
  
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("CASA CIVIL", pageWidth / 2, 48, { align: "center" });

  // Document Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text(title.toUpperCase(), pageWidth / 2, 58, { align: "center" });

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  const dataExtenso = new Date().toLocaleDateString("pt-BR", { day: '2-digit', month: '2-digit', year: 'numeric' });
  doc.text(`Documento oficial gerado em ${dataExtenso}`, pageWidth / 2, 65, { align: "center" });

  let startYLine = 75;

  // Render Data Sections inside boxes via autoTable
  dataSections.forEach((section) => {
    // Break content by lines if they arrive as strings with newlines to avoid autoTable squishing
    const formattedContent = section.content.map(c => c).join("\n");
    
    autoTable(doc, {
      startY: startYLine,
      theme: "plain",
      head: [[section.title.toUpperCase()]],
      body: [[formattedContent]],
      headStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0], fontStyle: 'bold', halign: 'left', cellPadding: 2 },
      bodyStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], valign: 'top', cellPadding: 3 },
      styles: { fontSize: 10, cellWidth: 'wrap' },
      margin: { left: 20, right: 20 },
      tableLineWidth: 0.1,
      tableLineColor: [200, 200, 200],
      didDrawPage: (data) => {
        startYLine = data.cursor ? data.cursor.y + 10 : startYLine;
      }
    });
  });

  // Logo Projeto at the bottom right before the bar (if it fits)
  await addImageToPdf("/logo-projeto.png", pageWidth - 60, pageHeight - 50, 40, 15);

  // Footer bar (Ceará colors)
  const barHeight = 4;
  const barY = pageHeight - 30;
  const colWidth = pageWidth / 4;
  doc.setFillColor(16, 185, 129); doc.rect(0, barY, colWidth, barHeight, "F"); // Emerald
  doc.setFillColor(245, 158, 11); doc.rect(colWidth, barY, colWidth, barHeight, "F"); // Amber
  doc.setFillColor(14, 165, 233); doc.rect(colWidth * 2, barY, colWidth, barHeight, "F"); // Blue
  doc.setFillColor(239, 68, 68); doc.rect(colWidth * 3, barY, colWidth, barHeight, "F"); // Red

  // Footer text
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text("Assessoria Especial para Inovação e Demandas Extraordinárias", pageWidth / 2, barY + 10, { align: "center" });
  doc.setFont("helvetica", "normal");
  doc.text("Rua Silva Paulet, 400 - Meireles • CEP: 60.120-020", pageWidth / 2, barY + 14, { align: "center" });
  doc.text("Fortaleza / CE fone: 3466-4000", pageWidth / 2, barY + 18, { align: "center" });

  if (action === 'save') {
    doc.save(`Ficha_${title.replace(/\s+/g, '_')}_${Date.now()}.pdf`);
  } else {
    const pdfBlob = doc.output('blob');
    const blobUrl = URL.createObjectURL(pdfBlob);
    window.open(blobUrl, '_blank');
  }
}
