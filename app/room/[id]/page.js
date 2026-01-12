// app/room/[id]/page.js

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function RoomDetailsPage() {
  const { id } = useParams();
  const router = useRouter();

  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);

  const [currentImage, setCurrentImage] = useState(0);

  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  // ==========================
  // FETCH ROOM DETAILS
  // ==========================
  useEffect(() => {
    if (!id) return;

    const fetchRoom = async () => {
      const { data, error } = await supabase
        .from("rooms")
        .select(`
          id,
          title,
          location,
          rent,
          property_type,
          tenant_type,
          description,
          owner_id,
          room_images (
            image_url
          )
        `)
        .eq("id", id)
        .single();

      if (error) {
        console.error(error);
        setRoom(null);
      } else {
        setRoom(data);
      }

      setLoading(false);
    };

    fetchRoom();
  }, [id]);

  // ==========================
  // LOADING / NOT FOUND
  // ==========================
  if (loading) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        Loading room details...
      </main>
    );
  }

  if (!room) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        Room not found
      </main>
    );
  }

  const images = room.room_images || [];

  // ==========================
  // SEND ENQUIRY HANDLER
  // ==========================
  const handleSendEnquiry = async () => {
    if (!message.trim()) {
      alert("Please write a message");
      return;
    }

    setSending(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("Please login to send enquiry");
      setSending(false);
      return;
    }

    const { error } = await supabase
      .from("room_enquiries")
      .insert({
        room_id: room.id,
        sender_id: user.id,
        owner_id: room.owner_id,
        message: message.trim(),
      });

    if (error) {
      alert(error.message);
    } else {
      alert("Enquiry sent successfully!");
      setMessage("");
    }

    setSending(false);
  };

  // ==========================
  // UI
  // ==========================
  return (
    <main className="min-h-screen bg-black text-white p-6">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* IMAGE CAROUSEL */}
        {images.length > 0 && (
          <div className="relative aspect-4/3 bg-zinc-900 rounded-lg overflow-hidden">
            <img
              src={images[currentImage].image_url}
              alt={room.title}
              className="w-full h-full object-cover"
            />

            {currentImage > 0 && (
              <button
                onClick={() => setCurrentImage((i) => i - 1)}
                className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/60 px-3 py-2 rounded-full"
              >
                ◀
              </button>
            )}

            {currentImage < images.length - 1 && (
              <button
                onClick={() => setCurrentImage((i) => i + 1)}
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/60 px-3 py-2 rounded-full"
              >
                ▶
              </button>
            )}
          </div>
        )}

        {/* ROOM INFO */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">{room.title}</h1>
          <p className="text-gray-400">{room.location}</p>

          <div className="flex items-center gap-4">
            <span className="text-2xl font-semibold text-blue-400">
              ₹{room.rent}
            </span>
            <span className="bg-zinc-800 px-3 py-1 rounded-full text-sm">
              {room.property_type}
            </span>
            <span className="bg-zinc-800 px-3 py-1 rounded-full text-sm">
              {room.tenant_type}
            </span>
          </div>
        </div>

        {/* DESCRIPTION */}
        {room.description && (
          <p className="text-gray-300">{room.description}</p>
        )}

        {/* ENQUIRY SECTION */}
        <div className="bg-zinc-900 p-4 rounded-lg space-y-3">
          <h2 className="text-lg font-semibold">Send Enquiry</h2>

          <textarea
            placeholder="Write your message..."
            className="w-full p-2 bg-zinc-800 rounded"
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />

          <button
            onClick={handleSendEnquiry}
            disabled={sending}
            className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {sending ? "Sending..." : "Send Enquiry"}
          </button>
        </div>
      </div>
    </main>
  );
}
