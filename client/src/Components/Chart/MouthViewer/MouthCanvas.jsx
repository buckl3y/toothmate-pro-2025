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


// Host and modify the mouth 3D model
export default function MouthCanvas({ selectedTooth, onTeethLoaded, onMeshClick, mouthData }) { 
    const { scene } = useGLTF('/assets/3DModels/CompressedAdultTeeth/mouth.glb');
    const originalMaterials = useRef({});    

    // Effect to extract mesh names and call onTeethLoaded
    // By default, effects run on every render pass. 
    // However, if we pass an array of dependencies, then it will only be run on the first render and any time an dependency is updated.
    useEffect(() => {
        // Skip until the teeth are loaded
        if (!scene || !onTeethLoaded) {
            console.log('Trying to extract mesh names but scene or onTeethLoaded not ready.');
            return;
        }

        scene.scale.set(4, 4, 4);

        console.log('Model Effect: Traversing scene to find all mesh names...');
        const extractedMeshNames = [];
        scene.traverse((child) => {
            // console.log('Traversing child:', child.name, 'Is Mesh:', child.isMesh);
            // Collect names of all mesh objects
            if (child.isMesh && child.name) { // Ensure it's a mesh and has a name
                // console.log('Found mesh:', child.name, typeof child.material);
                extractedMeshNames.push(child.name);
            }
        });

        // Filter out duplicates if any node names are repeated
        const uniqueMeshNames = [...new Set(extractedMeshNames)];

        // Sort names for consistent dropdown order (optional)
        uniqueMeshNames.sort();

        console.log('Loaded Model has the following meshes:', uniqueMeshNames);
        onTeethLoaded(uniqueMeshNames); // Pass the unique mesh names

    }, [scene, onTeethLoaded]); // Depend on scene and the callback itself


    // Effect to store original materials on mount and restore on unmount
    // Allows tooth colour to be returned to original after edits.
    useEffect(() => {
        if (!scene) return;
        const materialsToStore = {};
        scene.traverse((child) => {
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
            scene.traverse((child) => {
                if (child.isMesh && originalMaterials.current[child.uuid]) {
                    // Check if the current material is the blue one before disposing/replacing
                    if (child.material === blueMat) {
                        child.material.dispose(); // Dispose the instance if it was the blue one
                    }
                    child.material = originalMaterials.current[child.uuid];
                }
            });
            // Dispose the shared blue material instance using the variable
            blueMat.dispose();
        };
    }, [scene]); // Run when the scene loads.

    // Effect to change color based on treatment and condition data
    useEffect(() => {
        if (!scene) return;

        scene.traverse((tooth) => {
            if (!tooth.isMesh) return;

            // We only want to change the tooth texture if we have the original texture saved to restore it later.
            const originalMat = originalMaterials.current[tooth.uuid];
            if (!originalMat) return; // Don't proceed if originalMat is missing

            if (selectedTooth && selectedTooth == tooth.name) {
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
            if (!(tooth.name in mouthData)) {
                return;
            }

            // Colour based on treatments.
            let toothData = mouthData[tooth.name];
            if (toothData.treatments.length > 0) {
                let latestTreatment = toothData.treatments[0];
                switch (latestTreatment.type) {
                    case TreatmentType.FILLING:
                        if (fillingMaterial) tooth.material = fillingMaterial;
                        break;
                    case TreatmentType.CROWN:
                        if (crownMaterial) tooth.material = crownMaterial;
                        break;
                    case TreatmentType.ROOT_CANAL:
                        if (rootCanalMaterial) tooth.material = rootCanalMaterial;
                        break;
                    case TreatmentType.EXTRACTION:
                        if (extractionMaterial) tooth.material = extractionMaterial;
                        break;
                    case TreatmentType.IMPLANT:
                        if (implantMaterial) tooth.material = implantMaterial;
                        break;
                    case TreatmentType.VENEER:
                        if (veneerMaterial) tooth.material = veneerMaterial;
                        break;
                    case TreatmentType.SEALANT:
                        if (sealantMaterial) tooth.material = sealantMaterial;
                        break;
                    default:
                        console.log("Tooth "+ tooth.name +" has a treatment '"+ latestTreatment.type +"' but a texture for that treatment has not been defined!");
                        break;
                }
            } else {
                // Restore original material if has no treatments and is not selected.
                if ((tooth.material !== originalMat) && !(selectedTooth && selectedTooth == tooth.name)) {

                    tooth.material = originalMat;
                }
            }
        });
        // Run whenever these objects are updated.
    }, [scene, mouthData, selectedTooth]);

    // Handle pointer down events on the model
    const handleModelPointerDown = (event) => {
        event.stopPropagation(); // Prevent Canvas click handler from firing
        if (event.object.isMesh && event.object.name) {
            onMeshClick(event.object.name); // Call the callback with the mesh name
        }
    };

    // Use onPointerDown instead of onClick
    return <primitive object={scene} scale={1} onPointerDown={handleModelPointerDown} />;
}


// Add PropTypes validation
// This prevents the wrong types being passed to the object.
MouthCanvas.propTypes = {
    // Update prop type to array of strings
    selectedTooth: PropTypes.string,
    onTeethLoaded: PropTypes.func.isRequired, // Make callback required
    onMeshClick: PropTypes.func.isRequired, // Add prop type for the click handler
    mouthData: PropTypes.object.isRequired, // Add prop type for mouthData
};