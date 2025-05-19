import React from 'react';
import PropTypes from 'prop-types';

const PatientSearchInput = ({ searchTerm, setSearchTerm }) => (
    <input
        type="text"
        placeholder="Enter NHI or Name"
        className="bg-textbox-purple text-black py-2 px-4 rounded"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
    />
);

PatientSearchInput.propTypes = {
    searchTerm: PropTypes.string.isRequired,
    setSearchTerm: PropTypes.func.isRequired,
};

export default PatientSearchInput;
