"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { createPayment, type MobileMoneyMethod } from "@/lib/payments";
import type { Payment, Room } from "@/lib/types";

const STORAGE_KEY = "rentdirect_payments";

interface PaymentsContextValue {
  payments: Payment[];
  recordPayment: (input: { listing: Room; amount: number; method: MobileMoneyMethod; phone: string }) => Payment;
  resetPayments: () => void;
}

const PaymentsContext = createContext<PaymentsContextValue | null>(null);

export function PaymentsProvider({ children }: { children: ReactNode }) {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setPayments(JSON.parse(saved) as Payment[]);
    } catch {
      setPayments([]);
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!loaded) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payments));
  }, [payments, loaded]);

  const recordPayment: PaymentsContextValue["recordPayment"] = (input) => {
    const payment = createPayment(input);
    setPayments((prev) => [payment, ...prev]);
    return payment;
  };

  const resetPayments = () => {
    localStorage.removeItem(STORAGE_KEY);
    setPayments([]);
  };

  return (
    <PaymentsContext.Provider value={{ payments, recordPayment, resetPayments }}>
      {children}
    </PaymentsContext.Provider>
  );
}

export function usePayments() {
  const ctx = useContext(PaymentsContext);
  if (!ctx) throw new Error("usePayments must be used inside PaymentsProvider");
  return ctx;
}
