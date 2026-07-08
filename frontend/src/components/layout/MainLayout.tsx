import Navbar from './Navbar';
import Footer from './Footer';
import FacebookMessenger from '../common/FacebookMessenger';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <FacebookMessenger />
    </div>
  );
}
