import React from "react";
import RahcImage from "./Dev/Rahc.jpg";
import PaoImage from "./Dev/Pao.jpg";
import AidanImage from "./Dev/Aidan.png";
import CharlesImage from "./Dev/Charles.png";

function Contact() {
  return (
<div class="container my-24 md:px-6  px-4 object-center mx-auto max-w-screen lg:py-16 lg:px-6"> 
        <div class="mx-auto max-w-screen-md text-center mb-8 lg:mb-12">
            <div class="relative">
                <div class="inline-block">
                    <h2 class="mb-4 text-4xl tracking-tight font-extrabold text-blue-700">Project Developers </h2>
                </div>
                <div class="absolute rounded-lg bottom-0 left-1/2 transform -translate-x-1/2 w-[150px] h-1 bg-blue-700"></div>
            </div>
        </div>


    <div class="grid grid-cols-1 md:grid-cols-4 p-8 gap-9 font-serif">
      <div className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
        <div className="flex justify-end px-4 pt-4">
        </div>
        <div className="flex flex-col items-center pb-10">
        <img
          className="w-24 h-24 object-cover rounded-full shadow-lg" src={AidanImage} alt="Aidan's Image" />
          <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">
            Aidan Delon Del Pilar
          </h5>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Developer
          </span>
          <div className="flex mt-4 md:mt-6">
            <a  href="https://www.facebook.com/aidalandan" className="py-2 px-4 ms-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
              Contact
            </a>
          </div>
        </div>
      </div>
      <div className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
        <div className="flex justify-end px-4 pt-4">
        </div>
        <div className="flex flex-col items-center pb-10">
        <img
          className="w-24 h-24 object-cover rounded-full shadow-lg" src={PaoImage} alt="Pao's Image" />
          <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">
            John Paolo D. Espiritu
          </h5>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Developer
          </span>
          <div className="flex mt-4 md:mt-6">
            <a href="https://www.facebook.com/Paolonokaizoku/"  className="py-2 px-4 ms-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
              Contact
            </a>
          </div>
        </div>
      </div>
      <div className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
        <div className="flex justify-end px-4 pt-4">
        </div>
        <div className="flex flex-col items-center pb-10">
          <img
           className="w-24 h-24 object-cover rounded-full shadow-lg" src={RahcImage} alt="Rahc Image" />
          <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">
            Rahc Eiram Bulatao
          </h5>
          <span className="text-sm text-gray-500 dark:text-gray-400">
          Developer
          </span>
          <div className="flex mt-4 md:mt-6">
            <a href="https://www.facebook.com/RahcxHAHAHAH" className="py-2 px-4 ms-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
              Contact
            </a>
          </div>
        </div>
      </div>
      <div className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
        <div className="flex justify-end px-4 pt-4">
        </div>
        <div className="flex flex-col items-center pb-10">
          <img
            className="w-24 h-24 object-cover rounded-full shadow-lg" src={CharlesImage} alt="Charles Image" />
          <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">
            Charles Joshua Rodillas
          </h5>
          <span className="text-sm text-gray-500 dark:text-gray-400">
          Developer
          </span>
          <div className="flex mt-4 md:mt-6">
            <a href="https://www.facebook.com/Cjrodillas28" className="py-2 px-4 ms-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
              Contact
            </a>
          </div>
        </div>
      </div>


        </div>
    </div>
  );
}

export default Contact;