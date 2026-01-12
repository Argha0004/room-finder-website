// app/rooms/page.js

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function RoomsPage() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [maxRent, setMaxRent] = useState("");

  useEffect(() => {
    const fetchRooms = async () => {
      let query = supabase.from("rooms").select(`
        id,
        title,
        location,
        rent,
        property_type,
        room_images (
          image_url
        )
      `);

      if (location) {
        query = query.eq("location", location);
      }

      if (propertyType) {
        query = query.eq("property_type", propertyType);
      }

      if (maxRent) {
        query = query.lte("rent", maxRent);
      }

      const { data, error } = await query;

      if (!error) setRooms(data);
      setLoading(false);
    };

    fetchRooms();
  }, [location, propertyType, maxRent]);

  if (loading) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        Loading rooms...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white p-6">
      <h1 className="text-3xl font-bold mb-6">Available Rooms</h1>
      
      {/* FILTERS */}
      <div className="bg-zinc-900 p-4 rounded-lg mb-6 flex flex-wrap gap-4">
        {/* LOCATION */}
        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="bg-black border border-zinc-700 p-2 rounded text-white"
        />

        {/* PROPERTY TYPE */}
        <select
          value={propertyType}
          onChange={(e) => setPropertyType(e.target.value)}
          className="bg-black border border-zinc-700 p-2 rounded text-white"
        >
          <option value="">All Types</option>
          <option value="1BHK">1BHK</option>
          <option value="2BHK">2BHK</option>
          <option value="3BHK">3BHK</option>
        </select>

        {/* MAX RENT */}
        <input
          type="number"
          placeholder="Max Rent"
          value={maxRent}
          onChange={(e) => setMaxRent(e.target.value)}
          className="bg-black border border-zinc-700 p-2 rounded text-white"
        />
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {rooms.map((room) => (
          <Link key={room.id} href={`/room/${room.id}`}>
            <div className="bg-zinc-900 rounded-lg overflow-hidden hover:shadow-xl transition cursor-pointer">
              {/* IMAGE */}
              <div className="aspect-4/3 w-full">
                <img
                  src={room.room_images?.[0]?.image_url || "/placeholder.jpg"}
                  alt={room.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* DETAILS */}
              <div className="p-4 space-y-1">
                <h2 className="text-lg font-semibold">{room.title}</h2>
                <p className="text-xs text-gray-400">{room.location}</p>

                <div className="flex justify-between items-center pt-1">
                  <span className="text-blue-400 font-semibold">
                    ₹{room.rent}
                  </span>
                  <span className="text-xs bg-zinc-800 px-2 py-0.5 rounded-full">
                    {room.property_type}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
