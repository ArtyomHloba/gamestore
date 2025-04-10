import { useEffect, useState } from "react";
import { jsPDF } from "jspdf";
import { fetchPurchaseById } from "../../api";

function ReceiptPDF({ purchaseId }) {
  const [purchaseData, setPurchaseData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPurchaseData = async () => {
      try {
        const data = await fetchPurchaseById(purchaseId);
        setPurchaseData(data);
      } catch (error) {
        console.error("Failed to fetch purchase data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPurchaseData();
  }, [purchaseId]);

  const generatePDF = () => {
    if (!purchaseData) {
      return;
    }

    const { user, game, purchase_date } = purchaseData;

    const doc = new jsPDF();

    doc.setFontSize(22);
    doc.setTextColor("#333");
    doc.text("Game Store - Purchase Receipt", 20, 20);
    doc.setDrawColor(0, 0, 0);
    doc.line(20, 25, 190, 25);

    doc.setFontSize(16);
    doc.setTextColor("#555");
    doc.text("Customer Information", 20, 35);
    doc.setFontSize(12);
    doc.text(`Name: ${user.user_name}`, 20, 45);
    doc.text(`Email: ${user.email}`, 20, 55);

    doc.line(20, 60, 190, 60);

    doc.setFontSize(16);
    doc.setTextColor("#555");
    doc.text("Order Details", 20, 70);
    doc.setFontSize(12);
    doc.text(`Game: ${game.title}`, 20, 80);
    doc.text(`Genre: ${game.genre || "N/A"}`, 20, 90);
    doc.text(`Price: $${game.price}`, 20, 100);
    doc.text(
      `Purchase Date: ${new Date(purchase_date).toLocaleString()}`,
      20,
      110
    );

    doc.line(20, 115, 190, 115);

    doc.setFontSize(16);
    doc.setTextColor("#333");
    doc.text("Total", 20, 125);
    doc.setFontSize(18);
    doc.setTextColor("#000");
    doc.text(`$${game.price}`, 20, 135);

    doc.setFontSize(12);
    doc.setTextColor("#555");
    doc.text("Thank you for your purchase!", 20, 150);

    doc.save(`Receipt_${game.title}.pdf`);
  };

  if (loading) {
    return <p>Loading receipt data...</p>;
  }

  if (!purchaseData) {
    return <p>Failed to load receipt data.</p>;
  }

  return (
    <button onClick={generatePDF} style={styles.button}>
      Download Receipt
    </button>
  );
}

const styles = {
  button: {
    padding: "10px 20px",
    backgroundColor: "#f39c12",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
    marginTop: "10px",
  },
};

export default ReceiptPDF;
