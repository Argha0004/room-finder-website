// "use client";

// import { useEffect, useState } from "react";
// import { supabase } from "@/lib/supabaseClient";

// export default function MyEnquiriesPage() {
//   const [enquiries, setEnquiries] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchEnquiries = async () => {
//       setLoading(true);

//       // 1️⃣ Get logged-in user
//       const {
//         data: { user },
//         error: authError,
//       } = await supabase.auth.getUser();

//       if (authError || !user) {
//         setLoading(false);
//         return;
//       }

//       // 2️⃣ IMPORTANT:
//       // ❌ DO NOT filter by owner_id here
//       // ✅ RLS already does that
//       const { data, error } = await supabase
//         .from("room_enquiries")
//         .select(`
//           id,
//           message,
//           created_at,
//           rooms (
//             title,
//             location
//           )
//         `)
//         .order("created_at", { ascending: false });

//       if (error) {
//         console.error("Fetch enquiries error:", error.message);
//         setEnquiries([]);
//       } else {
//         setEnquiries(data || []);
//       }

//       setLoading(false);
//     };

//     fetchEnquiries();
//   }, []);

//   if (loading) {
//     return (
//       <main className="min-h-screen bg-black text-white flex items-center justify-center">
//         Loading enquiries...
//       </main>
//     );
//   }

//   return (
//     <main className="min-h-screen bg-black text-white p-6">
//       <h1 className="text-3xl font-bold mb-6 text-center">
//         Room Enquiries
//       </h1>

//       {enquiries.length === 0 ? (
//         <p className="text-center text-gray-400">
//           No enquiries received yet
//         </p>
//       ) : (
//         <div className="max-w-4xl mx-auto space-y-4">
//           {enquiries.map((enquiry) => (
//             <div
//               key={enquiry.id}
//               className="bg-zinc-900 rounded-lg p-4"
//             >
//               <h2 className="text-lg font-semibold">
//                 {enquiry.rooms?.title}
//               </h2>
//               <p className="text-sm text-gray-400">
//                 {enquiry.rooms?.location}
//               </p>

//               <p className="mt-2 text-gray-200">
//                 {enquiry.message}
//               </p>

//               <p className="mt-2 text-xs text-gray-500">
//                 {new Date(enquiry.created_at).toLocaleString()}
//               </p>
//             </div>
//           ))}
//         </div>
//       )}
//     </main>
//   );
// }


// "use client";

// import { useEffect, useState } from "react";
// import { supabase } from "@/lib/supabaseClient";

// export default function MyEnquiriesPage() {
//   const [enquiries, setEnquiries] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [replyingId, setReplyingId] = useState(null);
//   const [replyText, setReplyText] = useState("");

//   useEffect(() => {
//     fetchEnquiries();
//   }, []);

//   const fetchEnquiries = async () => {
//     setLoading(true);

//     const { data, error } = await supabase
//       .from("room_enquiries")
//       .select(`
//         id,
//         message,
//         owner_reply,
//         created_at,
//         rooms (
//           title,
//           location
//         )
//       `)
//       .order("created_at", { ascending: false });

//     if (!error) {
//       setEnquiries(data || []);
//     }

//     setLoading(false);
//   };

//   const sendReply = async (enquiryId) => {
//     if (!replyText.trim()) return;

//     const { error } = await supabase
//       .from("room_enquiries")
//       .update({ owner_reply: replyText })
//       .eq("id", enquiryId);

//     if (error) {
//       alert(error.message);
//       return;
//     }

//     setReplyText("");
//     setReplyingId(null);
//     fetchEnquiries();
//   };

//   if (loading) {
//     return (
//       <main className="min-h-screen bg-black text-white flex items-center justify-center">
//         Loading enquiries...
//       </main>
//     );
//   }

//   return (
//     <main className="min-h-screen bg-black text-white p-6">
//       <h1 className="text-3xl font-bold mb-6 text-center">
//         Room Enquiries
//       </h1>

//       {enquiries.length === 0 ? (
//         <p className="text-center text-gray-400">
//           No enquiries received yet
//         </p>
//       ) : (
//         <div className="max-w-4xl mx-auto space-y-4">
//           {enquiries.map((enquiry) => (
//             <div
//               key={enquiry.id}
//               className="bg-zinc-900 rounded-lg p-4 space-y-3"
//             >
//               <div>
//                 <h2 className="text-lg font-semibold">
//                   {enquiry.rooms?.title}
//                 </h2>
//                 <p className="text-sm text-gray-400">
//                   {enquiry.rooms?.location}
//                 </p>
//               </div>

