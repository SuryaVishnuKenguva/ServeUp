import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/icon.png";
import { login } from "../services/authService";
import { useAuth } from "../context/authContext";

function PlayerLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const { loginUser } = useAuth();

  // Validation Functions
  const validateEmail = (value) => {
    if (value.trim() === "") {
      setFieldErrors((prev) => ({ ...prev, email: "Email is required" }));
      return false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setFieldErrors((prev) => ({
        ...prev,
        email: "Please enter a valid email address",
      }));
      return false;
    }
    setFieldErrors((prev) => ({ ...prev, email: "" }));
    return true;
  };

  const validatePassword = (value) => {
    if (value === "") {
      setFieldErrors((prev) => ({ ...prev, password: "Password is required" }));
      return false;
    }
    setFieldErrors((prev) => ({ ...prev, password: "" }));
    return true;
  };

  // Input Change Handlers
  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    validateEmail(value);
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    validatePassword(value);
  };

  // Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);

    if (!isEmailValid || !isPasswordValid) return;

    setIsLoading(true);
    try {
      const response = await login(email, password, "player");
      loginUser(response.user);
      navigate("/player/home");
    } catch (err) {
      if (err.response?.status === 401) {
        setError("Invalid email or password. Please try again.");
      } else if (err.response?.data?.message?.includes("not found")) {
        setFieldErrors((prev) => ({ ...prev, email: "Email not registered" }));
      } else {
        setError(
          err.response?.data?.message || "Login failed. Please try again."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Google OAuth Sign In
  const handleGoogleSignIn = () => {
    window.location.href = "http://localhost:5000/api/auth/google/player";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="flex items-center">
            <img src={logo} alt="Logo" className="h-10 w-10 mr-3" />
            <span className="text-3xl font-bold text-white">FuturePlay</span>
          </div>
        </div>

        <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
          Player Sign In
        </h2>
        <p className="mt-2 text-center text-sm text-gray-400">
          Access your player dashboard and tournament registrations
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-gray-800 py-8 px-4 shadow-lg sm:rounded-lg sm:px-10 border border-gray-700">
          {error && (
            <div className="mb-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
              <p>{error}</p>
            </div>
          )}

          {/* Google Sign In */}
          <div className="mb-6">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              className="w-full flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white hover:bg-gray-50 text-gray-800 font-medium transition"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 48 48">
                <g>
                  <path
                    fill="#4285F4"
                    d="M24 9.5c3.54 0 6.7 1.22 9.19 3.23l6.85-6.85C36.68 2.64 30.73 0 24 0 14.82 0 6.71 5.8 2.69 14.09l7.98 6.2C12.13 13.09 17.61 9.5 24 9.5z"
                  />
                  <path
                    fill="#34A853"
                    d="M46.1 24.55c0-1.64-.15-3.22-.42-4.74H24v9.01h12.42c-.53 2.87-2.13 5.3-4.54 6.94l7.02 5.46C43.98 37.18 46.1 31.34 46.1 24.55z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M9.67 28.29a14.5 14.5 0 010-8.58l-7.98-6.2a24 24 0 000 21.03l7.98-6.25z"
                  />
                  <path
                    fill="#EA4335"
                    d="M24 48c6.48 0 11.91-2.15 15.88-5.85l-7.02-5.46c-2.02 1.35-4.6 2.16-8.86 2.16-6.39 0-11.87-3.59-14.33-8.78l-7.98 6.25C6.71 42.2 14.82 48 24 48z"
                  />
                </g>
              </svg>
              Sign in with Google
            </button>
            <div className="text-xs text-center mt-1 text-gray-400">
              Fastest way to get started • No password needed
            </div>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-800 text-gray-400">
                Or continue with email
              </span>
            </div>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-300"
              >
                Email <span className="text-red-500">*</span>
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={handleEmailChange}
                required
                className={`mt-1 block w-full px-3 py-2 border ${
                  fieldErrors.email ? "border-red-500" : "border-gray-600"
                } rounded-md shadow-sm placeholder-gray-500 bg-gray-700 text-white focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm`}
                placeholder="Enter your email"
              />
              {fieldErrors.email && (
                <p className="mt-1 text-xs text-red-500">{fieldErrors.email}</p>
              )}
            </div>

            {/* Password Field with visibility toggle */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-300"
              >
                Password <span className="text-red-500">*</span>
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={handlePasswordChange}
                  required
                  className={`block w-full px-3 py-2 border ${
                    fieldErrors.password ? "border-red-500" : "border-gray-600"
                  } rounded-md shadow-sm placeholder-gray-500 bg-gray-700 text-white focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm pr-10`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-300"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              </div>
              {fieldErrors.password && (
                <p className="mt-1 text-xs text-red-500">
                  {fieldErrors.password}
                </p>
              )}
            </div>

            {/* Remember Me and Signup Link */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={() => setRememberMe((prev) => !prev)}
                  className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 text-sm text-gray-300"
                >
                  Remember me
                </label>
              </div>
              <Link
                to="/player/signup"
                className="text-sm text-red-500 hover:text-red-400"
              >
                Don't have an account?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium bg-red-600 hover:bg-red-700 text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition disabled:opacity-50"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin h-5 w-5 mr-2 text-white"
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
                      d="M4 12a8 8 0 018-8v8z"
                    />
                  </svg>
                  Signing in...
                </span>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400">
              New to FuturePlay?{" "}
              <Link
                to="/player/signup"
                className="font-medium text-red-400 hover:text-red-300"
              >
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlayerLogin;