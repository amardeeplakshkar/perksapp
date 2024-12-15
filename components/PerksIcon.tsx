"use client";

import React, { useState, useEffect } from 'react';
import Perks from '../components/Perks';

interface PerksIconProps {
  size: string;
  medal: 'gold' | 'silver' | 'bronze' | 'diamond' | '';
}

const PerksIcon: React.FC<PerksIconProps> = ({ size, medal }) => {
  const [userMedal, setUserMedal] = useState<'gold' | 'silver' | 'bronze' | 'diamond' | "">('');

  useEffect(() => {
    setUserMedal(medal);
  }, [medal]);

  return (
    <div>
      <Perks medal={userMedal} size={size} />
    </div>
  );
};

export default PerksIcon;
