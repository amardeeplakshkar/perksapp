import React, { useEffect, useState } from 'react';
import { Button } from './ui/button';
import toast from 'react-hot-toast';
import { Drawer, DrawerContent, DrawerTrigger } from './ui/drawer';
import { RainbowButton } from './ui/rainbow-button';

interface ReferralLinkProps {
  telegramId: string;
}

const ReferralLink: React.FC<ReferralLinkProps> = ({ telegramId }) => {
  const [isClient, setIsClient] = useState(false);
  const [utils, setUtils] = useState<ReturnType<typeof import('@telegram-apps/sdk').initUtils> | null>(null);

  useEffect(() => {
    setIsClient(true);
    const loadUtils = async () => {
      if (typeof window !== 'undefined') {
        try {
          const { initUtils } = await import('@telegram-apps/sdk');
          setUtils(initUtils());
        } catch (error) {
          console.error('Error loading initUtils:', error);
        }
      }
    };

    loadUtils();
  }, []);

  const referralLink = `https://t.me/PerksCryptoBot/perks?startapp=${telegramId}`;

  const copyToClipboard = () => {
    if (!isClient) return;

    navigator.clipboard
      .writeText(referralLink)
      .then(() => toast.success('Referral link copied!'))
      .catch(() => toast.error('Failed to copy link'));
  };

  const handleShareClick = () => {
    if (utils) {
      utils.shareURL(
        referralLink,
        `
🌟 Welcome to PERKS! 🌟
🎁 Earn rewards for your activities on Telegram and mini-apps!
💰 Get $PERKS based on your engagement!
🚀 Explore. Earn. Engage. 🌌
        `
      );
    } else {
      toast.error('Share feature is unavailable.');
    }
  };

  return (
    <div className="bg-foreground/5 p-4 rounded-xl mb-4">
      <h3 className="text-lg font-semibold mb-2">Your Referral Link</h3>
      <div className="flex items-center gap-2">
        <div className="bg-background p-2 rounded flex-1 overflow-hidden text-sm">
          <p className="truncate w-[40dvw]">{referralLink}</p>
        </div>
        <Drawer>
          <DrawerTrigger>
            <RainbowButton className="text-white">Share</RainbowButton>
          </DrawerTrigger>
          <DrawerContent className="w-[90vw] h-[20vh]">
            <div className="p-4 capitalize h-full gap-4 flex justify-center items-center flex-col w-full">
              <Button
                className="w-full capitalize"
                onClick={handleShareClick}
              >
                Share Link
              </Button>
              <Button
                variant="secondary"
                className="w-full capitalize"
                onClick={copyToClipboard}
              >
                Copy Link
              </Button>
            </div>
          </DrawerContent>
        </Drawer>
      </div>
    </div>
  );
};

export default ReferralLink;
