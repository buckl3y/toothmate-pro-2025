/**
 * Component to render a condition in the tooth treatment editor
 * 
 * @author Skye Pooley
 */

import PropTypes from "prop-types";
import { useState } from "react";
import capitalize from "./capitalize";
import { ChevronDown, ChevronRight } from "lucide-react";

export default function Condition({ condition }) {
    const { name, tooth, Notes } = condition;
    const [showDetails, setShowDetails] = useState(false);

    return (
        <div className="subsubpanel flex justify-between mr-5 ml-5">
            <div className="flex flex-col w-4/5 pl-2 pr-2">
                <div className=" flex items-center justify-between">
                    <p >
                        <b>{capitalize(name)}</b> on tooth {tooth}
                    </p>
                </div>

                {showDetails && (
                    <div>
                        {<>
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


Condition.propTypes = {
    condition: PropTypes.shape({
            id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
            name: PropTypes.string,
            tooth: PropTypes.string,
            Notes: PropTypes.arrayOf(
                PropTypes.shape({
                    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
                    body: PropTypes.string,
                    author: PropTypes.string
                })
            )
        })
    }