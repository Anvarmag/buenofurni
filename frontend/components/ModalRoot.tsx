"use client";

import RequestModal from "./modals/RequestModal";
import HorecaRequestModal from "./modals/HorecaRequestModal";

export default function ModalRoot() {
    return (
        <>
            <RequestModal />
            <HorecaRequestModal />
        </>
    );
}
