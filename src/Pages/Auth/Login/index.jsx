import { useState } from "react";
import FormHeader from "../../../Components/Form/FormHeader";
import InputField from "../../../Components/Form/InputField";
import CheckboxField from "../../../Components/Form/CheckboxField";
import Button from "../../../Components/Form/Button";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { userLogin } from "../../../Thunks/Auth";
import { removeError } from "../../../Slices/authSlice";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const handleChange = (fieldName, value) => {
    setFormData((prev) => ({ ...prev, [fieldName]: value }));
    dispatch(removeError());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(removeError());
    const user = await dispatch(
      userLogin({ email: formData.email, password: formData.password })
    ).unwrap();

    if (user.email) {
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <FormHeader title="Sign in to your account" />

        <div className="bg-white py-8 px-6 shadow rounded-lg sm:px-10">
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error.match("auth/invalid-credential")
                ? "Invalid email or password"
                : error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <InputField
              id="email"
              type="email"
              label="Email address"
              icon="fa-envelope"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              required
              autoComplete="email"
            />

            <InputField
              id="password"
              type="password"
              label="Password"
              icon="fa-lock"
              placeholder="Enter your password"
              value={formData.password}
              onChange={(e) => handleChange("password", e.target.value)}
              required
              autoComplete="current-password"
            />

            <div className="flex items-center justify-between">
              <CheckboxField
                id="remember-me"
                label="Remember me"
                checked={formData.rememberMe}
                onChange={(e) => handleChange("rememberMe", e.target.checked)}
              />

              <div className="text-sm">
                <button
                  type="button"
                  className="font-medium text-blue-600 hover:text-blue-500 cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>
            </div>

            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? "Signing in..." : "Sign in"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
