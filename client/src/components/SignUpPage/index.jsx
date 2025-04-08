import { useState } from "react";
import { supabase } from "../../supabaseClient";
import { Formik, Form, Field, ErrorMessage } from "formik";
import signUpValidationSchema from "../../validation/signUpValidation";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "./SignUpPage.module.css";

function SignUpPage() {
  const [error, setError] = useState("");

  const handleSignUp = async (values, { setSubmitting }) => {
    setError("");
    try {
      const { data, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
      });

      if (error) {
        setError(error.message);
        return;
      }

      if (data.user) {
        const { error: insertError } = await supabase.from("user").insert([
          {
            user_name: values.userName,
            email: values.email,
            password: values.password,
            user_id: data.user.id,
          },
        ]);

        if (insertError) {
          setError(insertError.message);
        } else {
          toast.success(
            "🎉Please check your email 📩 and confirm your account to get started.",
            {
              position: "top-center",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "dark",
            }
          );
        }
      } else {
        setError("Oops! Something went wrong. Please try again.");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again later.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.signUpForm}>
      <h2>Join Us Today 🚀</h2>
      {error && <p className={styles.error}>❌ {error}</p>}
      <Formik
        initialValues={{ userName: "", email: "", password: "" }}
        validationSchema={signUpValidationSchema}
        onSubmit={handleSignUp}
      >
        {({ isSubmitting }) => (
          <Form className={styles.formContainer}>
            <label>Name:</label>
            <Field
              name="userName"
              type="text"
              placeholder="Enter your name"
              className={styles.inputField}
            />
            <ErrorMessage
              name="userName"
              component="div"
              className={styles.error}
            />

            <label>Email:</label>
            <Field
              name="email"
              type="email"
              placeholder="Your email address"
              className={styles.inputField}
            />
            <ErrorMessage
              name="email"
              component="div"
              className={styles.error}
            />

            <label>Password:</label>
            <Field
              name="password"
              type="password"
              placeholder="Create a password"
              className={styles.inputField}
            />
            <ErrorMessage
              name="password"
              component="div"
              className={styles.error}
            />

            <button
              type="submit"
              disabled={isSubmitting}
              className={styles.submitButton}
            >
              {isSubmitting ? "Creating your account..." : "Sign Up"}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default SignUpPage;
