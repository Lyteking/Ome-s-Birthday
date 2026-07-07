import './globals.css';

export const metadata = {
  title: 'Happy Birthday Ome 💖',
  description: 'A special birthday page, made with love',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
