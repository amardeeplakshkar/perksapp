import React, { useState, useEffect } from 'react';

function RandomNumber({ min, max }) {
    const [randomValue, setRandomValue] = useState(null);

    useEffect(() => {
        const value = Math.floor(Math.random() * (max - min + 1)) + min;
        setRandomValue(value);
    }, [min, max]);

    if (randomValue === null) {
        return null; 
    }

    return <span className='flex justify-center items-center'>{randomValue}
    <span className="text-sm p-1 font-semibold">PERKS</span> 
    </span>;
}

export default RandomNumber;
