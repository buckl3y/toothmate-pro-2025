/*
Mouth Data interfaces and API
Provides a function to fetch all the mouth-related data for a given patient.
Mouth data includes the treatments and conditions for each tooth.

@author Skye Pooley - 22179237
*/

import Axios from "axios";

const serverUrl: string = import.meta.env.VITE_SERVER_URL;

export const TreatmentType = {
    FILLING: 'filling',
    CROWN: 'crown',
    VENEER: 'veneer',
    IMPLANT: 'implant',
    EXTRACTION: 'extraction',
    ROOT_CANAL: 'root canal',
    BRIDGE: 'bridge',
    SEALANT: 'sealant'
}

interface iTreatmentData {
    type: string,
    faces: string[],
    dateAdded: Date,
    material: string
}

interface iToothData {
    index: string,
    treatments: iTreatmentData[]
    conditions: {},
    extracted: boolean
}

export interface iMouthData {
    't_11': iToothData,
    't_12': iToothData,
}

export async function getPatientMouthData(patientId: string): Promise<iMouthData | null> {
    try {
        let req = `${serverUrl}/api/mouthdata`;
        let response = await Axios.get(req)
        console.log(response);
        return response.data;
    }
    catch (error: any) {
        console.log(error.response);
        return null;
    }
}
