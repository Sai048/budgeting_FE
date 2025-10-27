"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";

export default function Sidebar() {
  const [userData, setUserData] = useState<any>(null);
  useEffect(() => {
    const getData = sessionStorage.getItem("data");
    setUserData(getData ? JSON.parse(getData) : null);
  }, []);
  return (
    <div className="w-60 rounded-xl bg-white shadow-lg flex flex-col p-4 text-center justify-between h-full">
      <div>
        <h2 className="text-xl font-bold mb-6">
          Hello {userData?.data?.name?.toUpperCase()}
        </h2>
        <nav className="flex flex-col space-y-3">
          <Link href="/home" className="hover:text-blue-600 font-semibold">
            Home
          </Link>

          <Link
            href="/home/budgetExpectation"
            className="hover:text-blue-600 font-semibold"
          >
            Set Budget
          </Link>

          <Link
            href="/home/dashboard"
            className="hover:text-blue-600 font-semibold"
          >
            Dashboard
          </Link>

          <Link
            href="/home/settings"
            className="hover:text-blue-600 font-semibold"
          >
            Settings
          </Link>
        </nav>
      </div>

      <div>
        <Link
          href="/"
          className="mt-6 inline-block bg-red-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-600 transition-all"
          onClick={async () => {
            sessionStorage.removeItem("data");
            localStorage.removeItem("bearer");
            Cookies.remove("token");
            localStorage.removeItem("persist:bearer");
          }}
        >
          Logout
        </Link>
      </div>
    </div>
  );
}
