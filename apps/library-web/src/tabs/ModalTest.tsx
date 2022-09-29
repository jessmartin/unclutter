import { LibraryModalPage } from "@unclutter/library-components/dist/components";
import { useEffect, useState } from "react";

export default function ModalTestTab({}) {
    const [showModal, setShowModal] = useState(false);
    useEffect(() => {
        setTimeout(() => {
            setShowModal(true);
        }, 100);
    }, []);

    const [darkModeEnabled, setDarkModeEnabled] = useState(false);
    useEffect(() => {
        window
            .matchMedia("(prefers-color-scheme: dark)")
            .addEventListener("change", (event) => {
                setDarkModeEnabled(event.matches);
            });
    }, []);

    return (
        <div className="h-screen w-screen">
            <div
                className="bg-lindy m-20 mx-auto max-w-md cursor-pointer rounded-lg p-2"
                onMouseEnter={() => setShowModal(true)}
            >
                Open Library
            </div>

            <LibraryModalPage
                darkModeEnabled={darkModeEnabled}
                articleUrl="https://www.wsj.com/articles/saying-goodbye-to-my-parents-library-11661572861"
                isVisible={showModal}
                closeModal={() => setShowModal(false)}
            />
        </div>
    );
}