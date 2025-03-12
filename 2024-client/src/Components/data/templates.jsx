
const templates = {
        mixedView : [
            ["28_Right_Upper_Wisdom", "27_Right_Upper_Second_Molar", "26_Right_Upper_First_Molar", "25_Right_Upper_Second_Premolar", "24_Right_Upper_First_Premolar", "23_Right_Upper_Canine", "22_Right_Upper_Lateral_Incisor", "21_Right_Upper_Central_Incisor", "11_Left_Upper_Central_Incisor", "12_Left_Upper_Lateral_Incisor", "13_Left_Upper_Canine", "14_Left_Upper_First_Premolar", "15_Left_Upper_Second_Premolar", "16_Left_Upper_First_Molar", "17_Left_Upper_Second_Molar", "18_Left_Upper_Wisdom"].map(id => `/assets/3DModels/AdultTeeth/${id}.glb`),
            ["55_Right_Upper_Second_Molar", "54_Right_Upper_First_Molar", "53_Right_Upper_Canine", "52_Right_Upper_Lateral_Incisor", "51_Right_Upper_Central_Incisor", "61_Left_Upper_Central_Incisor", "62_Left_Upper_Lateral_Incisor", "63_Left_Upper_Canine", "64_Left_Upper_First_Molar", "65_Left_Upper_Second_Molar"].map(id => `/assets/3DModels/DeciduousTeeth/${id}.glb`),
            ["85_Right_Lower_Second_Molar", "84_Right_Lower_First_Molar", "83_Right_Lower_Canine", "82_Right_Lower_Lateral_Incisor", "81_Right_Lower_Central_Incisor", "71_Left_Lower_Central_Incisor", "72_Left_Lower_Lateral_Incisor", "73_Left_Lower_Canine", "74_Left_Lower_First_Molar", "75_Left_Lower_Second_Molar"].map(id => `/assets/3DModels/DeciduousTeeth/${id}.glb`),
            ["38_Right_Lower_Wisdom", "37_Right_Lower_Second_Molar", "36_Right_Lower_First_Molar", "35_Right_Lower_Second_Premolar", "34_Right_Lower_First_Premolar", "33_Right_Lower_Canine", "32_Right_Lower_Lateral_Incisor", "31_Right_Lower_Central_Incisor", "41_Left_Lower_Central_Incisor", "42_Left_Lower_Lateral_Incisor", "43_Left_Lower_Canine", "44_Left_Lower_First_Premolar", "45_Left_Lower_Second_Premolar", "46_Left_Lower_First_Molar", "47_Left_Lower_Second_Molar", "48_Left_Lower_Wisdom"].map(id => `/assets/3DModels/AdultTeeth/${id}.glb`)
          ],
        
          adultView : [
            ["28_Right_Upper_Wisdom", "27_Right_Upper_Second_Molar", "26_Right_Upper_First_Molar", "25_Right_Upper_Second_Premolar", "24_Right_Upper_First_Premolar", "23_Right_Upper_Canine", "22_Right_Upper_Lateral_Incisor", "21_Right_Upper_Central_Incisor", "11_Left_Upper_Central_Incisor", "12_Left_Upper_Lateral_Incisor", "13_Left_Upper_Canine", "14_Left_Upper_First_Premolar", "15_Left_Upper_Second_Premolar", "16_Left_Upper_First_Molar", "17_Left_Upper_Second_Molar", "18_Left_Upper_Wisdom"].map(id => `/assets/3DModels/AdultTeeth/${id}.glb`),
            Array(10).fill(null),
            Array(10).fill(null),
            ["38_Right_Lower_Wisdom", "37_Right_Lower_Second_Molar", "36_Right_Lower_First_Molar", "35_Right_Lower_Second_Premolar", "34_Right_Lower_First_Premolar", "33_Right_Lower_Canine", "32_Right_Lower_Lateral_Incisor", "31_Right_Lower_Central_Incisor", "41_Left_Lower_Central_Incisor", "42_Left_Lower_Lateral_Incisor", "43_Left_Lower_Canine", "44_Left_Lower_First_Premolar", "45_Left_Lower_Second_Premolar", "46_Left_Lower_First_Molar", "47_Left_Lower_Second_Molar", "48_Left_Lower_Wisdom"].map(id => `/assets/3DModels/AdultTeeth/${id}.glb`)
          ],
        
          deciduousView : [
            Array(16).fill(null),
            ["55_Right_Upper_Second_Molar", "54_Right_Upper_First_Molar", "53_Right_Upper_Canine", "52_Right_Upper_Lateral_Incisor", "51_Right_Upper_Central_Incisor", "61_Left_Upper_Central_Incisor", "62_Left_Upper_Lateral_Incisor", "63_Left_Upper_Canine", "64_Left_Upper_First_Molar", "65_Left_Upper_Second_Molar"].map(id => `/assets/3DModels/DeciduousTeeth/${id}.glb`),
            ["85_Right_Lower_Second_Molar", "84_Right_Lower_First_Molar", "83_Right_Lower_Canine", "82_Right_Lower_Lateral_Incisor", "81_Right_Lower_Central_Incisor", "71_Left_Lower_Central_Incisor", "72_Left_Lower_Lateral_Incisor", "73_Left_Lower_Canine", "74_Left_Lower_First_Molar", "75_Left_Lower_Second_Molar"].map(id => `/assets/3DModels/DeciduousTeeth/${id}.glb`),
            Array(16).fill(null)
          ]};

export default templates;
