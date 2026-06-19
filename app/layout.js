import './globals.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import StoreProvider from '../components/StoreProvider';
import Toast from '../components/Toaster';
import MobileBottomNav from '../components/MobileBottomNav';

export const metadata = {
  title: 'fitstoryandco',
  description: 'A premium ethnic wear destination offering curated collections for weddings, festivals, and special occasions.'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <StoreProvider>
          <Navbar />
          {children}
            <Toast />
             <MobileBottomNav />
          <Footer />
        </StoreProvider>
      </body>
    </html>
  );
}
