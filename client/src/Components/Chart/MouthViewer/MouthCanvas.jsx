import PropTypes from 'prop-types'; // Import PropTypes
import { useGLTF } from '@react-three/drei';
import { useEffect, useRef } from 'react'; // Import hooks

import { TreatmentType } from '../../../api/MouthApi';
import { 
    blueMaterial, 
    fillingMaterial, 
    crownMaterial, 
    rootCanalMaterial, 
    extractionMaterial,
    implantMaterial,
    veneerMaterial,
    sealantMaterial
} from './ToothMaterials';
import { useState } from 'react';

export default function MouthCanvas({ selectedTooth, onMeshClick, mouthData, treatmentVisibility, is3d }) { 
    const { scene: model3d } = useGLTF('/assets/3DModels/CompressedAdultTeeth/mouth.glb');
    const { scene: model2d } = useGLTF('/assets/3DModels/CompressedAdultTeeth/flat-mouth.glb');
    const [modelScale, setModelScale] = useState(4);
    const [model, setmodel] = useState(model3d);
    const originalMaterials = useRef({});

    useEffect(() => {
        if (!model3d) { 
            console.log(
                "model 3d missing."
            )
            return; 
        }
        if (!model2d) { 
            console.log(
                "model 2d missing."
            )
            return; 
        }
        console.log("Switching mouth views");
        if (is3d) {
            setmodel(model3d);
            setModelScale(4);
        }else {
            setmodel(model2d);
            setModelScale(7);
        }
    }, [is3d, model3d, model2d])

    // Effect to store original materials on mount and restore on unmount
    // Allows tooth colour to be returned to original after edits.
    useEffect(() => {
        if (!model) return;
        console.log("Saving original materials...");
        const materialsToStore = {};
        model.traverse((child) => {
            if (child.isMesh && !materialsToStore[child.uuid]) {
                // Clone material to avoid modifying the original shared material instance
                materialsToStore[child.uuid] = child.material.clone();
            }
        });
        originalMaterials.current = materialsToStore;

        // Copy ref value to a variable inside the effect
        const blueMat = blueMaterial.current;

        // Cleanup function to restore materials
        return () => {
            model.traverse((child) => {
                if (child.isMesh && originalMaterials.current[child.uuid]) {
                    // Check if the current material is the blue one before disposing/replacing
                    if (child.material === blueMat) {
                        child.material.dispose(); // Dispose the instance if it was the blue one
                    }
                    child.material = originalMaterials.current[child.uuid];
                }
            });
            // Dispose the shared blue material instance using the variable
            // blueMat.dispose();
        };
    }, [model]); // Run when the model loads.

    // Effect to change color based on treatment and condition data
    useEffect(() => {
        if (!model) return;

        // Check the teeth one-by-one
        model.traverse((tooth) => {
            if (!tooth.isMesh) return;

            // We only want to change the tooth texture if we have the original texture saved to restore it later.
            const originalMat = originalMaterials.current[tooth.uuid];
            if (!originalMat) return; // Don't proceed if originalMat is missing

            // Mesh name might have some extra characters after the tooth name (t_xx)
            const toothName = tooth.name.substring(0, 4);

            // Prioritise showing selection over showing treatments.
            if (selectedTooth && selectedTooth == toothName) {
                if (blueMaterial && tooth.material !== blueMaterial) {
                    tooth.material = blueMaterial;
                    return;
                }
            } else {
                if (originalMat && tooth.material !== originalMat) {
                    tooth.material = originalMat;
                }
            }

            // Do we have any data on treatments and conditions?
            if (!(toothName in mouthData)) {
                return;
            }

            if (!treatmentVisibility.all) {
                return;
            }

            // Colour based on treatments.
            let toothData = mouthData[toothName];
            if (toothData.treatments.length > 0) {
                let latestTreatment = toothData.treatments[0];
                switch (latestTreatment.type) {
                    case TreatmentType.FILLING:
                        if (!treatmentVisibility.filling) break;
                        if (fillingMaterial) tooth.material = fillingMaterial;
                        break;
                    case TreatmentType.CROWN:
                        if (!treatmentVisibility.crown) break;
                        if (crownMaterial) tooth.material = crownMaterial;
                        break;
                    case TreatmentType.ROOT_CANAL:
                        if (!treatmentVisibility.rootCanal) break;
                        if (rootCanalMaterial) tooth.material = rootCanalMaterial;
                        break;
                    case TreatmentType.EXTRACTION:
                        if (!treatmentVisibility.extraction) break;
                        if (extractionMaterial) tooth.material = extractionMaterial;
                        break;
                    case TreatmentType.IMPLANT:
                        if (!treatmentVisibility.implant) break;
                        if (implantMaterial) tooth.material = implantMaterial;
                        break;
                    case TreatmentType.VENEER:
                        if (!treatmentVisibility.veneer) break;
                        if (veneerMaterial) tooth.material = veneerMaterial;
                        break;
                    case TreatmentType.SEALANT:
                        if (!treatmentVisibility.sealant) break;
                        if (sealantMaterial) tooth.material = sealantMaterial;
                        break;
                    default:
                        console.log("Tooth "+ toothName +" has a treatment '"+ latestTreatment.type +"' but a texture for that treatment has not been defined!");
                        break;
                }
            } else {
                // Restore original material if has no treatments and is not selected.
                if ((tooth.material !== originalMat) && !(selectedTooth && selectedTooth == toothName)) {

                    tooth.material = originalMat;
                }
            }
        });
        // Run whenever these objects are updated.
    }, [model, mouthData, selectedTooth, treatmentVisibility]);

    // Handle pointer down events on the model
    // Does tooth selection
    const handleModelPointerDown = (event) => {
        event.stopPropagation(); // Prevent Canvas click handler from firing
        if (event.object.isMesh && event.object.name) {
            const meshName = event.object.name
            // Disallow selection of the jaws
            if (meshName == "upper_jaw" || meshName == "lower_jaw") {
                return;
            }
            // Blender 3D models dont allow meshes with duplicate names.
            // The 2D model has duplicate rows to show the side and top of each tooth
            // so some meshes are named t_11.001 instead of t_11. 
            // We take the substring so that we only return the t_11
            const toothName = meshName.substring(0, 4);
            onMeshClick(toothName); // Call the callback with the mesh name
        }
    };

    return (
        <>
            {model && 
                <primitive object={model} scale={modelScale} onPointerDown={handleModelPointerDown} />
            }
        </>
        
    )
}


MouthCanvas.propTypes = {
    selectedTooth: PropTypes.string,
    onMeshClick: PropTypes.func.isRequired, 
    mouthData: PropTypes.object.isRequired, 
    treatmentVisibility: PropTypes.shape({
        all: PropTypes.bool,
        filling: PropTypes.bool,
        crown:PropTypes.bool,
        rootCanal: PropTypes.bool,
        extraction: PropTypes.bool,
        implant: PropTypes.bool,
        veneer: PropTypes.bool,
        sealant: PropTypes.bool
    }),
    is3d: PropTypes.bool.isRequired
};