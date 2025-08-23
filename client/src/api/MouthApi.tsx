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