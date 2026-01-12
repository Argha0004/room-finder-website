import "./globals.css";
import Navbar from "./components/Navbar";

export const metadata = {
  title: "Room Finder",
  description: "Find rooms easily",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-black text-white min-h-screen">
        {/* Top Navigation */}
        <Navbar />

        {/* Page Content */}
        <main className="pt-6">{children}</main>

        {/* Footer */}
        <footer className="mt-16 border-t border-zinc-800 py-6 text-center text-sm text-gray-400">
          © {new Date().getFullYear()} Room Finder — All rights reserved
        </footer>
      </body>
    </html>
  );
}
