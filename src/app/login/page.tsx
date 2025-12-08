"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";

// --- HELPER & SIMULATED SHADCN/UI COMPONENTS ---
const cn = (...classes: (string | undefined | null | false)[]): string =>
  classes.filter(Boolean).join(" ");

const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input
    className={cn(
      "flex h-12 w-full rounded-xl border border-slate-700 bg-slate-800/50 px-4 py-2 text-sm text-gray-200 placeholder:text-gray-500",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
      className,
    )}
    ref={ref}
    {...props}
  />
));
Input.displayName = "Input";

// --- SVG ICONS ---
const EyeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
);

const EyeSlashIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.243 4.243L6.228 6.228"
    />
  </svg>
);

// --- MAIN LOGIN PAGE COMPONENT ---
export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginMethod, setLoginMethod] = useState<"email" | "phone">("email");
  const [phone, setPhone] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const router = useRouter();

  // Form validation
  const validateForm = () => {
    if (loginMethod === "email") {
      if (!formData.email) {
        toast.error("Email is required");
        return false;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        toast.error("Please enter a valid email address");
        return false;
      }
    } else if (loginMethod === "phone") {
      if (!phone || phone.length < 8) {
        toast.error("Please enter a valid phone number");
        return false;
      }
    }

    if (!formData.password) {
      toast.error("Password is required");
      return false;
    }
    if (formData.password.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return false;
    }

    return true;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const { apiFetch } = await import("../../lib/api");
      const identifier = loginMethod === "email" ? formData.email : phone;
      const data: any = await apiFetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password: formData.password }),
      });

      if (data.token) {
        try {
          localStorage.setItem("auth_token", data.token);
        } catch (e) {}
      }

      toast.success(data.message || "Login successful! Redirecting...");
      // Redirect to the local dashboard route
      setTimeout(() => {
        router.push("/dashboard");
      }, 800);
    } catch (err: any) {
      console.error("Login api error:", err);
      toast.error(
        err?.message ||
          err?.text ||
          "Login failed. Please check your credentials and try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    router.push("/forgot-password");
  };

  return (
    <div
      className="relative min-h-screen w-full text-gray-200 flex flex-col"
      style={{
        fontFamily: "Inter, sans-serif",
        background: "#0A1A2F",
      }}
    >
      {/* Corner glow effects */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
        <div
          className="absolute -top-20 -left-20 w-56 h-56"
          style={{
            background:
              "radial-gradient(closest-side, rgba(69,79,187,0.35) 0%, rgba(69,79,187,0.18) 45%, rgba(69,79,187,0.0) 70%)",
            filter: "blur(18px)",
          }}
        />
        <div
          className="absolute -top-36 -left-36 w-[540px] h-[540px]"
          style={{
            background:
              "radial-gradient(closest-side, rgba(69,79,187,0.14), rgba(69,79,187,0))",
            filter: "blur(12px)",
          }}
        />
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

            /* Custom styles for react-international-phone */
            .react-international-phone-input-container {
              width: 100%;
            }

            .react-international-phone-input-container .react-international-phone-input {
              height: 48px !important;
              width: 100% !important;
              background-color: rgba(30, 41, 59, 0.5) !important;
              border: 1px solid #334155 !important;
              border-radius: 0 12px 12px 0 !important;
              color: #e2e8f0 !important;
              font-size: 14px !important;
            }

            .react-international-phone-input-container .react-international-phone-input:focus {
              outline: none !important;
              box-shadow: 0 0 0 2px #3b82f6 !important;
            }

            .react-international-phone-input-container .react-international-phone-input::placeholder {
              color: #64748b !important;
            }

            .react-international-phone-country-selector-button {
              height: 48px !important;
              background-color: rgba(30, 41, 59, 0.5) !important;
              border: 1px solid #334155 !important;
              border-radius: 12px 0 0 12px !important;
              border-right: none !important;
              padding: 0 12px !important;
            }

            .react-international-phone-country-selector-button:hover {
              background-color: #334155 !important;
            }

            .react-international-phone-country-selector-dropdown {
              background-color: #1e293b !important;
              border: 1px solid #334155 !important;
              border-radius: 12px !important;
              box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3) !important;
              max-height: 300px !important;
              z-index: 9999 !important;
            }

            .react-international-phone-country-selector-dropdown__list-item {
              padding: 10px 12px !important;
              color: #e2e8f0 !important;
            }

            .react-international-phone-country-selector-dropdown__list-item:hover {
              background-color: #334155 !important;
            }

            .react-international-phone-country-selector-dropdown__list-item--selected {
              background-color: #3b82f6 !important;
              color: white !important;
            }

            .react-international-phone-dial-code-preview {
              color: #e2e8f0 !important;
            }
          `,
        }}
      />

      {/* Logo */}
      <div className="flex flex-col items-center justify-center pt-12 pb-8">
        <img
          src="/logo.png"
          alt="Summit Exchange Logo"
          className="h-16 w-auto"
        />
      </div>

      {/* Main Content */}
      <main className="relative z-10 flex-grow flex items-start justify-center px-4 pb-12">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="bg-[#0d1f35] border border-slate-800/50 rounded-3xl shadow-2xl p-8">
            {/* Header */}
            <h1 className="text-2xl font-bold text-white mb-2">
              Login to your account
            </h1>
            <p className="text-gray-400 text-sm mb-8">
              Don&apos;t have an account?{" "}
              <a
                href="/signup"
                className="font-medium text-blue-400 hover:text-blue-300 hover:underline transition-colors"
              >
                Sign up
              </a>
            </p>

            {/* Login Method Toggle */}
            <div className="flex gap-3 mb-8">
              <button
                type="button"
                onClick={() => setLoginMethod("email")}
                className={cn(
                  "flex-1 py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-200",
                  loginMethod === "email"
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25"
                    : "bg-slate-800/50 text-gray-400 hover:bg-slate-700/50 hover:text-gray-300 border border-slate-700",
                )}
              >
                Email Address
              </button>
              <button
                type="button"
                onClick={() => setLoginMethod("phone")}
                className={cn(
                  "flex-1 py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-200",
                  loginMethod === "phone"
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25"
                    : "bg-slate-800/50 text-gray-400 hover:bg-slate-700/50 hover:text-gray-300 border border-slate-700",
                )}
              >
                Phone Number
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email or Phone Input */}
              {loginMethod === "email" ? (
                <div>
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email address"
                    disabled={isLoading}
                    autoComplete="username"
                  />
                </div>
              ) : (
                <div>
                  <PhoneInput
                    defaultCountry="sg"
                    value={phone}
                    onChange={(phone) => setPhone(phone)}
                    placeholder="Enter phone number"
                    disabled={isLoading}
                  />
                </div>
              )}

              {/* Password Input */}
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  className="pr-12"
                  disabled={isLoading}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-4 flex items-center text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 text-white font-semibold h-12 rounded-xl text-sm hover:bg-blue-500 disabled:bg-slate-600 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-blue-600/25 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0d1f35] focus:ring-blue-500 mt-8"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="animate-spin h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Logging in...
                  </span>
                ) : (
                  "Login"
                )}
              </button>

              {/* Forgot Password Link */}
              <div className="text-center pt-4">
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-sm text-blue-400 hover:text-blue-300 hover:underline font-medium bg-transparent border-none cursor-pointer transition-colors"
                >
                  Forgot your password?
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>

      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        toastStyle={{
          backgroundColor: "#1E293B",
          color: "#F1F5F9",
          border: "1px solid #475569",
        }}
      />
    </div>
  );
}
