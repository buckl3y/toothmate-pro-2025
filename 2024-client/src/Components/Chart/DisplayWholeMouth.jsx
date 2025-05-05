import { Suspense, useState, useEffect, useRef, useCallback } from 'react'; // Import hooks
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three'; // Import THREE
import PropTypes from 'prop-types'; // Import PropTypes
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu"; // Assuming dropdown components are here
import { Button } from "../ui/button"; // Assuming a Button component exists


function Model({ selectedTeeth, onTeethLoaded, onMeshClick }) { // Accept selectedTeeth, onTeethLoaded, and onMeshClick props
    const { scene } = useGLTF('/assets/3DModels/PatientTeeth/NH123/adult_whole_mouth_client1.glb');
    const originalMaterials = useRef({});
    const blueMaterial = useRef(new THREE.MeshStandardMaterial({ color: 'blue', side: THREE.DoubleSide })); // Use DoubleSide if needed

    // Effect to extract mesh names and call onTeethLoaded
    // By default, effects run on every render pass. 
    // However, if we pass an array of dependencies, then it will only be run on the first render and any time an dependency is updated.
    useEffect(() => {
        // Skip until the teeth are loaded
        if (!scene || !onTeethLoaded) {
            console.log('Model Effect: Scene or onTeethLoaded not ready.');
            return;
        }

        console.log('Model Effect: Traversing scene to find all mesh names...');
        const extractedMeshNames = [];
        scene.traverse((child) => {
            console.log('Traversing child:', child.name, 'Is Mesh:', child.isMesh);
            // Collect names of all mesh objects
            if (child.isMesh && child.name) { // Ensure it's a mesh and has a name
                console.log('Found mesh:', child.name, typeof child.material);
                extractedMeshNames.push(child.name);
            }
        });

        // Filter out duplicates if any node names are repeated
        const uniqueMeshNames = [...new Set(extractedMeshNames)];

        // Sort names for consistent dropdown order (optional)
        uniqueMeshNames.sort();

        console.log('Model Effect: Calling onTeethLoaded with:', uniqueMeshNames);
        onTeethLoaded(uniqueMeshNames); // Pass the unique mesh names

    }, [scene, onTeethLoaded]); // Depend on scene and the callback itself

    // Effect to store original materials on mount and restore on unmount
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

    // Effect to change color based on selection
    useEffect(() => {
        if (!scene) return;
        // Log effect run with the array of selected teeth
        console.log(`Color Effect: Running for selectedTeeth: ${JSON.stringify(selectedTeeth)}`);

        scene.traverse((child) => {
            if (child.isMesh) {
                const originalMat = originalMaterials.current[child.uuid];
                if (originalMat) {
                    // Check if this tooth is in the selectedTeeth array
                    const isSelected = selectedTeeth.includes(child.name);

                    if (isSelected) {
                        // Apply blue material if selected and not already blue
                        if (child.material !== blueMaterial.current) {
                            console.log(`Color Effect: Applying blue material to ${child.name}`);
                            child.material = blueMaterial.current;
                            // child.material.color.copy(new THREE.Color('green'));
                        }
                    } else {
                        // Restore original material if not selected and not already original
                        if (child.material !== originalMat) {
                            console.log(`Color Effect: Restoring original material for ${child.name}`);
                            child.material = originalMat;
                        }
                    }
                }
            }
        });
        // Depend on the array of selected teeth
    }, [scene, selectedTeeth]);

    // Handle pointer down events on the model
    const handleModelPointerDown = (event) => {
        event.stopPropagation(); // Prevent Canvas click handler from firing
        if (event.object.isMesh && event.object.name) {
            console.log("PointerDown on Mesh:", event.object.name);
            onMeshClick(event.object.name); // Call the callback with the mesh name
        }
    };

    // Use onPointerDown instead of onClick
    return <primitive object={scene} scale={1} onPointerDown={handleModelPointerDown} />;
}


