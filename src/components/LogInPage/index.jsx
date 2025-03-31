import { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";
import { Formik, Form, Field, ErrorMessage } from "formik";
import loginValidationSchema from "../../validation/loginValidation";
import styles from "./LogInPage.module.css";

function LogInPage() {
  const [error, setError] = useState("");
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const user = await supabase.auth.getUser();
      if (user.data) {
        setCurrentUser(user.data);
      }
    };
    fetchUser();
  }, []);

  const handleLogin = async (values, { setSubmitting }) => {
    setError("");
    try {
      const { data: user, error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (error) {
        setError(`Login error: ${error.message}`);
      } else {
        setCurrentUser(user);
        alert("Login successful!");
      }
    } catch (err) {
      setError("Unable to process the request. Please try again later.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setCurrentUser(null);
  };

  return (
    <div className={styles.logInForm}>
      <h2>{currentUser ? `Hello, ${currentUser.email}` : "Log In"}</h2>
      {currentUser ? (
        <button onClick={handleSignOut}>Sign Out</button>
      ) : (
        <>
          {error && <p className={styles.error}>{error}</p>}
          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={loginValidationSchema}
            onSubmit={handleLogin}
          >
            {({ isSubmitting }) => (
              <Form>
                <label>Email:</label>
                <Field
                  name="email"
                  type="email"
                  placeholder="example@mail.com"
                  required
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
                  placeholder="Password"
                  required
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className={styles.error}
                />

                <button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Logging in..." : "Log In"}
                </button>
              </Form>
            )}
          </Formik>
        </>
      )}
    </div>
  );
}

export default LogInPage;
