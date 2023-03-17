import { useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";

const Carousel = ({ images }) => {
  const [imageSelected, setimageSelected] = useState(0);

  return (
    <div className="w-full h-full">
      {/* <img
        src={images[imageSelected]}
        className="object-cover rounded-t-lg transition delay-300 "
      /> */}
      <div
        style={{
          backgroundImage: `url(${images[imageSelected]})`,
          backgroundPosition: "center",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        }}
        className={`h-full w-full rounded-t-lg`}
      >
        <div className="h-full flex justify-between items-center px-2">
          <button
            onClick={() => {
              if (imageSelected > 0) {
                setimageSelected(imageSelected - 1);
              } else {
                setimageSelected(images.length - 1);
              }
            }}
          >
            <MdChevronLeft size={24} className="p-1 bg-white rounded-full" />
          </button>
          <button
            onClick={() => {
              if (imageSelected < images.length - 1) {
                setimageSelected(imageSelected + 1);
              } else {
                setimageSelected(0);
              }
            }}
          >
            <MdChevronRight size={24} className="p-1 bg-white rounded-full" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Carousel;
