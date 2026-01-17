// app/my-enquiries/page.js
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

/**
 * @typedef {Object} Enquiry
 * @property {string} id
 * @property {string} message
 * @property {string | null} owner_reply
 * @property {string} created_at
 * @property {{
 *   title: string
 *   location: string
 * } | null} rooms
 */

export default function MyEnquiriesPage() {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyingId, setReplyingId] = useState(null);
  const [replyText, setReplyText] = useState("");

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const fetchEnquiries = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("room_enquiries")
      .select(
        `
        id,
        message,
        owner_reply,
        created_at,
        rooms (
          title,
          location
        )
      `
      )
      .order("created_at", { ascending: false });

    if (!error) setEnquiries(data || []);
    setLoading(false);
  };

  const sendReply = async (id) => {
    if (!replyText.trim()) return;

    const { error } = await supabase
      .from("room_enquiries")
      .update({ owner_reply: replyText })
      .eq("id", id);

    if (!error) {
      setReplyText("");
      setReplyingId(null);
      fetchEnquiries();
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-gray-500">Loading enquiries...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 text-center mb-8">
        Enquiries
      </h1>

      {enquiries.length === 0 ? (
        <p className="text-center text-gray-500">No enquiries received yet</p>
      ) : (
        <div className="flex justify-center">
          {enquiries.map((enquiry) => (
            <div
              key={enquiry.id}
              className="bg-[#BDE8F5] border border-gray-200 rounded-2xl p-7 space-y-5 w-380px h-380px shadow-md hover:shadow-lg transition"
            >
              {/* Room info */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {enquiry.rooms?.title}
                </h2>
                <p className="text-sm text-gray-500">
                  {enquiry.rooms?.location}
                </p>
              </div>

              {/* Message */}
              <p className="text-gray-800">{enquiry.message}</p>

              {/* Owner reply */}
              {enquiry.owner_reply ? (
                <div className="bg-teal-50 border border-teal-200 rounded-lg p-3">
                  <p className="text-sm font-semibold text-teal-700">
                    Your reply
                  </p>
                  <p className="text-gray-800">{enquiry.owner_reply}</p>
                </div>
              ) : (
                <>
                  {replyingId === enquiry.id ? (
                    <div className="space-y-3">
                      <textarea
                        rows={3}
                        className=" w-full border border-[#F96E5B] rounded-lg p-3 text-[#2B2A2A] placeholder:text-[#2B2A2A] focus:outline-none focus:ring-2 focus:ring-[#F96E5B] caret-[#2B2A2A] bg-transparent"
                        placeholder="Write your reply..."
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                      />

                      <div className="flex items-center justify-between mt-4">
                        {/* Cancel (Left) */}
                        <button
                          onClick={() => {
                            setReplyingId(null);
                            setReplyText("");
                          }}
                          className=" w-11 h-11 flex items-center justify-center rounded-full  bg-[#FF7DB0] border border-gray-300  hover:bg-[#00F7FF] transition"
                          title="Cancel"
                        >
                          <img
                            src="/rooms/icons/cancel-icon.png"
                            alt="Cancel"
                            className="w-6 h-6"
                          />
                        </button>

                        {/* Send (Right) */}
                        <button
                          onClick={() => sendReply(enquiry.id)}
                          className=" w-11 h-11 flex items-center justify-center rounded-full bg-[#009688] hover:bg-[#00796B] transition"
                          title="Send"
                        >
                          <img
                            src="/rooms/icons/send-icon.png"
                            alt="Send"
                            className="w-5 h-5"
                          />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setReplyingId(enquiry.id)}
                      className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg"
                    >
                      Reply
                    </button>
                  )}
                </>
              )}

              <p className="text-xs text-gray-400">
                {new Date(enquiry.created_at).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
