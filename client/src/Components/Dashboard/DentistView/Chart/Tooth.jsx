import React, { useState, useRef, useEffect } from 'react';
import { useGLTF } from '@react-three/drei';
import { MeshStandardMaterial } from 'three';
import * as THREE from 'three';

const ToothModel = ({ position, rotation, url, reset, onResetComplete, onHoverChange, onToothSelect, interactive = true,  latestTreatment, selectedTreatmentOption, }) => {
  const validUrl = url || '/assets/3DModels/CompressedAdultTeeth/t_11.glb';
  const { scene } = useGLTF(validUrl);
  const mesh = useRef();
  const toothName = validUrl.split('/').pop().replace('.glb', '');
  // Store the initial position and rotation using useRef to persist across renders
  const initialPosition = useRef(position);
  const initialRotation = useRef(rotation || [0, 0, 0]);

  // State to manage the current rotation, dragging status, hover, and selection
  const [state, setState] = useState({
    rotation: rotation || [0, 0, 0],
    isDragging: false,
    start: { x: 0, y: 0 },
  });

  const [isHovered, setIsHovered] = useState(false);
  const [isSelected, setIsSelected] = useState(false);

  const DAMPING = 0.1;
  const LERP_FACTOR = 0.1;

  const treatmentColors = {
    Filling: 'lightblue',
    Crown: 'yellow',
    Veneer: 'grey',
    'Root Canal': 'red',
    Extraction: 'brown',
  };

  useEffect(() => {
    if (mesh.current) {
      mesh.current.traverse((child) => {
        if (child.isMesh) {
          if (!child.originalMaterial) {
            child.originalMaterial = child.material.clone();
          }
          let color = child.originalMaterial.color.clone();

          if (isHovered) {
            color = new THREE.Color('lightblue');
          } else if (selectedTreatmentOption) {
            color = new THREE.Color(
              treatmentColors[selectedTreatmentOption] || 'white'
            );
          } else if (latestTreatment && latestTreatment.treatmentOption) {
            color = new THREE.Color(
              treatmentColors[latestTreatment.treatmentOption] || 'white'
            );
          } else {
            color = child.originalMaterial.color.clone();
          }

          child.material.color.copy(color);
        }
      });
    }
  }, [isHovered, selectedTreatmentOption, latestTreatment]);

  

  const handleMouseDown = (e) => {
    // setState((prevState) => ({
    //   ...prevState,
    //   isDragging: true,
    //   start: { x: e.clientX, y: e.clientY },
    // }));
    // setIsSelected(!isSelected);

    if (!interactive) return;


    if (onToothSelect) {
      onToothSelect(validUrl); // Pass the tooth URL
    }
  };

  const handleMouseMove = (e) => {
    if (!state.isDragging) return;

    const dx = (e.clientX - state.start.x) * DAMPING;
    const dy = (e.clientY - state.start.y) * DAMPING;

    const targetRotation = [
      state.rotation[0] + dy,
      state.rotation[1] + dx,
      state.rotation[2],
    ];

    requestAnimationFrame(() => {
      const lerpX =
        state.rotation[0] + LERP_FACTOR * (targetRotation[0] - state.rotation[0]);
      const lerpY =
        state.rotation[1] + LERP_FACTOR * (targetRotation[1] - state.rotation[1]);

      setState((prevState) => ({
        ...prevState,
        rotation: [lerpX, lerpY, prevState.rotation[2]],
      }));
    });
  };

  const handleMouseUp = () => {
    setState((prevState) => ({ ...prevState, isDragging: false }));
  };

  const handlePointerOver = () => {
    if (!interactive) return;
    setIsHovered(true);
    if (onHoverChange) {
      onHoverChange(toothName); 
    }
  };

  const handlePointerOut = () => {
    setIsHovered(false);
    if (onHoverChange) {
      onHoverChange(null); 
    }
  };

  useEffect(() => {
    if (state.isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [state.isDragging]);

  useEffect(() => {
    if (reset) {
      setState({
        rotation: initialRotation.current.slice(), // Use slice to ensure a new array reference
        isDragging: false,
        start: { x: 0, y: 0 },
      });
      // Call onResetComplete if needed or manage it differently to avoid repeated triggers
    }
  }, [reset]);

  // const handleDoubleClick = () => {
  //   const toothName = validUrl.split('/').pop().replace('.glb', '');
  //   console.log(`Tooth clicked: ${toothName}`);
  // };



  return (
    <>
      <primitive
        ref={mesh}
        position={initialPosition.current} // Use the initial position
        rotation={state.rotation} // Use the state rotation
        object={scene}
        scale={[2.5, 2.5, 2.5]}
        onPointerDown={handleMouseDown}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        // onDoubleClick={handleDoubleClick}
      />
    </>
  );
};

export default ToothModel;
