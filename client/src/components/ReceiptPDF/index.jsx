import { jsPDF } from "jspdf";

function ReceiptPDF({ game, user }) {
  const generatePDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Game Store - Purchase Receipt", 20, 20);

    doc.setFontSize(14);
    doc.text(`Game: ${game.title}`, 20, 40);
    doc.text(`Price: $${game.price}`, 20, 50);
    doc.text(`Genre: ${game.genre}`, 20, 60);
    doc.text(`Purchase Date: ${new Date().toLocaleString()}`, 20, 70);

    doc.setFontSize(12);

    doc.save(`Receipt_${game.title}.pdf`);
  };

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
