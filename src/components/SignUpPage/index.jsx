import { useState } from "react";
import { supabase } from "../../supabaseClient";
import { Formik, Form, Field, ErrorMessage } from "formik";
import signUpValidationSchema from "../../validation/signUpValidation";
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
          alert("Registration successful!");
        }
      } else {
        setError("Error: User not created.");
      }
    } catch (err) {
      setError("Registration error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.signUpForm}>
      <h2>Sign Up</h2>
      {error && <p className={styles.error}>{error}</p>}
      <Formik
        initialValues={{ userName: "", email: "", password: "" }}
        validationSchema={signUpValidationSchema}
        onSubmit={handleSignUp}
      >
        {({ isSubmitting }) => (
          <Form>
            <label>Name:</label>
            <Field name="userName" type="text" placeholder="Your name" />
            <ErrorMessage
              name="userName"
              component="div"
              className={styles.error}
            />

            <label>Email:</label>
            <Field name="email" type="email" placeholder="example@mail.com" />
            <ErrorMessage
              name="email"
              component="div"
              className={styles.error}
            />

            <label>Password:</label>
            <Field name="password" type="password" placeholder="Password" />
            <ErrorMessage
              name="password"
              component="div"
              className={styles.error}
            />

            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Registering..." : "Sign Up"}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default SignUpPage;
