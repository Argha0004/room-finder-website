"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function MyRoomsPage() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyRooms = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data, error } = await supabase
        .from("rooms")
        .select("*")
        .eq("owner_id", user.id);

      if (!error) {
        setRooms(data);
      }

      setLoading(false);
    };

    fetchMyRooms();
  }, []);

  if (loading) {
    return <div className="p-6">Loading your rooms...</div>;
  }

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-2">My Rooms</h1>
      <p className="text-gray-400 mb-6">
        Owner can manage their rooms here.
      </p>

      {rooms.length === 0 ? (
        <p className="text-gray-500">
          You haven’t listed any rooms yet.
        </p>
      ) : (
        <div className="grid gap-4">
          {rooms.map((room) => (
            <div
              key={room.id}
              className="bg-neutral-900 p-4 rounded-lg border border-neutral-800"
            >
              <h2 className="text-lg font-semibold">{room.title}</h2>
              <p className="text-gray-400">{room.city}</p>
              <p className="text-teal-400 font-bold">₹{room.rent}</p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}




