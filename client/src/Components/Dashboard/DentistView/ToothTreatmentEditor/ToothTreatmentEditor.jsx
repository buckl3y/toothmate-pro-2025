import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { addTreatment } from "../../../../api";
import Treatment from "./Treatment";

/**
 * ToothTreatmentEditor 
 * Shows list of existing treatments and allows addition of new treatments.
 * @param {Object} param0 - Component props.
 * @param {Object} param0.selectedPatient - The currently selected patient.
 * @param {Function} param0.refreshPatientData - Patient data stored in parent component. Call this to refresh from database
 * @param {string} param0.selectedTooth - The currently selected tooth as tooth code string: t_14.
 * @param {Array} param0.selectedSurfaces - The currently selected tooth surfaces. List of surface names.
 * @returns {JSX.Element} The rendered component.
 * 
 * @author Skye Pooley
 */

const ToothTreatmentEditor = ({ selectedPatient, refreshPatientData, selectedTooth, selectedSurfaces }) => {
    const [treatmentType, setTreatmentType] = useState('filling');
    const [treatmentDate, setTreatmentDate] = useState(new Date());
    const [relevantTreatments, setRelevantTreatments] = useState([]);
    const [treatmentNotes, setTreatmentNotes] = useState("");

    useEffect(() => {
        if (selectedTooth) {
            setRelevantTreatments(
                selectedPatient.Treatments.filter(treatment => treatment.tooth === selectedTooth)
            );
        }
        else {
            setRelevantTreatments(selectedPatient.Treatments);
        }
        
    }, [selectedPatient, selectedTooth]);

    const handleTreatmentAdd = async () => {
        console.log("Adding new treament for " + selectedPatient.name);

        selectedSurfaces.forEach(surface => {
            console.log("Surface: " + surface);
        });

        const treatment = {
            procedure: treatmentType,
            tooth: selectedTooth,
            surfaces: selectedSurfaces,
            notes: [treatmentNotes],
            plannedDate: treatmentDate
        }

        await addTreatment(selectedPatient, treatment);
        refreshPatientData();
    };

    return (
        <div className="h-full w-full p-4 flex flex-col">
            {selectedTooth ? (
                <h3 className="text-center">{selectedPatient.name} Tooth {selectedTooth} Treatments</h3>
            ) : (
                <h3 className="text-center">Treatments for {selectedPatient.name}</h3>
            )}
            
            {relevantTreatments.length > 0 ? (
            <>
                <div className="flex items-center justify-center w-full">
                    <hr className="aside"/>
                    <h5 className="ml-5 mr-5 text-center">Upcoming</h5>
                    <hr className="aside"/>
                </div>

                <div>

                    {relevantTreatments.map(treatment => <Treatment key={treatment.id} treatment={treatment} />)}

                    <div className="flex items-center justify-center w-full">
                        <hr className="aside"/>
                        <h5 className="ml-5 mr-5 text-center">Completed</h5>
                        <hr className="aside"/>
                    </div>
                </div>
            </>
            ) : (
                <p className="text-center">No Treatments On Record</p>
            )}
            
            
            {/* Treatment Editor */}
            {selectedTooth &&
            <div className="subpanel" style={{ marginTop: "auto" }}>
                <h4 className="text-center">Add a New Treatment</h4>
                <div className="flex justify-between m-3">
                    
                    <div className="flex flex-col w-full mr-3">
                        <div className="flex justify-between">
                            <select 
                            value={treatmentType} 
                            onChange={e => setTreatmentType(e.target.value)}
                            className="border border-gray-300 rounded-md p-1"
                            >
                                <option value={'filling'}>Filling</option>
                                <option value={'crown'}>Crown</option>
                                <option value={'root canal'}>Root Canal</option>
                                <option value={'extraction'}>Extraction</option>
                                <option value={'implant'}>Implant</option>
                                <option value={'veneer'}>Veneer</option>
                                <option value={'sealant'}>Sealant</option>
                            </select>

                            <div className="">
                                {selectedSurfaces.length > 0 ? selectedSurfaces.join(", ") : "Select a Surface"}
                            </div>

                            <div>
                                <label htmlFor="treatment-date">Date:</label>
                                <input
                                    type="date"
                                    id="treatment-date"
                                    value={treatmentDate.toISOString().split("T")[0]}
                                    onChange={e => setTreatmentDate(new Date(e.target.value))}
                                />
                            </div>
                        </div>

                        <div className="w-full">
                            <textarea
                                className="border border-gray-300 rounded-md p-1 mt-2 w-full"
                                id="treatment-notes"
                                placeholder="Notes (optional)"
                                value={treatmentNotes}
                                onChange={e => setTreatmentNotes(e.target.value)}
                            />
                        </div>
                    </div>

                    <button className="btn" onClick={handleTreatmentAdd} disabled={selectedSurfaces.length < 1}>Add</button>
                </div>
            </div>
            }
        </div>
    );
};
ToothTreatmentEditor.propTypes = {
    selectedPatient: PropTypes.shape({
        name: PropTypes.string.isRequired,
        Treatments: PropTypes.arrayOf(PropTypes.shape({
            id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
            tooth: PropTypes.string,
            procedure: PropTypes.string,
            ToothSurfaces: PropTypes.arrayOf(
                PropTypes.shape({
                    name: PropTypes.string
                })
            )
        })).isRequired
    }).isRequired,
    refreshPatientData: PropTypes.func.isRequired,
    selectedTooth: PropTypes.string,
    selectedSurfaces: PropTypes.arrayOf(PropTypes.string).isRequired
};

export default ToothTreatmentEditor;