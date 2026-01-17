"use client";
export const dynamic = "force-dynamic";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useSearchParams, useRouter } from "next/navigation";

export default function RoomsPage() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  const [location, setLocation] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [maxRent, setMaxRent] = useState(20000);

  // PART 1: Availability (single source of truth)
  const [availableOnly, setAvailableOnly] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchRooms = async () => {
      let query = supabase.from("rooms").select(`
        id,
        title,
        location,
        rent,
        property_type,
        available,
        room_images (
          image_url
        )
      `);

      if (location) query = query.eq("location", location);
      if (propertyType) query = query.eq("property_type", propertyType);
      if (maxRent) query = query.lte("rent", maxRent);
      if (availableOnly) query = query.eq("available", true);

      const { data, error } = await query;
      if (!error) setRooms(data || []);

      setLoading(false);
    };

    fetchRooms();
  }, [location, propertyType, maxRent, availableOnly]);

  if (loading) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        Loading rooms...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white px-6 py-8">
      <h1 className="text-3xl font-bold text-gray-900 text-center mb-2">
        Rooms
      </h1>
      <p className="text-gray-500 text-center mb-8">
        Find rooms that match your needs
      </p>

      {/* ================= FILTER BAR ================= */}
      <div className="mt-6 mb-10 flex justify-center max-w-6xl mx-auto sticky top-4 z-30">
        <div
          className="
            flex flex-col
            sm:flex-row
            sm:flex-wrap
            items-stretch
            sm:items-center
            gap-4
           bg-[#BDE8F5]
            px-6 py-4
            rounded-2xl
            shadow-md
            animate-filter-in
          "
        >
          {/* LOCATION */}
          <div className="relative flex items-center group transition-transform duration-200 hover:-translate-y-[2px]">
            <img
              src="/rooms/icons/location-animation.gif"
              alt="Location"
              className="
                absolute left-2 w-4 h-5
                pointer-events-none
                transition-all duration-300
                group-hover:scale-110
                group-hover:opacity-100
                opacity-80
              "
            />

            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="
                pl-7 pr-4 py-2
                rounded-lg
                border border-[#F9ED69]
                text-sm text-gray-800
                bg-white
                transition-all duration-200
                hover:shadow-md
                focus:outline-none
                focus:ring-2 focus:ring-[#F9ED69]
              "
            >
              <option value="">Location</option>
              <option>Newtown</option>
              <option>Salt Lake</option>
              <option>Rajarhat</option>
            </select>
          </div>

          {/* MAX RENT */}
          <div className="flex flex-col gap-1 min-w-[200px] transition-transform duration-200 hover:-translate-y-[2px]">
            <span className="text-xs text-black">
              Max Rent:&nbsp;
              <span
                key={maxRent}
                className="text-sm font-medium inline-block transition-transform duration-200 scale-105"
              >
                ₹{maxRent}
              </span>
            </span>

            <div className="flex items-center gap-2">
              <input
                type="range"
                min={5000}
                max={50000}
                step={1000}
                value={maxRent}
                onChange={(e) => setMaxRent(Number(e.target.value))}
                className="
                  w-28
                  accent-[#F9ED69]
                  cursor-pointer
                  transition-all duration-200
                  hover:scale-[1.03]
                  active:scale-[1.05]
                "
              />

              <input
                type="number"
                value={maxRent}
                onChange={(e) => setMaxRent(Number(e.target.value))}
                className="
                  w-[72px]
                  px-2 py-1.5
                  rounded-md
                  text-sm
                  border border-[#F9ED69]
                  bg-white
                  text-[#2B2A2A]
                  transition-all duration-150
                  focus:outline-none
                  focus:ring-2 focus:ring-[#F9ED69]
                  focus:scale-[1.03]
                "
              />
            </div>
          </div>

          {/* AVAILABILITY */}
          <div className="flex items-center gap-2 transition-transform duration-200 hover:-translate-y-[2px]">
            {!availableOnly && (
              <>
                <input
                  type="checkbox"
                  checked={false}
                  onChange={() => setAvailableOnly(true)}
                  className="
                    w-4 h-4
                    appearance-none
                    rounded-full
                    bg-white
                    cursor-pointer
                  "
                />
                <span className="text-sm text-[#222831]">Available</span>
              </>
            )}

            {availableOnly && (
              <img
                src="/rooms/icons/check-mark-animation.gif"
                alt="Available"
                className="w-6 h-6 cursor-pointer"
                onClick={() => setAvailableOnly(false)}
              />
            )}
          </div>
        </div>
      </div>

      {/* ================= ROOMS GRID ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {rooms.map((room) => (
          <Link key={room.id} href={`/room/${room.id}`}>
            <div
              className="
                bg-[#BDE8F5]
                rounded-xl
                overflow-hidden
                transition-all duration-300
                hover:shadow-lg hover:-translate-y-1
                cursor-pointer
              "
            >
              <div className="aspect-4/3 w-full">
                <img
                  src={room.room_images?.[0]?.image_url || "/placeholder.jpg"}
                  alt={room.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-4 text-[#2B2A2A] space-y-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <img src="/rooms/icons/room-icon.png" className="w-5 h-5" />
                    <span className="font-semibold">{room.title}</span>
                  </div>

                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <img
                      src="/rooms/icons/location-icon.png"
                      className="w-4 h-4"
                    />
                    <span>{room.location}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img src="/rooms/icons/rent-icon.png" className="w-5 h-5" />
                    <span className="font-medium">₹{room.rent} / month</span>
                  </div>

                  {room.available && (
                    <div className="flex items-center gap-1 text-sm text-green-600">
                      <img
                        src="/rooms/icons/available-icon.png"
                        className="w-4 h-4"
                      />
                      <span>Available</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
