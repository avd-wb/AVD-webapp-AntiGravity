export function Membership() {
  return (
    <div className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl text-center mb-8">Membership</h1>
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-lg leading-8 text-gray-600 mb-8">
            Join the prominent network of veterinary professionals in West Bengal. 
            We offer various membership tiers for serving officers, retired members, and students.
          </p>
          <div className="bg-white rounded-2xl border border-gray-200 p-10 shadow-sm">
            <h3 className="text-xl font-semibold mb-4 text-gray-900">Apply for Membership</h3>
            <p className="text-gray-500 mb-6">Online registration will be available shortly. For now, please contact your district representative or the head office.</p>
            <a 
              href="https://drive.google.com/file/d/1HasUvMwGKvn1KYCAiAmHDVKJw-KW5-ND/view?usp=sharing" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-flex justify-center bg-gradient-to-r from-saffron-500 to-saffron-600 text-white rounded-lg px-6 py-3 font-bold hover:from-saffron-400 hover:to-saffron-500 shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 w-full sm:w-auto text-center"
            >
              Download Application Form
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
