import { useState, useEffect } from 'react';
import AvatarScene from './AvatarScene';

function AvatarViewer({ height, weight, skinColor, hairType, modelPath = null }) {
    const [loading, setLoading] = useState(!!modelPath);
    const [error, setError] = useState(null);

    // Monitor loading state
    useEffect(() => {
        if (modelPath) {
            setLoading(true);
            setError(null);
            // Reset loading after a delay (model will handle its own loading)
            const timer = setTimeout(() => {
                setLoading(false);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [modelPath]);

    const bmi = (weight / ((height / 100) ** 2)).toFixed(1);

    return (
        <div className="bg-white rounded-2xl shadow-lg border border-[#e5e7eb] p-8 animate-fade-in">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-[#1a1a1a]">
                    Your Avatar
                </h2>
                <div className="bg-[#fee2e2] px-4 py-1.5 rounded-full border border-[#fecaca]">
                    <p className="text-sm text-[#991b1b] font-medium">
                        BMI: <span className="text-[#dc2626] font-semibold">{bmi}</span>
                    </p>
                </div>
            </div>
            <div className="relative mb-6">
                {loading && modelPath && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/90 backdrop-blur-sm rounded-xl z-10">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#dc2626] border-t-transparent mx-auto mb-3" />
                            <p className="text-sm text-[#6b7280] font-medium">Loading model...</p>
                        </div>
                    </div>
                )}
                {error && (
                    <div className="absolute top-4 right-4 bg-red-50 text-red-600 text-xs px-3 py-2 rounded-lg z-10 border border-red-200">
                        <p className="font-medium">Error: {error}</p>
                    </div>
                )}
                <div
                    className="w-full h-[600px] rounded-xl bg-[#f9fafb] overflow-hidden border border-[#e5e7eb]"
                    style={{ minHeight: '600px' }}
                >
                    <AvatarScene
                        modelPath={modelPath}
                        height={height}
                        weight={weight}
                        skinColor={skinColor}
                        hairType={hairType}
                    />
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#fee2e2] border border-[#fecaca] p-5 rounded-xl">
                    <p className="text-xs text-[#991b1b] mb-2 font-medium uppercase tracking-wide">Height</p>
                    <p className="text-3xl font-semibold text-[#dc2626]">
                        {height} <span className="text-lg text-[#991b1b] font-normal">cm</span>
                    </p>
                </div>
                <div className="bg-[#fee2e2] border border-[#fecaca] p-5 rounded-xl">
                    <p className="text-xs text-[#991b1b] mb-2 font-medium uppercase tracking-wide">Weight</p>
                    <p className="text-3xl font-semibold text-[#dc2626]">
                        {weight} <span className="text-lg text-[#991b1b] font-normal">kg</span>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default AvatarViewer;
