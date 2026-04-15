"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);

      const data = await loginUser(form);

      localStorage.setItem("token", data.access_token);
      localStorage.setItem("user", JSON.stringify(data.user));

      router.push("/home");
    } catch (err: any) {
      setError(err.message || "Erreur de connexion");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#D4D0C4] flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-[#111] border border-[#1A1A1A] rounded-2xl p-8">
        <h1 className="text-white text-3xl font-bold mb-2 text-center">WASL</h1>
        <p className="text-[#666] text-center mb-8">Connexion à votre espace</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm text-[#666] mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl px-4 py-3 text-white outline-none focus:border-[#C8A84E]"
              placeholder="email@wasl.com"
            />
          </div>

          <div>
            <label className="block text-sm text-[#666] mb-2">Mot de passe</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl px-4 py-3 text-white outline-none focus:border-[#C8A84E]"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="text-red-400 text-sm border border-red-500/20 bg-red-500/10 rounded-xl px-4 py-3">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#C8A84E] text-black font-semibold py-3 rounded-xl border border-[#C8A84E] hover:bg-[#d6b55a] transition disabled:opacity-50"
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>
      </div>
    </div>
  );
}