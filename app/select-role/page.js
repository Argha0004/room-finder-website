"use client";

import { useRouter } from "next/navigation";

export default function SelectRolePage() {
  const router = useRouter();

  const selectRole = (role) => {
    localStorage.setItem("selectedRole", role);
    router.push("/register");
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-[#0F0F0F] px-6 relative">
      {/* TITLE */}
      <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
        Welcome to RoomFinder
      </h1>

      <p className="text-gray-400 mb-16 text-center max-w-md">
        Tell us how you want to use the platform
      </p>

      {/* 🔽 DOUBLE DOWN ARROWS (LEFT & RIGHT, FROM TOP) */}
      <div className="relative w-full max-w-4xl mb-8">
        {/* Left Arrow */}
        <img
          src="/rooms/icons/double-down-icon.gif"
          alt="Scroll down"
          className="
            absolute -top-14 left-0
            w-10 h-10
            animate-bounce
            opacity-80
          "
        />

        {/* Right Arrow */}
        <img
          src="/rooms/icons/double-down-icon.gif"
          alt="Scroll down"
          className="
            absolute -top-14 right-0
            w-10 h-10
            animate-bounce
            opacity-80
          "
        />

        {/* ROLE CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
          {/* USER */}
          <div
            onClick={() => selectRole("user")}
            className="
              cursor-pointer
              border border-dashed border-gray-500
              rounded-xl p-10 text-center text-white
              hover:border-blue-500 hover:bg-blue-500/10
              transition-all duration-300
            "
          >
            <h2 className="text-xl font-semibold mb-2">
              I want to find rooms
            </h2>
            <p className="text-gray-400">(User)</p>
          </div>

          {/* OWNER */}
          <div
            onClick={() => selectRole("owner")}
            className="
              cursor-pointer
              border border-dashed border-gray-500
              rounded-xl p-10 text-center text-white
              hover:border-purple-500 hover:bg-purple-500/10
              transition-all duration-300
            "
          >
            <h2 className="text-xl font-semibold mb-2">
              I want to list my rooms
            </h2>
            <p className="text-gray-400">(Owner)</p>
          </div>
        </div>
      </div>
    </main>
  );
}
