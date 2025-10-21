import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { addTreatment, addCondition } from "../../../../api";
import Treatment from "./Treatment";
import Condition from "./Condition";

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

const ToothTreatmentEditor = ({ selectedPatient, refreshPatientData, selectedTooth, selectedSurfaces, setRequireSurface }) => {
    const [showConditionEditor, setShowConditionEditor] = useState(false);
    const [conditionType, setConditionType] = useState('erosion');
    const [conditionNotes, setConditionNotes] = useState('');
    const [relevantConditions, setRelevantConditions] = useState([]);
    
    const [treatmentType, setTreatmentType] = useState('filling');
    const [relevantTreatments, setRelevantTreatments] = useState([]);
    const [treatmentNotes, setTreatmentNotes] = useState("");
    const [isPlanned, setIsPlanned] = useState(false);
    const [vitaShade, setVitaShade] = useState('A2');
    const [treatmentDate, setTreatmentDate] = useState(new Date());
    const [showMaterial, setShowMaterial] = useState(true);
    const [showVitaDropdown, setShowVitaDropdown] = useState(false);
    const [material, setMaterial] = useState("ceramic");

    // There is no hex code guide for the VITA shades, these are just my best guess.
    // Dentists have the physical guide on-hand and would use it for colour matching.
    // We cannot expect their computer monitor to be colour accurate.
    const VitaShades = {
        A1: '#f6efe5ff',
        A2: '#eedfccff',
        A3: '#e2ceabff', 
        A4: '#d0bd8bff'
    }

    // Filter treatments to only show ones on the currently selected tooth.
    useEffect(() => {
        if (selectedTooth) {
            setRelevantTreatments(
                selectedPatient.Treatments.filter(treatment => treatment.tooth === selectedTooth)
            );
            setRelevantConditions(
                selectedPatient.Conditions.filter(condition => condition.tooth === selectedTooth)
            );
        }
        else {
            setRelevantTreatments(selectedPatient.Treatments);
            setRelevantConditions(selectedPatient.Conditions);
        }
    }, [selectedPatient, selectedTooth]);

    // Send request for new treatment to backend.
    const handleTreatmentAdd = async () => {
        console.log("Adding new treament for " + selectedPatient.name);

        selectedSurfaces.forEach(surface => {
            console.log("Surface: " + surface);
        });

        const treatment = {
            procedure: treatmentType,
            tooth: selectedTooth,
            surfaces: (requireSurface() ? selectedSurfaces : []),
            notes: [treatmentNotes],
            planned: isPlanned,
            material: material,
            materialTone: vitaShade,
            plannedDate: treatmentDate
        }

        console.log("Adding treatment: \n" + JSON.stringify(treatment))

        await addTreatment(selectedPatient, treatment);
        refreshPatientData();
    };

    const handleConditionAdd = async () => {
        const condition = {
            name: conditionType,
            tooth: selectedTooth,
            notes: [conditionNotes]
        }

        await addCondition(selectedPatient, condition);
        refreshPatientData();
    }

    // Does the selected treatment type require a surface to be selected?
    const requireSurface = () => {
        return ["filling", "sealant", "root canal"].includes(treatmentType)
    }

    // Is the treatment valid for sending to backend?
    const validateTreatment = () => {
        if (requireSurface()) {
            return selectedSurfaces.length > 0;
        }
        return true;
    }

    // Tell the dentist view whether it should show a surface selection tool
    useEffect(() => {
        setRequireSurface(requireSurface())

        const materialRequired = ["filling", "root canal", "crown", "veneer", "implant"].includes(treatmentType);
        setShowMaterial(materialRequired)
        if (!materialRequired) {
            setMaterial(null)
            setVitaShade(null)
        }
    }, [treatmentType])

    return (
        <div className="w-full p-2 flex flex-col h-full" style={{ minHeight: "600px" }}>
            <div style={{ flex: "0 0 auto" }}>
                {selectedTooth ? (
                    <h4 className="text-center mt-3">{selectedPatient.name} Tooth {selectedTooth} Chart</h4>
                ) : (
                    <h4 className="text-center mt-3">Chart for {selectedPatient.name}</h4>
                )}
            </div>

            <div style={{ flex: "1 1 auto", minHeight: 0, overflow: "hidden" }}>
                {relevantTreatments.length > 0 || relevantConditions.length > 0 ? (
                    <div style={{ height: "100%", maxHeight: "530px", overflow: 'auto' }}>
                        <div className="flex items-center justify-center w-full">
                            <hr className="aside"/>
                            <h5 className="ml-5 mr-5 text-center">Planned</h5>
                            <hr className="aside"/>
                        </div>
                        {relevantTreatments
                            .filter(treatment => treatment.planned)
                            .map(treatment => <Treatment key={treatment.id} treatment={treatment} refreshPatientData={refreshPatientData} />)}

                        <div className="flex items-center justify-center w-full">
                            <hr className="aside"/>
                            <h5 className="ml-5 mr-5 text-center">Historical</h5>
                            <hr className="aside"/>
                        </div>
                        {relevantTreatments
                            .filter(treatment => !treatment.planned)
                            .map(treatment => <Treatment key={treatment.id} treatment={treatment} refreshPatientData={refreshPatientData}/>)}
                        
                        <div className="flex items-center justify-center w-full">
                            <hr className="aside"/>
                            <h5 className="ml-5 mr-5 text-center">Conditions</h5>
                            <hr className="aside"/>
                        </div>
                        {relevantConditions.map(condition => 
                            <Condition key={condition.id} condition={condition} refreshPatientData={refreshPatientData} />
                        )}
                    </div>
                ) : (
                    <p className="text-center">No Treatments or Conditions Recorded</p>
                )}
            </div>

            {/* Treatment Editor */}
            {selectedTooth && (
                <div className="subpanel w-full" style={{ flex: "0 0 auto", marginTop: "auto" }}>
                    <div className="flex justify-between">
                        <button 
                            className={showConditionEditor ? "btn-secondary" :"btn"}
                            style={{width: '50%'}}
                            onClick={() => setShowConditionEditor(false)}>
                            New Treatment
                        </button>
                        <button 
                            className={showConditionEditor ? "btn" :"btn-secondary"}
                            style={{width: '50%'}}
                            onClick={() => setShowConditionEditor(true)}>
                            Log Condition
                        </button>
                    </div>
                    
                    {showConditionEditor ? 
                    <div className="flex justify-between m-3">
                        <div className="flex flex-col w-full mr-3">
                            <div className="flex justify-between">
                                <select 
                                    value={conditionType} 
                                    onChange={e => setConditionType(e.target.value)}
                                    className="border border-gray-300 rounded-md p-1"
                                >
                                    <option value={'erosion'}>Erosion</option>
                                    <option value={'partial eruption'}>Partial Eruption</option>
                                    <option value={'acid wear'}>Acid Wear</option>
                                    <option value={'bruxism'}>Bruxism</option>
                                    <option value={'grooving'}>Grooving</option>
                                    <option value={'discolouration'}>Discolouration</option>
                                    <option value={'fracture'}>Fracture</option>
                                </select>

                            </div>

                            <div className="w-full">
                                <textarea
                                    className="border border-gray-300 rounded-md p-1 mt-2 w-full"
                                    id="treatment-notes"
                                    placeholder="Notes (optional)"
                                    value={conditionNotes}
                                    onChange={e => setConditionNotes(e.target.value)}
                                />
                            </div>
                        </div>

                        <button 
                            className="btn tooltip" 
                            onClick={handleConditionAdd}>
                                Add
                        </button>

                    </div>
                    :
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

                                {
                                showMaterial &&
                                <div className="flex">
                                    <select
                                        value={material}
                                        onChange={e => setMaterial(e.target.value)}
                                        className="border border-gray-300 rounded-md p-1"
                                    >
                                        <option value={'ceramic'}>Ceramic</option>
                                        <option value={'composite'}>Composite</option>
                                        <option value={'gold'}>Gold</option>
                                        <option value={'silver amalgam'}>Silver Amalgam</option>
                                        <option value={'glass ionomer'}>Glass Ionomer</option>
                                    </select>

                                    {/* 
                                    Ideally this would just be a regular select like the one above but most browsers don't support
                                    colours for individual options so we do this instead :(
                                    Material Shade Selector. */
                                    }
                                    <div className="relative">
                                        <button
                                            type="button"
                                            className="border border-gray-300 rounded-md p-1 w-full text-left"
                                            style={{ backgroundColor: VitaShades[vitaShade] }}
                                            onClick={() => setShowVitaDropdown(prev => !prev)}
                                        >
                                            {vitaShade}
                                        </button>
                                        {showVitaDropdown &&
                                            <ul
                                                className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg"
                                                style={{
                                                    maxHeight: "75px",
                                                    overflowY: "auto"
                                                }}
                                            >
                                                {Object.entries(VitaShades).map(([shade, color]) => (
                                                    <li
                                                        key={shade}
                                                        className="cursor-pointer"
                                                        style={{ backgroundColor: color }}
                                                        onClick={() => {
                                                            setVitaShade(shade);
                                                            setShowVitaDropdown(false);
                                                        }}
                                                    >
                                                        {shade}
                                                    </li>
                                                ))}
                                            </ul>
                                        }
                                    </div>
                                </div>}

                                <div>
                                    <label htmlFor={"radio-historic"} >Historic</label>
                                    <label className="toggle">
                                        <input 
                                            type="checkbox" 
                                            checked={isPlanned}
                                            onChange={(ce) => {setIsPlanned(ce.target.checked)}}
                                            />
                                        <span className="toggle-slider round" ></span>
                                    </label>
                                    <label htmlFor={"radio-planned"} >Planned</label>
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

                            {isPlanned &&
                                <div>
                                    <label hidden={false} htmlFor="treatment-date">Date:</label>
                                    <input
                                        type="date"
                                        id="treatment-date"
                                        value={treatmentDate ? treatmentDate.toISOString().slice(0, 10) : ""}
                                        onChange={e => {
                                            const newDate = new Date(treatmentDate);
                                            const [year, month, day] = e.target.value.split('-');
                                            newDate.setFullYear(Number(year), Number(month) - 1, Number(day));
                                            setTreatmentDate(newDate);
                                        }}
                                        hidden={false}
                                    />
                                    <input 
                                        type="time"
                                        value={treatmentDate ? treatmentDate.toTimeString().slice(0,5) : ""}
                                        onChange={e => {
                                            const [hours, minutes] = e.target.value.split(':');
                                            const newDate = new Date(treatmentDate);
                                            newDate.setHours(Number(hours), Number(minutes));
                                            setTreatmentDate(newDate);
                                        }}
                                    />
                                </div>}
                        </div>

                        <button 
                            className="btn tooltip" 
                            onClick={handleTreatmentAdd} 
                            disabled={!validateTreatment()}>
                                Add
                                <span className="tooltiptext">Please select a surface before adding treatment.</span>
                        </button>
                    </div>
                    }
                </div>
            )}
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
        })).isRequired,
        Conditions: PropTypes.arrayOf(PropTypes.shape({
            id: PropTypes.number,
            tooth: PropTypes.string,
            name: PropTypes.string,
            Notes: PropTypes.array
        }))
    }).isRequired,
    refreshPatientData: PropTypes.func.isRequired,
    selectedTooth: PropTypes.string,
    selectedSurfaces: PropTypes.arrayOf(PropTypes.string).isRequired,
    setRequireSurface: PropTypes.func.isRequired
};

export default ToothTreatmentEditor;