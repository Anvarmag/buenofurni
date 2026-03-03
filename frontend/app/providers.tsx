"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type ModalState = {
    isOpen: boolean;
    type: "b2c" | "b2b" | null;
    source: string;
};

type ModalContextType = {
    modalState: ModalState;
    openModal: (type: "b2c" | "b2b", source?: string) => void;
    closeModal: () => void;
};

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function ModalProvider({ children }: { children: ReactNode }) {
    const [modalState, setModalState] = useState<ModalState>({
        isOpen: false,
        type: null,
        source: "organic",
    });

    const openModal = (type: "b2c" | "b2b", source = "organic") => {
        setModalState({ isOpen: true, type, source });
        document.body.style.overflow = "hidden"; // Prevent background scroll
        document.body.classList.add("has-overlay");
    };

    const closeModal = () => {
        setModalState({ isOpen: false, type: null, source: "organic" });
        document.body.style.overflow = "auto";
        document.body.classList.remove("has-overlay");
    };

    return (
        <ModalContext.Provider value={{ modalState, openModal, closeModal }}>
            {children}
        </ModalContext.Provider>
    );
}

export function useModal() {
    const context = useContext(ModalContext);
    if (context === undefined) {
        throw new Error("useModal must be used within a ModalProvider");
    }
    return context;
}
