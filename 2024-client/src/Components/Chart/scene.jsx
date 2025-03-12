import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import ToothModel from './Tooth';
import { Environment, Text } from '@react-three/drei';

function TeethView({ view, onToothSelect, toothTreatments }) {
    const [resetTrigger, setResetTrigger] = useState(false);
    const [hoveredToothName, setHoveredToothName] = useState(null);
    const baseRowSpacing = 12;
    const baseToothSpacing = 4;
    const baseBabyRowSpacing = 10;
    const baseBabyToothSpacing = 3;

    const labelOffsets = [
        { x: 10, y: -6.5 },
        { x: -4, y: 1.5 },
        { x: -4, y: 3.5 },
        { x: 10, y: 10.5 }
    ];

    const labelXGapSpacing = [
        2.65,
        3.9,
        3.9,
        2.65
    ];

    const handleResetView = () => {
        setResetTrigger(true);
        setTimeout(() => {
            setResetTrigger(false);
        }, 100);
    };

    useEffect(() => {
        console.log('TeethView mounted');
        return () => {
          console.log('TeethView unmounted');
        };
      }, []);

    return (
        <div className="relative w-full h-full">
            {/* Ensure AddToothButton is isolated from the layout */}
            {/* <div className="absolute top-5 left-5 z-50">
                <AddToothButton />
            </div> */}
      {hoveredToothName && (
        <div className="absolute top-0 left-0 right-0 mx-auto text-center z-50">
          <div className="p-2 text-black font-bold">
            {hoveredToothName}
          </div>
        </div>
      )}
            {/* Canvas should take full space and not be affected by AddToothButton */}
            <Canvas className="w-full h-full  pl-10" camera={{ position: [0, 3, 25], fov: 80 }}>
                <Environment preset="city" />
                <ambientLight intensity={1} />

                {view.map((row, rowIndex) => {
                    if (row.every(item => item === null)) {
                        return null;
                    }
                    let startX, startY, toothSpacing, rotation;

                    if (rowIndex === 1) {
                        toothSpacing = baseBabyToothSpacing;
                        startX = -14;
                        startY = -1.9;
                        rotation = [0.3, 0, 0];
                    } else if (rowIndex === 2) {
                        toothSpacing = baseBabyToothSpacing;
                        startX = -14;
                        startY = -6;
                        rotation = [100, 0, 0];
                    } else {
                        toothSpacing = baseToothSpacing;
                        startX = -30;
                        startY = rowIndex === 0 ? 14 : -19;
                    }

                    return row.map((url, index) => {
                        if (url === null) {
                            return null;
                        }
                        const label = url.split('/').pop().slice(0, 2);

                        const treatments = toothTreatments[url] || [];
                        const latestTreatment = treatments.sort(
                          (a, b) => new Date(b.date) - new Date(a.date)
                        )[0];

                        return (
                            <React.Fragment key={url}>
                                <ToothModel
                                    url={url}
                                    position={[
                                        startX + index * toothSpacing,
                                        startY,
                                        -5
                                    ]}
                                    rotation={rotation}
                                    reset={resetTrigger}
                                    onResetComplete={() => setResetTrigger(false)}
                                    onHoverChange={setHoveredToothName}
                                    onToothSelect={onToothSelect}
                                    latestTreatment={latestTreatment}
                                />
                                <Text
                                    position={[
                                        startX + index * labelXGapSpacing[rowIndex] + labelOffsets[rowIndex].x,
                                        startY + labelOffsets[rowIndex].y,
                                        5
                                    ]}
                                    fontSize={1}
                                    color="black"
                                    anchorX="center"
                                    anchorY="middle"
                                    renderOrder={50}
                                    depthTest={false}
                                >
                                    {label}
                                </Text>
                            </React.Fragment>
                        );
                    });
                })}
            </Canvas>

            {/* Reset button should also be isolated */}
            {/* <button
                onClick={handleResetView}
                className="absolute bottom-5 left-5 bg-red-500 text-white p-2 rounded-xl hover:bg-red-700 z-50"
            >
                Reset View
            </button> */}
        </div>
    );
}

export default TeethView;
