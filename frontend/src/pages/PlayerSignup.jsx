import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/icon.png";
import { register } from "../services/authService";
import { useAuth } from "../context/authContext";

function PlayerSignup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    whatsappNumber: "",
    password: "",
    confirmPassword: "",
    dob: "",
    academy: "",
  });
  const [age, setAge] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const { loginUser } = useAuth();

  const [fieldErrors, setFieldErrors] = useState({
    name: "",
    email: "",
    whatsappNumber: "",
    password: "",
    confirmPassword: "",
    dob: "",
    academy: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Real-time validation for name field - prevent numbers
    if (name === "name" && /\d/.test(value)) {
      setFieldErrors((prev) => ({
        ...prev,
        name: "Name cannot contain numbers",
      }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    setFieldErrors((prev) => ({
      ...prev,
      [name]: "",
    }));

    // Calculate age when DOB changes
    if (name === "dob") {
      const birthDate = new Date(value);
      const today = new Date();
      
      // Check if date is valid
      if (isNaN(birthDate.getTime())) {
        setAge("");
        return;
      }
      
      // Check if date is in the future
      if (birthDate > today) {
        setFieldErrors((prev) => ({
          ...prev,
          dob: "Date of birth cannot be in the future",
        }));
        setAge("");
        return;
      }
      
      let calculatedAge = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        calculatedAge--;
      }
      
      // Check if age is at least 5 years
      if (calculatedAge < 5) {
        setFieldErrors((prev) => ({
          ...prev,
          dob: "Player must be at least 5 years old",
        }));
      }
      
      setAge(calculatedAge);
    }

    // Real-time validation for each field
    validateField(name, value);

    // Check password strength when password field changes
    if (name === "password") {
      const strength = calculatePasswordStrength(value);
      setPasswordStrength(strength);

      // Also update confirmPassword validation if it exists
      if (formData.confirmPassword) {
        validateField("confirmPassword", formData.confirmPassword);
      }
    }

    // Real-time validation for confirm password
    if (name === "confirmPassword") {
      if (value !== formData.password) {
        setFieldErrors((prev) => ({
          ...prev,
          confirmPassword: "Passwords do not match",
        }));
      } else {
        setFieldErrors((prev) => ({
          ...prev,
          confirmPassword: "",
        }));
      }
    }

    // Real-time validation for email format
    if (name === "email") {
      if (value.trim() === "") {
        setFieldErrors((prev) => ({
          ...prev,
          email: "Email is required",
        }));
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        setFieldErrors((prev) => ({
          ...prev,
          email: "Please enter a valid email address",
        }));
      }
    }

    // Real-time validation for whatsapp number
    if (name === "whatsappNumber") {
      if (value.trim() === "") {
        setFieldErrors((prev) => ({
          ...prev,
          whatsappNumber: "WhatsApp number is required",
        }));
      } else if (!/^[0-9]{10,15}$/.test(value.replace(/[\s-]/g, ""))) {
        setFieldErrors((prev) => ({
          ...prev,
          whatsappNumber: "Please enter a valid WhatsApp number",
        }));
      }
    }
  };

  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "name":
        if (value.trim() === "") {
          error = "Name is required";
        } else if (value.length < 2) {
          error = "Name must be at least 2 characters";
        } else if (/\d/.test(value)) {
          error = "Name cannot contain numbers";
        }
        break;

      case "email":
        if (value.trim() === "") {
          error = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = "Please enter a valid email address";
        }
        break;

      case "whatsappNumber":
        if (value.trim() === "") {
          error = "WhatsApp number is required";
        } else if (!/^[0-9]{10,15}$/.test(value.replace(/[\s-]/g, ""))) {
          error = "Please enter a valid WhatsApp number";
        }
        break;

      case "password":
        if (value === "") {
          error = "Password is required";
        } else if (value.length < 8) {
          error = "Password must be at least 8 characters";
        } else if (passwordStrength < 2) {
          error = "Password is too weak";
        }

        // Also update confirmPassword validation if it exists
        if (formData.confirmPassword && value !== formData.confirmPassword) {
          setFieldErrors((prev) => ({
            ...prev,
            confirmPassword: "Passwords do not match",
          }));
        } else if (formData.confirmPassword) {
          setFieldErrors((prev) => ({
            ...prev,
            confirmPassword: "",
          }));
        }
        break;

      case "confirmPassword":
        if (value === "") {
          error = "Please confirm your password";
        } else if (value !== formData.password) {
          error = "Passwords do not match";
        }
        break;

      case "dob":
        if (value === "") {
          error = "Date of birth is required";
        } else {
          const birthDate = new Date(value);
          const today = new Date();
          
          if (isNaN(birthDate.getTime())) {
            error = "Please enter a valid date";
          } else if (birthDate > today) {
            error = "Date of birth cannot be in the future";
          } else {
            let calculatedAge = today.getFullYear() - birthDate.getFullYear();
            const m = today.getMonth() - birthDate.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
              calculatedAge--;
            }
            
            if (calculatedAge < 5) {
              error = "Player must be at least 5 years old";
            }
          }
        }
        break;

      default:
        break;
    }

    setFieldErrors((prev) => ({
      ...prev,
      [name]: error,
    }));

    return error === "";
  };

  const validateForm = () => {
    let isValid = true;

    // Validate each field
    Object.keys(formData).forEach((field) => {
      // Skip academy validation as it's not required
      if (field === "academy") return;
      
      if (!validateField(field, formData[field])) {
        isValid = false;
      }
    });

    return isValid;
  };

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    return strength;
  };

  const getStrengthText = () => {
    switch (passwordStrength) {
      case 0:
        return "Very Weak";
      case 1:
        return "Weak";
      case 2:
        return "Medium";
      case 3:
        return "Strong";
      case 4:
        return "Very Strong";
      default:
        return "";
    }
  };

  const getStrengthColor = () => {
    switch (passwordStrength) {
      case 0:
        return "bg-red-500";
      case 1:
        return "bg-orange-500";
      case 2:
        return "bg-yellow-500";
      case 3:
        return "bg-green-500";
      case 4:
        return "bg-green-600";
      default:
        return "bg-gray-300";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (step === 1) {
      const isEmailValid = validateField("email", formData.email);
      const isPasswordValid = validateField("password", formData.password);
      const isConfirmPasswordValid = validateField(
        "confirmPassword",
        formData.confirmPassword
      );

      if (isEmailValid && isPasswordValid && isConfirmPasswordValid) {
        setStep(2);
      }
      return;
    }

    // Validate form
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Call the register API
      const response = await register({
        name: formData.name,
        email: formData.email,
        phone: formData.whatsappNumber,
        password: formData.password,
        dob: formData.dob,
        academy: formData.academy || undefined,
        role: "player"
      });

      // Update auth context
      loginUser(response.user);

      // Redirect to OTP verification
      navigate("/player/verify-otp");
    } catch (err) {
      if (err.response?.data?.message.includes("email already exists")) {
        setFieldErrors((prev) => ({
          ...prev,
          email: "Email already exists",
        }));
        setStep(1);
      } else {
        setError(
          err.response?.data?.message ||
            "Registration failed. Please try again."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="flex items-center">
            <div className="rounded-lg mr-3">
              <img src={logo} alt="ServeUp Logo" className="h-10 w-10" />
            </div>
            <span className="text-3xl font-bold text-white">FuturePlay</span>
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
          Create Your Player Account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-400">
          Join tournaments, track your progress, and connect with other players
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
              onClick={() => {
                window.location.href = "http://localhost:5000/api/auth/google/player";
              }}
              className="w-full flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white hover:bg-gray-50 text-gray-800 font-medium transition"
            >
              <svg
                width="18"
                height="18"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 48 48"
                className="mr-2"
              >
                <path
                  fill="#FFC107"
                  d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                />
                <path
                  fill="#FF3D00"
                  d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                />
                <path
                  fill="#4CAF50"
                  d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                />
                <path
                  fill="#1976D2"
                  d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                />
              </svg>
              Sign up with Google
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
            {/* Step indicator */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div
                  className={`rounded-full h-8 w-8 flex items-center justify-center ${
                    step === 1 ? "bg-red-600" : "bg-gray-600"
                  } text-white font-medium`}
                >
                  1
                </div>
                <div
                  className={`h-1 w-10 ${
                    step === 1 ? "bg-red-600" : "bg-gray-600"
                  }`}
                ></div>
                <div
                  className={`rounded-full h-8 w-8 flex items-center justify-center ${
                    step === 2 ? "bg-red-600" : "bg-gray-600"
                  } text-white font-medium`}
                >
                  2
                </div>
              </div>
              <div className="text-sm text-gray-400">Step {step} of 2</div>
            </div>

            {step === 1 ? (
              <>
                {/* Step 1: Email and Password */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-300"
                  >
                    Email <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className={`appearance-none block w-full px-3 py-2 border ${
                        fieldErrors.email ? "border-red-500" : "border-gray-600"
                      } rounded-md shadow-sm placeholder-gray-500 bg-gray-700 text-white focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm`}
                      placeholder="Enter your email"
                    />
                  </div>
                  {fieldErrors.email && (
                    <p className="mt-1 text-xs text-red-500">
                      {fieldErrors.email}
                    </p>
                  )}
                </div>

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
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className={`appearance-none block w-full px-3 py-2 border ${
                        fieldErrors.password
                          ? "border-red-500"
                          : "border-gray-600"
                      } rounded-md shadow-sm placeholder-gray-500 bg-gray-700 text-white focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm pr-10`}
                      placeholder="Create a password"
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
                  {formData.password && (
                    <div className="mt-2">
                      <div className="flex items-center justify-between mb-1">
                        <div className="text-xs text-gray-400">
                          Password strength:
                        </div>
                        <div
                          className="text-xs font-medium"
                          style={{
                            color:
                              passwordStrength >= 3
                                ? "#10B981"
                                : passwordStrength >= 2
                                ? "#F59E0B"
                                : "#EF4444",
                          }}
                        >
                          {getStrengthText()}
                        </div>
                      </div>
                      <div className="h-1 w-full bg-gray-600 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${getStrengthColor()}`}
                          style={{ width: `${(passwordStrength / 4) * 100}%` }}
                        ></div>
                      </div>
                      <div className="mt-1 text-xs text-gray-400">
                        Use 8+ characters with a mix of letters, numbers &
                        symbols
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-gray-300"
                  >
                    Confirm Password <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1 relative">
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      autoComplete="new-password"
                      required
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={`appearance-none block w-full px-3 py-2 border ${
                        fieldErrors.confirmPassword
                          ? "border-red-500"
                          : "border-gray-600"
                      } rounded-md shadow-sm placeholder-gray-500 bg-gray-700 text-white focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm pr-10`}
                      placeholder="Confirm your password"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-300"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? (
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
                  {fieldErrors.confirmPassword && (
                    <p className="mt-1 text-xs text-red-500">
                      {fieldErrors.confirmPassword}
                    </p>
                  )}
                </div>
              </>
            ) : (
              <>
                {/* Step 2: Personal Information */}
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-300"
                  >
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1">
                    <input
                      id="name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className={`appearance-none block w-full px-3 py-2 border ${
                        fieldErrors.name ? "border-red-500" : "border-gray-600"
                      } rounded-md shadow-sm placeholder-gray-500 bg-gray-700 text-white focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm`}
                      placeholder="Enter your full name"
                    />
                  </div>
                  {fieldErrors.name && (
                    <p className="mt-1 text-xs text-red-500">
                      {fieldErrors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="whatsappNumber"
                    className="block text-sm font-medium text-gray-300"
                  >
                    WhatsApp Number <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1">
                    <input
                      id="whatsappNumber"
                      name="whatsappNumber"
                      type="tel"
                      autoComplete="tel"
                      required
                      value={formData.whatsappNumber}
                      onChange={handleChange}
                      className={`appearance-none block w-full px-3 py-2 border ${
                        fieldErrors.whatsappNumber ? "border-red-500" : "border-gray-600"
                      } rounded-md shadow-sm placeholder-gray-500 bg-gray-700 text-white focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm`}
                      placeholder="Enter your WhatsApp number"
                    />
                  </div>
                  {fieldErrors.whatsappNumber && (
                    <p className="mt-1 text-xs text-red-500">
                      {fieldErrors.whatsappNumber}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="dob"
                    className="block text-sm font-medium text-gray-300"
                  >
                    Date of Birth <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1">
                    <input
                      id="dob"
                      name="dob"
                      type="date"
                      required
                      value={formData.dob}
                      onChange={handleChange}
                      className={`appearance-none block w-full px-3 py-2 border ${
                        fieldErrors.dob ? "border-red-500" : "border-gray-600"
                      } rounded-md shadow-sm placeholder-gray-500 bg-gray-700 text-white focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm`}
                    />
                  </div>
                  {fieldErrors.dob && (
                    <p className="mt-1 text-xs text-red-500">
                      {fieldErrors.dob}
                    </p>
                  )}
                  {age && !fieldErrors.dob && (
                    <p className="mt-1 text-xs text-gray-400">
                      Age: {age} years
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="academy"
                    className="block text-sm font-medium text-gray-300"
                  >
                    Academy
                  </label>
                  <div className="mt-1">
                    <input
                      id="academy"
                      name="academy"
                      type="text"
                      value={formData.academy}
                      onChange={handleChange}
                      className={`appearance-none block w-full px-3 py-2 border ${
                        fieldErrors.academy ? "border-red-500" : "border-gray-600"
                      } rounded-md shadow-sm placeholder-gray-500 bg-gray-700 text-white focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm`}
                      placeholder="Enter your academy (optional)"
                    />
                  </div>
                  {fieldErrors.academy && (
                    <p className="mt-1 text-xs text-red-500">
                      {fieldErrors.academy}
                    </p>
                  )}
                </div>
              </>
            )}

            <div className="flex justify-between">
              {step === 2 && (
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="py-2 px-4 border border-gray-600 rounded-md shadow-sm text-sm font-medium text-white bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Back
                </button>
              )}
              <button
                type="submit"
                disabled={isLoading}
                className={`${
                  step === 2 ? "w-auto" : "w-full"
                } flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                  isLoading
                    ? "bg-red-700 cursor-not-allowed"
                    : "bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                }`}
              >
                {isLoading ? (
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                ) : null}
                {isLoading
                  ? "Creating account..."
                  : step === 1
                  ? "Continue"
                  : "Create My Player Account"}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400">
              Already have an account?{" "}
              <Link
                to="/player/login"
                className="font-medium text-red-400 hover:text-red-300"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlayerSignup;