import React, { useState, useRef } from "react";
import { Tabs, Button } from "flowbite-react";
import { Link } from "react-router-dom";
import { MdOutlineArrowCircleRight, MdAccountCircle } from "react-icons/md";
import Logo from "../../assets/icon.svg";


const Register = () => {
  const [activeTab, setActiveTab] = useState(0);
  const tabsRef = useRef(null);
  return (
    <div>
      {/* Profile background */}
      <div className="flex flex-col h-[88vh] mx-auto  bg-gray-50">
        <div className="w-full bg-teal-400 h-60"></div>
        <div className="w-full h-full grid grid-cols-12 gap-4 p-5">
          <div className="bg-white col-span-3 rounded-lg">
            <div className="flex flex-col items-center">
              <MdAccountCircle size={100} className="text-slate-300"/>
              <p className="text-sm font-bold">Edgar Meneses</p>
            </div>
            <div className="py-6">
              <div className="flex py-4 px-2 border-t justify-between items-center hover:bg-slate-200 transition delay-75 duration-200 ease-in-out">
                <p className="text-xs text-center">
                  Opportunities applied 
                </p>
                <span className="text-xs p-1 rounded-full bg-blue-300 text-white font-bold">23</span>
              </div>
              <div className="flex py-4 px-2 border-t justify-between items-center hover:bg-slate-200 transition delay-75 duration-200 ease-in-out">
                <p className="text-xs text-center">
                  Opportunities applied 
                </p>
                <span className="text-xs p-1 rounded-full bg-blue-300 text-white font-bold">23</span>
              </div>
              <div className="flex py-4 px-2 border-t justify-between items-center hover:bg-slate-200 transition delay-75 duration-200 ease-in-out">
                <p className="text-xs text-center">
                  Opportunities applied 
                </p>
                <span className="text-xs p-1 rounded-full bg-blue-300 text-white font-bold">23</span>
              </div>
              <div className="flex flex-col gap-4 py-4 px-2 border-t justify-center items-center ">
                <div className="border w-full text-center hover:bg-slate-200 transition delay-75 duration-200 ease-in-out">
                  <p className="text-xs py-2 px-6">View Public Profile</p>
                </div>
                <div className="border  w-full text-center hover:bg-blue-600 transition delay-75 duration-200 ease-in-out">
                  <p className="text-xs text-blue-600 py-2 px-6 hover:text-white">https://facebook.com</p>
                </div>
              </div>
            </div>
          </div>


          <div className="md:col-span-9 col-span-12 rounded-lg bg-slate-500">
            <Tabs.Group aria-label="Tabs with underline" style="underline">
              <Tabs.Item title="Profile" ctive={true}>
                <div className="hover:text-white">Edgar Meneses</div>
              </Tabs.Item>
              <Tabs.Item active={true} title="Dashboard">
                Dashboard content
              </Tabs.Item>
            <Tabs.Item title="Settings">Settings content</Tabs.Item>
              <Tabs.Item title="Contacts">Contacts content</Tabs.Item>
              <Tabs.Item disabled={true}>
                Disabled content
              </Tabs.Item>
            </Tabs.Group>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
