"use client";

import { createContext, useContext, useMemo, useState } from "react";
import RegisterModal from "./RegisterModal";

type RegisterModalContextValue = {
  openRegister: () => void;
};

const RegisterModalContext = createContext<RegisterModalContextValue | null>(
  null
);

export function useRegisterModal() {
  const context = useContext(RegisterModalContext);
  if (!context) {
    throw new Error("useRegisterModal must be used within RegisterModalProvider");
  }
  return context;
}

type RegisterModalProviderProps = {
  children: React.ReactNode;
};

export default function RegisterModalProvider({
  children,
}: RegisterModalProviderProps) {
  const [isOpen, setIsOpen] = useState(false);

  const value = useMemo(
    () => ({
      openRegister: () => setIsOpen(true),
    }),
    []
  );

  return (
    <RegisterModalContext.Provider value={value}>
      {children}
      <RegisterModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </RegisterModalContext.Provider>
  );
}
