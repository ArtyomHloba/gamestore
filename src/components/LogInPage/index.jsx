import { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";
import { Formik, Form, Field, ErrorMessage } from "formik";
import loginValidationSchema from "../../validation/loginValidation";
import styles from "./LogInPage.module.css";

function LogInPage() {
  const [error, setError] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        setError("Error fetching user data");
        return;
      }
      if (data?.user) {
        setCurrentUser(data.user);
        fetchUserData(data.user.email);
      }
    };

    const fetchUserData = async email => {
      const { data, error } = await supabase
        .from("user")
        .select("user_name")
        .eq("email", email)
        .single();

      if (error) {
        setError("Error fetching profile data");
        return;
      }
      setUserData(data);
    };

    fetchUser();
  }, []);

  const handleLogin = async (values, { setSubmitting }) => {
    setError("");

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (error) {
        setError(`Login error: ${error.message}`);
      } else if (data?.user) {
        setCurrentUser(data.user);
        fetchUserData(data.user.email);
        alert("You have successfully logged in!");
      }
    } catch (err) {
      setError("Failed to process request. Please try again later.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setCurrentUser(null);
    setUserData(null);
  };

  return (
    <div className={styles.logInForm}>
      <h2>
        {currentUser ? `Hello, ${userData?.user_name || "User"}!` : "Log in"}
      </h2>
      {currentUser ? (
        <>
          <p>Email: {currentUser.email}</p>
          <button className={styles.logOutBtn} onClick={handleSignOut}>
            Log out
          </button>
        </>
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
                  className={styles.inputField}
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className={styles.errorValid}
                />

                <label>Password:</label>
                <Field
                  name="password"
                  type="password"
                  placeholder="Password"
                  required
                  className={styles.inputField}
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className={styles.errorValid}
                />

                <button
                  className={styles.logOutBtn}
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Logging in..." : "Log in"}
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
