import PastTreatment from './PastTreatment';
import PlannedTreatment from './PlannedTreatment';
import TreatmentType from './TreatmentType';
import TreatmentOptions from './TreatmentOptions';

const ToothTreatmentEditor = ({ selectedTooth, selectedPatient, selectedDate }) => {
    if (!selectedTooth) {
        return (
            <h3 style={{textAlign: 'center', margin: '8px', fontWeight: 'bold'}}>
                Tooth Editor Placeholder
            </h3>
        );
    }

    return (
        <div className="grid grid-cols-2 grid-rows-2 gap-2 h-full w-full p-4">
            <div className="bg-gray-100 rounded-md flex items-center justify-center shadow-md">
                <PastTreatment selectedTooth={selectedTooth} selectedPatient={selectedPatient} selectedDate={selectedDate} />
            </div>
            <div className="bg-gray-100 rounded-md flex items-center justify-center shadow-md">
                <PlannedTreatment selectedTooth={selectedTooth} selectedPatient={selectedPatient} selectedDate={selectedDate} />
            </div>
            <div className="bg-gray-100 rounded-md flex items-center justify-center shadow-md">
                <TreatmentType selectedTooth={selectedTooth} selectedPatient={selectedPatient} selectedDate={selectedDate} />
            </div>
            <div className="bg-gray-100 rounded-md flex items-center justify-center shadow-md">
                <TreatmentOptions selectedTooth={selectedTooth} selectedPatient={selectedPatient} selectedDate={selectedDate} />
            </div>
        </div>
    );
};

export default ToothTreatmentEditor;