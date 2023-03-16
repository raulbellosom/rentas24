import React from "react";
import Cards from "../cards/Cards";

function Home() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 justify-items-center lg:grid-cols-3 xl:grid-cols-4 gap-4 m-2 mt-4">
      <Cards />
    </div>
  );
}

export default Home;
