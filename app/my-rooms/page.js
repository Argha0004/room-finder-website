"use client";

import { useEffect, useState } from "react";
import getUserRole from "@/lib/getUserRole";

export default function MyRoomsPage() {
  const [allowed, setAllowed] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    getUserRole().then((role) => {
      setAllowed(role === "owner");
      setChecked(true);
    });
  }, []);

  if (!checked) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Checking access...
      </div>
    );
  }

  if (!allowed) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-400">
        My Rooms Page (Protected)
      </div>
    );
  }

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">My Rooms</h1>
      <p className="text-gray-400">
        Owner can manage their rooms here.
      </p>
    </main>
  );
}




