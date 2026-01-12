"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push("/login");
      } else {
        setLoading(false);
      }
    };

    checkSession();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  if (loading) return <p className="text-white">Loading...</p>;

  return (
    <main className="min-h-screen flex flex-col items-center justify-center text-white space-y-6">
      <h1 className="text-2xl font-bold">
        Room Finder – Frontend Started 🚀
      </h1>

      <button
        onClick={handleLogout}
        className="bg-red-600 px-4 py-2 rounded hover:bg-red-700"
      >
        Logout
      </button>
    </main>
  );
}
