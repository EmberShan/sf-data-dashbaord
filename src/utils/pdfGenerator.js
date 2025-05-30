import { jsPDF } from 'jspdf';
import { toPng } from 'html-to-image';

// pdfGenerator.js
// Utility functions for generating high-quality PDFs from chart cards
// Features:
// - One card per page
// - High-quality rendering
// - Page size matches card size
// - Maintains exact styling and alignment

export const generatePDF = async (cards) => {
  try {
    // Process each card
    for (let i = 0; i < cards.length; i++) {
      const card = cards[i];
      
      // Get card dimensions and position
      const cardRect = card.getBoundingClientRect();
      const cardWidth = cardRect.width;
      const cardHeight = cardRect.height;

      // Add small margins to the page size
      const pageWidth = cardWidth + 40; // 20px margin on each side
      const pageHeight = cardHeight + 40; // 20px margin on each side

      // Debug: Log card DOM size and intended PDF page size
      console.log(`Card #${i + 1} DOM size:`, { cardWidth, cardHeight });
      console.log(`Intended PDF page size:`, { pageWidth, pageHeight });

      // Create a new PDF document with custom page size
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [pageWidth, pageHeight],
      });

      // Convert card to high-quality image
      const image = await toPng(card, {
        quality: 1.0,
        pixelRatio: 2,
        backgroundColor: 'white',
        style: {
          transform: 'scale(1)',
          transformOrigin: 'top left',
        },
      });

      // Debug: Log PNG image size
      const img = new window.Image();
      img.src = image;
      await new Promise((resolve) => {
        img.onload = () => {
          console.log(`Card #${i + 1} PNG image size:`, { width: img.width, height: img.height });
          resolve();
        };
      });

      // Add new page for each card (except the first one)
      if (i > 0) {
        pdf.addPage();
      }

      // Add the image to the PDF with centered margins
      pdf.addImage(
        image,
        'PNG',
        20, // x margin
        20, // y margin
        cardWidth,
        cardHeight,
        undefined,
        'FAST'
      );

      // Debug: Log actual PDF page size after creation
      const pdfPageSize = pdf.internal.pageSize;
      console.log(`Card #${i + 1} actual PDF page size:`, { width: pdfPageSize.getWidth(), height: pdfPageSize.getHeight() });

      // Save the PDF after each card (this will append to the same file)
      if (i === 0) {
        pdf.save('dashboard-report.pdf');
      } else {
        pdf.output('datauristring');
      }
    }
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};

// pdfGenerator.js
// Utility function for generating a PDF of the entire page (including toolbar and background)
// Features:
// - Captures the whole page as a single image
// - PDF page size matches the image size (no scaling)
// - Maintains exact styling and alignment

export const downloadFullPagePDF = async () => {
  try {
    // Capture the entire page (body)
    const target = document.body;
    const image = await toPng(target, {
      quality: 1.0,
      pixelRatio: 2,
      backgroundColor: 'white',
    });

    // Get image size
    const img = new window.Image();
    img.src = image;
    await new Promise((resolve) => {
      img.onload = () => resolve();
    });
    const imgWidth = img.width;
    const imgHeight = img.height;

    // Create PDF with page size matching the image
    const pdf = new jsPDF({
      orientation: imgWidth > imgHeight ? 'landscape' : 'portrait',
      unit: 'px',
      format: [imgWidth, imgHeight],
    });

    pdf.addImage(image, 'PNG', 0, 0, imgWidth, imgHeight);
    pdf.save('full-dashboard.pdf');
  } catch (error) {
    console.error('Error generating full page PDF:', error);
    throw error;
  }
}; 