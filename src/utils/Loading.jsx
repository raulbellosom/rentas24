import { Spinner } from "flowbite-react";
import React from "react";

const Loading = () => {
  return (
    <div className="w-screen h-screen flex justify-center items-center bg-black/50">
      <div className="text-center">
        <Spinner size="xl" aria-label="Center-aligned spinner example" />
      </div>
    </div>
  );
};

export default Loading;
