"use client";
import { useState } from "react";
import { useAdminAuth } from "@/lib/admin-auth";
import { Lock, Eye, EyeOff } from "lucide-react";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAdminAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const success = await login(password);
      if (!success) {
        setError("Invalid password. Please try again.");
      }
    } catch (err) {
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
            <Lock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Admin Access
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Enter password to access admin panel
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                className="input pr-10"
                placeholder="Enter admin password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="text-red-600 text-sm text-center bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading || !password}
              className="btn btn-primary w-full"
            >
              {loading ? "Signing in..." : "Sign in to Admin"}
            </button>
          </div>
          
          <div className="text-center text-sm text-gray-500 dark:text-gray-400">
            <p>Default password: <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">admin123</code></p>
            <p className="mt-1">Change it in Settings after logging in</p>
          </div>
        </form>
      </div>
    </div>
  );
}
