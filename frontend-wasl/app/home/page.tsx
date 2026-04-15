"use client";

import { useEffect, useState } from "react";
import { getTrips, updateTripStatus } from "@/lib/api";
import { useRouter } from "next/navigation";
import { getStoredUser, getToken, logout } from "@/lib/session";

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  const [selectedTrip, setSelectedTrip] = useState<any>(null);
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [trips, setTrips] = useState<any[]>([]);

  const loadTrips = async () => {
    try {
      const data = await getTrips();
      setTrips(data);
    } catch (error) {
      console.error("Erreur lors du chargement des missions :", error);
    }
  };

  useEffect(() => {
    const token = getToken();
    const storedUser = getStoredUser();

    if (!token || !storedUser) {
      router.push("/login");
      return;
    }

    setUser(storedUser);

    async function loadTrips() {
      try {
        const data = await getTrips();
        setTrips(data);
      } catch (error) {
        console.error("Erreur lors du chargement des missions :", error);
      }
    }

    loadTrips();
  }, [router]);

  const handleStatusChange = async (id: number, status: string) => {
    try {
      await updateTripStatus(id, status);
      await loadTrips();

      if (selectedTrip && selectedTrip.id === id) {
        const updatedTrip = trips.find((trip) => trip.id === id);
        if (updatedTrip) {
          setSelectedTrip({ ...updatedTrip, status });
        }
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut :", error);
    }
  };

  const stats = {
    total: trips.length,
    enRoute: trips.filter((t) => t.status === "EN_ROUTE").length,
    enAttente: trips.filter((t) => t.status === "PENDING").length,
    livre: trips.filter((t) => t.status === "DELIVERED").length,
  };

  const filteredTrips = trips.filter((trip) => {
    if (activeFilter === "ALL") return true;
    if (activeFilter === "EN_ROUTE") return trip.status === "EN_ROUTE";
    if (activeFilter === "PENDING") return trip.status === "PENDING";
    if (activeFilter === "DELIVERED") return trip.status === "DELIVERED";
    return true;
  });

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return "—";

    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return "—";

    return date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
    });
  };

  const getStatusLabel = (status: string) => {
    if (status === "EN_ROUTE") return "En route";
    if (status === "DELIVERED") return "Livré";
    return "En attente";
  };

  const getStatusClasses = (status: string) => {
    if (status === "EN_ROUTE") {
      return "border-blue-500/30 bg-blue-500/10 text-blue-400";
    }

    if (status === "DELIVERED") {
      return "border-green-500/30 bg-green-500/10 text-green-400";
    }

    return "border-yellow-500/30 bg-yellow-500/10 text-yellow-400";
  };

  return (
    <div className="bg-[#0A0A0A] min-h-screen text-[#666] font-sans">
      {/* NAVBAR */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#1A1A1A]">
        <div className="flex items-center gap-6">
          <h1 className="text-white font-bold text-xl tracking-[0.2em]">WASL</h1>

          <div className="flex gap-3">
            <button className="bg-[#13110A] border border-[#C8A84E] text-[#C8A84E] px-4 py-2 rounded-lg">
              Tableau de bord
            </button>

            <button className="bg-[#111] border border-[#1A1A1A] px-4 py-2 rounded-lg hover:border-[#C8A84E]">
              Facturation
            </button>

            <button
              onClick={() => {
                logout();
                router.push("/login");
              }}
              className="text-sm text-[#666] hover:text-white transition"
            >
              Déconnexion
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/new-mission")}
            className="bg-[#0A0A0A] text-[#C8A84E] px-4 py-2 rounded-lg font-medium border border-[#C8A84E] transition-all duration-150 hover:bg-[#C8A84E] hover:text-[#0A0A0A] cursor-pointer"
          >
            + Nouvelle mission
          </button>
              
          <div className="px-3 py-1 rounded-md bg-[#D94841] text-white text-sm font-semibold">
            AVIS
          </div>
        </div>
      </div>

      {/* HEADER */}
      <div className="px-6 pt-8 pb-2">
        <h2 className="text-white text-3xl font-semibold">
          Bonjour AVIS, <span className="text-[#666] text-xl font-normal">14 avril 2026</span>
        </h2>
      </div>

      {/* KPI CARDS */}
      <div className="p-6 grid grid-cols-4 gap-4">
        <div
          onClick={() => setActiveFilter("ALL")}
          className={`p-6 rounded-xl cursor-pointer border transition-all ${
            activeFilter === "ALL"
              ? "border-[#C8A84E] bg-[#13110A]"
              : "border-[#1A1A1A] bg-[#111] hover:border-[#C8A84E]"
          }`}
        >
          <p className="text-xs tracking-[0.2em] text-gray-400 mb-3">TOUT</p>
          <p className="text-white text-4xl font-semibold">{stats.total}</p>
        </div>

        <div
          onClick={() => setActiveFilter("EN_ROUTE")}
          className={`p-6 rounded-xl cursor-pointer border transition-all ${
            activeFilter === "EN_ROUTE"
              ? "border-[#C8A84E] bg-[#13110A]"
              : "border-[#1A1A1A] bg-[#111] hover:border-[#C8A84E]"
          }`}
        >
          <p className="text-xs tracking-[0.2em] text-gray-400 mb-3">EN ROUTE</p>
          <p className="text-white text-4xl font-semibold">{stats.enRoute}</p>
        </div>

        <div
          onClick={() => setActiveFilter("PENDING")}
          className={`p-6 rounded-xl cursor-pointer border transition-all ${
            activeFilter === "PENDING"
              ? "border-[#C8A84E] bg-[#13110A]"
              : "border-[#1A1A1A] bg-[#111] hover:border-[#C8A84E]"
          }`}
        >
          <p className="text-xs tracking-[0.2em] text-gray-400 mb-3">EN ATTENTE</p>
          <p className="text-white text-4xl font-semibold">{stats.enAttente}</p>
        </div>

        <div
          onClick={() => setActiveFilter("DELIVERED")}
          className={`p-6 rounded-xl cursor-pointer border transition-all ${
            activeFilter === "DELIVERED"
              ? "border-[#C8A84E] bg-[#13110A]"
              : "border-[#1A1A1A] bg-[#111] hover:border-[#C8A84E]"
          }`}
        >
          <p className="text-xs tracking-[0.2em] text-gray-400 mb-3">LIVRÉ</p>
          <p className="text-white text-4xl font-semibold">{stats.livre}</p>
        </div>
      </div>

      {/* TABLE */}
      <div className="px-6 pb-8">
        <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="text-left text-[#777] border-b border-[#1A1A1A]">
              <tr>
                <th className="p-4">REF</th>
                <th className="p-4">TRAJET</th>
                <th className="p-4">VÉHICULE</th>
                <th className="p-4">CHAUFFEUR</th>
                <th className="p-4">À PARTIR DE</th>
                <th className="p-4">DEADLINE</th>
                <th className="p-4">STATUT</th>
              </tr>
            </thead>

            <tbody>
              {filteredTrips.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-gray-500">
                    Aucune mission trouvée
                  </td>
                </tr>
              ) : (
                filteredTrips.map((trip) => (
                  <tr
                    key={trip.id}
                    onClick={() => setSelectedTrip(trip)}
                    className="cursor-pointer transition hover:bg-[#0F0F0F]"
                  >
                    <td className="p-4 text-[#C8A84E] font-medium">
                      WAS-{String(trip.id).padStart(4, "0")}
                    </td>

                    <td className="p-4 text-[#D4D0C4]">
                      {trip.departureSite} → {trip.arrivalSite}
                    </td>

                    <td className="p-4 text-[#999]">
                      {trip.vehicleType} — {trip.vehiclePlate}
                    </td>

                    <td className="p-4 text-[#999]">
                      {trip.driverName || "—"}
                    </td>

                    <td className="p-4 text-[#999]">
                      {formatDate(trip.availableFromDate)} — {trip.availableFromTime || "—"}
                    </td>

                    <td className="p-4 text-[#999]">
                      {formatDate(trip.latestDeliveryDate)} — {trip.latestDeliveryTime || "—"}
                    </td>

                    <td className="p-4">
                      {user?.role === "ADMIN" ? (
                        <select
                          value={trip.status}
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) => handleStatusChange(trip.id, e.target.value)}
                          className={`px-3 py-1 rounded-full text-xs border bg-transparent outline-none cursor-pointer ${getStatusClasses(
                            trip.status,
                          )}`}
                        >
                          <option value="PENDING" className="bg-[#111] text-white">
                            En attente
                          </option>
                          <option value="EN_ROUTE" className="bg-[#111] text-white">
                            En route
                          </option>
                          <option value="DELIVERED" className="bg-[#111] text-white">
                            Livré
                          </option>
                        </select>
                        ) : (
                        <span
                          className={`inline-flex px-3 py-1 rounded-full text-xs border ${getStatusClasses(
                            trip.status,
                          )}`}
                        >
                          {getStatusLabel(trip.status)}
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* DRAWER */}
      {selectedTrip && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-40"
            onClick={() => setSelectedTrip(null)}
          />

          <div className="fixed top-0 right-0 w-[380px] h-full bg-[#111] border-l border-[#1A1A1A] p-6 z-50 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-white font-semibold text-lg">Mission</h2>

              <button
                onClick={() => setSelectedTrip(null)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-5 text-sm text-gray-300">
              <div>
                <p className="text-gray-500 mb-1">Référence</p>
                <p className="text-white">WAS-{String(selectedTrip.id).padStart(4, "0")}</p>
              </div>

              <div>
                <p className="text-gray-500 mb-1">Trajet</p>
                <p className="text-white">
                  {selectedTrip.departureSite} → {selectedTrip.arrivalSite}
                </p>
              </div>

              <div>
                <p className="text-gray-500 mb-1">Véhicule</p>
                <p className="text-white">
                  {selectedTrip.vehicleType} — {selectedTrip.vehiclePlate}
                </p>
              </div>

              <div>
                <p className="text-gray-500 mb-1">Chauffeur</p>
                <p className="text-white">{selectedTrip.driverName || "—"}</p>
              </div>

              <div>
                <p className="text-gray-500 mb-1">Départ</p>
                <p className="text-white">
                  {formatDate(selectedTrip.availableFromDate)} {selectedTrip.availableFromTime || "—"}
                </p>
              </div>

              <div>
                <p className="text-gray-500 mb-1">Deadline</p>
                <p className="text-white">
                  {formatDate(selectedTrip.latestDeliveryDate)} {selectedTrip.latestDeliveryTime || "—"}
                </p>
              </div>

              <div>
                <p className="text-gray-500 mb-1">Statut</p>
                <select
                  value={selectedTrip.status}
                  onChange={(e) => handleStatusChange(selectedTrip.id, e.target.value)}
                  className={`px-3 py-1 rounded-full text-xs border bg-transparent outline-none cursor-pointer ${getStatusClasses(
                    selectedTrip.status,
                  )}`}
                >
                  <option value="PENDING" className="bg-[#111] text-white">
                    En attente
                  </option>
                  <option value="EN_ROUTE" className="bg-[#111] text-white">
                    En route
                  </option>
                  <option value="DELIVERED" className="bg-[#111] text-white">
                    Livré
                  </option>
                </select>
              </div>

              <div>
                <p className="text-gray-500 mb-1">Commentaire</p>
                <p className="text-white">{selectedTrip.comment || "—"}</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}