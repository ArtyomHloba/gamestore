import { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";
import { Formik, Form, Field, ErrorMessage } from "formik";
import loginValidationSchema from "../../validation/loginValidation";
import ClipLoader from "react-spinners/ClipLoader";
import styles from "./LogInPage.module.css";

function LogInPage() {
  const [error, setError] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        setLoading(false);
        return;
      }
      if (data?.user) {
        setCurrentUser(data.user);
        await fetchUserData(data.user.email);
      }
      setLoading(false);
    };

    const fetchUserData = async email => {
      const { data, error } = await supabase
        .from("user")
        .select("user_name")
        .eq("email", email)
        .single();

      if (!error) {
        setUserData(data);
      }
    };

    fetchUser();
  }, []);

  const handleLogin = async (values, { setSubmitting }) => {
    setError("");
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (error) {
        setError(`Login error: ${error.message}`);
      } else if (data?.user) {
        setCurrentUser(data.user);
        await fetchUserData(data.user.email);
      }
    } catch (err) {
      setError("Failed to process request. Please try again later.");
    } finally {
      setSubmitting(false);
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    setCurrentUser(null);
    setUserData(null);
    setLoading(false);
  };

  return (
    <div className={styles.logInForm}>
      {loading ? (
        <div className={styles.loaderContainer}>
          <ClipLoader color="#f39c12" size={50} />
        </div>
      ) : (
        <>
          <h2>
            {currentUser
              ? `Hello, ${userData?.user_name || "User"}!`
              : "Log in"}
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
        </>
      )}
    </div>
  );
}

export default LogInPage;
