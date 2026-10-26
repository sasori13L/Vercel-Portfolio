import "./globals.css";

export const metadata = {
  title: "Lyla Chairein Quintana — Pre-construction Estimator & Quantity Surveyor",
  description:
    "Portfolio of Lyla Chairein Quintana, Registered Civil Engineer and Pre-construction Estimator / Quantity Surveyor in Cebu City, Philippines.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@600;700;800&family=IBM+Plex+Mono:wght@400;500&family=Inter:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
