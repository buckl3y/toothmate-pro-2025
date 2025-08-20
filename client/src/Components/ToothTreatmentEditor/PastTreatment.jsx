const PastTreatment = ({ selectedTooth, selectedPatient, selectedDate }) => {
    return (
        <div className="flex flex-col items-center">
            <span className="text-lg font-semibold">Past Treatment</span>
            <span className="text-sm mt-2">Selected Tooth: {selectedTooth}</span>
            <span className="text-sm mt-2">Selected Patient: {selectedPatient.name}</span>
            {/* <span className="text-sm mt-2">Selected Date: {selectedDate}</span> */}

        </div>
    );
};

export default PastTreatment;