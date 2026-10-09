import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "RoomRent.co.in | Rooms, PG, Flats & Hostels in Hyderabad",
    template: "%s | RoomRent.co.in",
  },
  description: "Find the best rooms, PG accommodations, hostels and flats for rent in Hyderabad. Connect directly with owners — no brokerage, no middlemen. Search by locality, budget and more.",
  keywords: "rooms for rent hyderabad, pg accommodation hyderabad, hostel hyderabad, flat for rent hyderabad, no brokerage rooms, gachibowli room rent, madhapur pg",
  metadataBase: new URL("https://roomrent.co.in"),
  openGraph: {
    title: "RoomRent.co.in | Find Rooms, PG & Flats in Hyderabad",
    description: "Hyderabad's trusted rental marketplace. Find rooms, PGs, hostels, and flats directly from owners.",
    type: "website",
    locale: "en_IN",
    siteName: "RoomRent.co.in",
  },
  twitter: {
    card: "summary_large_image",
    title: "RoomRent.co.in | Hyderabad Rental Marketplace",
    description: "Find rooms, PG, hostels and flats in Hyderabad — directly from owners.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
