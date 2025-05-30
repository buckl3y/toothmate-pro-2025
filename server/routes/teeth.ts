/*
    Returns the mouth-related data for a given patient.
    Currently using placeholder data for testing.

    @author Skye Pooley
*/

const express = require("express");
const router = express.Router();
const path = require("path");

// important. client/api/MouthApi needs to have a matching copy.
const TreatmentType = {
    FILLING: 'filling',
    CROWN: 'crown',
    VENEER: 'veneer',
    IMPLANT: 'implant',
    EXTRACTION: 'extraction',
    ROOT_CANAL: 'root canal',
    BRIDGE: 'bridge',
    SEALANT: 'sealant'
}

// Return the mouth data for a given patient.
// Temporarily implemented with hard-coded data.
// @author Skye Pooley
// Updated 29 May
router.get("/mouthdata", (req, res) => {
    console.log("fetching placeholder mouth");
    let demoMouth = {
        t_11: {
            index: "11",
            treatments: [
                {
                    type: TreatmentType.EXTRACTION,
                    faces: ['all'],
                    dateAdded: new Date("2017-05-11"),
                    material: null
                },
                {
                    type: TreatmentType.FILLING,
                    faces: ['buccal'],
                    dateAdded: new Date("2017-05-11"),
                    material: 'composite'
                }
            ],
            conditions: {
                cavities: [],
            },
        },
        t_12: {
            index: "12",
            treatments: [
                {
                    type: TreatmentType.CROWN,
                    faces: ['incisal'],
                    dateAdded: new Date("2019-10-06"),
                    material: 'ceramic'
                }
            ],
            conditions: {
                cavities: [],
            },
        },
        t_13: {
            index: "13",
            treatments: [],
            conditions: {
                cavities: [],
            },
        },
        t_14: {
            index: "14",
            treatments: [],
            conditions: {
                cavities: [],
            },
        },
        t_15: {
            index: "15",
            treatments: [],
            conditions: {
                cavities: [],
            },
        },
        t_16: {
            index: "16",
            treatments: [],
            conditions: {
                cavities: [],
            },
        },
        t_17: {
            index: "17",
            treatments: [],
            conditions: {
                cavities: [],
            },
        },
        t_18: {
            index: "18",
            treatments: [],
            conditions: {
                cavities: [],
            },
        },
        t_21: {
            index: "21",
            treatments: [],
            conditions: {
                cavities: [],
            },
        },
        t_22: {
            index: "22",
            treatments: [],
            conditions: {
                cavities: [],
            },
        },
        t_23: {
            index: "23",
            treatments: [],
            conditions: {
                cavities: [],
            },
        },
        t_24: {
            index: "24",
            treatments: [
                {
                    type: TreatmentType.VENEER,
                    faces: ['incisal'],
                    dateAdded: new Date("2019-10-06"),
                    material: 'ceramic'
                }
            ],
            conditions: {
                cavities: [],
            },
        },
        t_25: {
            index: "25",
            treatments: [
                {
                    type: TreatmentType.IMPLANT,
                    faces: ['incisal'],
                    dateAdded: new Date("2019-10-06"),
                    material: 'ceramic'
                }
            ],
            conditions: {
                cavities: [],
            },
        },
        t_26: {
            index: "26",
            treatments: [],
            conditions: {
                cavities: [],
            },
        },
        t_27: {
            index: "27",
            treatments: [],
            conditions: {
                cavities: [],
            },
        },
        t_28: {
            index: "28",
            treatments: [],
            conditions: {
                cavities: [],
            },
        },
        t_31: {
            index: "31",
            treatments: [],
            conditions: {
                cavities: [],
            },
        },
        t_32: {
            index: "32",
            treatments: [],
            conditions: {
                cavities: [],
            },
        },
        t_33: {
            index: "33",
            treatments: [],
            conditions: {
                cavities: [],
            },
        },
        t_34: {
            index: "34",
            treatments: [],
            conditions: {
                cavities: [],
            },
        },
        t_35: {
            index: "35",
            treatments: [],
            conditions: {
                cavities: [],
            },
        },
        t_36: {
            index: "36",
            treatments: [],
            conditions: {
                cavities: [],
            },
        },
        t_37: {
            index: "37",
            treatments: [],
            conditions: {
                cavities: [],
            },
        },
        t_38: {
            index: "38",
            treatments: [],
            conditions: {
                cavities: [],
            },
        },
        t_41: {
            index: "41",
            treatments: [],
            conditions: {
                cavities: [],
            },
        },
        t_42: {
            index: "42",
            treatments: [],
            conditions: {
                cavities: [],
            },
        },
        t_43: {
            index: "43",
            treatments: [],
            conditions: {
                cavities: [],
            },
        },
        t_44: {
            index: "44",
            treatments: [],
            conditions: {
                cavities: [],
            },
        },
        t_45: {
            index: "45",
            treatments: [
                {
                    type: TreatmentType.SEALANT,
                    faces: ['incisal'],
                    dateAdded: new Date("2019-10-06"),
                    material: 'ceramic'
                }
            ],
            conditions: {
                cavities: [],
            },
        },
        t_46: {
            index: "46",
            treatments: [],
            conditions: {
                cavities: [],
            },
        },
        t_47: {
            index: "47",
            treatments: [
                {
                    type: TreatmentType.ROOT_CANAL,
                    faces: ['incisal'],
                    dateAdded: new Date("2019-10-06"),
                    material: 'ceramic'
                }
            ],
            conditions: {
                cavities: [],
            },
        },
        t_48: {
            index: "48",
            treatments: [],
            conditions: {
                cavities: [],
            },
        },
    };
    res.json(demoMouth);
});

module.exports = router;