// Add PropTypes validation
// This prevents the wrong types being passed to the object.
Model.propTypes = {
    // Update prop type to array of strings
    selectedTeeth: PropTypes.arrayOf(PropTypes.string).isRequired,
    onTeethLoaded: PropTypes.func.isRequired, // Make callback required
    onMeshClick: PropTypes.func.isRequired, // Add prop type for the click handler

};

function DisplayWholeMouth() {
    // Change state to hold an array of selected teeth
    const [selectedTeeth, setSelectedTeeth] = useState([]);
    const [availableTeeth, setAvailableTeeth] = useState([]); // State for teeth names from model

    // Callback function to receive mesh names from the Model component
    const handleTeethLoaded = useCallback((meshNames) => {
        console.log("DisplayWholeMouth: Received mesh names:", meshNames); // Log received names
        setAvailableTeeth(meshNames);
    }, []); // Empty dependency array means this function is created once

    // Callback for when a mesh is clicked in the Model component
    const handleMeshClick = useCallback((meshName) => {
        console.log(`DisplayWholeMouth: handleMeshClick called with: ${meshName}`); // Log click callback
        // Toggle selection: add if not present, remove if present
        setSelectedTeeth(prevSelected =>
            prevSelected.includes(meshName)
                ? prevSelected.filter(name => name !== meshName) // Remove
                : [...prevSelected, meshName] // Add
        );
    }, []); // Dependency array is empty, function created once

    // Callback for clicking the canvas background
    // This is super broken. Only the fallback case is ever triggered.
    const handleCanvasClick = (event) => {
        // Simplified check to avoid error: Check if the direct target is the canvas itself
        if (event.target.localname == "canvas" ) {
            console.log("Canvas background clicked. Selection remains unchanged.");
            // This case is never triggered. Not sure why.
        } else if (event.intersections?.length > 0) {
            // This case is handled by onPointerDown in Model due to event propagation stopping
            console.log("Canvas click detected on an object. Selection handled by mesh click.");
        } else {
            // Fallback log for unexpected event structure
            console.log("Canvas click detected, but event structure is unexpected.", event);
        }
    };

    return (
        <div style={{ position: 'relative', height: '800px', width: '100%' }}>
            {/* Dropdown Menu */}
            <div style={{ position: 'absolute', top: 10, left: 10, zIndex: 1 }}>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        {/* Disable button until meshes are loaded */}
                        <Button variant="outline" disabled={availableTeeth.length === 0}>
                            {/* Update button text logic for multiple selections */}
                            {availableTeeth.length === 0
                                ? 'Loading Teeth...'
                                : `Select Tooth (${selectedTeeth.length} selected)`}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuLabel>Select Tooth (Toggle)</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {availableTeeth.length > 0 ? (
                            availableTeeth.map((meshName) => (
                                // Use handleMeshClick to toggle selection from dropdown
                                <DropdownMenuItem key={meshName} onSelect={() => handleMeshClick(meshName)}>
                                    {/* Indicate if tooth is currently selected */}
                                    {meshName} {selectedTeeth.includes(meshName) ? '✓' : ''}
                                </DropdownMenuItem>
                            ))
                        ) : (
                            <DropdownMenuItem disabled>No meshes found in model</DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        {/* Update clear selection to use the new state setter */}
                        <DropdownMenuItem onSelect={() => setSelectedTeeth([])} disabled={selectedTeeth.length === 0}>
                            Clear All Selections
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Canvas for 3D Model */}
            <Canvas style={{ height: '100%', width: '100%' }} onClick={handleCanvasClick}>
                <ambientLight intensity={2.5} />
                <directionalLight position={[0, 10, 5]} intensity={1} />
                <Suspense fallback={null}>
                    {/* Pass selectedTeeth array, onTeethLoaded, and onMeshClick to Model */}
                    <Model
                        selectedTeeth={selectedTeeth} // Pass the array
                        onTeethLoaded={handleTeethLoaded}
                        onMeshClick={handleMeshClick}
                    />
                </Suspense>
                <OrbitControls />
            </Canvas>
        </div>
    );
}

export default DisplayWholeMouth;
