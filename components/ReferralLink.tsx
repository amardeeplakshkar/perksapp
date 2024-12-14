import React from 'react';
import { Button } from './ui/button';
import toast from 'react-hot-toast';
import { initUtils } from '@telegram-apps/sdk';
import { Drawer, DrawerContent, DrawerTrigger } from './ui/drawer';
import { RainbowButton } from './ui/rainbow-button';

const utils = initUtils();

interface ReferralLinkProps {
  telegramId: string;
}

const ReferralLink: React.FC<ReferralLinkProps> = ({ telegramId }) => {
  const referralLink = `https://t.me/PerksCryptoBot/perks?startapp=${telegramId}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink)
      .then(() => toast.success('Referral link copied!'))
      .catch(() => toast.error('Failed to copy link'));
  };

  const handleShareClick = () => {
    utils.shareURL(
      referralLink,
      "\n🌟 Welcome to PERKS! 🌟\n🎁 Earn rewards for your activities on Telegram and mini-apps!\n💰 Get $PERKS based on your engagement!\n🚀 __Explore. Earn. Engage.__ 🌌  "
    );
  };

  return (
    <div className="bg-foreground/5 p-4 rounded-xl mb-4">
      <h3 className="text-lg font-semibold mb-2">Your Referral Link</h3>
      <div className="flex items-center gap-2">
        <div className="bg-background p-2 rounded flex-1 overflow-hidden text-sm">
          <p className="truncate w-[40dvw] ">{referralLink}</p>
        </div>
        <Drawer>
          <DrawerTrigger>
            <RainbowButton className="text-white">
              Share
            </RainbowButton>
          </DrawerTrigger>
          <DrawerContent className='w-dvw h-[20dvh]'>
            <div className='p-4 capitalize h-full gap-4 flex justify-center items-center flex-col w-full'>
              <Button className=' w-full capitalize' onClick={handleShareClick}>
                share link
              </Button>  
            <Button variant='secondary' className='w-full capitalize' onClick={copyToClipboard}>
              copy link
              </Button>
            </div>
          </DrawerContent>
        </Drawer>
      </div>
    </div>
  );
};

export default ReferralLink;