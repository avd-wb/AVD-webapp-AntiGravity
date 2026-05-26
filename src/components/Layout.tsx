import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { PwaInstallPrompt } from "./PwaInstallPrompt";
import { NotificationPrompt } from "./NotificationPrompt";

export default function Layout() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900 font-sans">
      <Header />
      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>
      <Footer />
      <PwaInstallPrompt />
      <NotificationPrompt />
    </div>
  );
}
