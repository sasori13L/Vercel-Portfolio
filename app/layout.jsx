import "./globals.css";

export const metadata = {
  title: "Lyla Chairein Quintana — Portfolio",
  description:
    "Portfolio of Lyla Chairein Quintana, Registered Civil Engineer, Construction Estimator and Quantity Surveyor based in Cebu City.",
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
