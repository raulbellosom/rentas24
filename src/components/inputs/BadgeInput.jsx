import { BsCheck, BsTrash } from "react-icons/bs";
import { useState } from "react";

const BadgeInput = ({key, service}) => {

  const [isHover, setIsHover] = useState(false)
  return (
    <p
    key={key}
    onMouseLeave={() => setIsHover(false)}
    onMouseOver={() => setIsHover(true)}
    onClick={() => handleSelectOption(service)}
    // className="font-normal border border-gray-200 rounded-lg p-2 flex justify-between items-center hover:scale-100 transition ease-in-out duration-200 cursor-pointer bg-gradient-to-r"
    className="font-normal border border-gray-200 rounded-lg p-2 flex justify-between items-center hover:scale-100 transition ease-in-out duration-200 cursor-pointer bg-gradient-to-r from-white to-primary-100 hover:from-red-500 hover:to-red-600 hover:text-white"
  >
    {service.label}
    <span className={`text-md font-light ${isHover ? "bg-red-500" : "bg-green-400"}  p-1 rounded-full text-white`}>
      {isHover ? <BsTrash/> : <BsCheck />}
    </span>
  </p>  
  )
}

export default BadgeInput