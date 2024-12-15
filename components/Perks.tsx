import React from 'react';
import SparklesText from './ui/sparkle-text';

interface PerksProps {
    medal?: string;
    size: string;
}

const Perks: React.FC<PerksProps> = ({ medal, size }) => {
    const medalColors: Record<string, string> = {
        gold: '#FFD700',
        silver: '#C0C0C0',
        bronze: '#CD7F32',
        diamond: 'goldenrod',
    };

    // Default color is grey if no medal is provided
    const color = medalColors[medal || ''] || '#808080';

    return (
        <SparklesText sparklesCount={5} colors={{ first: color, second: color }}>
            <i
                className={`fad fa-award fa-fw text-transparent`}
                style={{ color, fontSize: size }}
            ></i>
        </SparklesText>
    );
};

export default Perks;
