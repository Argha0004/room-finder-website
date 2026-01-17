"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function EditRoomPage() {
  const router = useRouter();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [rent, setRent] = useState("");
  const [location, setLocation] = useState("");
  const [newImage, setNewImage] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  // 🔹 Fetch room (OWNER only – RLS safe)
  useEffect(() => {
    const fetchRoom = async () => {
      const { data, error } = await supabase
        .from("rooms")
        .select("title, rent, location")
        .eq("id", id)
        .single();

      if (error || !data) {
        console.error(error);
        alert("Room not found");
        router.push("/my-rooms");
        return;
      }

      setTitle(data.title ?? "");
      setRent(data.rent ?? "");
      setLocation(data.location ?? "");
      setLoading(false);
    };

    fetchRoom();
  }, [id, router]);

  // 🔹 Update room (ONLY editable columns)
  const handleUpdate = async () => {
    setUpdating(true);

    const { error } = await supabase
      .from("rooms")
      .update({
        title: title.trim(),
        rent: Number(rent),
        location: location.trim(),
      })
      .eq("id", id);

    if (error) {
      console.error(error);
      setUpdating(false);
      return;
    }

    // 🔹 Upload new image if selected
    if (newImage) {
      const fileExt = newImage.name.split(".").pop();
      const filePath = `${id}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("room-images")
        .upload(filePath, newImage);

      if (uploadError) {
        setUpdating(false);
        return;
      }

      const { data } = supabase.storage
        .from("room-images")
        .getPublicUrl(filePath);

      await supabase.from("room_images").insert({
        room_id: id,
        image_url: data.publicUrl,
      });
    }

    setUpdating(false);
    setUpdateSuccess(true);

    setTimeout(() => {
      router.push("/my-rooms");
    }, 3000);
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-black">Loading room details...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-white">
      <div className="bg-[#BDE8F5] p-8 rounded-2xl w-[420px] shadow-lg space-y-5 relative">
        {updateSuccess && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#BDE8F5] rounded-2xl z-10">
            <img
              src="\rooms\icons\update complete-animation.gif"
              className="w-24 h-24"
              alt="Update Successful"
            />
          </div>
        )}
        <h1 className="text-2xl font-bold text-center text-black">Edit Room</h1>

        {/* TITLE */}
        <div className="flex items-center gap-2 bg-white rounded-lg px-3 py-2">
          <img
            src="/rooms/icons/title-icon.png"
            className="w-5 h-5"
            alt="Title"
          />
          <input
            className="w-full outline-none text-black bg-transparent"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
          />
        </div>

        {/* RENT */}
        <div className="flex items-center gap-2 bg-white rounded-lg px-3 py-2">
          <img
            src="/rooms/icons/rent-1-icon.png"
            className="w-5 h-5"
            alt="Rent"
          />
          <input
            type="number"
            className="w-full outline-none text-black bg-transparent"
            value={rent}
            onChange={(e) => setRent(e.target.value)}
            placeholder="Rent"
          />
        </div>

        {/* LOCATION */}
        <div className="flex items-center gap-2 bg-white rounded-lg px-3 py-2">
          <img
            src="/rooms/icons/location-icon.png"
            className="w-5 h-5"
            alt="Location"
          />
          <input
            className="w-full outline-none text-black bg-transparent"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Location"
          />
        </div>

        {/* REPLACE PHOTO */}
        <div className="flex items-center gap-3 text-black text-sm">
          <span className="font-medium">Replace photo</span>

          <label className="bg-[#E6E6FA] px-4 py-1 rounded cursor-pointer border">
            Choose File
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setNewImage(e.target.files[0])}
              className="hidden"
            />
          </label>

          <span className="text-gray-700">
            {newImage ? newImage.name : "No file chosen"}
          </span>
        </div>

        {/* ACTION */}
        <button
          onClick={handleUpdate}
          disabled={updating}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2"
        >
          Update Room
          {updating && (
            <img
              src="/rooms/icons/update-animation.gif"
              className="w-5 h-5"
              alt="Updating"
            />
          )}
        </button>
      </div>
    </main>
  );
}
