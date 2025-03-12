import React from 'react';
import PropTypes from 'prop-types';

const PatientDropdown = ({ isDropdownOpen, filteredPatients, handleSelectPatient }) => (
    isDropdownOpen && filteredPatients.length > 0 && (
        <ul className="absolute top-full mt-2 bg-white border rounded shadow-lg text-black">
            {filteredPatients.map(patient => (
                <li
                    key={patient.nhiNumber}
                    className="p-2 hover:bg-gray-200 cursor-pointer"
                    onClick={() => handleSelectPatient(patient)}
                >
                    {`${patient.nhiNumber} - ${patient.name}`}
                </li>
            ))}
        </ul>
    )
);

PatientDropdown.propTypes = {
    isDropdownOpen: PropTypes.bool.isRequired,
    filteredPatients: PropTypes.arrayOf(PropTypes.shape({
        nhiNumber: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired
    })).isRequired,
    handleSelectPatient: PropTypes.func.isRequired,
};

export default PatientDropdown;
