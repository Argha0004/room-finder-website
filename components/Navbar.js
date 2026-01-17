"use client";

import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { useEffect, useState } from "react";
import getUserRole from "@/lib/getUserRole";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();

  // ✅ Hooks ALWAYS at top
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Navbar ONLY reads auth state — NO redirects
  useEffect(() => {
    const loadRole = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        setRole(null);
        setLoading(false);
        return;
      }

      const userRole = await getUserRole();
      setRole(userRole);
      setLoading(false);
    };

    loadRole();

    // ✅ React to login/logout instantly
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      loadRole();
    });

    return () => subscription.unsubscribe();
  }, []);
  // 🔒 dependency array NEVER changes

  const logout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  // ✅ Safe early return AFTER hooks
  if (loading) return null;

  return (
    <nav className="w-full px-6 py-4 flex items-center justify-between bg-[#FF9494]">
      {/* LOGO → HOME */}
      <Link href="/">
        <h1 className="text-xl font-bold text-[#2B2A2A] cursor-pointer hover:opacity-80 transition">
          RoomFinder
        </h1>
      </Link>

      {/* NAV LINKS */}
      <div className="flex items-center gap-6 text-[#2B2A2A] font-medium">
        <Link href="/rooms">Rooms</Link>

        {role === "owner" && (
          <>
            <Link href="/add-room">Add Room</Link>
            <Link href="/my-rooms">My Rooms</Link>
            <Link href="/my-enquiries">Enquiries</Link>
          </>
        )}

        {role && (
          <button
            onClick={logout}
            className="ml-4 px-4 py-1 rounded-md bg-[#0E21A0] text-white font-semibold hover:bg-[#E37434]"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}
