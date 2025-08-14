import PropTypes from "prop-types";
import { useState } from "react";

export default function SurfaceSelector({ onSurfaceSelected }) {
    const [selectedSurfaces, setSelectedSurface] = useState([]);

    function handleSurfaceSelected(surface) {
        let updated;

        if (selectedSurfaces.includes(surface)) {
            updated = selectedSurfaces.filter(s => s !== surface);
        } else {
            updated = [...selectedSurfaces, surface];
        }

        setSelectedSurface(updated);
        onSurfaceSelected(surface);
    }

    const isSelected = (surface) => selectedSurfaces.includes(surface);

    return (
        <>
            <div className="h-full flex justify-center items-center">
                <div className="grid grid-cols-5 grid-rows-5 gap-2 place-items-center w-full h-full p-2">
                    {Array.from({ length: 25 }, (_, index) => {
                        const row = Math.floor(index / 5);
                        const col = index % 5;
                        const realButtons = {
                            '1-2': { id: "mesial", label: "M" },
                            '2-1': { id: "buccal", label: "B" },
                            '2-2': { id: "occlusal", label: "O" },
                            '2-3': { id: "lingual", label: "L" },
                            '3-2': { id: "distal", label: "D" }
                        };

                        const key = `${row}-${col}`;
                        if (realButtons[key]) {
                            const { id, label } = realButtons[key];
                            return (
                                <button
                                    key={index}
                                    id={id}
                                    onClick={() => handleSurfaceSelected(id)}
                                    className={isSelected(id) ? "btn-surface-selected" : "btn-surface"}
                                >
                                    {label}
                                </button>
                            );
                        }

                        // filler button
                        return (
                            <button
                                key={index}
                                className="btn-filler"
                            >

                            </button>
                        );
                    })}
                </div>
            </div>
        </>
    )
}

SurfaceSelector.propTypes = {
    onSurfaceSelected: PropTypes.func.isRequired
}