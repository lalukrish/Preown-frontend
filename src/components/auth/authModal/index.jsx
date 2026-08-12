"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiX } from "react-icons/fi";
import { useFormik } from "formik";
import * as Yup from "yup";
import logo from "@/assets/newlogo.png";

import { useRouter } from "next/navigation";
import { AppSnackbarProvider } from "@/components/Common/snackbar";
import { useAuth } from "@/context/AuthContext"; // ← add this

const LOGIN_URL = "https://backapp.preown.store/api/auth/local";
// NOTE: Strapi's default signup route is normally spelled "register".
// Keeping the "registar" path exactly as you gave it — double check this
// against your backend, since a typo here will silently 404.
const REGISTER_URL = "https://backapp.preown.store/api/auth/local/register";

const loginSchema = Yup.object({
  identifier: Yup.string().required("Email or username is required"),
  password: Yup.string().required("Password is required"),
});

const registerSchema = Yup.object({
  username: Yup.string().required("Username is required"),
  email: Yup.string()
    .email("Enter a valid email")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords do not match")
    .required("Please confirm your password"),
});

export default function AuthModal({ isOpen, onClose }) {
  const [isLogin, setIsLogin] = useState(true);
  const [serverError, setServerError] = useState("");
  const [serverSuccess, setServerSuccess] = useState("");
  const router = useRouter();
  const { login } = useAuth(); // ← add this, drop useRouter if unused now

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: isLogin
      ? { identifier: "", password: "" }
      : { username: "", email: "", password: "", confirmPassword: "" },
    validationSchema: isLogin ? loginSchema : registerSchema,
    // onSubmit: async (values, { setSubmitting }) => {
    //   setServerError("");
    //   setServerSuccess("");

    //   const url = isLogin ? LOGIN_URL : REGISTER_URL;
    //   const body = isLogin
    //     ? { identifier: values.identifier, password: values.password }
    //     : {
    //         username: values.username,
    //         email: values.email,
    //         password: values.password,
    //       };

    //   try {
    //     const res = await fetch(url, {
    //       method: "POST",
    //       headers: { "Content-Type": "application/json" },
    //       body: JSON.stringify(body),
    //     });

    //     const data = await res.json();

    //     if (!res.ok) {
    //       const message =
    //         data?.error?.message ||
    //         data?.message?.[0]?.messages?.[0]?.message ||
    //         "Something went wrong. Please try again.";
    //       throw new Error(message);
    //     }

    //     // Strapi returns { jwt, user } on success
    //     if (data.jwt) {
    //       localStorage.setItem("jwt", data.jwt);
    //     }

    //     setServerSuccess(
    //       isLogin ? "Signed in successfully." : "Account created successfully.",
    //     );
    //     setTimeout(() => {
    //       onClose();
    //     }, 800);
    //   } catch (err) {
    //     setServerError(err.message || "Network error. Please try again.");
    //   } finally {
    //     setSubmitting(false);
    //   }
    // },
    onSubmit: async (values, { setSubmitting }) => {
      setServerError("");
      setServerSuccess("");

      const url = isLogin ? LOGIN_URL : REGISTER_URL;
      const body = isLogin
        ? {
            identifier: values.identifier,
            password: values.password,
          }
        : {
            username: values.username,
            email: values.email,
            password: values.password,
          };

      try {
        const res = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        });

        const data = await res.json();

        if (!res.ok) {
          const message =
            data?.error?.message ||
            data?.message?.[0]?.messages?.[0]?.message ||
            "Something went wrong. Please try again.";

          throw new Error(message);
        }

        if (data.jwt) {
          login(data.user, data.jwt); // ← replaces the two localStorage.setItem calls

          localStorage.setItem("jwt", data.jwt);
          localStorage.setItem("user", JSON.stringify(data.user));
        }

        setServerSuccess(
          isLogin ? "Signed in successfully." : "Account created successfully.",
        );

        if (isLogin) {
          onClose(); // optional if inside a modal
          router.push("/dashboard");
          return;
        }

        // For registration, just close the modal
        setTimeout(() => {
          onClose();
        }, 600);
      } catch (err) {
        setServerError(err.message || "Network error. Please try again.");
      } finally {
        setSubmitting(false);
      }
    },
  });

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEsc);
      getComputedStyle(document.body).overflow;
    };
  }, [isOpen, onClose]);

  const switchMode = () => {
    setServerError("");
    setServerSuccess("");
    formik.resetForm();
    setIsLogin((prev) => !prev);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 40, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 40, opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute right-4 top-4 rounded-full p-2 text-gray-500 transition hover:bg-gray-100 hover:text-black"
            >
              <FiX size={20} />
            </button>

            {/* Header */}
            <div className="flex flex-col items-center px-8 pt-8">
              <img
                src={logo.src}
                alt="Logo"
                className="h-8 md:h-11 w-auto object-contain"
              />

              {/* <h2 className="mt-5 text-2xl font-bold text-gray-900">
                {isLogin ? "Welcome Back" : "Create Account"}
              </h2> */}

              <p className="mt-2 text-center text-sm text-gray-500">
                {isLogin
                  ? "Sign in to continue shopping."
                  : "Create an account to continue."}
              </p>
            </div>

            {/* Form */}
            <div className="px-8 py-6">
              {serverError && (
                <div className="mb-4 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">
                  {serverError}
                </div>
              )}
              {serverSuccess && (
                <div className="mb-4 rounded-lg bg-green-50 px-4 py-2 text-sm text-green-600">
                  {serverSuccess}
                </div>
              )}

              <form
                className="space-y-4"
                onSubmit={formik.handleSubmit}
                noValidate
              >
                {!isLogin && (
                  <div>
                    <input
                      type="text"
                      name="username"
                      placeholder="Username"
                      value={formik.values.username || ""}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={`w-full rounded-lg border px-4 py-3 outline-none focus:border-cyan-500 ${
                        formik.touched.username && formik.errors.username
                          ? "border-cyan-400"
                          : "border-gray-300"
                      }`}
                    />
                    {formik.touched.username && formik.errors.username && (
                      <p className="mt-1 text-xs text-red-500">
                        {formik.errors.username}
                      </p>
                    )}
                  </div>
                )}

                {isLogin ? (
                  <div>
                    <input
                      type="text"
                      name="identifier"
                      placeholder="Email Address"
                      value={formik.values.identifier || ""}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={`w-full rounded-lg border px-4 py-3 outline-none focus:border-cyan-500 ${
                        formik.touched.identifier && formik.errors.identifier
                          ? "border-red-400"
                          : "border-gray-300"
                      }`}
                    />
                    {formik.touched.identifier && formik.errors.identifier && (
                      <p className="mt-1 text-xs text-red-500">
                        {formik.errors.identifier}
                      </p>
                    )}
                  </div>
                ) : (
                  <div>
                    <input
                      type="email"
                      name="email"
                      placeholder="Email Address"
                      value={formik.values.email || ""}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={`w-full rounded-lg border px-4 py-3 outline-none focus:border-cyan-500 ${
                        formik.touched.email && formik.errors.email
                          ? "border-red-400"
                          : "border-gray-300"
                      }`}
                    />
                    {formik.touched.email && formik.errors.email && (
                      <p className="mt-1 text-xs text-red-500">
                        {formik.errors.email}
                      </p>
                    )}
                  </div>
                )}

                <div>
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formik.values.password || ""}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full rounded-lg border px-4 py-3 outline-none focus:border-cyan-500 ${
                      formik.touched.password && formik.errors.password
                        ? "border-red-400"
                        : "border-gray-300"
                    }`}
                  />
                  {formik.touched.password && formik.errors.password && (
                    <p className="mt-1 text-xs text-red-500">
                      {formik.errors.password}
                    </p>
                  )}
                </div>

                {!isLogin && (
                  <div>
                    <input
                      type="password"
                      name="confirmPassword"
                      placeholder="Confirm Password"
                      value={formik.values.confirmPassword || ""}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={`w-full rounded-lg border px-4 py-3 outline-none focus:border-cyan-500 ${
                        formik.touched.confirmPassword &&
                        formik.errors.confirmPassword
                          ? "border-red-400"
                          : "border-gray-300"
                      }`}
                    />
                    {formik.touched.confirmPassword &&
                      formik.errors.confirmPassword && (
                        <p className="mt-1 text-xs text-red-500">
                          {formik.errors.confirmPassword}
                        </p>
                      )}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={formik.isSubmitting}
                  className="w-full rounded-lg bg-cyan-950 py-3 font-semibold text-white transition hover:bg-cyan-950 disabled:opacity-60"
                >
                  {formik.isSubmitting
                    ? "Please wait..."
                    : isLogin
                      ? "Sign In"
                      : "Create Account"}
                </button>
              </form>

              <div className="mt-6 text-center">
                <button
                  onClick={switchMode}
                  className="text-sm font-medium text-cyan-800 hover:underline"
                >
                  {isLogin
                    ? "Don't have an account? Sign Up"
                    : "Already have an account? Sign In"}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
