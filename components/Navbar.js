"use client";

import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { useEffect, useState } from "react";
import getUserRole from "@/lib/getUserRole";

export default function Navbar() {
  const [role, setRole] = useState(null);

  useEffect(() => {
    getUserRole().then(setRole);
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  return (
    <nav className="flex justify-between items-center px-6 py-4 bg-zinc-900 border-b border-zinc-800">
      <Link href="/" className="text-xl font-bold text-teal-400">
        RoomFinder
      </Link>

      <div className="flex gap-4 items-center text-sm">
        <Link href="/rooms">Rooms</Link>

        {role === "owner" && (
          <>
            <Link href="/add-room">Add Room</Link>
            <Link href="/my-rooms">My Rooms</Link>
            <Link href="/my-enquiries">Enquiries</Link>
          </>
        )}

        {role === "user" && (
          <Link href="/my-enquiries">My Enquiries</Link>
        )}

        <button
          onClick={logout}
          className="bg-orange-500 px-4 py-1 rounded text-black font-semibold"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
