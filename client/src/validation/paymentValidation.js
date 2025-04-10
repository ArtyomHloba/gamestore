import * as Yup from "yup";

const paymentValidationSchema = Yup.object({
  cardNumber: Yup.string()
    .matches(/^\d{16}$/, "Card number must be 16 digits")
    .required("Card number is required"),
  expiryDate: Yup.string()
    .matches(/^(0[1-9]|1[0-2])\/\d{2}$/, "Expiry date must be in MM/YY format")
    .required("Expiry date is required")
    .test("expiryDate", "Card is expired", value => {
      if (!value) return false;

      const [month, year] = value.split("/").map(Number);
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth() + 1;
      const currentYear = currentDate.getFullYear() % 100;

      return (
        year > currentYear || (year === currentYear && month >= currentMonth)
      );
    }),
  cvv: Yup.string()
    .matches(/^\d{3}$/, "CVV must be 3 digits")
    .required("CVV is required"),
});

export default paymentValidationSchema;
