import PropTypes from "prop-types";
import { useState } from "react";

export default function SurfaceSelector({onSurfaceSelected}) {
    const [selectedSurface, setSelectedSurface] = useState("");

    function handleSurfaceSelected(surface) {
        setSelectedSurface(surface);
        onSurfaceSelected(surface);
    }

    return (
        <>
        <div className="grid grid-cols-3 grid-rows-3 gap-2">
            <div></div> {/*whitespace top left*/}
            <div>
                <button className="bg-gray-300" id="mesial" onClick={() => handleSurfaceSelected("mesial")}>Mesial</button>
            </div>
            <div></div> {/*whitespace top right*/}
            <div>
                <button id="buccal" onClick={() => handleSurfaceSelected("buccal")}>Buccal</button>
            </div>
            <div>
                <button id="occlusal" onClick={() => handleSurfaceSelected("occlusal")}>Occlusal</button>
            </div>
            <div>
                <button id="lingual" onClick={() => handleSurfaceSelected("lingual")}>Lingual</button>
            </div>
            <div></div> {/*whitespace bottom left*/}
            <div>
                <button className="bg-gray-300" id="distal" onClick={() => handleSurfaceSelected("distal")}>Distal</button>
            </div>
            <div></div> {/*whitespace bottom right*/}
        </div>
        </>
    )
}

SurfaceSelector.propTypes = {
    onSurfaceSelected: PropTypes.func.isRequired
}