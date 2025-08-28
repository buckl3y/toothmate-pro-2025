/*
Previously this was an api that returned dummy data for mouth treatments but that function was moved to the patient
api during database migration.
Now this file is just used to keep track of treatment types.

@author Skye Pooley - 22179237
*/

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