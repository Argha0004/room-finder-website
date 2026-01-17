"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push("/select-role");
      } else {
        setLoading(false);
      }
    };

    checkSession();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-black">Loading...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      {/* HERO SECTION */}
      <section className="flex flex-col items-center text-center px-6 pt-28 pb-16 space-y-6 mb-16">
        {/* Welcome Animation */}
        <img
          src="/rooms/icons/welcome-animation.gif"
          alt="Welcome"
          className="w-24 h-24 md:w-28 md:h-28"
        />

        <h1 className="text-3xl md:text-4xl font-bold text-black">
          Find rooms easily. Manage listings effortlessly.
        </h1>

        <p className="text-gray-600 text-base md:text-lg max-w-xl">
          Browse rooms, add your own listings, and manage everything from one
          place.
        </p>

        <div className="flex gap-4 pt-4">
          <button
            onClick={() => router.push("/rooms")}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition active:scale-95"
          >
            Browse Rooms
          </button>

          <button
            onClick={() => router.push("/add-room")}
            className="bg-[#9929EA] text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition"
          >
            Add Room
          </button>
        </div>

        <button
          onClick={handleLogout}
          className="text-red-600 text-sm underline pt-6"
        >
          Logout
        </button>
      </section>

      {/* STATS ROW */}
      <section className="w-full max-w-6xl mx-auto px-6 mb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Rooms */}
          <div
            className="bg-[#BDE8F5] rounded-2xl p-6 shadow-lg
           transition-transform duration-200
           hover:-translate-y-1 hover:shadow-xl"
          >
            <img
              src="/rooms/icons/hotel-icon.png"
              alt="Rooms"
              className="w-8 h-8 mx-auto"
            />

            <h3 className="text-2xl font-bold text-black">120+</h3>
            <p className="text-gray-700">Rooms Listed</p>
          </div>

          {/* Cities */}
          <div
            className="bg-[#BDE8F5] rounded-2xl p-6 shadow-lg
           transition-transform duration-200
           hover:-translate-y-1 hover:shadow-xl"
          >
            <img
              src="/rooms/icons/location-icon.png"
              alt="Cities"
              className="w-8 h-8 mx-auto"
            />
            <h3 className="text-3xl font-bold text-black">8+</h3>
            <p className="text-gray-700 mt-1">Cities Covered</p>
          </div>

          {/* Owners */}
          <div
            className="bg-[#BDE8F5] rounded-2xl p-6 shadow-lg
           transition-transform duration-200
           hover:-translate-y-1 hover:shadow-xl"
          >
            <img
              src="/rooms/icons/active-owner-icon.png"
              alt="Owners"
              className="w-8 h-8 mx-auto"
            />
            <h3 className="text-3xl font-bold text-black">45+</h3>
            <p className="text-gray-700 mt-1">Active Owners</p>
          </div>

          {/* Enquiries */}
          <div
            className="bg-[#BDE8F5] rounded-2xl p-6 shadow-lg
           transition-transform duration-200
           hover:-translate-y-1 hover:shadow-xl"
          >
            <img
              src="/rooms/icons/enquiry-icon.png"
              alt="Cities"
              className="w-8 h-8 mx-auto"
            />
            <h3 className="text-3xl font-bold text-black">300+</h3>
            <p className="text-gray-700 mt-1">Enquiries</p>
          </div>
        </div>
      </section>

      {/* FEATURE SECTION */}
      <section className="w-full max-w-6xl mx-auto mt-16 px-6 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {/* Browse Rooms */}
          <div
            onClick={() => router.push("/rooms")}
            className="bg-[#BDE8F5] rounded-2xl p-6 shadow-lg
           transition-transform duration-200
           hover:-translate-y-1 hover:shadow-xl"
          >
            <h3 className="text-xl font-bold text-black mb-2">Browse Rooms</h3>
            <p className="text-gray-700">
              Find available rooms with price, location, and availability
              filters.
            </p>
          </div>

          {/* Add Room */}
          <div
            onClick={() => router.push("/add-room")}
            className="bg-[#BDE8F5] rounded-2xl p-6 shadow-lg
           transition-transform duration-200
           hover:-translate-y-1 hover:shadow-xl"
          >
            <h3 className="text-xl font-bold text-black mb-2">Add Room</h3>
            <p className="text-gray-700">
              List your room easily and reach potential tenants faster.
            </p>
          </div>

          {/* My Rooms */}
          <div
            onClick={() => router.push("/my-rooms")}
            className="bg-[#BDE8F5] rounded-2xl p-6 shadow-lg
           transition-transform duration-200
           hover:-translate-y-1 hover:shadow-xl"
          >
            <h3 className="text-xl font-bold text-black mb-2">My Rooms</h3>
            <p className="text-gray-700">
              Manage, update, or delete your listed rooms.
            </p>
          </div>

          {/* Enquiries */}
          <div
            onClick={() => router.push("/my-enquiries")}
            className="bg-[#BDE8F5] rounded-2xl p-6 shadow-lg
           transition-transform duration-200
           hover:-translate-y-1 hover:shadow-xl"
          >
            <h3 className="text-xl font-bold text-black mb-2">Enquiries</h3>
            <p className="text-gray-700">
              View messages and interest from potential tenants.
            </p>
          </div>
        </div>
      </section>
      <footer className="w-full border-t mt-16 py-8">
        <div className="max-w-6xl mx-auto px-6 text-center text-sm text-gray-600">
          <p className="font-medium text-black">RoomFinder</p>
          <p>Find rooms. List easily. Manage smartly.</p>
          <p className="mt-2">© 2026 RoomFinder. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
