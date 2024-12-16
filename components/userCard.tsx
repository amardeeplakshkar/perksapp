"use client"
import React from 'react'
import { useUserData } from './hooks/useUserData';
import { Skeleton } from './ui/skeleton';

const UserCard = () => {
    const { userData} = useUserData();
    return (
        <div>
            <h3 className=" text-base font-semibold">{userData?.firstName ? userData?.firstName : <Skeleton className='h-4 w-20 -ml-1' />}</h3>
            <p className="">
                {userData?.points ? userData.points.toLocaleString()
                    : <Skeleton className='h-4 w-10 -ml-1 mt-1' />}
            </p>
        </div>
    )
}

export default UserCard