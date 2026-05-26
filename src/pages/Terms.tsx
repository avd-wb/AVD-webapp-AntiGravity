export function Terms() {
  return (
    <div className="py-24 sm:py-32 bg-slate-50 min-h-[70vh]">
      <div className="mx-auto max-w-3xl px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl mb-8">Terms of Service</h1>
        
        <div className="prose prose-slate prose-a:text-saffron-600 hover:prose-a:text-saffron-500 max-w-none bg-white p-8 sm:p-12 rounded-2xl shadow-sm border border-slate-200">
          <p className="text-sm text-slate-500 mb-8">Last updated: {new Date().toLocaleDateString()}</p>
          
          <h2 className="text-xl font-semibold text-slate-800 mt-8 mb-4">1. Agreement to Terms</h2>
          <p className="text-slate-600 mb-6 leading-relaxed">
            These Terms of Service constitute a legally binding agreement made between you, whether personally or on behalf of an entity ("you") and the Association of Veterinary Doctors ("AVD", "we", "us", or "our"), concerning your access to and use of our website as well as any other media form, media channel, mobile website or mobile application related, linked, or otherwise connected thereto.
          </p>

          <h2 className="text-xl font-semibold text-slate-800 mt-8 mb-4">2. Intellectual Property Rights</h2>
          <p className="text-slate-600 mb-6 leading-relaxed">
            Unless otherwise indicated, the Site is our proprietary property and all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics on the Site (collectively, the "Content") and the trademarks, service marks, and logos contained therein (the "Marks") are owned or controlled by us or licensed to us, and are protected by copyright and trademark laws and various other intellectual property rights and unfair competition laws.
          </p>

          <h2 className="text-xl font-semibold text-slate-800 mt-8 mb-4">3. User Representations</h2>
          <p className="text-slate-600 mb-6 leading-relaxed">
            By using the Site, you represent and warrant that:
          </p>
          <ul className="list-disc pl-6 text-slate-600 mb-6 space-y-2">
            <li>All registration information you submit will be true, accurate, current, and complete.</li>
            <li>You will maintain the accuracy of such information and promptly update such registration information as necessary.</li>
            <li>You have the legal capacity and you agree to comply with these Terms of Service.</li>
            <li>You will not access the Site through automated or non-human means, whether through a bot, script or otherwise.</li>
            <li>You will not use the Site for any illegal or unauthorized purpose.</li>
          </ul>

          <h2 className="text-xl font-semibold text-slate-800 mt-8 mb-4">4. Membership</h2>
          <p className="text-slate-600 mb-6 leading-relaxed">
            If you apply to become a member of AVD, additional terms and conditions, including our constitution and bylaws, will apply to your membership. Membership is subject to approval per our official criteria.
          </p>

          <h2 className="text-xl font-semibold text-slate-800 mt-8 mb-4">5. Governing Law</h2>
          <p className="text-slate-600 mb-6 leading-relaxed">
            These Terms shall be governed by and defined following the laws of India. AVD West Bengal and yourself irrevocably consent that the courts of West Bengal shall have exclusive jurisdiction to resolve any dispute which may arise in connection with these terms.
          </p>
        </div>
      </div>
    </div>
  );
}
