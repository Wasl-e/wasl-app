"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createPricing, deletePricing, getPricing } from "@/lib/api";
import { getStoredUser, getToken } from "@/lib/session";

const sites = [
  "Casablanca centre-ville",
  "Casablanca Aéroport",
  "Rabat centre-ville",
  "Rabat Aéroport",
  "Tanger Aéroport",
  "Plateforme Tanger free zone",
  "Marrakech centre-ville",
  "Marrakech Aéroport",
  "Plateforme Marrakech",
  "Agadir centre-ville",
  "Agadir Aéroport",
  "Essaouira",
  "Fés centre-ville",
  "Fés Aéroport",
  "Oujda",
  "Ouarzazate",
  "Plateforme Kénitra",
];

function formatMoneyWithDecimals(value: number) {
  return new Intl.NumberFormat("fr-FR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export default function TarifsPage() {
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [pricing, setPricing] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    departureSite: "",
    arrivalSite: "",
    amountHt: "",
  });

  const loadPricing = async () => {
    try {
      const data = await getPricing();
      setPricing(data);
    } catch (error) {
      console.error("Erreur chargement tarifs :", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = getToken();
    const storedUser = getStoredUser();

    if (!token || !storedUser) {
      router.push("/login");
      return;
    }

    if (storedUser.role !== "ADMIN") {
      router.push("/home");
      return;
    }

    setUser(storedUser);
    loadPricing();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await createPricing({
        departureSite: form.departureSite,
        arrivalSite: form.arrivalSite,
        amountHt: Number(form.amountHt),
      });

      setForm({
        departureSite: "",
        arrivalSite: "",
        amountHt: "",
      });

      await loadPricing();
    } catch (error: any) {
      console.error(error);
      alert(error.message || "Erreur lors de la création du tarif");
    }
  };

  const handleDelete = async (id: number) => {
    const confirmDelete = window.confirm("Supprimer ce tarif ?");

    if (!confirmDelete) return;

    try {
      await deletePricing(id);
      await loadPricing();
    } catch (error: any) {
      console.error(error);
      alert(error.message || "Erreur lors de la suppression");
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#D4D0C4] font-sans">
      {/* NAVBAR */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#1A1A1A]">
        <div className="flex items-center gap-8">
          <h1 className="text-white font-bold text-xl tracking-[0.2em]">WASL</h1>

          <div className="flex gap-3">
            <button
              onClick={() => router.push("/home")}
              className="bg-[#111] border border-[#1A1A1A] px-4 py-2 rounded-lg hover:border-[#C8A84E]"
            >
              Tableau de bord
            </button>

            <button
              onClick={() => router.push("/facturation")}
              className="bg-[#111] border border-[#1A1A1A] px-4 py-2 rounded-lg hover:border-[#C8A84E]"
            >
              Facturation
            </button>

            <button className="bg-[#13110A] border border-[#C8A84E] text-[#C8A84E] px-4 py-2 rounded-lg">
              Tarifs
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-sm text-[#666]">
            {user?.role === "ADMIN" ? "Admin" : "Utilisateur"}
          </div>
        </div>
      </div>

      <div className="px-6 py-8 space-y-8">
        <div>
          <h2 className="text-white text-3xl font-semibold">Tarifs</h2>
          <p className="text-[#666] mt-1">
            Configure les prix HT par trajet
          </p>
        </div>

        {/* FORM */}
        <div className="bg-[#111] border border-[#1A1A1A] rounded-xl p-5">
          <h3 className="text-white font-semibold mb-4">Ajouter un tarif</h3>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm text-[#666] mb-2">Départ</label>
              <select
                value={form.departureSite}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, departureSite: e.target.value }))
                }
                className="w-full bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl px-4 py-3 text-white outline-none focus:border-[#C8A84E]"
              >
                <option value="">Sélectionner</option>
                {sites.map((site) => (
                  <option key={site} value={site}>
                    {site}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-[#666] mb-2">Arrivée</label>
              <select
                value={form.arrivalSite}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, arrivalSite: e.target.value }))
                }
                className="w-full bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl px-4 py-3 text-white outline-none focus:border-[#C8A84E]"
              >
                <option value="">Sélectionner</option>
                {sites.map((site) => (
                  <option key={site} value={site}>
                    {site}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-[#666] mb-2">Montant HT</label>
              <input
                type="number"
                value={form.amountHt}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, amountHt: e.target.value }))
                }
                placeholder="Ex : 110"
                className="w-full bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl px-4 py-3 text-white outline-none focus:border-[#C8A84E]"
              />
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                className="w-full px-4 py-3 rounded-xl border border-[#C8A84E] bg-[#C8A84E] text-black font-semibold hover:bg-[#d6b55a] transition"
              >
                Ajouter
              </button>
            </div>
          </form>
        </div>

        {/* TABLE */}
        <div className="bg-[#111] border border-[#1A1A1A] rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="text-left text-[#666] border-b border-[#141414]">
              <tr>
                <th className="px-4 py-3 font-medium">DÉPART</th>
                <th className="px-4 py-3 font-medium">ARRIVÉE</th>
                <th className="px-4 py-3 font-medium">MONTANT HT</th>
                <th className="px-4 py-3 font-medium text-right">ACTION</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-[#777]">
                    Chargement...
                  </td>
                </tr>
              ) : pricing.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-[#777]">
                    Aucun tarif enregistré
                  </td>
                </tr>
              ) : (
                pricing.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-[#101010] hover:bg-[#0F0F0F] transition"
                  >
                    <td className="px-4 py-3 text-[#D4D0C4]">{item.departureSite}</td>
                    <td className="px-4 py-3 text-[#D4D0C4]">{item.arrivalSite}</td>
                    <td className="px-4 py-3 text-[#C8A84E]">
                      {formatMoneyWithDecimals(item.amountHt)} DH
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="px-3 py-1 rounded-lg border border-red-500 text-red-400 hover:bg-red-500/10 text-sm"
                      >
                        Supprimer
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}