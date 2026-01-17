import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata = {
  title: "RoomFinder",
  description: "Find rooms easily",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-white text-black">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
