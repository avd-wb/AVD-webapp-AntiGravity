export function Privacy() {
  return (
    <div className="py-24 sm:py-32 bg-slate-50 min-h-[70vh]">
      <div className="mx-auto max-w-3xl px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl mb-8">Privacy Policy</h1>
        
        <div className="prose prose-slate prose-a:text-saffron-600 hover:prose-a:text-saffron-500 max-w-none bg-white p-8 sm:p-12 rounded-2xl shadow-sm border border-slate-200">
          <p className="text-sm text-slate-500 mb-8">Last updated: {new Date().toLocaleDateString()}</p>
          
          <h2 className="text-xl font-semibold text-slate-800 mt-8 mb-4">1. Introduction</h2>
          <p className="text-slate-600 mb-6 leading-relaxed">
            The Association of Veterinary Doctors ("AVD", "we", "our", or "us") respects your privacy and is committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website (regardless of where you visit it from) and tell you about your privacy rights and how the law protects you.
          </p>

          <h2 className="text-xl font-semibold text-slate-800 mt-8 mb-4">2. The Data We Collect About You</h2>
          <p className="text-slate-600 mb-6 leading-relaxed">
            Personal data, or personal information, means any information about an individual from which that person can be identified.
            We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:
          </p>
          <ul className="list-disc pl-6 text-slate-600 mb-6 space-y-2">
            <li><strong>Identity Data</strong> includes first name, maiden name, last name, username or similar identifier, marital status, title, date of birth and gender.</li>
            <li><strong>Contact Data</strong> includes billing address, delivery address, email address and telephone numbers.</li>
            <li><strong>Professional Data</strong> includes your West Bengal Veterinary Council registration details, qualifications, and employment history.</li>
          </ul>

          <h2 className="text-xl font-semibold text-slate-800 mt-8 mb-4">3. How We Use Your Personal Data</h2>
          <p className="text-slate-600 mb-6 leading-relaxed">
            We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
          </p>
          <ul className="list-disc pl-6 text-slate-600 mb-6 space-y-2">
            <li>Where we need to perform the contract we are about to enter into or have entered into with you (e.g., managing your membership).</li>
            <li>Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.</li>
            <li>Where we need to comply with a legal or regulatory obligation.</li>
          </ul>

          <h2 className="text-xl font-semibold text-slate-800 mt-8 mb-4">4. Data Security</h2>
          <p className="text-slate-600 mb-6 leading-relaxed">
            We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorised way, altered or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors and other third parties who have a business need to know.
          </p>

          <h2 className="text-xl font-semibold text-slate-800 mt-8 mb-4">5. Contact Us</h2>
          <p className="text-slate-600 mb-6 leading-relaxed">
            If you have any questions about this privacy policy, including any requests to exercise your legal rights, please contact us using the details set out on our <a href="/contact" className="font-medium underline underline-offset-2">Contact</a> page.
          </p>
        </div>
      </div>
    </div>
  );
}
