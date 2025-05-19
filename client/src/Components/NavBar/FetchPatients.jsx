import { useState, useEffect } from 'react';

// Remove serverUrl parameter if you're using the environment variable directly
const useFetchPatients = (refreshTrigger) => {
    const [patients, setPatients] = useState([]);
    // Get the server URL from environment variables
    const serverUrl = import.meta.env.VITE_SERVER_URL;
    
    // Add debugging
    console.log('Server URL from environment:', serverUrl);

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                console.log('Fetching patients from:', `${serverUrl}/api/patients`);
                
                const response = await fetch(`${serverUrl}/api/patients`, {
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
                // Log more detailed error information
                console.error('Error type:', error.name);
                console.error('Error message:', error.message);
            }
        };
        
        fetchPatients();
    }, [serverUrl, refreshTrigger]); 

    return patients;
};

export default useFetchPatients;