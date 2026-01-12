// app/add-room/page.js
"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function AddRoomPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [rent, setRent] = useState("");
  const [propertyType, setPropertyType] = useState("1BHK");
  const [tenantType, setTenantType] = useState("Any");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // 1️⃣ Get logged-in user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      alert("You must be logged in");
      setLoading(false);
      return;
    }

    // 2️⃣ Insert room (CORRECT COLUMNS)
    const { data: room, error: roomError } = await supabase
      .from("rooms")
      .insert({
        title,
        location,
        rent: Number(rent),
        property_type: propertyType,
        tenant_type: tenantType,
        owner_id: user.id,
      })
      .select()
      .single();

    if (roomError) {
      alert(roomError.message);
      setLoading(false);
      return;
    }

    // 3️⃣ Upload image (scoped path)
    const fileExt = image.name.split(".").pop();
    const filePath = `${room.id}/${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("room-images")
      .upload(filePath, image, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      alert(uploadError.message);
      setLoading(false);
      return;
    }

    // 4️⃣ Get public URL
    const { data } = supabase.storage
      .from("room-images")
      .getPublicUrl(filePath);

    // 5️⃣ Save image URL
    const { error: imageError } = await supabase
      .from("room_images")
      .insert({
        room_id: room.id,
        image_url: data.publicUrl,
      });

    if (imageError) {
      alert(imageError.message);
      setLoading(false);
      return;
    }

    setLoading(false);
    router.push("/rooms");
  };

  return (
    <main className="min-h-screen flex items-center justify-center text-white">
      <form
        onSubmit={handleSubmit}
        className="bg-zinc-900 p-6 rounded w-96 space-y-4"
      >
        <h1 className="text-xl font-bold">Add Room</h1>

        <input
          placeholder="Title"
          className="w-full p-2 bg-zinc-800"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <input
          placeholder="Location"
          className="w-full p-2 bg-zinc-800"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
        />

        <input
          type="number"
          placeholder="Rent"
          className="w-full p-2 bg-zinc-800"
          value={rent}
          onChange={(e) => setRent(e.target.value)}
          required
        />

        <select
          className="w-full p-2 bg-zinc-800"
          value={propertyType}
          onChange={(e) => setPropertyType(e.target.value)}
        >
          <option>1BHK</option>
          <option>2BHK</option>
          <option>3BHK</option>
        </select>

        <select
          className="w-full p-2 bg-zinc-800"
          value={tenantType}
          onChange={(e) => setTenantType(e.target.value)}
        >
          <option>Any</option>
          <option>Family</option>
          <option>Bachelor</option>
        </select>

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          required
        />

        <button
          disabled={loading}
          className="w-full bg-blue-600 py-2 rounded"
        >
          {loading ? "Adding..." : "Add Room"}
        </button>
      </form>
    </main>
  );
}