//               <p className="text-gray-200">
//                 {enquiry.message}
//               </p>

//               {enquiry.owner_reply ? (
//                 <div className="bg-zinc-800 p-3 rounded">
//                   <p className="text-sm text-green-400 font-semibold">
//                     Your Reply:
//                   </p>
//                   <p className="text-gray-200">
//                     {enquiry.owner_reply}
//                   </p>
//                 </div>
//               ) : (
//                 <>
//                   {replyingId === enquiry.id ? (
//                     <div className="space-y-2">
//                       <textarea
//                         className="w-full p-2 bg-zinc-800 rounded"
//                         rows={3}
//                         placeholder="Write your reply..."
//                         value={replyText}
//                         onChange={(e) =>
//                           setReplyText(e.target.value)
//                         }
//                       />
//                       <div className="flex gap-2">
//                         <button
//                           onClick={() => sendReply(enquiry.id)}
//                           className="bg-blue-600 px-4 py-1 rounded"
//                         >
//                           Send Reply
//                         </button>
//                         <button
//                           onClick={() => {
//                             setReplyingId(null);
//                             setReplyText("");
//                           }}
//                           className="bg-zinc-700 px-4 py-1 rounded"
//                         >
//                           Cancel
//                         </button>
//                       </div>
//                     </div>
//                   ) : (
//                     <button
//                       onClick={() => setReplyingId(enquiry.id)}
//                       className="bg-blue-600 px-4 py-1 rounded"
//                     >
//                       Reply to Sender
//                     </button>
//                   )}
//                 </>
//               )}

//               <p className="text-xs text-gray-500">
//                 {new Date(enquiry.created_at).toLocaleString()}
//               </p>
//             </div>
//           ))}
//         </div>
//       )}
//     </main>
//   );
// }


// "use client";

// import { useEffect, useState } from "react";
// import { supabase } from "@/lib/supabaseClient";

// export default function MyEnquiriesPage() {
//   const [enquiries, setEnquiries] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [replyingId, setReplyingId] = useState(null);
//   const [replyText, setReplyText] = useState("");

//   useEffect(() => {
//     fetchEnquiries();
//   }, []);

//   const fetchEnquiries = async () => {
//     setLoading(true);

//     const { data, error } = await supabase
//       .from("room_enquiries")
//       .select(`
//         id,
//         message,
//         owner_reply,
//         created_at,
//         rooms (
//           title,
//           location
//         )
//       `)
//       .order("created_at", { ascending: false });

//     if (error) {
//       console.error("Fetch enquiries error:", error.message);
//       setEnquiries([]);
//     } else {
//       setEnquiries(data || []);
//     }

//     setLoading(false);
//   };

//   const sendReply = async (enquiryId) => {
//     if (!replyText.trim()) return;

//     const { error } = await supabase
//       .from("room_enquiries")
//       .update({ owner_reply: replyText })
//       .eq("id", enquiryId);

//     if (error) {
//       alert(error.message);
//       return;
//     }

//     setReplyText("");
//     setReplyingId(null);
//     fetchEnquiries();
//   };

//   if (loading) {
//     return (
//       <main className="min-h-screen bg-black text-white flex items-center justify-center">
//         Loading enquiries...
//       </main>
//     );
//   }

//   return (
//     <main className="min-h-screen bg-black text-white p-6">
//       <h1 className="text-3xl font-bold mb-6 text-center">
//         Room Enquiries
//       </h1>

//       {enquiries.length === 0 ? (
//         <p className="text-center text-gray-400">
//           No enquiries received yet
//         </p>
//       ) : (
//         <div className="max-w-4xl mx-auto space-y-4">
//           {enquiries.map((enquiry) => (
//             <div
//               key={enquiry.id}
//               className="bg-zinc-900 rounded-lg p-4 space-y-3"
//             >
//               <div>
//                 <h2 className="text-lg font-semibold">
//                   {enquiry.rooms?.title}
//                 </h2>
//                 <p className="text-sm text-gray-400">
//                   {enquiry.rooms?.location}
//                 </p>
//               </div>

