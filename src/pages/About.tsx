import { Users, ShieldCheck, HeartPulse, BookOpen, GraduationCap, Globe2, Mic, Quote } from "lucide-react";

export function About() {
  return (
    <div className="py-24 sm:py-32 bg-slate-50 min-h-screen">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <h1 className="text-4xl font-black tracking-tight text-slate-900 sm:text-5xl text-center mb-6 drop-shadow-sm">About AVD</h1>
        <p className="text-xl text-slate-600 text-center max-w-3xl mx-auto mb-16">
          The Association of Veterinary Doctors (AVD) is a dedicated professional body representing veterinarians across West Bengal.
        </p>

        <div className="space-y-16">
          {/* History Section */}
          <div className="bg-white p-8 sm:p-12 rounded-3xl shadow-sm border border-slate-200">
            <h2 className="text-3xl font-bold text-slate-800 mb-6 flex items-center gap-3">
              <span className="w-10 h-1 bg-slate-300 rounded-full inline-block"></span>
              OUR HISTORY
            </h2>
            <div className="prose prose-lg prose-slate max-w-none text-slate-700 leading-relaxed">
              <p>
                Founded under the <strong>West Bengal Societies Registration Act, 1961 (Reg. No. 34784)</strong>, the Association of Veterinary Doctors (AVD) emerged from a collective realization that strength comes only through unity and organization. 
              </p>
              <p>
                Over the years, our organization has strived to uphold the dignity and honor of the veterinary profession, safeguard the rights of its members, and promote the advancement of veterinary science and animal husbandry in the state. From its early origins as a small collective of visionaries, AVD has grown into the single, credible voice of the veterinary profession in West Bengal, standing firm in its commitment to the welfare of animals and those who dedicate their lives to healing them.
              </p>
            </div>
          </div>

          <div className="prose prose-lg prose-slate mx-auto max-w-none bg-white p-8 sm:p-12 rounded-3xl shadow-sm border border-slate-200">
            <div className="space-y-16">
              <section>
                <h2 className="text-3xl font-bold text-saffron-600 mb-6 flex items-center gap-3">
                  <span className="w-10 h-1 bg-saffron-500 rounded-full inline-block"></span>
                  VISION
                </h2>
                <div className="space-y-4 text-slate-700 leading-relaxed pl-4 sm:pl-12 border-l-4 border-saffron-100">
                  <p>
                    To carry the veterinary profession of West Bengal to the pinnacle of its dignity, strength, and service, so that no power can cast an evil eye on the welfare of its animals or the standing of its doctors.
                  </p>
                  <p>
                    A West Bengal where every animal, owned or stray, productive or companion, receives competent and compassionate care; where every veterinarian stands as a respected guardian of public health, food security, and animal welfare; and where the profession functions not as scattered individuals but as one organized, self-confident body.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-3xl font-bold text-blue-600 mb-6 flex items-center gap-3">
                  <span className="w-10 h-1 bg-blue-500 rounded-full inline-block"></span>
                  MISSION
                </h2>
                <div className="space-y-4 text-slate-700 leading-relaxed pl-4 sm:pl-12 border-l-4 border-blue-100">
                  <p>
                    The well-being of animals and the well-being of the people who depend on them are one single life-breath. They cannot be separated. AVD exists to protect both.
                  </p>
                  <p>
                    Strength comes only through organization. It is therefore the duty of every veterinarian in West Bengal to consolidate the profession into one disciplined, vigilant, and united body. A scattered profession is exploited; an organized profession sets the terms of its own respect.
                  </p>
                  <p>
                    AVD is not a sectoral or reactive body. It is a power-house meant to energize every field of veterinary endeavour in the state, government service, private practice, academia, livestock development, and public health, so that the profession reaches its full potential and the society it serves prospers with it.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-3xl font-bold text-emerald-600 mb-6 flex items-center gap-3">
                  <span className="w-10 h-1 bg-emerald-500 rounded-full inline-block"></span>
                  OBJECTIVES
                </h2>
                <p className="text-slate-600 mb-6 italic pl-4 sm:pl-12">The objectives flow from the mission. Each one builds the same body.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pl-4 sm:pl-12 mt-8">
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center font-bold text-xl mb-4"><Users className="w-6 h-6" /></div>
                    <strong className="text-slate-900 block text-lg mb-2">Organize the entire profession</strong>
                    <p className="text-slate-600 text-sm leading-relaxed">Bring every veterinarian in West Bengal, government, private, academic, and retired, onto one common platform of fraternity, shared identity, and coordinated action.</p>
                  </div>
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center font-bold text-xl mb-4"><ShieldCheck className="w-6 h-6" /></div>
                    <strong className="text-slate-900 block text-lg mb-2">Protect dignity and welfare</strong>
                    <p className="text-slate-600 text-sm leading-relaxed">Defend the professional standing, service conditions, legal protection, and economic security of the veterinary doctor, so the profession remains attractive to the finest minds.</p>
                  </div>
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center font-bold text-xl mb-4"><HeartPulse className="w-6 h-6" /></div>
                    <strong className="text-slate-900 block text-lg mb-2">Advance animal health</strong>
                    <p className="text-slate-600 text-sm leading-relaxed">Treat the care of every animal, companion, livestock, and stray, as a service owed to society, not a transaction. Promote the right to a dignified life and a dignified death for animals.</p>
                  </div>
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center font-bold text-xl mb-4"><BookOpen className="w-6 h-6" /></div>
                    <strong className="text-slate-900 block text-lg mb-2">Strengthen foundations</strong>
                    <p className="text-slate-600 text-sm leading-relaxed">Foster continuing education, ethical practice, modern skills, and discipline, so each member is equipped for the challenges of the present day.</p>
                  </div>
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 hover:shadow-md transition-shadow">
                     <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center font-bold text-xl mb-4"><GraduationCap className="w-6 h-6" /></div>
                     <strong className="text-slate-900 block text-lg mb-2">Mould the next generation</strong>
                     <p className="text-slate-600 text-sm leading-relaxed">Instill in veterinary students and young doctors a sense of pride in the profession's heritage, scientific rigour, and intense commitment to animal and public welfare.</p>
                  </div>
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 hover:shadow-md transition-shadow">
                     <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center font-bold text-xl mb-4"><Globe2 className="w-6 h-6" /></div>
                     <strong className="text-slate-900 block text-lg mb-2">Serve the people</strong>
                     <p className="text-slate-600 text-sm leading-relaxed">Recognize that protecting livestock, food safety, and zoonotic disease control directly protects the rural economy and the health of every household in West Bengal.</p>
                  </div>
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 hover:shadow-md transition-shadow md:col-span-2 text-center flex flex-col items-center">
                     <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center font-bold text-xl mb-4"><Mic className="w-6 h-6" /></div>
                     <strong className="text-slate-900 block text-lg mb-2">Speak as one voice</strong>
                     <p className="text-slate-600 text-sm leading-relaxed max-w-2xl">Be the single, credible, non-political voice of the veterinary profession before government, public, and society, on every matter affecting animals and those who heal them.</p>
                  </div>
                </div>
              </section>
            </div>
          </div>

          {/* Governing Body Section */}
          <div className="py-12">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">Our Governing Body</h2>
              <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
                Meet the dedicated leaders guiding the association towards a united and empowered veterinary profession in West Bengal.
              </p>
            </div>
            
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center shadow-sm">
              <div className="w-16 h-16 bg-saffron-100 text-saffron-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">Coming Soon</h3>
              <p className="text-slate-600 max-w-lg mx-auto leading-relaxed">
                We are currently updating our governing body member profiles. Please check back soon for more information about the dedicated leadership team guiding the association.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
