import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { AlertCircle } from "lucide-react";

interface TransferOrder {
  title: string;
  link: string;
  date: string;
}

export function AppointmentsMarquee() {
  const [items, setItems] = useState<TransferOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        let transfersData: TransferOrder[] = [];
        let ordersData: TransferOrder[] = [];

        // Fetch Transfers
        try {
          const resTProxy = await fetch("/api/transfers");
          const dataT = await resTProxy.json();
          if (dataT.success && dataT.data) {
            transfersData = dataT.data.map((o: any) => ({
              title: o.title,
              link: o.link,
              date: o.date,
              timestamp: new Date(o.order_date || o.date).getTime()
            }));
          }
        } catch (inner) { console.error("Transfers fetch error", inner); }

        // Fetch Orders
        try {
          const resOProxy = await fetch("/api/orders");
          const dataO = await resOProxy.json();
          if (dataO.success && dataO.data) {
            ordersData = dataO.data.map((o: any) => ({
              title: o.title,
              link: o.link,
              date: o.date,
              timestamp: new Date(o.order_date || o.date).getTime()
            }));
          }
        } catch (inner) { console.error("Orders fetch error", inner); }

        const combined = [...transfersData, ...ordersData].sort((a: any, b: any) => b.timestamp - a.timestamp);
        setItems(combined.slice(0, 6));

      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="w-full bg-slate-900 py-2 border-y border-slate-800 text-slate-400 text-xs px-4">
        Syncing live data...
      </div>
    );
  }

  if (items.length === 0) {
     return (
      <div className="w-full bg-slate-900 py-2 border-y border-slate-800 text-slate-400 text-xs px-4 flex items-center justify-center gap-2">
        <AlertCircle className="w-4 h-4 text-saffron-500" />
        No recent orders, appointments or transfers found at this time.
      </div>
     )
  }

  return (
    <div className="w-full bg-slate-900 overflow-hidden relative border-y border-slate-800 flex items-center h-10">
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-slate-900 to-transparent z-10 pointer-events-none"></div>
      <div className="bg-saffron-600 text-white font-bold text-[10px] uppercase tracking-wider px-4 py-3 h-full flex items-center absolute left-0 z-20 shrink-0">
        Latest Orders
      </div>
      
      <div className="flex w-full ml-32 relative">
        <motion.div
          className="flex whitespace-nowrap gap-12 text-sm text-slate-300"
          animate={{ x: [0, -2000] }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 40,
              ease: "linear",
            },
          }}
        >
          {items.map((order, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-saffron-500"></span>
              <a 
                href={order.link}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
                title="Download Document"
              >
                {order.title} <span className="text-slate-500 ml-2">({order.date})</span>
              </a>
            </div>
          ))}
          {/* Duplicate for infinite seamless scroll */}
          {items.map((order, i) => (
            <div key={`dup-${i}`} className="flex items-center gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-saffron-500"></span>
              <a 
                href={order.link}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
                title="Download Document"
              >
                {order.title} <span className="text-slate-500 ml-2">({order.date})</span>
              </a>
            </div>
          ))}
        </motion.div>
      </div>
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-slate-900 to-transparent z-10 pointer-events-none"></div>
    </div>
  );
}
