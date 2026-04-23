"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createTrip } from "@/lib/api";
import { getToken, getStoredUser } from "@/lib/session";
import { useEffect } from "react";
import { useRef } from "react";


export default function NewMissionPage() {
  const router = useRouter();

  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const dateRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    departureSite: "",
    arrivalSite: "",
    availableFromDate: "",
    availableFromTime: "",
    latestDeliveryDate: "",
    latestDeliveryTime: "",
    vehicleType: "",
    vehiclePlate: "",
    driverName: "",
    comment: "",
    });

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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

   const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

        try {
            setIsSubmitting(true);
            await createTrip({
            departureSite: form.departureSite,
            arrivalSite: form.arrivalSite,
            availableFromDate: form.availableFromDate || null,
            availableFromTime: form.availableFromTime,
            latestDeliveryDate: form.latestDeliveryDate || null,
            latestDeliveryTime: form.latestDeliveryTime || null,
            vehicleType: form.vehicleType,
            vehiclePlate: form.vehiclePlate,
            comment: form.comment,
            driverName: form.driverName,
            status: "PENDING",
            });

            setSuccessMessage("Mission bien créée");

            setTimeout(() => {
            router.push("/home");
            }, 800);
        } catch (error: any) {
        console.error("Erreur création mission :", error);
        alert(error.message || "Erreur lors de la création de la mission");
        } finally {
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        const token = getToken();
        const user = getStoredUser();

        if (!token || !user) {
            router.push("/login");
        }
    }, [router]);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#D4D0C4] font-sans">
        {successMessage && (
            <div className="fixed top-6 right-6 z-50">
                <div className="bg-[#111] border border-[#C8A84E] text-white px-5 py-3 rounded-xl shadow-lg">
                {successMessage}
                </div>
            </div>
        )}
      {/* NAVBAR */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#1A1A1A]">
        <div className="flex items-center gap-8">
          <h1 className="text-white font-bold text-xl tracking-[0.2em]">WASL</h1>

          <div className="flex gap-6 text-sm text-[#666]">
            <button
              type="button"
              onClick={() => router.push("/home")}
              className="hover:text-white transition"
            >
              Tableau de bord
            </button>

            <button 
            type="button" 
            className="hover:text-white transition"
            onClick={() => router.push("/facturation")}
            >
              Facturation
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4">

          <div className="px-3 py-1 rounded-md bg-[#D94841] text-white text-sm font-semibold">
            AVIS
          </div>

        </div>
      </div>

      {/* PAGE CONTENT */}
      <div className="max-w-[840px] mx-auto pt-10 pb-20 px-6">
        {/* BACK LINK */}
        <button
          type="button"
          onClick={() => router.push("/home")}
          className="text-sm text-[#666] hover:text-white transition mb-8 flex items-center gap-2"
        >
          <span>‹</span>
          <span>Retour au tableau de bord</span>
        </button>

        {/* TITLE */}
        <div className="text-center mb-10">
          <h1 className="text-white text-4xl font-semibold mb-2">Nouvelle mission</h1>
          <p className="text-[#666] text-base">Créer une mission de convoyage</p>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* TRAJET */}
          <section className="border-t border-[#111] pt-6">
            <h2 className="text-[#C8A84E] text-xs tracking-[0.2em] font-semibold mb-5">
              TRAJET
            </h2>
            {/* FILTRE */}
            <div className="grid grid-cols-[1fr_auto_1fr] gap-3 items-end">
              <div>
                <label className="block text-sm text-[#666] mb-2">Site de départ</label>
              <select
                name="departureSite"
                value={form.departureSite}
                onChange={handleChange}
                className="w-full bg-[#111] border border-[#1A1A1A] rounded-xl px-4 py-3 text-white outline-none focus:border-[#C8A84E]"
              >
                <option value="" className="bg-[#111] text-[#666]">
                  Sélectionner
                </option>
                {sites.map((site) => (
                  <option key={site} value={site} className="bg-[#111] text-white">
                    {site}
                  </option>
                ))}
              </select>
              </div>
              <div className="pb-3 text-[#C8A84E] text-2xl">→</div>
              <div>
                <label className="block text-sm text-[#666] mb-2">Site d'arrivée</label>
                <select
                name="arrivalSite"
                value={form.arrivalSite}
                onChange={handleChange}
                className="w-full bg-[#111] border border-[#1A1A1A] rounded-xl px-4 py-3 text-white outline-none focus:border-[#C8A84E]"
              >
                <option value="" className="bg-[#111] text-[#666]">
                  Sélectionner
                </option>

                {sites.map((site) => (
                  <option key={site} value={site} className="bg-[#111] text-white">
                    {site}
                  </option>
                ))}
              </select>
              </div>
            </div>
          </section>

          {/* DISPONIBILITÉ */}
          <section className="border-t border-[#111] pt-6">
            <h2 className="text-[#C8A84E] text-xs tracking-[0.2em] font-semibold mb-5">
              DISPONIBILITÉ
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-[#666] mb-2">À partir du</label>
                <input
                  ref={dateRef}
                  type="date"
                  name="availableFromDate"
                  value={form.availableFromDate}
                  onChange={handleChange}
                  onClick={() => dateRef.current?.showPicker()}
                  className="w-full bg-[#111] border border-[#1A1A1A] rounded-xl px-4 py-3 text-white outline-none focus:border-[#C8A84E]"
                />
              </div>

              <div>
                <label className="block text-sm text-[#666] mb-2">Heure</label>
                <input
                  type="time" 
                  name="availableFromTime"
                  value={form.availableFromTime}
                  onChange={handleChange}
                  className="w-full bg-[#111] border border-[#1A1A1A] rounded-xl px-4 py-3 text-white outline-none focus:border-[#C8A84E]"
                />
              </div>

              <div>
                <label className="block text-sm text-[#666] mb-2">
                  Livraison au plus tard le
                </label>
                <input
                  type="date"
                  name="latestDeliveryDate"
                  value={form.latestDeliveryDate}
                  onChange={handleChange}
                  className="w-full bg-[#111] border border-[#1A1A1A] rounded-xl px-4 py-3 text-white outline-none focus:border-[#C8A84E]"
                />
              </div>

              <div>
                <label className="block text-sm text-[#666] mb-2">Heure</label>
                <input
                  type="time"
                  name="latestDeliveryTime"
                  value={form.latestDeliveryTime}
                  onChange={handleChange}
                  className="w-full bg-[#111] border border-[#1A1A1A] rounded-xl px-4 py-3 text-white outline-none focus:border-[#C8A84E]"
                />
              </div>
            </div>
          </section>

          {/* VÉHICULE */}
          <section className="border-t border-[#111] pt-6">
            <h2 className="text-[#C8A84E] text-xs tracking-[0.2em] font-semibold mb-5">
              VÉHICULE
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-[#666] mb-2">Type de véhicule</label>
                <input
                  name="vehicleType"
                  value={form.vehicleType}
                  onChange={handleChange}
                  placeholder="Sélectionner"
                  className="w-full bg-[#111] border border-[#1A1A1A] rounded-xl px-4 py-3 text-white placeholder:text-[#666] outline-none focus:border-[#C8A84E]"
                />
              </div>

              <div>
                <label className="block text-sm text-[#666] mb-2">Immatriculation</label>
                <input
                  name="vehiclePlate"
                  value={form.vehiclePlate}
                  onChange={handleChange}
                  placeholder="Ex : 78291-A-6"
                  className="w-full bg-[#111] border border-[#1A1A1A] rounded-xl px-4 py-3 text-white placeholder:text-[#666] outline-none focus:border-[#C8A84E]"
                />
              </div>
            </div>                
          </section>

          <div className="mt-4">
            <label className="block text-sm text-[#666] mb-2">Chauffeur</label>
            <input
                name="driverName"
                value={form.driverName}
                onChange={handleChange}
                placeholder="Ex : Youssef B."
                className="w-full bg-[#111] border border-[#1A1A1A] rounded-xl px-4 py-3 text-white placeholder:text-[#666] outline-none focus:border-[#C8A84E]"
            />
        </div>

          {/* COMMENTAIRE */}
          <section className="border-t border-[#111] pt-6">
            <h2 className="text-[#C8A84E] text-xs tracking-[0.2em] font-semibold mb-5">
              COMMENTAIRE <span className="text-[#666] normal-case tracking-normal">— facultatif</span>
            </h2>

            <textarea
              name="comment"
              value={form.comment}
              onChange={handleChange}
              placeholder="Ajouter des instructions ou précisions pour le chauffeur..."
              className="w-full min-h-[120px] bg-[#111] border border-[#1A1A1A] rounded-xl px-4 py-4 text-white placeholder:text-[#666] outline-none resize-none focus:border-[#C8A84E]"
            />
          </section>

          {/* ACTIONS */}
          <div className="flex items-center justify-center gap-4 pt-2">
            <button
              type="button"
              onClick={() => router.push("/home")}
              className="px-8 py-3 rounded-xl border border-[#1A1A1A] bg-transparent text-[#888] hover:text-white hover:border-[#333] transition"
            >
              Annuler
            </button>

            <button
            type="submit"
            disabled={isSubmitting}
            className="px-8 py-3 rounded-xl border border-[#C8A84E] bg-[#C8A84E] text-black font-semibold hover:bg-[#d6b55a] transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
            {isSubmitting ? "Création..." : "Créer la mission"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}