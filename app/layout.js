import "./globals.css";

export const metadata = {
  title: "DRISHTI — AI Deepfake Detection Platform",
  description:
    "DRISHTI (Deepfake Recognition & Image Synthetic Hybrid Truth Identifier) detects AI-generated content and deepfakes across text, images, audio, and video. Get confidence scores, forensic heatmaps, and GAN attribution.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen" style={{ background: "var(--navy)" }}>
        {children}
      </body>
    </html>
  );
}
