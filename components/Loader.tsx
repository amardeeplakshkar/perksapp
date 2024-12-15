import React from 'react'
import { FaSpinner } from 'react-icons/fa'

const Loader = () => {
  return (
    <div className="h-dvh w-dvw flex justify-center items-center">
    <FaSpinner className="animate-spin" size={"5rem"}/>
    </div>
  )
}

export default Loader