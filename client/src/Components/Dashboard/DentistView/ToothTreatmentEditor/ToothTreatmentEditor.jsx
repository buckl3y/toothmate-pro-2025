import { useState, useEffect } from "react";
import { addTreatment } from "../../../../api";

const ToothTreatmentEditor = ({ selectedPatient, refreshPatientData, selectedTooth, selectedSurface, selectedDate }) => {
    const [treatmentType, setTreatmentType] = useState('filling');
    const [treatmentDate, setTreatmentDate] = useState(Date.now());
    const [relevantTreatments, setRelevantTreatments] = useState([]);

    useEffect(() => {
        setRelevantTreatments(
            selectedPatient.Treatments.filter(treatment => treatment.tooth === selectedTooth)
        );
    }, [selectedPatient, selectedTooth]);

    const handleTreatmentAdd = async () => {
        console.log("Adding new treament for " + selectedPatient.name);

        const treatment = {
            procedure: treatmentType,
            tooth: selectedTooth,
            surface: selectedSurface
        }

        await addTreatment(selectedPatient, treatment);
        refreshPatientData();
    };

    if (!selectedTooth) {
        return (
            <h3 style={{textAlign: 'center', margin: '8px', fontWeight: 'bold'}}>
                Tooth Editor Placeholder
            </h3>
        );
    }

    return (
        <div className="h-full w-full p-4">
            <h3 className="text-center">Tooth {selectedTooth} Treatments</h3>
            <hr />

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

                Surface: {selectedSurface}

                <button className="btn" onClick={handleTreatmentAdd}>Add</button>
            </div>
            
            <hr/>

            <h3>Planned Treatments</h3>
            <br/>

            <ul>
                {relevantTreatments.map(treatment => 
                <li key={treatment.id}>
                    {treatment.procedure}
                </li>)}
            </ul>

            <hr/>
            <h3>Completed Treatments</h3>
            <br/>
            <hr/>
        </div>
    );
};

export default ToothTreatmentEditor;