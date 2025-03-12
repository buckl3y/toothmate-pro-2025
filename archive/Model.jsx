import React, { useRef, useState } from 'react';
import { useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import PropTypes from 'prop-types';

const Model = ({ url, position, scale = [1.5, 1.5, 1.5] }) => {
  const gltf = useLoader(GLTFLoader, url);
  const ref = useRef();
  const [isDragging, setIsDragging] = useState(false);

  const handlePointerDown = (event) => {
    event.stopPropagation();
    setIsDragging(true);
  };

  const handlePointerMove = (event) => {
    if (isDragging) {
      event.stopPropagation();
      const { offsetX, offsetY } = event.nativeEvent;
      ref.current.position.set(offsetX, offsetY, 0);
    }
  };

  const handlePointerUp = (event) => {
    event.stopPropagation();
    setIsDragging(false);
  };

  return (
    <group
      ref={ref}
      position={position}
      scale={scale}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      <primitive object={gltf.scene} />
    </group>
  );
};

Model.propTypes = {
  url: PropTypes.string.isRequired,
  position: PropTypes.arrayOf(PropTypes.number).isRequired,
  scale: PropTypes.arrayOf(PropTypes.number)
};

export default Model;
