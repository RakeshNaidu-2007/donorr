import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAuth } from "../contexts/AuthContext";
import { Heart, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register: registerUser } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch("password");

  const onSubmit = async (data) => {
    setLoading(true);

    try {
      const result = await registerUser(data);

      if (result.success) {
        toast.success("Registration successful!");

        if (data.role === "admin") navigate("/admin");
        else navigate("/dashboard");
      } else {
        toast.error(result.message);
      }
    } catch (err) {
      toast.error("An error occurred during registration");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4">

      <div className="mx-auto w-full max-w-md">
        <div className="flex justify-center">
          <Heart className="h-12 w-12 text-red-500" />
        </div>

        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
          Create your account
        </h2>

        <p className="mt-2 text-center text-sm text-gray-600">
          Or{" "}
          <Link to="/login" className="font-medium text-red-600 hover:text-red-500">
            sign in to your existing account
          </Link>
        </p>
      </div>

      <div className="mt-8 mx-auto w-full max-w-md">
        <div className="bg-white py-8 px-6 shadow-md rounded-lg">

          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>

            {/* NAME */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <input
                {...register("name", { required: true })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Enter your full name"
              />
              {errors.name && <p className="text-sm text-red-600">Name is required</p>}
            </div>

            {/* EMAIL */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Email Address</label>
              <input
                {...register("email", { required: true })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Enter your email"
                type="email"
              />
              {errors.email && <p className="text-sm text-red-600">Email is required</p>}
            </div>

            {/* PHONE */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone Number</label>
              <input
                {...register("phone", { required: true })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Enter phone number"
              />
              {errors.phone && <p className="text-sm text-red-600">Phone is required</p>}
            </div>

            {/* ROLE */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Select Role</label>
              <select
                {...register("role", { required: true })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="">-- Select your role --</option>
                <option value="donor">Donate Items</option>
                <option value="recipient">Request Items</option>
                <option value="logistics">Logistics Helper</option>
                <option value="admin">Administrator</option>
              </select>
              {errors.role && <p className="text-sm text-red-600">Role is required</p>}
            </div>

            {/* ORG */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Organization (Optional)</label>
              <input
                {...register("organization")}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Enter your organization"
              />
            </div>

            {/* PASSWORD */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <div className="relative">
                <input
                  {...register("password", { required: true })}
                  type={showPassword ? "text" : "password"}
                  className="mt-1 block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md"
                  placeholder="Enter password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3"
                  onClick={() => setShowPassword((v) => !v)}
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
            </div>

            {/* CONFIRM */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
              <input
                {...register("confirmPassword", {
                  required: true,
                  validate: (v) => v === password || "Passwords must match",
                })}
                type="password"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Re-enter password"
              />
              {errors.confirmPassword && (
                <p className="text-sm text-red-600">{errors.confirmPassword.message}</p>
              )}
            </div>

            <button
              disabled={loading}
              type="submit"
              className="w-full py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create account"}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
};

export default Register;
