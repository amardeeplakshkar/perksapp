import React from 'react';
import SparklesText from './ui/sparkle-text';
import { FaAward } from 'react-icons/fa6';
import DynamicSVGIcon from './icon';

interface PerksProps {
    medal?: string;
    size: string;
}

const Perks: React.FC<PerksProps> = ({ medal, size }) => {
    const medalColors: Record<string, string> = {
        gold: 'goldenrod',  
        silver: 'silver', 
        bronze: '#b56a2c',
        diamond: 'skyblue'
    };

    const color = medalColors[medal || ''] || 'white';

    return (
        <SparklesText sparklesCount={8} className='' colors={{ first: color, second: color }}>
            <DynamicSVGIcon color={color} size={size}/>
        </SparklesText>
    );
};

export default Perks;
