import { useState, useEffect } from "react";
import { addTreatment } from "../../../../api";

const ToothTreatmentEditor = ({ selectedPatient, refreshPatientData, selectedTooth, selectedSurfaces, selectedDate }) => {
    const [treatmentType, setTreatmentType] = useState('filling');
    const [treatmentDate, setTreatmentDate] = useState(Date.now());
    const [relevantTreatments, setRelevantTreatments] = useState([]);

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
            surfaces: selectedSurfaces
        }

        await addTreatment(selectedPatient, treatment);
        refreshPatientData();
    };

    return (
        <div className="h-full w-full p-4">
            {selectedTooth ? (
                <h3 className="text-center">Tooth {selectedTooth} Treatments</h3>
            ) : (
                <h3 className="text-center">Treatments for {selectedPatient.name}</h3>
            )}
            <hr />

            {selectedTooth &&
            <>
                <h4 className="text-center">Add a New Treatment</h4>
                <div className="flex justify-between m-3">
                    
                    <select value={treatmentType} onChange={e => setTreatmentType(e.target.value)}>
                        <option value={'filling'}>Filling</option>
                        <option value={'crown'}>Crown</option>
                        <option value={'root canal'}>Root Canal</option>
                        <option value={'extraction'}>Extraction</option>
                        <option value={'implant'}>Implant</option>
                        <option value={'veneer'}>Veneer</option>
                        <option value={'sealant'}>Sealant</option>
                    </select>

                    {selectedSurfaces.length > 0 ? "Surface:" +  selectedSurfaces.join(", ") : "Select a Surface"}

                    <button className="btn" onClick={handleTreatmentAdd} disabled={selectedSurfaces.length < 1}>Add</button>
                </div>
            </>
            }
            <hr/>

            <h4>Planned Treatments</h4>
            <br/>

            <ul>
                {relevantTreatments.map(treatment => 
                <li key={treatment.id}>
                    {treatment.tooth} - {treatment.procedure} 
                    {treatment.ToothSurfaces && (" on " + treatment.ToothSurfaces.map(surface => ` ${surface.name} `))}
                </li>)}
            </ul>

            <hr/>
            <h4>Completed Treatments</h4>
            <br/>
            <hr/>
        </div>
    );
};

export default ToothTreatmentEditor;