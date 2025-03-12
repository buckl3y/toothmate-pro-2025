import { useState, useEffect } from 'react';

const useFetchPatients = (serverUrl, refreshTrigger) => {
    const [patients, setPatients] = useState([]);

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/patients`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    },
                });

                if (response.ok) {
                    const contentType = response.headers.get('Content-Type');
                    if (contentType && contentType.includes('application/json')) {
                        const data = await response.json();
                        const patientArray = Object.keys(data).map(key => ({
                            nhiNumber: key,
                            ...data[key]
                        }));
                        console.log("successful fetch patients: ", patientArray);
                        setPatients(patientArray);
                    } else {
                        console.error('Expected JSON, but received:', contentType);
                    }
                } else {
                    console.error('Failed to load patients:', response.statusText);
                }
            } catch (error) {
                console.error('Failed to load patients:', error);
            }
        };
        fetchPatients();
    }, [serverUrl, refreshTrigger]); 

    return patients;
};

export default useFetchPatients;
