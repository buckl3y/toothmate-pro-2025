import PropTypes from "prop-types";
import { useState } from "react";

export default function SurfaceSelector({onSurfaceSelected}) {
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
        <div className="grid grid-cols-3 grid-rows-3 gap-2">
            <div></div> {/*whitespace top left*/}
            <div>
                <button
                    id="mesial"
                    onClick={() => {handleSurfaceSelected("mesial");}}
                    className={isSelected("mesial") ? "btn-surface-selected" : "btn-surface"}
                >
                    M
                </button>
            </div>
            
            <div></div> {/*whitespace top right*/}

            <div>
                <button
                    id="buccal"
                    onClick={() => {handleSurfaceSelected("buccal");}}
                    className={isSelected("buccal") ? "btn-surface-selected" : "btn-surface"}
                >
                    B
                </button>
            </div>

            <div>
                <button
                    id="occlusal"
                    onClick={() => {handleSurfaceSelected("occlusal");}}
                    className={isSelected("occlusal") ? "btn-surface-selected" : "btn-surface"}
                >
                    O
                </button>            
            </div>

            <div>
                <button
                    id="lingual"
                    onClick={() => {handleSurfaceSelected("lingual");}}
                    className={isSelected("lingual") ? "btn-surface-selected" : "btn-surface"}
                >
                    L
                </button>            
            </div>

            <div></div> {/*whitespace bottom left*/}

            <div>
                <button
                    id="distal"
                    onClick={() => {handleSurfaceSelected("distal");}}
                    className={isSelected("distal") ? "btn-surface-selected" : "btn-surface"}
                >
                    D
                </button>            
            </div>

            <div></div> {/*whitespace bottom right*/}
        </div>
        </>
    )
}

SurfaceSelector.propTypes = {
    onSurfaceSelected: PropTypes.func.isRequired
}