import React from 'react';
import './loading-indicator.css';
import '@fontsource/ubuntu/400.css';
import { FaCircleRadiation } from "react-icons/fa6";
import { SiGoogleearth, SiGooglecontaineroptimizedos } from "react-icons/si";

const iconArray = [
    SiGoogleearth,
    SiGooglecontaineroptimizedos,
    FaCircleRadiation,
];

const getRandomIcon = () => {
    const randomIndex = Math.floor(Math.random() * iconArray.length);
    return iconArray[randomIndex];
};

const LoadingIndicator: React.FC = () => {
    const RandomIcon = getRandomIcon();

    return (
        <div
            style={{
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                textAlign: 'center',
            }}
        >
            <RandomIcon className="rotate-icon ml-5" />
            <p className="text-black dark:text-gray-200 font-bold text-2xl font-mono mt-2">
                En route...
            </p>
        </div>
    );
};

export default LoadingIndicator;
