import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const generatePdf = (title: string, head: string[][], body: (string | number)[][], fileName: string) => {
  const doc = new jsPDF();
  doc.text(title, 20, 10);
  autoTable(doc, {
    head,
    body,
  });
  doc.save(`${fileName}.pdf`);
};
