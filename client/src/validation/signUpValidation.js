import * as Yup from "yup";

const signUpValidationSchema = Yup.object().shape({
  userName: Yup.string().required("Please enter your name"),
  email: Yup.string()
    .email("Invalid email")
    .required("Please enter your email"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters long")
    .required("Please enter your password"),
});

export default signUpValidationSchema;
