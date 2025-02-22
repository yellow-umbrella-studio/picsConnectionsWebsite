import "@/styles/globals.css";
import { IBM_Plex_Sans } from 'next/font/google';

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

export default function App({ Component, pageProps }) {
  return (
    <main className={ibmPlexSans.className}>
      <Component {...pageProps} />
    </main>
  );
}