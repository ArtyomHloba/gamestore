import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { supabase } from "../../supabaseClient";
import styles from "./PaymentForm.module.css";

function PaymentForm({ game, onPaymentSuccess }) {
  const initialValues = {
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  };

  const validationSchema = Yup.object({
    cardNumber: Yup.string()
      .matches(/^\d{16}$/, "Card number must be 16 digits")
      .required("Card number is required"),
    expiryDate: Yup.string()
      .matches(
        /^(0[1-9]|1[0-2])\/\d{2}$/,
        "Expiry date must be in MM/YY format"
      )
      .required("Expiry date is required"),
    cvv: Yup.string()
      .matches(/^\d{3}$/, "CVV must be 3 digits")
      .required("CVV is required"),
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        alert("You need to be logged in to make a purchase.");
        setSubmitting(false);
        return;
      }

      const response = await fetch("http://localhost:5000/simulate-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          game_id: game.game_id,
          user_id: user.id,
        }),
      });

      const result = await response.json();

      if (result.success) {
        alert("Payment successful!");
        onPaymentSuccess();
        resetForm();
      } else {
        alert("Failed to record purchase. Please try again.");
      }
    } catch (err) {
      alert("An error occurred. Please try again later.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.paymentForm}>
      <h2>Payment for {game.title}</h2>
      <p>Price: ${game.price}</p>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <div className={styles.formGroup}>
              <label htmlFor="cardNumber">Card Number</label>
              <Field
                type="text"
                id="cardNumber"
                name="cardNumber"
                placeholder="1234 5678 9012 3456"
              />
              <ErrorMessage
                name="cardNumber"
                component="div"
                className={styles.error}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="expiryDate">Expiry Date</label>
              <Field
                type="text"
                id="expiryDate"
                name="expiryDate"
                placeholder="MM/YY"
              />
              <ErrorMessage
                name="expiryDate"
                component="div"
                className={styles.error}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="cvv">CVV</label>
              <Field type="text" id="cvv" name="cvv" placeholder="123" />
              <ErrorMessage
                name="cvv"
                component="div"
                className={styles.error}
              />
            </div>

            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Processing..." : "Pay Now"}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default PaymentForm;
