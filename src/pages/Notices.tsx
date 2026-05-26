import { noticesData } from "../data/notices";

export function Notices() {
  const notices = noticesData;

  return (
    <div className="py-24 sm:py-32 bg-slate-50 min-h-screen">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl mb-6">Notices & Updates</h1>
        <p className="text-lg leading-8 text-slate-600 max-w-2xl mx-auto mb-12">
          Stay informed with the latest announcements, circulars, and events from the Association.
        </p>
        <div className="max-w-3xl mx-auto text-left space-y-4">
          {notices.map((notice) => (
            <div key={notice.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4 mb-2 text-sm text-slate-500">
                <time>{notice.date}</time>
                <span className="bg-saffron-100 text-saffron-700 px-2.5 py-0.5 rounded-full font-bold text-[10px] tracking-wider uppercase">{notice.type}</span>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">{notice.title}</h3>
              <p className="text-slate-600 text-sm mb-4 leading-relaxed">{notice.description}</p>
              {notice.link !== "#" && (
                <a href={notice.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-sm font-semibold text-saffron-600 hover:text-saffron-500">
                  Download / View <span aria-hidden="true" className="ml-1">&rarr;</span>
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
