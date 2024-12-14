import { LiveEmoji } from 'liveemoji'
import React from 'react'
import DotPattern from './ui/dot-pattern'
import { cn } from 'lib/utils'

type IconName = "Trophy" | "Handshake" | "PalmUpHand" | "MoneyBag"; 
interface LogoHeaderProps {
  icon?: IconName;
  header: string;
  about?: string;
}

const LogoHeader = ({ icon, header,about }: LogoHeaderProps) => {
  return (
    <>
      <div className='flex flex-col justify-center items-center'>
        <LiveEmoji icon={icon} size={"4.5rem"} className='no-interaction' />
        <h2 className=' font-semibold text-xl uppercase'>{header}</h2>
        <p className='capitalize pb-3 text-muted-foreground/80 text-sm'>{about}</p>
      </div>
      <DotPattern
        className={cn(
          "[mask-image:radial-gradient(8rem_circle_at_top,white,transparent)]",
        )}
      />
    </>
  )
}

export default LogoHeader;
