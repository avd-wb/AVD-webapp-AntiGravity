import { useEffect, useState } from "react";
import { Download, AlertCircle, FileText, ArrowRight } from "lucide-react";

interface Order {
  title: string;
  link: string;
  date: string;
}

export function OrdersSection() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const response = await fetch("https://ard.wb.gov.in/api/v1/orders");
        if (!response.ok) throw new Error("Network response was not ok");
        const apiData = await response.json();
        if (apiData && Array.isArray(apiData)) {
          const formattedOrders = apiData.map((item: any) => ({
            title: item.title_english,
            link: item.file_path ? `https://ard.wb.gov.in/${item.file_path}` : 'https://ard.wb.gov.in',
            date: new Date(item.created).toLocaleDateString()
          }));
          setOrders(formattedOrders.slice(0, 4));
        }
      } catch (error) {
        console.error("Failed to fetch directly, falling back to proxy", error);
        try {
          const response = await fetch("/api/orders");
          const data = await response.json();
          if (data.success && data.data) {
            setOrders(data.data.slice(0, 4));
          }
        } catch (innerError) {
          console.error("Both direct fetch and proxy failed", innerError);
        }
      } finally {
        setLoading(false);
      }
    }
    
    fetchOrders();
  }, []);

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8 sm:p-12 w-full shadow-sm mt-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
            <span className="text-blue-600 font-bold text-xs tracking-widest uppercase">Live Sync</span>
          </div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Govt. Orders, Circulars & Notification</h2>
          <p className="text-slate-500 mt-2">Latest orders fetched directly from the ARD Portal.</p>
        </div>
        <a 
          href="https://ard.wb.gov.in/order-notifications" 
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm font-bold text-slate-700 hover:text-blue-600 transition-colors"
        >
          View all on ARD Portal <ArrowRight className="w-4 h-4" />
        </a>
      </div>

      {loading ? (
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-20 bg-slate-200 rounded-xl w-full"></div>
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-8 flex flex-col items-center justify-center text-center">
          <AlertCircle className="w-10 h-10 text-slate-300 mb-4" />
          <h3 className="text-lg font-bold text-slate-700 mb-2">No Records Found</h3>
          <p className="text-slate-500 max-w-sm text-sm">
            There are currently no recent orders to display. Please check the ARD portal for historical records.
          </p>
          <a 
            href="https://ard.wb.gov.in/order-notifications"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 bg-slate-900 text-white px-6 py-2.5 rounded-lg font-medium text-sm hover:bg-slate-800 transition-colors"
          >
            Open ARD Portal
          </a>
        </div>
      ) : (
        <div className="grid gap-4">
          {orders.map((order, i) => (
            <div key={i} className="bg-white group border border-slate-200 hover:border-blue-300 rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all shadow-sm hover:shadow-md">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100 group-hover:bg-blue-50 transition-colors">
                  <FileText className="w-5 h-5 text-slate-400 group-hover:text-blue-600 transition-colors" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm mb-1 leading-snug break-words pr-4 line-clamp-2">{order.title}</h4>
                  <div className="text-xs font-medium text-slate-500">
                    Received on {order.date}
                  </div>
                </div>
              </div>
              <a 
                href={order.link}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 flex items-center justify-center gap-2 bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white px-5 py-2.5 rounded-lg font-bold text-sm transition-colors border border-blue-100 min-w-[140px]"
              >
                <Download className="w-4 h-4" /> Download PDF
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
