"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function AddRoomPage() {
  const router = useRouter();
  const REFRESH_DURATION = 1500;
  const COMPLETE_DURATION = 1000;

  const [addSuccess, setAddSuccess] = useState(false);

  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [rent, setRent] = useState("");
  const [propertyType, setPropertyType] = useState("1BHK");
  const [tenantType, setTenantType] = useState([]);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  // Refresh animation states (UNCHANGED)
  const [showRefreshAnim, setShowRefreshAnim] = useState(false);
  const [refreshStep, setRefreshStep] = useState(0);

  const toggleTenantType = (type) => {
    setTenantType((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handleRefresh = () => {
    setShowRefreshAnim(true);
    setRefreshStep(1);

    setTimeout(() => {
      setTitle("");
      setLocation("");
      setRent("");
      setPropertyType("1BHK");
      setTenantType([]);
      setImage(null);
      setRefreshStep(2);
    }, REFRESH_DURATION);

    setTimeout(() => {
      setShowRefreshAnim(false);
      setRefreshStep(0);
    }, REFRESH_DURATION + COMPLETE_DURATION);
  };

  // ✅ ADD ROOM FUNCTIONALITY (LOGIC UNCHANGED)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("You must be logged in");
      setLoading(false);
      return;
    }

    const { data: room, error } = await supabase
      .from("rooms")
      .insert({
        title,
        location,
        rent: Number(rent),
        property_type: propertyType,
        tenant_type: tenantType.join(", "),
        owner_id: user.id,
      })
      .select()
      .single();

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    if (image) {
      const fileExt = image.name.split(".").pop();
      const filePath = `${room.id}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("room-images")
        .upload(filePath, image);

      if (uploadError) {
        alert(uploadError.message);
        setLoading(false);
        return;
      }

      const { data } = supabase.storage
        .from("room-images")
        .getPublicUrl(filePath);

      await supabase.from("room_images").insert({
        room_id: room.id,
        image_url: data.publicUrl,
      });
    }

    setLoading(false);
    setAddSuccess(true);

    setTimeout(() => {
      router.push("/rooms");
    }, 3000);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-white">
      <div className="bg-[#BDE8F5] p-8 rounded-2xl w-[420px] shadow-lg">
        {!addSuccess ? (
          <form onSubmit={handleSubmit} className="space-y-5">
            <h1 className="text-2xl font-bold text-center text-black">
              Add Room
            </h1>

            {/* TITLE */}
            <div className="flex items-center gap-2 bg-white rounded-lg px-3 py-2">
              <img src="/rooms/icons/title-icon.png" className="w-5 h-5" />
              <input
                placeholder="Title"
                className="w-full outline-none text-black bg-transparent"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            {/* LOCATION + RENT */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2 bg-white rounded-lg px-3 py-2">
                <img src="/rooms/icons/location-icon.png" className="w-5 h-5" />
                <input
                  placeholder="Location"
                  className="w-full outline-none text-black bg-transparent"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                />
              </div>

              <div className="flex items-center gap-2 bg-white rounded-lg px-3 py-2">
                <img src="/rooms/icons/rent-1-icon.png" className="w-5 h-5" />
                <input
                  type="number"
                  placeholder="Rent"
                  className="w-full outline-none text-black bg-transparent"
                  value={rent}
                  onChange={(e) => setRent(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* PROPERTY TYPE */}
            <div className="flex items-center gap-3 text-black text-sm">
              <img src="/rooms/icons/apartment-icon.png" className="w-5 h-5" />
              <span className="font-semibold w-[80px]">Property Type</span>
              {["1BHK", "2BHK", "3BHK"].map((type) => (
                <label key={type} className="flex items-center gap-1">
                  <input
                    type="checkbox"
                    checked={propertyType === type}
                    onChange={() => setPropertyType(type)}
                  />
                  {type}
                </label>
              ))}
            </div>

            {/* RELATIONSHIP */}
            <div className="flex items-center gap-3 text-black text-sm">
              <img
                src="/rooms/icons/relationship-icon.png"
                className="w-5 h-5"
              />
              <span className="font-semibold w-[80px]">Relationship</span>
              {["Family", "Bachelor", "Couple"].map((type) => (
                <label key={type} className="flex items-center gap-1">
                  <input
                    type="checkbox"
                    checked={tenantType.includes(type)}
                    onChange={() => toggleTenantType(type)}
                  />
                  {type}
                </label>
              ))}
            </div>

            {/* FILE */}
            <div className="flex items-center gap-3 text-black text-sm">
              <span className="font-medium">Upload file</span>
              <label className="bg-[#E6E6FA] px-4 py-1 rounded cursor-pointer border">
                Choose File
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImage(e.target.files[0])}
                  className="hidden"
                  required
                />
              </label>
              <span className="text-gray-700">
                {image ? image.name : "No file chosen"}
              </span>
            </div>

            {/* ACTIONS */}
            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={handleRefresh}
                className="bg-[#9929EA] text-white px-5 py-2 rounded-lg"
              >
                Refresh
              </button>

              <button
                disabled={loading}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg"
              >
                {loading ? "Adding..." : "Add Room"}
              </button>
            </div>
          </form>
        ) : (
          <div className="flex flex-col items-center justify-center h-[380px] text-center">
            <img
              src="/rooms/icons/complete-animation.gif"
              className="w-24 h-24 mb-4"
              alt="Success"
            />
            <h2 className="text-xl font-semibold text-black">
              Successfully added
            </h2>
          </div>
        )}
      </div>
    </main>
  );
}
