import React from 'react';

import Shirt from './Shirt';

// Separate wrapper for the design page so we can position/scale
// the shirt independently from the home page previews.
const StudioShirt = () => {
    // Offset just the studio version so the orbit pivot (set in OrbitControls)
    // lines up around the belly area, without affecting home-page previews.
    return (
        <group position={[0.15, -0.1, 0]} scale={1.2}>
            <Shirt />
        </group>
    );
};

export default StudioShirt;

