import { Building2, Mail, Globe } from "lucide-react";

export function Contact() {
  return (
    <div className="py-24 sm:py-32 bg-slate-50">
      <div className="mx-auto max-w-4xl px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl text-center mb-6">Contact Us</h1>
        <p className="text-lg leading-8 text-gray-600 mx-auto text-center mb-16">
          Have questions or need assistance? Reach out to our central office or find your district representative.
        </p>
        
        <div className="flex flex-col gap-12">
          {/* Section 1: Head Office */}
          <section className="bg-white p-8 md:p-10 rounded-3xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-saffron-100 text-saffron-600 rounded-xl">
                <Building2 className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-semibold text-slate-900">Head Office</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-slate-600">
              <div className="bg-slate-50 p-6 rounded-2xl">
                <div className="font-semibold text-slate-900 mb-2 flex items-center gap-2">Address</div>
                <p>
                  F-1, Tribeni Complex,<br />
                  36A Sahitya Parishad Street,<br />
                  Kolkata - 700006
                </p>
              </div>
              
              <div className="bg-slate-50 p-6 rounded-2xl">
                <div className="font-semibold text-slate-900 mb-2 flex items-center gap-2"><Mail className="w-4 h-4 text-slate-400" /> Email</div>
                <p>
                  <a href="mailto:contact@avdwb.com" className="text-blue-600 hover:text-blue-700 hover:underline">contact@avdwb.com</a>
                </p>
              </div>
              
              <div className="bg-slate-50 p-6 rounded-2xl">
                <div className="font-semibold text-slate-900 mb-2 flex items-center gap-2"><Globe className="w-4 h-4 text-slate-400" /> Website</div>
                <p>
                  <a href="https://www.avdwb.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 hover:underline">www.avdwb.com</a>
                </p>
              </div>
            </div>
          </section>

          {/* Section 2: Contact Form */}
          <section className="bg-white p-0 md:p-4 rounded-3xl border border-slate-200 shadow-sm flex justify-center overflow-hidden">
            <iframe 
              src="https://docs.google.com/forms/d/e/1FAIpQLSe1v4oku2-RFLYtuBfiyDLqvzOZV2GR2t7WU35KYFl5dkvDDw/viewform?embedded=true" 
              width="100%" 
              height="934" 
              frameBorder={0} 
              marginHeight={0} 
              marginWidth={0}
              className="max-w-full"
            >
              Loading…
            </iframe>
          </section>
        </div>
      </div>
    </div>
  );
}
