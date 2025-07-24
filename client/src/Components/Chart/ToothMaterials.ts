/*
    Defines Three.js materials to apply to teeth in the chart viewer.
    For now this is using the same colours as the app team to demonstrate the code.
    We can update these later to be more 'realistic'

    @author Skye Pooley
*/

import { useRef } from "react";
import { MeshStandardMaterial, DoubleSide } from "three";

export const blueMaterial = new MeshStandardMaterial({
    color: 'blue',
    side: DoubleSide,
    metalness: 0.0,    // Higher metalness for more reflection
    roughness: 0.2,    // Lower roughness for shinier surface
});
export const fillingMaterial = new MeshStandardMaterial({
    color: '#C00A0A',
    side: DoubleSide,
    metalness: 0.0,
    roughness: 0.2,
});
export const crownMaterial = new MeshStandardMaterial({
    color: '#FF5100',
    side: DoubleSide,
    metalness: 0.0,
    roughness: 0.2,
});
export const rootCanalMaterial = new MeshStandardMaterial({
    color: '#0080FF',
    side: DoubleSide,
    metalness: 0.0,
    roughness: 0.2,
});
export const extractionMaterial = new MeshStandardMaterial({
    color: '#EECCFF',
    side: DoubleSide,
    metalness: 0.6,
    roughness: 0.1,
    transparent: true,
    opacity: 0.5
});
export const implantMaterial = new MeshStandardMaterial({
    color: '#007610',
    side: DoubleSide,
    metalness: 0.0,
    roughness: 0.2,
});
export const veneerMaterial = new MeshStandardMaterial({
    color: '#7B00FF',
    side: DoubleSide,
    metalness: 0.0,
    roughness: 0.2,
});
export const sealantMaterial = new MeshStandardMaterial({
    color: '#FF0099',
    side: DoubleSide,
    metalness: 0.0,
    roughness: 0.2,
});