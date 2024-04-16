import React from "react";
import { Outlet, Link } from "react-router-dom";

function Navigate() {
  return (
    <div>
<nav class="border-gray-200 bg-gray-800 dark:border-gray-700">
  <div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
    <a href="/home" class="flex items-center space-x-3 rtl:space-x-reverse">
      <img src="https://flowbite.com/docs/images/logo.svg" class="h-8" alt="Flowbite Logo" />
      <span class="self-center text-2xl font-semibold whitespace-nowrap text-white">Human Action Recognition</span>
    </a>
    <button data-collapse-toggle="navbar-solid-bg" type="button" class="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-white rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-solid-bg" aria-expanded="false">
      <span class="sr-only">Open main menu</span>
      <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h15M1 7h15M1 13h15"/>
      </svg>
    </button>
    <div class="hidden w-full md:block md:w-auto" id="navbar-solid-bg">
      <ul class="flex flex-col font-medium mt-4 rounded-lg text-white bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-transparent dark:bg-gray-800 md:dark:bg-transparent dark:border-gray-700">
      <li>
          <Link to="/home">Home</Link>
        </li>
        <li>
          <Link to="/about">About-Us</Link>
        </li>
        <li>
          <Link to="/contact">Contact-Us</Link>
        </li>
      </ul>
    </div>
  </div>
</nav>
<Outlet />
</div>
  );
}
export default Navigate;



