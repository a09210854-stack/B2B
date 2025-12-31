import jsPDF from 'jspdf';

export function generateProformaPDF(order: {
  id: string;
  sellerName: string;
  buyerName: string;
  items: { title: string; qty: number; unitPrice: number }[];
  total: number;
}) {
  const doc = new jsPDF();
  doc.setFontSize(16);
  doc.text(`Proforma Invoice - ${order.id}`, 20, 20);
  doc.setFontSize(12);
  doc.text(`Seller: ${order.sellerName}`, 20, 30);
  doc.text(`Buyer: ${order.buyerName}`, 20, 36);

  let y = 50;
  doc.text('Items:', 20, y);
  y += 6;
  order.items.forEach((it, idx) => {
    doc.text(`${idx+1}. ${it.title} - ${it.qty} x ${it.unitPrice.toFixed(2)} USD`, 20, y);
    y += 6;
  });
  y += 6;
  doc.text(`Total: ${order.total.toFixed(2)} USD`, 20, y);
  return doc.output('blob');
}
