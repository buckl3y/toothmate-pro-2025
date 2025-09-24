import PropTypes from "prop-types";
import { useState } from "react";
import { useEffect } from "react";

export default function SurfaceSelector({ selectedSurfaces, setSelectedSurfaces, selectedTooth }) {
    const [topFaceName, setTopFaceName] = useState("incisal");
    const [topFaceLabel, setTopFaceLabel] = useState("I")

    // Select / deselect clicked surfaces
    function handleSurfaceSelected(surface) {
        let updated;

        if (selectedSurfaces.includes(surface)) {
            updated = selectedSurfaces.filter(s => s !== surface);
        } else {
            updated = [...selectedSurfaces, surface];
        }

        setSelectedSurfaces(updated);
    }

    // Change between incisal and occlusal when molars/incisors are selected
    useEffect(() => {
        if (selectedTooth[3] < 5) {
            setTopFaceLabel("I")
            setTopFaceName("incisal")
            setSelectedSurfaces(selectedSurfaces.filter(s => s !== "occlusal"))
        }
        else {
            setTopFaceLabel("O")
            setTopFaceName("occlusal")
            setSelectedSurfaces(selectedSurfaces.filter(s => s !== "incisal"))
        }
    }, [selectedTooth]);

    const isSelected = (surface) => selectedSurfaces.includes(surface);

    return (
        <div className="h-full">
            <h4 className="text-center pt-2 mb-0">Select Tooth Surfaces</h4>
            <div className="flex justify-center items-center" style={{height: '100%'}}>
                <div className="grid grid-cols-5 grid-rows-5 gap-2 place-items-center w-full h-full">
                    {Array.from({ length: 25 }, (_, index) => {
                        const row = Math.floor(index / 5);
                        const col = index % 5;
                        const realButtons = {
                            '1-2': { id: "mesial", label: "M" },
                            '2-1': { id: "buccal", label: "B" },
                            '2-2': { id: topFaceName, label: topFaceLabel },
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
        </div>
    )
}

SurfaceSelector.propTypes = {
    selectedSurfaces: PropTypes.arrayOf(PropTypes.string).isRequired,
    setSelectedSurfaces: PropTypes.func.isRequired,
    selectedTooth: PropTypes.string.isRequired
}