// frontend/src/components/common/StarryBackground.jsx

import React from 'react';

const StarryBackground = () => (
    <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-stars-animation"></div>
        {/* Note: The CSS for .bg-stars-animation remains in the <style global jsx> block in App.jsx or in your global CSS file. */}
    </div>
);

export default StarryBackground;