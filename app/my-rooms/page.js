// app/my-rooms/page.js

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import useAuth from "@/lib/userAuth";

export default function MyRoomsPage() {
  const router = useRouter();        // ✅ FIRST
  const { user, role, loading } = useAuth(); // ✅ SECOND

  if (loading) return null;

  if (!user || role !== "owner") {
    router.push("/");
    return null;
  }

  const [rooms, setRooms] = useState([]);
  const [loadedImages, setLoadedImages] = useState({});

  useEffect(() => {
    const fetchMyRooms = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("rooms")
        .select(
          `
          id,
          title,
          rent,
          location,
          available,
          room_images (
            image_url
          )
        `,
        )
        .eq("owner_id", user.id);

      if (!error) setRooms(data || []);
      setLoading(false);
    };

    fetchMyRooms();
  }, []);

  const handleEdit = (roomId) => {
    router.push(`/edit-room/${roomId}`);
  };

  const handleDelete = async (roomId) => {
    const confirmDelete = confirm("Are you sure you want to delete this room?");
    if (!confirmDelete) return;

    await supabase.from("rooms").delete().eq("id", roomId);
    setRooms((prev) => prev.filter((room) => room.id !== roomId));
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-gray-500">Loading your rooms...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white px-4 py-8">
      {/* HEADER */}
      <h1 className="text-3xl font-bold text-gray-900 text-center mb-2">
        My Rooms
      </h1>
      <p className="text-gray-500 text-center mb-8">
        Owner can manage their rooms here.
      </p>

      {rooms.length === 0 ? (
        <div className="mt-20 flex justify-center">
          <div
            className="flex flex-col items-center space-y-4 text-center
                 bg-[#FFD8DF] rounded-2xl px-10 py-8 shadow-sm"
          >
            <video
              src="/rooms/icons/empty-animation.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="w-40 h-40 opacity-90"
            />

            <p className="text-lg font-medium text-gray-700">
              No rooms listed yet
            </p>

            <p className="text-sm text-gray-500">
              Start by adding your first room
            </p>

            <button
              onClick={() => router.push("/add-room")}
              className="mt-2 px-5 py-2 rounded-lg bg-[#71C9CE] text-white hover:opacity-90 transition"
            >
              + Add Room
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 place-items-center">
          {rooms.map((room) => {
            const image =
              room.room_images?.[0]?.image_url ||
              "https://via.placeholder.com/400x250?text=No+Image";

            return (
              <div
                key={room.id}
                className="
                  bg-[#BDE8F5] rounded-2xl overflow-hidden
                  w-full max-w-[360px] aspect-square flex flex-col
                  shadow-md
                  transition-all duration-300 ease-out
                  hover:-translate-y-1 hover:shadow-xl
                "
              >
                {/* IMAGE */}
                <div className="relative w-full aspect-square overflow-hidden bg-gray-200">
                  {!loadedImages[room.id] && (
                    <div className="absolute inset-0 animate-pulse bg-gray-400" />
                  )}

                  <img
                    src={image}
                    alt={room.title}
                    onLoad={() =>
                      setLoadedImages((prev) => ({ ...prev, [room.id]: true }))
                    }
                    className={`
                      h-full w-full object-cover
                      transition-opacity duration-700
                      ${loadedImages[room.id] ? "opacity-100" : "opacity-0"}
                    `}
                  />
                </div>

                {/* CONTENT */}
                <div className="flex-1 p-4 flex flex-col justify-between text-[#2B2A2A]">
                  {/* TITLE + LOCATION */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-1">
                      <img
                        src="/rooms/icons/room-icon.png"
                        className="w-5 h-5"
                        alt="Room"
                      />
                      <span className="font-semibold">{room.title}</span>
                    </div>

                    {room.location && (
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <img
                          src="/rooms/icons/location-icon.png"
                          className="w-4 h-4"
                          alt="Location"
                        />
                        <span>{room.location}</span>
                      </div>
                    )}
                  </div>

                  {/* RENT + STATUS */}
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-1">
                      <img
                        src="/rooms/icons/rent-icon.png"
                        className="w-5 h-5"
                        alt="Rent"
                      />
                      <span>₹{room.rent} / month</span>
                    </div>

                    <div className="flex items-center gap-1 text-sm">
                      <img
                        src={
                          room.available
                            ? "/rooms/icons/available-icon.png"
                            : "/rooms/icons/booked-icon.png"
                        }
                        className="w-4 h-4"
                        alt="Status"
                      />
                      <span
                        className={
                          room.available ? "text-green-600" : "text-red-500"
                        }
                      >
                        {room.available ? "Available" : "Booked"}
                      </span>
                    </div>
                  </div>

                  {/* ACTIONS */}
                  <div className="flex items-center justify-between mt-3">
                    <button
                      onClick={() => handleEdit(room.id)}
                      className="
                        w-10 h-10 rounded-full bg-[#71C9CE]
                        flex items-center justify-center
                        transition-all duration-200
                        hover:scale-110 hover:ring-2 hover:ring-[#71C9CE]/50
                        focus:outline-none focus:ring-2
                      "
                    >
                      <img
                        src="/rooms/icons/edit-icon.png"
                        className="w-5 h-5"
                        alt="Edit"
                      />
                    </button>

                    <button
                      onClick={() => handleDelete(room.id)}
                      className="
                        w-10 h-10 rounded-full bg-[#FF9494]
                        flex items-center justify-center
                        transition-all duration-200
                        hover:scale-110 hover:ring-2 hover:ring-[#FF9494]/50
                        focus:outline-none focus:ring-2
                      "
                    >
                      <img
                        src="/rooms/icons/delete-icon.png"
                        className="w-5 h-5"
                        alt="Delete"
                      />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
