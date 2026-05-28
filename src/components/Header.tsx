import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { cn } from "../lib/utils";
import { motion, AnimatePresence } from "motion/react";

const navigation = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Membership", href: "/membership" },
  { name: "Districts", href: "/districts" },
  { name: "Notices", href: "/notices" },
  { name: "Member Portal", href: "/portal" },
  { name: "Contact Us", href: "/contact" },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200/50 sticky top-0 z-50 flex items-center justify-between px-6 lg:px-10 shrink-0 shadow-[0_4px_30px_rgba(0,0,0,0.03)]">
      <nav className="flex w-full items-center justify-between" aria-label="Global">
        <div className="flex items-center gap-3">
          <Link to="/" className="-m-1.5 p-1.5 flex items-center gap-3">
            <span className="sr-only">Association of Veterinary Doctors</span>
            <img src="https://ik.imagekit.io/avdwb/Logo/20260517%20Logo_AVD_trans.webp" alt="AVD Logo" className="w-12 h-12 object-contain" />
            <div className="flex-col hidden sm:flex">
              <span className="font-bold text-slate-800 leading-tight">AVD West Bengal</span>
              <span className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold">Association of Veterinary Doctors</span>
            </div>
          </Link>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <Menu className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <div className="hidden lg:flex gap-8 items-center">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href || (item.href !== '/' && location.pathname.startsWith(item.href));
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "text-sm transition-colors",
                  isActive ? "font-semibold text-saffron-600 border-b-2 border-saffron-600 py-1" : "font-medium text-slate-600 hover:text-saffron-600"
                )}
              >
                {item.name}
              </Link>
            )
          })}
        </div>
        <div className="hidden lg:flex gap-3">
          <Link to="/portal" className="bg-saffron-600 text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-saffron-700 transition-colors shadow-sm">
            Member Portal
          </Link>
          <Link to="/contact" className="border border-slate-300 text-slate-700 px-5 py-2 rounded-full text-sm font-semibold hover:bg-slate-50 transition-colors">
            Contact
          </Link>
        </div>
      </nav>
      
      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden fixed inset-0 z-50 bg-white px-4 py-4 sm:ring-1 sm:ring-gray-900/10 h-screen"
          >
            <div className="flex items-center justify-between">
              <Link to="/" className="-m-1.5 p-1.5 flex items-center gap-3" onClick={() => setMobileMenuOpen(false)}>
                <img src="https://ik.imagekit.io/avdwb/Logo/20260517%20Logo_AVD_trans.webp" alt="AVD Logo" className="w-10 h-10 object-contain" />
                <div className="flex-col flex">
                  <span className="font-bold text-slate-800 leading-tight">AVD West Bengal</span>
                  <span className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold">Association of Veterinary</span>
                </div>
              </Link>
              <button
                type="button"
                className="-m-2.5 rounded-md p-2.5 text-gray-700"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="sr-only">Close menu</span>
                <X className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-gray-500/10">
                <div className="space-y-2 py-6">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
                <div className="py-6">
                  <Link
                    to="/membership"
                    className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Join Now
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
