import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import 'react-toastify/dist/ReactToastify.css';
import Navbar from '@/components/Navbar';
import "react-loading-skeleton/dist/skeleton.css";


export default function App({ Component, pageProps }: AppProps) {
  return (<>
  <Navbar />
  <Component {...pageProps} />
  </>)
}
