import { Spinner } from "flowbite-react";
import React from "react";

const Loading = () => {
  return (
    <div className="fixed z-50 top-0 left-0 w-screen h-screen bg-black bg-opacity-50 flex justify-center items-center">
      <Spinner size="xl" aria-label="Center-aligned spinner example" />
    </div>
  );
};

export default Loading;
