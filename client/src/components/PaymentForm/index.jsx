import paymentValidationSchema from "../../validation/paymentValidation";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { supabase } from "../../supabaseClient";
import styles from "./PaymentForm.module.css";

function PaymentForm({ game, onPaymentSuccess }) {
  const initialValues = {
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  };

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
    <div className={styles.paymentFormContainer}>
      <div className={styles.paymentTitle}>Payment for {game.title}</div>
      <div className={styles.paymentPrice}>Price: ${game.price}</div>

      <Formik
        initialValues={initialValues}
        validationSchema={paymentValidationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <div className={styles.formGroup}>
              <label htmlFor="cardNumber" className={styles.formLabel}>
                Card Number
              </label>
              <Field
                type="text"
                id="cardNumber"
                name="cardNumber"
                placeholder="1234 5678 9012 3456"
                className={styles.formInput}
              />
              <ErrorMessage
                name="cardNumber"
                component="div"
                className={styles.errorMessage}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="expiryDate" className={styles.formLabel}>
                Expiry Date
              </label>
              <Field
                type="text"
                id="expiryDate"
                name="expiryDate"
                placeholder="MM/YY"
                className={styles.formInput}
              />
              <ErrorMessage
                name="expiryDate"
                component="div"
                className={styles.errorMessage}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="cvv" className={styles.formLabel}>
                CVV
              </label>
              <Field
                type="text"
                id="cvv"
                name="cvv"
                placeholder="123"
                className={styles.formInput}
              />
              <ErrorMessage
                name="cvv"
                component="div"
                className={styles.errorMessage}
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={styles.submitButton}
            >
              {isSubmitting ? "Processing..." : "Pay Now"}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default PaymentForm;
