/*
    Defines Three.js materials to apply to teeth in the chart viewer.
    For now this is using the same colours as the app team to demonstrate the code.
    We can update these later to be more 'realistic'

    @author Skye Pooley
*/

import { MeshPhysicalMaterial, DoubleSide } from "three";

export const blueMaterial = new MeshPhysicalMaterial({
    color: 'blue',
    side: DoubleSide,
    metalness: 0.0,    // Higher metalness for more reflection
    roughness: 0.2,    // Lower roughness for shinier surface
});
export const fillingMaterial = new MeshPhysicalMaterial({
    color: '#C00A0A',
    side: DoubleSide,
    metalness: 0.0,
    roughness: 0.2,
});
export const crownMaterial = new MeshPhysicalMaterial({
    color: '#FF5100',
    side: DoubleSide,
    metalness: 0.0,
    roughness: 0.2,
});
export const rootCanalMaterial = new MeshPhysicalMaterial({
    color: '#0080FF',
    side: DoubleSide,
    metalness: 0.0,
    roughness: 0.2,
});
export const extractionMaterial = new MeshPhysicalMaterial({
    color: '#EECCFF',
    side: DoubleSide,
    metalness: 0.6,
    roughness: 0.1,
    transparent: true,
    opacity: 0.3
});
export const implantMaterial = new MeshPhysicalMaterial({
    color: '#007610',
    side: DoubleSide,
    metalness: 0.0,
    roughness: 0.2,
});
export const veneerMaterial = new MeshPhysicalMaterial({
    color: '#7B00FF',
    side: DoubleSide,
    metalness: 0.0,
    roughness: 0.2,
});
export const sealantMaterial = new MeshPhysicalMaterial({
    color: '#FF0099',
    side: DoubleSide,
    metalness: 0.0,
    roughness: 0.2,
});