//               <p className="text-gray-200">
//                 {enquiry.message}
//               </p>

//               {enquiry.owner_reply ? (
//                 <div className="bg-zinc-800 p-3 rounded">
//                   <p className="text-sm text-green-400 font-semibold">
//                     Your Reply
//                   </p>
//                   <p>{enquiry.owner_reply}</p>
//                 </div>
//               ) : (
//                 <>
//                   {replyingId === enquiry.id ? (
//                     <div className="space-y-2">
//                       <textarea
//                         className="w-full p-2 bg-zinc-800 rounded"
//                         rows={3}
//                         placeholder="Write your reply..."
//                         value={replyText}
//                         onChange={(e) =>
//                           setReplyText(e.target.value)
//                         }
//                       />
//                       <div className="flex gap-2">
//                         <button
//                           onClick={() => sendReply(enquiry.id)}
//                           className="bg-blue-600 px-4 py-1 rounded"
//                         >
//                           Send Reply
//                         </button>
//                         <button
//                           onClick={() => {
//                             setReplyingId(null);
//                             setReplyText("");
//                           }}
//                           className="bg-zinc-700 px-4 py-1 rounded"
//                         >
//                           Cancel
//                         </button>
//                       </div>
//                     </div>
//                   ) : (
//                     <button
//                       onClick={() => setReplyingId(enquiry.id)}
//                       className="bg-blue-600 px-4 py-1 rounded"
//                     >
//                       Reply to Sender
//                     </button>
//                   )}
//                 </>
//               )}

//               <p className="text-xs text-gray-500">
//                 {new Date(enquiry.created_at).toLocaleString()}
//               </p>
//             </div>
//           ))}
//         </div>
//       )}
//     </main>
//   );
// }


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
  /** @type {[Enquiry[], Function]} */
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
      .select(`
        id,
        message,
        owner_reply,
        created_at,
        rooms (
          title,
          location
        )
      `)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Fetch enquiries error:", error.message);
      setEnquiries([]);
    } else {
      setEnquiries(data || []);
    }

    setLoading(false);
  };

  const sendReply = async (enquiryId) => {
    if (!replyText.trim()) return;

    const { error } = await supabase
      .from("room_enquiries")
      .update({ owner_reply: replyText })
      .eq("id", enquiryId);

    if (error) {
      alert(error.message);
      return;
    }

    setReplyText("");
    setReplyingId(null);
    fetchEnquiries();
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        Loading enquiries...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Room Enquiries
      </h1>

      {enquiries.length === 0 ? (
        <p className="text-center text-gray-400">
          No enquiries received yet
        </p>
      ) : (
        <div className="max-w-4xl mx-auto space-y-4">
          {enquiries.map((enquiry) => (
            <div
              key={enquiry.id}
              className="bg-zinc-900 rounded-lg p-4 space-y-3"
            >
              <div>
                <h2 className="text-lg font-semibold">
                  {enquiry.rooms?.title}
                </h2>
                <p className="text-sm text-gray-400">
                  {enquiry.rooms?.location}
                </p>
              </div>

              <p className="text-gray-200">
                {enquiry.message}
              </p>

              {enquiry.owner_reply ? (
                <div className="bg-zinc-800 p-3 rounded">
                  <p className="text-sm text-green-400 font-semibold">
                    Your Reply:
                  </p>
                  <p className="text-gray-200">
                    {enquiry.owner_reply}
                  </p>
                </div>
              ) : (
                <>
                  {replyingId === enquiry.id ? (
                    <div className="space-y-2">
                      <textarea
                        className="w-full p-2 bg-zinc-800 rounded"
                        rows={3}
                        placeholder="Write your reply..."
                        value={replyText}
                        onChange={(e) =>
                          setReplyText(e.target.value)
                        }
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => sendReply(enquiry.id)}
                          className="bg-blue-600 px-4 py-1 rounded"
                        >
                          Send Reply
                        </button>
                        <button
                          onClick={() => {
                            setReplyingId(null);
                            setReplyText("");
                          }}
                          className="bg-zinc-700 px-4 py-1 rounded"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setReplyingId(enquiry.id)}
                      className="bg-blue-600 px-4 py-1 rounded"
                    >
                      Reply to Sender
                    </button>
                  )}
                </>
              )}

              <p className="text-xs text-gray-500">
                {new Date(enquiry.created_at).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
