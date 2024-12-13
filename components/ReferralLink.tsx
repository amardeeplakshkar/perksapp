import React from 'react';
import { Button } from './ui/button';
import toast from 'react-hot-toast';
interface ReferralLinkProps {
  telegramId: string;
}

const ReferralLink: React.FC<ReferralLinkProps> = ({ telegramId }) => {
  const referralLink = `https://t.me/majorwithdrawbot/perks?startapp=${telegramId}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink)
      .then(() => toast.success('Referral link copied!'))
      .catch(() => toast.error('Failed to copy link'));
  };

  return (
    <div className="bg-foreground/5 p-4 rounded-xl mb-4">
      <h3 className="text-lg font-semibold mb-2">Your Referral Link</h3>
      <div className="flex items-center gap-2">
        <div className="bg-background p-2 rounded flex-1 overflow-hidden text-sm">
          <p className="truncate w-[80%] ">{referralLink}</p>
        </div>
        <Button onClick={copyToClipboard} className="">
          Copy
        </Button>
      </div>
    </div>
  );
};

export default ReferralLink;