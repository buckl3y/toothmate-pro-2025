/**
 * Treatment component to display treatments in a list.
 * Used in the ToothTreatmentEditor.
 * 
 * @author Skye Pooley
 */

import PropTypes from "prop-types";
import { useState } from "react";
import capitalize from "./capitalize";
import { ChevronDown, ChevronRight } from "lucide-react";

export default function Treatment({ treatment }) {
    const { tooth, procedure, ToothSurfaces, Notes } = treatment;
    const [showDetails, setShowDetails] = useState(false);
     const VitaShades = {
        A1: '#f6efe5ff',
        A2: '#eedfccff',
        A3: '#e2ceabff', 
        A4: '#d0bd8bff'
    }

    return (
        <div className="subsubpanel flex justify-between mr-5 ml-5">
            <div className="flex flex-col w-4/5 pl-2 pr-2">
                <div className=" flex items-center justify-between">
                    <p >
                        <b>
                            {procedure === "filling" && (
                                ToothSurfaces.length > 1 
                                ? (ToothSurfaces.length > 2 ? "Large" : "Medium") 
                                : "Small"
                            )}{" "}
                            {capitalize(procedure)}</b> on {ToothSurfaces.map(surface => surface.name).join(", ")} surface{ToothSurfaces.length > 1 && "s"} of tooth {tooth}
                    </p>
                </div>

                {showDetails && (
                    <div>
                        {<>
                            <div className="flex justify-between=">
                                <div>Material: {treatment.material}{' '}</div> 
                                <div>Tone: {treatment.materialTone} <span className="legend-colour" style={{background: '#111'}}>hello</span></div> 
                            </div>
                            {Notes.length > 0 ? (
                                Notes.map(note => (
                                    <div key={note.id} className="mb-2 flex">
                                        <div className="mt-1 ml-2 mr-2">{new Date(note.createdAt).toLocaleDateString()}</div>
                                        <p className="border border-gray-300 rounded-md p-1 w-full">
                                            {note.body}
                                        </p>
                                    </div>
                                ))
                            ) : (
                                <p>No Notes</p>
                            )}
                        </>}
                        
                    </div>
                )}
            </div>

            <button className={showDetails ? "btn" : "btn-secondary"} style={{ maxHeight: "40px" }} onClick={() => setShowDetails(!showDetails)}>
                {showDetails ? <ChevronDown/> : <ChevronRight/>}
            </button>
        </div>
    );
}


Treatment.propTypes = {
    treatment: PropTypes.shape({
            id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
            tooth: PropTypes.string,
            procedure: PropTypes.string,
            ToothSurfaces: PropTypes.arrayOf(
                PropTypes.shape({
                    name: PropTypes.string
                })
            ),
            material: PropTypes.string,
            materialTone: PropTypes.string,
            Notes: PropTypes.arrayOf(
                PropTypes.shape({
                    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
                    body: PropTypes.string,
                    author: PropTypes.string
                })
            )
        })
    }