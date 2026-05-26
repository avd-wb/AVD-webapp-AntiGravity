import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, Shield, Users, Image as ImageIcon, X, FileText, Download, Building, Eye, Compass, Target } from "lucide-react";
import { FaqAccordion } from "../components/FaqAccordion";
import { Helmet } from "react-helmet-async";
import { BackgroundCarousel } from "../components/BackgroundCarousel";
import { AppointmentsMarquee } from "../components/AppointmentsMarquee";
import { AppointmentsSection } from "../components/AppointmentsSection";
import { OrdersSection } from "../components/OrdersSection";
import { allPhotos, heroPhotos } from "../data/photos";
import { noticesData } from "../data/notices";
import { AnimatePresence, motion } from "motion/react";

export function Home() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const ldJson = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Who can become a member?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Membership is open to all veterinarians, including serving, retired, and student categories, provided they meet the basic requirement of holding a recognized veterinary qualification."
        }
      },
      {
        "@type": "Question",
        "name": "How do I apply for membership?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "You can apply for membership online through our 'Become a Member' page or by contacting your district representative. You will need to submit proof of qualification and the required fee."
        }
      },
      {
        "@type": "Question",
        "name": "Are there membership fees?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, there is an annual or lifetime subscription fee depending on the membership category chosen. Student and retired members often qualify for reduced rates. Please check the membership page for current fees."
        }
      }
    ]
  };

  return (
    <div className="flex flex-col">
      <Helmet>
        <title>AVD West Bengal - Association of Veterinary Doctors</title>
        <meta name="title" content="AVD West Bengal - Association of Veterinary Doctors" />
        <meta name="description" content="A premier professional body representing veterinarians across West Bengal, dedicated to excellence in animal healthcare and professional welfare." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://avd-gais.vercel.app/" />
        <meta property="og:title" content="AVD West Bengal - Association of Veterinary Doctors" />
        <meta property="og:description" content="A premier professional body representing veterinarians across West Bengal." />
        <meta property="og:image" content="https://ik.imagekit.io/dgevdmg7em/AVD/20260519%20AVD%20Photos%20(8).webp?tr=f-jpg,w-1200,h-630,c-at_max,q-80" />
        <meta property="og:image:type" content="image/jpeg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:title" content="AVD West Bengal - Association of Veterinary Doctors" />
        <meta property="twitter:description" content="A premier professional body representing veterinarians across West Bengal." />
        <meta property="twitter:image" content="https://ik.imagekit.io/dgevdmg7em/AVD/20260519%20AVD%20Photos%20(8).webp?tr=f-jpg,w-1200,h-630,c-at_max,q-80" />
        <script type="application/ld+json">
          {JSON.stringify(ldJson)}
        </script>
      </Helmet>

      {/* Premium Hero Section */}
      <section className="relative px-5 py-24 sm:py-28 lg:py-36 lg:px-12 flex flex-col md:flex-row items-center justify-center md:justify-start overflow-hidden min-h-[100svh] md:min-h-[85vh]">
        <BackgroundCarousel images={heroPhotos} interval={3360} />
        
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute -top-1/2 -right-1/4 w-[600px] h-[600px] md:w-[1000px] md:h-[1000px] rounded-full bg-saffron-900/30 blur-[100px] md:blur-[150px] mix-blend-screen"></div>
          <div className="absolute -bottom-1/2 -left-1/4 w-[500px] h-[500px] md:w-[800px] md:h-[800px] rounded-full bg-blue-900/20 blur-[80px] md:blur-[120px] mix-blend-screen"></div>
        </div>
        
        <div className="relative z-10 max-w-3xl text-white md:pl-8 lg:pl-12 w-full text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-4 py-2 sm:px-3 sm:py-1.5 bg-saffron-500/10 border border-saffron-500/20 rounded-full text-[10px] sm:text-xs font-bold mb-6 sm:mb-8 tracking-widest text-saffron-300 shadow-inner backdrop-blur-sm mx-auto md:mx-0">
             <span className="w-2 h-2 rounded-full bg-saffron-500 animate-pulse"></span>
             REG. NO. 34784
          </div>
          <h1 className="text-4xl sm:text-6xl lg:text-[4.5rem] font-extrabold leading-[1.1] sm:leading-[1.05] mb-6 tracking-tight drop-shadow-lg">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-200">Association of</span><br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-saffron-400 to-saffron-600">Veterinary Doctors</span>
          </h1>
          <p className="text-lg sm:text-xl text-slate-200 font-light mb-10 sm:mb-12 leading-relaxed max-w-xl mx-auto md:mx-0 drop-shadow-md">
            A premier professional body representing veterinarians across West Bengal, dedicated to excellence in animal healthcare and professional welfare.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto items-center justify-center md:justify-start flex-wrap">
            <Link to="/membership" className="w-full sm:w-auto bg-gradient-to-r from-saffron-500 to-saffron-600 text-white px-8 py-4 sm:py-3.5 rounded-xl sm:rounded-lg font-bold text-base sm:text-sm shadow-[0_0_20px_rgba(255,153,51,0.3)] hover:shadow-[0_0_25px_rgba(255,153,51,0.4)] hover:from-saffron-400 hover:to-saffron-500 text-center flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5">
              Become a Member <ArrowRight className="h-5 w-5 sm:h-4 sm:w-4" />
            </Link>
            <a href="https://drive.google.com/file/d/1HasUvMwGKvn1KYCAiAmHDVKJw-KW5-ND/view?usp=sharing" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto bg-white/10 border border-white/20 text-white px-8 py-4 sm:py-3.5 rounded-xl sm:rounded-lg font-bold text-base sm:text-sm hover:bg-white/20 text-center backdrop-blur-md transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2">
              Download Application
            </a>
            <Link to="/about" className="w-full sm:w-auto bg-white/10 border border-white/20 text-white px-8 py-4 sm:py-3.5 rounded-xl sm:rounded-lg font-bold text-base sm:text-sm hover:bg-white/20 text-center backdrop-blur-md transition-all transform hover:-translate-y-0.5">
              About AVD
            </Link>
          </div>
        </div>
      </section>

      {/* Premium Overlapping Facts Section */}
      <section className="relative z-20 max-w-7xl mx-auto md:-mt-12 mb-8 grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 px-4 sm:px-6 lg:px-8 mt-4 sm:mt-0">
        <div className="bg-white rounded-2xl p-8 shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col gap-4 transform hover:-translate-y-1 transition-transform duration-300">
          <div className="w-12 h-12 bg-saffron-50 rounded-xl flex items-center justify-center text-saffron-600 ring-1 ring-saffron-100 shadow-inner">
            <Shield className="h-6 w-6" aria-hidden="true" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 mb-2 text-lg tracking-tight">Registered Society</h3>
            <p className="text-sm text-slate-500 leading-relaxed">Officially registered under the WB Societies Registration Act, 1961 (Reg. No. 34784).</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-8 shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col gap-4 transform hover:-translate-y-1 transition-transform duration-300">
          <div className="w-12 h-12 bg-saffron-50 rounded-xl flex items-center justify-center text-saffron-600 ring-1 ring-saffron-100 shadow-inner">
            <CheckCircle2 className="h-6 w-6" aria-hidden="true" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 mb-2 text-lg tracking-tight">Statewide Network</h3>
            <p className="text-sm text-slate-500 leading-relaxed">A strong and growing network connecting veterinary professionals across all districts of West Bengal.</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-8 shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col gap-4 transform hover:-translate-y-1 transition-transform duration-300">
          <div className="w-12 h-12 bg-saffron-50 rounded-xl flex items-center justify-center text-saffron-600 ring-1 ring-saffron-100 shadow-inner">
            <Users className="h-6 w-6" aria-hidden="true" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 mb-2 text-lg tracking-tight">Open to Veterinarians</h3>
            <p className="text-sm text-slate-500 leading-relaxed">Welcoming serving professionals, retired experts, and veterinary students.</p>
          </div>
        </div>
      </section>

      {/* Appointments Marquee */}
      <section className="mb-12">
        <AppointmentsMarquee />
      </section>

      {/* Latest Notice Update (AVD - Activities) */}
      <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 mb-16">
        <div className="inline-flex items-center gap-2 mb-4 px-2">
          <span className="w-6 h-[2px] bg-blue-500"></span>
          <h4 className="text-sm font-bold text-slate-700 uppercase tracking-widest">AVD - Activities & Notices</h4>
        </div>
        <div className="flex flex-col gap-4">
          {noticesData.slice(0, 3).map((notice, index) => (
            <div key={notice.id} className="bg-blue-50 border border-blue-100 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm overflow-hidden relative">
              <div className="absolute top-0 left-0 w-2 h-full bg-blue-500"></div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  {index === 0 && <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider animate-pulse">Latest Notice</span>}
                  <span className="text-sm text-blue-800/70 font-medium">{notice.date}</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{notice.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed max-w-3xl">
                  {notice.description}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row w-full md:w-auto gap-3 shrink-0">
                {notice.link !== "#" && (
                  <a href={notice.link} target="_blank" rel="noopener noreferrer" className="text-center font-bold text-sm text-white bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg transition-colors">
                    View
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 flex justify-center">
            <Link to="/notices" className="text-center font-bold text-sm text-blue-700 bg-white border border-blue-200 hover:bg-blue-50 px-8 py-3 rounded-lg transition-colors">
              View All Notices
            </Link>
        </div>
      </section>

      {/* About AVD Section (Vibrant & Lively) */}
      <section className="relative overflow-hidden w-full bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 py-20 lg:py-28 mb-16 shadow-[0px_-20px_40px_rgb(0,0,0,0.05)] border-y border-indigo-800/30">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-full h-full bg-[url('https://ik.imagekit.io/dgevdmg7em/AVD/20260519%20AVD%20Photos%20(8).webp?tr=f-jpg,w-1200,h-630,c-at_max,q-80')] bg-cover bg-center opacity-5 mix-blend-overlay"></div>
          <div className="absolute -top-1/2 -right-1/4 w-96 h-96 bg-saffron-500/20 rounded-full blur-[100px] mix-blend-screen"></div>
          <div className="absolute -bottom-1/2 -left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[100px] mix-blend-screen"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 flex flex-col items-center">
          <div className="space-y-8 w-full max-w-5xl text-center">
            <div className="inline-flex items-center gap-2 justify-center mx-auto">
              <span className="w-8 h-[2px] bg-saffron-400"></span>
              <h4 className="text-xs font-bold text-saffron-400 uppercase tracking-widest drop-shadow-md">About the Association</h4>
              <span className="w-8 h-[2px] bg-saffron-400"></span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight pt-2 drop-shadow-lg">
              Driving Excellence in <span className="text-transparent bg-clip-text bg-gradient-to-r from-saffron-400 to-saffron-500">Veterinary Science</span>
            </h2>
            <p className="text-lg md:text-xl leading-relaxed text-indigo-100 max-w-4xl mx-auto font-light drop-shadow">
              AVD is a professional association of veterinarians, registered as a society under the West Bengal Societies Registration Act, 1961. We are dedicated to advancing the veterinary profession, advocating for member welfare, and supporting the livestock development of the state through scientific advancement and public policy engagement.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 pt-16 w-full max-w-6xl">
            {/* Vision Card */}
            <div className="relative group bg-white/10 backdrop-blur-xl border border-white/15 shadow-xl hover:shadow-[0_8px_40px_rgba(255,153,51,0.25)] hover:bg-white/20 rounded-3xl p-8 overflow-hidden transition-all duration-300 hover:-translate-y-2 ring-1 ring-white/10">
               <div className="absolute -top-4 -right-4 p-4 opacity-[0.03] group-hover:opacity-10 transition-opacity rotate-12 scale-150">
                 <Eye className="w-32 h-32 text-saffron-400" />
               </div>
               <div className="w-14 h-14 bg-gradient-to-br from-saffron-400 to-saffron-600 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg shadow-saffron-500/40 transform group-hover:rotate-12 transition-transform">
                 <Eye className="w-7 h-7" />
               </div>
               <h3 className="text-base font-extrabold text-white uppercase tracking-widest mb-3 drop-shadow-sm">Vision</h3>
               <p className="text-base text-indigo-100 leading-relaxed font-medium">To carry the veterinary profession of West Bengal to the pinnacle of its dignity, strength, and service.</p>
            </div>
            {/* Mission Card */}
            <div className="relative group bg-white/10 backdrop-blur-xl border border-white/15 shadow-xl hover:shadow-[0_8px_40px_rgba(37,99,235,0.25)] hover:bg-white/20 rounded-3xl p-8 overflow-hidden transition-all duration-300 hover:-translate-y-2 ring-1 ring-white/10">
               <div className="absolute -top-4 -right-4 p-4 opacity-[0.03] group-hover:opacity-10 transition-opacity -rotate-12 scale-150">
                 <Compass className="w-32 h-32 text-blue-400" />
               </div>
               <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg shadow-blue-500/40 transform group-hover:-rotate-12 transition-transform">
                 <Compass className="w-7 h-7" />
               </div>
               <h3 className="text-base font-extrabold text-white uppercase tracking-widest mb-3 drop-shadow-sm">Mission</h3>
               <p className="text-base text-indigo-100 leading-relaxed font-medium">Protecting both animal and human well-being through professional discipline, vigilance, and unity.</p>
            </div>
            {/* Objectives Card */}
            <div className="relative group bg-white/10 backdrop-blur-xl border border-white/15 shadow-xl hover:shadow-[0_8px_40px_rgba(16,185,129,0.25)] hover:bg-white/20 rounded-3xl p-8 overflow-hidden transition-all duration-300 hover:-translate-y-2 ring-1 ring-white/10">
               <div className="absolute -top-4 -right-4 p-4 opacity-[0.03] group-hover:opacity-10 transition-opacity rotate-12 scale-150">
                 <Target className="w-32 h-32 text-emerald-400" />
               </div>
               <div className="w-14 h-14 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg shadow-emerald-500/40 transform group-hover:rotate-12 transition-transform">
                 <Target className="w-7 h-7" />
               </div>
               <h3 className="text-base font-extrabold text-white uppercase tracking-widest mb-3 drop-shadow-sm">Objectives</h3>
               <p className="text-base text-indigo-100 leading-relaxed font-medium">Organize the entire profession, protect member welfare, and advance animal health as a public duty.</p>
            </div>
          </div>
          
          <div className="pt-16 pb-4 flex flex-col sm:flex-row gap-6 w-full max-w-3xl mx-auto">
            <div className="flex-1 flex flex-col items-center text-center px-6 py-6 bg-white/5 backdrop-blur-xl rounded-full border border-white/10 shadow-lg">
              <span className="text-4xl font-black text-white mb-1 drop-shadow-md">800<span className="text-saffron-400">+</span></span>
              <span className="text-xs font-bold text-saffron-300 uppercase tracking-widest drop-shadow-sm">Active Members</span>
            </div>
            <div className="flex-1 flex flex-col items-center text-center px-6 py-6 bg-white/5 backdrop-blur-xl rounded-full border border-white/10 shadow-lg">
              <span className="text-4xl font-black text-white mb-1 drop-shadow-md">23</span>
              <span className="text-xs font-bold text-saffron-300 uppercase tracking-widest drop-shadow-sm">District Units</span>
            </div>
          </div>
        </div>
      </section>

      {/* Appointments & Transfers Section */}
      <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 mb-16">
        <AppointmentsSection />
        <OrdersSection />
      </section>
      
      {/* FAQ Section */}
      <section className="bg-slate-50 py-16 px-6 lg:px-12 w-full">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 mb-6 justify-center w-full">
            <span className="w-8 h-[2px] bg-saffron-500"></span>
            <h4 className="text-xs font-bold text-saffron-600 uppercase tracking-widest">Help & Support</h4>
            <span className="w-8 h-[2px] bg-saffron-500"></span>
          </div>
          <h2 className="text-3xl font-bold text-slate-800 tracking-tight mb-8 text-center">Frequently Asked Questions</h2>
          <FaqAccordion />
        </div>
      </section>

      {/* Gallery Section with Lightbox */}
      <section className="bg-slate-50 border-t border-slate-200 py-16 px-6 lg:px-12 shrink-0">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10 flex flex-col items-center text-center gap-3">
             <div className="p-3 bg-saffron-100 rounded-full text-saffron-600 mb-2">
                <ImageIcon className="h-6 w-6" />
             </div>
            <h2 className="text-3xl font-bold text-slate-800 tracking-tight">AVD Moments & Gallery</h2>
            <p className="text-slate-500 max-w-2xl">A glimpse into our state-wide activities, meetings, and veterinary milestones across West Bengal.</p>
          </div>
          <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
            {allPhotos.map((photo, i) => (
              <div 
                key={i} 
                onClick={() => setSelectedImage(photo)}
                className="break-inside-avoid relative group overflow-hidden rounded-xl shadow-sm border border-slate-200 cursor-pointer bg-white"
              >
                <img 
                  src={photo} 
                  alt={`AVD Event preview ${i + 1}`} 
                  loading="lazy"
                  className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                   <span className="bg-white/95 text-slate-900 px-5 py-2.5 rounded-full text-xs font-bold tracking-wide shadow-xl backdrop-blur-md transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      View Photo
                   </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-slate-950/90 backdrop-blur-md flex justify-center items-center p-4 sm:p-8 cursor-zoom-out"
            onClick={() => setSelectedImage(null)}
          >
            <button 
              className="absolute top-6 right-6 text-white/50 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-2.5 transition-colors focus:outline-none"
              onClick={(e) => { e.stopPropagation(); setSelectedImage(null); }}
            >
              <X className="w-6 h-6" />
            </button>
            <motion.img 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              src={selectedImage} 
              alt="Expanded view"
              className="max-w-full max-h-[90vh] rounded-xl shadow-2xl ring-1 ring-white/20 cursor-default object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
