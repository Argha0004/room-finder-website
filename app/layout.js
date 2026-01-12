import './globals.css';
import Navbar from '../components/Navbar';

export const metadata = {
  title: 'Room Finder',
  description: 'Find rooms easily',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-black text-white">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
