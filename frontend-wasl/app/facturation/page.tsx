"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getInvoices, getInvoicesSummary, updateInvoiceStatus, getTrips, createInvoice, deleteInvoice } from "@/lib/api";
import { getStoredUser, getToken } from "@/lib/session";

function formatMoney(value: number) {
  return new Intl.NumberFormat("fr-FR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function formatMoneyWithDecimals(value: number) {
  return new Intl.NumberFormat("fr-FR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function formatDate(dateString?: string) {
  if (!dateString) return "—";

  const date = new Date(dateString);

  return date.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function SummaryCard({
  label,
  value,
  suffix,
}: {
  label: string;
  value: string;
  suffix: string;
}) {
  return (
    <div className="bg-[#111] border border-[#1A1A1A] rounded-xl px-4 py-4 min-h-[82px] flex flex-col justify-between">
    <p className="text-[11px] tracking-[0.16em] text-[#777]">{label}</p>
    <div className="flex items-end gap-1">
        <span className="text-white text-[30px] font-semibold leading-none">{value}</span>
        <span className="text-[#8B877C] text-lg leading-none mb-[2px]">{suffix}</span>
    </div>
    </div>
  );
}

export default function FacturationPage() {
  const router = useRouter();

  const [availableTrips, setAvailableTrips] = useState<any[]>([]);
  const [selectedTripIds, setSelectedTripIds] = useState<number[]>([]);
  const [invoiceForm, setInvoiceForm] = useState({
    startDate: "",
    endDate: "",
  });
  const [showCreateInvoice, setShowCreateInvoice] = useState(false);

  const [user, setUser] = useState<any>(null);
  const [summary, setSummary] = useState({
    totalFacture: 0,
    enAttente: 0,
    paye: 0,
  });
  const [invoices, setInvoices] = useState<any[]>([]);
  const [expandedInvoiceId, setExpandedInvoiceId] = useState<number | null>(null);

  const filteredTrips = availableTrips.filter((trip) => {
    if (!invoiceForm.startDate || !invoiceForm.endDate) return true;
    if (!trip.availableFromDate) return false;

    const tripDate = new Date(trip.availableFromDate);
    const start = new Date(invoiceForm.startDate);
    const end = new Date(invoiceForm.endDate);

    return tripDate >= start && tripDate <= end;
  });

  const loadFacturation = async () => {
    try {
        const [summaryData, invoicesData, tripsData] = await Promise.all([
        getInvoicesSummary(),
        getInvoices(),
        getTrips(),
        ]);

        setSummary(summaryData);
        setInvoices(invoicesData);

        const nonInvoicedTrips = tripsData.filter(
          (trip: any) => !trip.invoiceId && trip.amountHt !== null
        );

        if (invoicesData.length > 0 && expandedInvoiceId === null) {
        setExpandedInvoiceId(invoicesData[0].id);
        }
    } catch (error) {
        console.error("Erreur lors du chargement de la facturation :", error);
    }
    };

    const handleDeleteInvoice = async (id: number) => {
    const confirmDelete = confirm("Supprimer cette facture ?");

      if (!confirmDelete) return;

      try {
        await deleteInvoice(id);
        await loadFacturation();
      } catch (error) {
        console.error(error);
        alert("Erreur lors de la suppression");
      }
  };

    const handleTripSelection = (tripId: number) => {
        setSelectedTripIds((prev) =>
            prev.includes(tripId)
            ? prev.filter((id) => id !== tripId)
            : [...prev, tripId],
        );
    };

    const handleCreateInvoice = async () => {
    try {
        if (!invoiceForm.startDate || !invoiceForm.endDate || selectedTripIds.length === 0) {
        alert("Sélectionne une période et au moins une mission");
        return;
        }

        await createInvoice({
        startDate: invoiceForm.startDate,
        endDate: invoiceForm.endDate,
        tripIds: selectedTripIds,
        });

        setShowCreateInvoice(false);
        setSelectedTripIds([]);
        setInvoiceForm({
        startDate: "",
        endDate: "",
        });

        await loadFacturation();
    } catch (error: any) {
        console.error("Erreur lors de la création de la facture :", error);
        alert(error.message || "Erreur lors de la création de la facture");
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
    loadFacturation();
  }, [router]);

  const handleInvoiceStatusChange = async (invoiceId: number, status: string) => {
    try {
      await updateInvoiceStatus(invoiceId, status);
      await loadFacturation();
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut facture :", error);
    }
  };

  const allSelected =
  filteredTrips.length > 0 &&
  filteredTrips.every((trip) => selectedTripIds.includes(trip.id));

  const handleSelectAll = () => {
  const allIds = filteredTrips.map((trip) => trip.id);
  setSelectedTripIds(allIds);
  };

  const handleDeselectAll = () => {
    setSelectedTripIds([]);
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

            <button className="bg-[#13110A] border border-[#C8A84E] text-[#C8A84E] px-4 py-2 rounded-lg">
              Facturation
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {user?.role === "ADMIN" && (
            <button
            onClick={() => setShowCreateInvoice(true)}
            className="bg-[#0A0A0A] text-[#C8A84E] px-4 py-2 rounded-lg font-medium border border-[#C8A84E] transition-all duration-150 hover:bg-[#C8A84E] hover:text-[#0A0A0A] cursor-pointer"
            >
            + Créer une facture
            </button>
           )}
        </div>
      </div>

      <div className="px-6 py-10 space-y-10">
        <div>
          <h2 className="text-white text-[32px] font-semibold">Facturation</h2>
        </div>

        {/* SUMMARY */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <SummaryCard
            label="TOTAL FACTURÉ"
            value={formatMoney(summary.totalFacture)}
            suffix="DH"
          />
          <SummaryCard
            label="EN ATTENTE DE PAIEMENT"
            value={formatMoney(summary.enAttente)}
            suffix="DH"
          />
          <SummaryCard
            label="PAYÉ"
            value={formatMoney(summary.paye)}
            suffix="DH"
          />
        </div>

        {/* INVOICES */}
        <div className="space-y-5">
          {invoices.length === 0 ? (
            <div className="bg-[#111] border border-[#1A1A1A] rounded-2xl p-8 text-center text-[#777]">
              Aucune facture disponible
            </div>
          ) : (
            invoices.map((invoice) => {
              const isOpen = expandedInvoiceId === invoice.id;

              return (
                <div
                  key={invoice.id}
                  className="bg-[#111] border border-[#1A1A1A] rounded-2xl overflow-hidden"
                >
                  <div
                  className="px-5 py-5 border-b border-[#1A1A1A] flex items-center justify-between gap-4 cursor-pointer"
                  onClick={() => setExpandedInvoiceId(isOpen ? null : invoice.id)}
                  >
                    <div className="flex items-center gap-5 flex-wrap">
                      <div className="flex items-center gap-4 flex-wrap">
                        <span className="text-[#C8A84E] font-medium">
                          {invoice.reference}
                        </span>
                        <span className="text-[#A8A39A]">
                          {formatDate(invoice.startDate)} — {formatDate(invoice.endDate)}
                        </span>
                        <span className="text-[#777]">
                          {invoice.trips?.length || 0} mission
                          {(invoice.trips?.length || 0) > 1 ? "s" : ""}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 flex-wrap">
                      <span className="text-white text-3xl font-semibold">
                        {formatMoneyWithDecimals(invoice.totalTtc)}
                      </span>
                      <span className="text-[#8B877C]">DH</span>

                      {user?.role === "ADMIN" ? (
                        <select
                          value={invoice.status}
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) =>
                            handleInvoiceStatusChange(invoice.id, e.target.value)
                          }
                          className={`inline-flex px-4 py-2 rounded-full text-sm border bg-transparent outline-none cursor-pointer ${
                            invoice.status === "PAID"
                              ? "border-green-500/30 bg-green-500/10 text-green-400"
                              : "border-blue-500/30 bg-blue-500/10 text-blue-400"
                          }`}
                        >
                          <option value="PENDING" className="bg-[#111] text-white">
                            En attente
                          </option>
                          <option value="PAID" className="bg-[#111] text-white">
                            Payé
                          </option>
                        </select>
                      ) : (
                        <span
                          className={`inline-flex px-4 py-2 rounded-full text-sm border ${
                            invoice.status === "PAID"
                              ? "border-green-500/30 bg-green-500/10 text-green-400"
                              : "border-blue-500/30 bg-blue-500/10 text-blue-400"
                          }`}
                        >
                          {invoice.status === "PAID" ? "Payé" : "En attente"}
                        </span>
                      )}

                      {user?.role === "ADMIN" && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteInvoice(invoice.id);
                          }}
                          className="px-3 py-1 rounded-lg border border-red-500 text-red-400 hover:bg-red-500/10 text-sm"
                        >
                          Supprimer
                        </button>
                      )}

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setExpandedInvoiceId(isOpen ? null : invoice.id);
                        }}
                        className="text-[#666] hover:text-white"
                      >
                        {isOpen ? "⌃" : "⌄"}
                      </button>
                    </div>
                  </div>

                  {isOpen && (
                    <>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead className="text-left text-[#666] border-b border-[#141414]">
                            <tr>
                              <th className="px-5 py-4 font-medium">REF</th>
                              <th className="px-5 py-4 font-medium">DATE</th>
                              <th className="px-5 py-4 font-medium">TRAJET</th>
                              <th className="px-5 py-4 font-medium">VÉHICULE</th>
                              <th className="px-5 py-4 font-medium">CHAUFFEUR</th>
                              <th className="px-5 py-4 font-medium text-right">
                                MONTANT HT
                              </th>
                            </tr>
                          </thead>

                          <tbody>
                            {invoice.trips?.map((trip: any) => (
                              <tr
                                key={trip.id}
                                className="border-b border-[#101010] hover:bg-[#0F0F0F] transition"
                              >
                                <td className="px-5 py-4 text-[#C8A84E] font-medium">
                                  WAS-{String(trip.id).padStart(4, "0")}
                                </td>
                                <td className="px-5 py-4 text-[#B4B0A8]">
                                  {formatDate(trip.availableFromDate)}
                                </td>
                                <td className="px-5 py-4 text-[#D4D0C4]">
                                  {trip.departureSite} → {trip.arrivalSite}
                                </td>
                                <td className="px-5 py-4 text-[#B4B0A8]">
                                  {trip.vehicleType}
                                </td>
                                <td className="px-5 py-4 text-[#B4B0A8]">
                                  {trip.driverName || "—"}
                                </td>
                                <td className="px-5 py-4 text-right text-[#D4D0C4]">
                                  {formatMoneyWithDecimals(trip.amountHt || 0)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      <div className="px-5 py-4 border-t border-[#141414] flex items-center justify-between gap-4 flex-wrap">
                        <div className="flex items-center gap-6 text-sm flex-wrap">
                          <span className="text-[#666]">
                            HT :{" "}
                            <span className="text-[#9E998E]">
                              {formatMoneyWithDecimals(invoice.totalHt)}
                            </span>
                          </span>
                          <span className="text-[#666]">
                            TVA 20% :{" "}
                            <span className="text-[#9E998E]">
                              {formatMoneyWithDecimals(invoice.taxAmount)}
                            </span>
                          </span>
                          <span className="text-[#D4D0C4] font-semibold">
                            TTC : {formatMoneyWithDecimals(invoice.totalTtc)} DH
                          </span>
                        </div>

                        <button className="text-[#C8A84E] hover:text-[#e2c770] transition flex items-center gap-2">
                          <span>↓</span>
                          <span>Télécharger PDF</span>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
      {showCreateInvoice && (
        <>
            <div
            className="fixed inset-0 bg-black/40 z-40"
            onClick={() => setShowCreateInvoice(false)}
            />

            <div className="fixed top-0 right-0 w-[460px] h-screen bg-[#111] border-l border-[#1A1A1A] z-50 shadow-2xl flex flex-col">
            <div className="p-6 border-b border-[#1A1A1A] flex justify-between items-center">
                <h2 className="text-white font-semibold text-lg">Créer une facture</h2>

                <button
                onClick={() => setShowCreateInvoice(false)}
                className="text-gray-400 hover:text-white"
                >
                ✕
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm text-[#666] mb-2">Début période</label>
                    <input
                    type="date"
                    value={invoiceForm.startDate}
                    onChange={(e) =>
                        setInvoiceForm((prev) => ({
                        ...prev,
                        startDate: e.target.value,
                        }))
                    }
                    className="w-full bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl px-4 py-3 text-white outline-none focus:border-[#C8A84E]"
                    />
                </div>

                <div>
                    <label className="block text-sm text-[#666] mb-2">Fin période</label>
                    <input
                    type="date"
                    value={invoiceForm.endDate}
                    onChange={(e) =>
                        setInvoiceForm((prev) => ({
                        ...prev,
                        endDate: e.target.value,
                        }))
                    }
                    className="w-full bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl px-4 py-3 text-white outline-none focus:border-[#C8A84E]"
                    />
                </div>
                </div>

                <div>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm text-[#666]">Missions disponibles</p>

                  <div className="flex gap-3 text-xs">
                    <button
                      onClick={allSelected ? handleDeselectAll : handleSelectAll}
                      className="text-[#C8A84E] hover:underline"
                    >
                      {allSelected ? "Tout désélectionner" : "Tout sélectionner"}
                    </button>
                  </div>
                </div>

              <div className="space-y-3">
                    {filteredTrips.length === 0 ? (
                    <div className="text-sm text-[#777] border border-[#1A1A1A] rounded-xl p-4">
                        Aucune mission disponible à facturer
                    </div>
                    ) : (
                    filteredTrips.map((trip) => (
                      console.log(filteredTrips, ',feroignjgoierngoiren'),
                        <label
                        key={trip.id}
                        className="flex items-start gap-3 border border-[#1A1A1A] rounded-xl p-4 cursor-pointer hover:border-[#C8A84E] transition"
                        >
                        <input
                            type="checkbox"
                            checked={selectedTripIds.includes(trip.id)}
                            onChange={() => handleTripSelection(trip.id)}
                            className="mt-1"
                        />

                        <div className="flex-1">
                            <p className="text-[#C8A84E] text-sm font-medium">
                            WAS-{String(trip.id).padStart(4, "0")}
                            </p>
                            <p className="text-white text-sm">
                            {trip.departureSite} → {trip.arrivalSite}
                            </p>
                            <p className="text-[#999] text-sm">
                            {trip.vehicleType} — {trip.vehiclePlate}
                            </p>
                            <p className="text-[#999] text-sm">
                            {formatDate(trip.availableFromDate)}
                            </p>
                            <p className="text-[#999] text-sm">
                            Chauffeur : {trip.driverName || "—"}
                            </p>
                            <p className="text-[#D4D0C4] text-sm mt-1">
                            Montant HT : {formatMoneyWithDecimals(trip.amountHt || 0)} DH
                            </p>
                        </div>
                        </label>
                    ))
                    )}
                </div>
                </div>
            </div>

            <div className="p-6 border-t border-[#1A1A1A] flex justify-between items-center">
                <p className="text-sm text-[#777]">
                {selectedTripIds.length} mission{selectedTripIds.length > 1 ? "s" : ""} sélectionnée
                {selectedTripIds.length > 1 ? "s" : ""}
                </p>

                <div className="flex gap-3">
                <button
                    onClick={() => setShowCreateInvoice(false)}
                    className="px-4 py-2 rounded-lg border border-[#1A1A1A] text-gray-300"
                >
                    Annuler
                </button>

                <button
                    onClick={handleCreateInvoice}
                    className="px-4 py-2 rounded-lg border border-[#C8A84E] bg-[#C8A84E] text-black"
                >
                    Créer la facture
                </button>
                </div>
            </div>
            </div>
        </>
        )}
    </div>
  );
}