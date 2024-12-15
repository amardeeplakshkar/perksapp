import React from 'react'
import DotPattern from './ui/dot-pattern'
import { cn } from 'lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

interface LogoHeaderProps {
  icon?: string;
  header: string;
  about?: string;
}

const LogoHeader = ({ icon, header, about }: LogoHeaderProps) => {
  return (
    <>
      <div className='flex flex-col justify-center items-center'>
        <DotPattern
          className={cn(
            "[mask-image:radial-gradient(8rem_circle_at_top,white,transparent)] -z-2",
          )}
        />
        <Avatar className='h-[6rem] w-[6rem] rounded-none'>
          <AvatarImage src={`https://res.cloudinary.com/duscymcfc/image/upload/v1/perks/assets/${icon}`} />
        </Avatar>
        <h2 className=' font-semibold text-xl uppercase'>{header}</h2>
        <p className='capitalize pb-3 text-muted-foreground/80 text-sm'>{about}</p>
      </div>
    </>
  )
}

export default LogoHeader;
