import React from 'react'
import { FaSpinner } from 'react-icons/fa'
import Perks from './Perks'

const Loader = () => {
  return (
    <div className="h-dvh w-dvw flex justify-center items-center">
      <FaSpinner className="animate-spin" size={"5rem"} />
      <Perks medal={"bronze"} size={"8rem"} />
      <Perks medal={"sliver"} size={"8rem"} />
      <Perks medal={"gold"} size={"8rem"} />
      <Perks medal={"diamond"} size={"8rem"} />
    </div>
  )
}

export default Loader