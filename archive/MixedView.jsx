import React, {useState} from 'react';
import { Canvas } from '@react-three/fiber';
import Model from './Model';
import {Environment} from "@react-three/drei";

const teethLayout = [
  ["28_Right_Upper_Wisdom", "27_Right_Upper_Second_Molar", "26_Right_Upper_First_Molar", "25_Right_Upper_Second_Premolar", "24_Right_Upper_First_Premolar", "23_Right_Upper_Canine", "22_Right_Upper_Lateral_Incisor", "21_Right_Upper_Central_Incisor", "11_Left_Upper_Central_Incisor", "12_Left_Upper_Lateral_Incisor", "13_Left_Upper_Canine", "14_Left_Upper_First_Premolar", "15_Left_Upper_Second_Premolar", "16_Left_Upper_First_Molar", "17_Left_Upper_Second_Molar", "18_Left_Upper_Wisdom"].map(id => `/assets/3DModels/AdultTeeth/${id}.glb`),
  ["55_Right_Upper_Second_Molar", "54_Right_Upper_First_Molar", "53_Right_Upper_Canine", "52_Right_Upper_Lateral_Incisor", "51_Right_Upper_Central_Incisor", "61_Left_Upper_Central_Incisor", "62_Left_Upper_Lateral_Incisor", "63_Left_Upper_Canine", "64_Left_Upper_First_Molar", "65_Left_Upper_Second_Molar"].map(id => `/assets/3DModels/DeciduousTeeth/${id}.glb`),
  ["85_Right_Lower_Second_Molar", "84_Right_Lower_First_Molar", "83_Right_Lower_Canine", "82_Right_Lower_Lateral_Incisor", "81_Right_Lower_Central_Incisor", "71_Left_Lower_Central_Incisor", "72_Left_Lower_Lateral_Incisor", "73_Left_Lower_Canine", "74_Left_Lower_First_Molar", "75_Left_Lower_Second_Molar"].map(id => `/assets/3DModels/DeciduousTeeth/${id}.glb`),
  ["38_Right_Lower_Wisdom", "37_Right_Lower_Second_Molar", "36_Right_Lower_First_Molar", "35_Right_Lower_Second_Premolar", "34_Right_Lower_First_Premolar", "33_Right_Lower_Canine", "32_Right_Lower_Lateral_Incisor", "31_Right_Lower_Central_Incisor", "41_Left_Lower_Central_Incisor", "42_Left_Lower_Lateral_Incisor", "43_Left_Lower_Canine", "44_Left_Lower_First_Premolar", "45_Left_Lower_Second_Premolar", "46_Left_Lower_First_Molar", "47_Left_Lower_Second_Molar", "48_Left_Lower_Wisdom"].map(id => `/assets/3DModels/AdultTeeth/${id}.glb`)
];

function MixedView() {
  
  const baseRowSpacing = 12; // Base vertical spacing between rows
  const baseToothSpacing = 6; // Base horizontal spacing between teeth

  const maxLength = Math.max(...teethLayout.map(row => row.length));
  const maxRowWidth = maxLength * baseToothSpacing;

  // Center middle 2 rows by calculating vertical offset
  const middleIndex = teethLayout.length / 2;
  const verticalOffset = middleIndex * baseRowSpacing - baseRowSpacing / 2;

  return (
    <Canvas camera={{ position: [0, 0, 60], fov: 50 }}>
      <Environment preset="city"/>

      <ambientLight intensity={1} />
      {teethLayout.map((row, rowIndex) => {
        const rowWidth = row.length * baseToothSpacing;
        const offset = (maxRowWidth - rowWidth) / 2; // Centering each row based on the widest row width

        return row.map((url, index) => (
          <Model
            key={url}
            url={url}
            position={[
              (index * baseToothSpacing + offset) - maxRowWidth / 2, // Centering rows within the canvas horizontally
              -(rowIndex * baseRowSpacing - verticalOffset), // Vertical positioning to center between middle two rows
            ]}
          />
        ));
      })}
    </Canvas>
  );
}

export default MixedView;
