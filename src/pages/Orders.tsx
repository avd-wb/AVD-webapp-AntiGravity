import { useState, useMemo, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { motion, AnimatePresence } from "motion/react";
import { 
  Search, Download, Clock, Calendar, Shield, Briefcase, 
  ChevronDown, ArrowUpDown, SlidersHorizontal, AlertCircle, 
  Award, FileText, Sparkles, HelpCircle, Layers
} from "lucide-react";
import ordersData from "../data/orders_master_index.json";

interface Order {
  id: string;
  title: string;
  order_type: string;
  category: string;
  in_scope: string;
  is_service_order: string;
  order_date: string;
  mimeType: string;
  fileExtension: string;
  fileSize: string;
  full_path: string;
  parent_folder_title: string;
  viewUrl: string;
}

export function Orders() {
  const allOrders = ordersData as Order[];

  // Basic States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [selectedRole, setSelectedRole] = useState("ALL");
  const [sortBy, setSortBy] = useState("date-desc");
  const [aiEnabled, setAiEnabled] = useState(false);
  const [visibleCount, setVisibleCount] = useState(30);

  // Intent keyword expander dictionary for AI Search
  const AI_INTENTS: Record<string, string[]> = {
    "scale": ["mcas", "benefit", "career", "advancement", "promotion", "scale", "8-year", "16-year", "pay", "m.c.a.s", "increment"],
    "mcas": ["mcas", "benefit", "career", "advancement", "scale", "8-year", "16-year", "pay", "m.c.a.s", "increment"],
    "transfer": ["transfer", "posting", "joining", "time", "policy", "rotational", "station", "mutual"],
    "posting": ["transfer", "posting", "joining", "time", "policy", "rotational", "station", "mutual"],
    "election": ["election", "duty", "exempt", "requisition", "court", "order", "nomination"],
    "recruitment": ["recruit", "rule", "psc", "appointment", "vacancy", "examination", "syllabus"],
    "psc": ["recruit", "rule", "psc", "appointment", "vacancy", "examination", "syllabus"],
    "bldo": ["bldo", "block", "office", "setup", "establishment", "livestock", "b.l.d.o"],
    "vo": ["vo", "veterinary officer", "bahc", "sahc", "vety", "v.o"],
    "pharmacist": ["pharmacist", "compounder", "redesignation", "vety pharmacist"],
    "restructure": ["cadre", "restructur", "service", "division", "elevation", "reorganisation"],
    "pension": ["pension", "gratuity", "retirement", "retire", "superannuation", "dues"],
    "leave": ["leave", "earned", "maternity", "casual", "medical", "commuted"]
  };

  // Categories list extracted dynamically + standard filters
  const categories = useMemo(() => {
    const set = new Set<string>();
    allOrders.forEach(o => {
      if (o.order_type) set.add(o.order_type);
    });
    return ["ALL", ...Array.from(set).filter(Boolean).sort()];
  }, [allOrders]);

  // Roles list
  const roles = [
    { id: "ALL", name: "All Officer Ranks" },
    { id: "VO", name: "VO (Veterinary Officer)", desc: "SAHC, BAHC & Block Level Officers" },
    { id: "BLDO", name: "BLDO (Block Livestock Development Officer)", desc: "Administrative Block level" },
    { id: "AD", name: "AD (Assistant Director)", desc: "District & Directorate Wings" },
    { id: "DDARD", name: "DDARD (Deputy Director)", desc: "Deputy Directors of ARD" },
    { id: "Joint Director", name: "Joint Director", desc: "Joint Directors of ARD" },
    { id: "Additional Director", name: "Additional Director", desc: "Addl. Directors" },
    { id: "Director", name: "Director", desc: "Headquarters & Directorate Chiefs" }
  ];

  // Helper matching role
  const matchesRole = (title: string, orderType: string, role: string) => {
    if (role === "ALL") return true;
    const text = `${title} ${orderType}`.toLowerCase();
    
    if (role === "VO") {
      return text.includes("vo") || text.includes("veterinary officer") || text.includes("vety. officer") || 
             text.includes("bahc") || text.includes("sahc") || text.includes("transfer") || 
             text.includes("mcas") || text.includes("service") || text.includes("v.o");
    }
    if (role === "BLDO") {
      return text.includes("bldo") || text.includes("block livestock") || text.includes("block") || 
             text.includes("transfer") || text.includes("mcas") || text.includes("b.l.d.o");
    }
    if (role === "AD") {
      return text.includes("assistant director") || text.includes("asst. director") || 
             text.includes("ad ") || text.includes(" ad") || text.includes("recruitment") || 
             text.includes("promotion") || text.includes("a.d");
    }
    if (role === "DDARD") {
      return text.includes("deputy director") || text.includes("ddard") || text.includes(" dd") || 
             text.includes("promotion") || text.includes("delegation") || text.includes("d.d.a.r.d");
    }
    if (role === "Joint Director") {
      return text.includes("joint director") || text.includes("jt. director") || text.includes("jd") || 
             text.includes("promotion") || text.includes("j.d");
    }
    if (role === "Additional Director") {
      return text.includes("additional director") || text.includes("addl. director") || 
             text.includes("promotion") || text.includes("addl");
    }
    if (role === "Director") {
      return text.includes("director") || text.includes("directorate") || text.includes("headquarter") || 
             text.includes("hq");
    }
    return true;
  };

  // Perform filtration & AI Intent Scoring
  const filteredOrders = useMemo(() => {
    let result = [...allOrders];

    // 1. Filter by category
    if (selectedCategory !== "ALL") {
      result = result.filter(o => o.order_type === selectedCategory);
    }

    // 2. Filter by Officer Role
    if (selectedRole !== "ALL") {
      result = result.filter(o => matchesRole(o.title, o.order_type, selectedRole));
    }

    // 3. Search text / AI intent query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      
      if (aiEnabled) {
        // AI Intent Scoring mode
        // Expand query to include synonyms / related terms
        let expandedTerms = [query];
        Object.keys(AI_INTENTS).forEach(key => {
          if (query.includes(key)) {
            expandedTerms = [...expandedTerms, ...AI_INTENTS[key]];
          }
        });

        // Compute scores
        const scored = result.map(o => {
          let score = 0;
          const title = o.title.toLowerCase();
          const category = (o.order_type || "").toLowerCase();
          
          expandedTerms.forEach((term, idx) => {
            // First term (original query) gets higher weight
            const weight = idx === 0 ? 10 : 3;
            if (title.includes(term)) score += weight;
            if (category.includes(term)) score += weight / 2;
          });

          return { order: o, score };
        });

        // Filter and sort by score
        result = scored
          .filter(s => s.score > 0)
          .sort((a, b) => b.score - a.score)
          .map(s => s.order);
      } else {
        // Standard text search
        result = result.filter(o => 
          o.title.toLowerCase().includes(query) || 
          (o.order_type || "").toLowerCase().includes(query) ||
          (o.order_date || "").includes(query)
        );
      }
    }

    // 4. Sort (If not AI Intent Search, which has its own relevance sorting)
    if (!searchQuery.trim() || !aiEnabled) {
      result.sort((a, b) => {
        if (sortBy === "date-desc") {
          return new Date(b.order_date || 0).getTime() - new Date(a.order_date || 0).getTime();
        }
        if (sortBy === "date-asc") {
          return new Date(a.order_date || 0).getTime() - new Date(b.order_date || 0).getTime();
        }
        if (sortBy === "title-asc") {
          return a.title.localeCompare(b.title);
        }
        if (sortBy === "title-desc") {
          return b.title.localeCompare(a.title);
        }
        return 0;
      });
    }

    return result;
  }, [allOrders, selectedCategory, selectedRole, searchQuery, sortBy, aiEnabled]);

  // Reset pagination when filter changes
  useEffect(() => {
    setVisibleCount(30);
  }, [selectedCategory, selectedRole, searchQuery, sortBy, aiEnabled]);

  // Badge background class mapping
  const getBadgeClass = (type: string) => {
    const t = (type || "").toLowerCase();
    if (t.includes("transfer")) return "bg-indigo-50 text-indigo-700 ring-1 ring-indigo-600/10";
    if (t.includes("confirmation")) return "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/10";
    if (t.includes("appointment") || t.includes("recruit")) return "bg-teal-50 text-teal-700 ring-1 ring-teal-600/10";
    if (t.includes("cadre") || t.includes("restructur")) return "bg-amber-50 text-amber-700 ring-1 ring-amber-600/10";
    if (t.includes("general")) return "bg-sky-50 text-sky-700 ring-1 ring-sky-600/10";
    if (t.includes("notification")) return "bg-rose-50 text-rose-700 ring-1 ring-rose-600/10";
    if (t.includes("memo")) return "bg-slate-50 text-slate-700 ring-1 ring-slate-600/10";
    return "bg-slate-50 text-slate-600 ring-1 ring-slate-600/10";
  };

  const getFileSizeStr = (bytesStr: string) => {
    const bytes = parseInt(bytesStr, 10);
    if (isNaN(bytes) || bytes === 0) return "N/A";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  return (
    <div className="py-20 sm:py-28 bg-slate-50 min-h-screen">
      <Helmet>
        <title>Official Orders & Circulars Catalog | AVD West Bengal</title>
        <meta name="description" content="Access and search the comprehensive catalog of 1,325+ official circulars, notifications, and cadre orders of the Association of Veterinary Doctors West Bengal." />
      </Helmet>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col gap-10">
        
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="bg-saffron-50 text-saffron-800 ring-1 ring-saffron-200/50 py-1.5 px-3 rounded-xl font-bold text-xs uppercase tracking-widest inline-flex items-center gap-1.5 shadow-sm">
            <Layers className="w-3.5 h-3.5" /> Departmental Archives
          </span>
          <h1 className="text-3xl font-black tracking-tight text-slate-800 sm:text-5xl">
            Orders & Notifications
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-medium">
            A centralized digital database hosting over <strong>1,320+</strong> official government orders, circulars, notifications, recruitment rules, and promotional guidelines affecting animal resource development officers in West Bengal.
          </p>
        </div>

        {/* Search, Filter & Role Controls Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-md flex flex-col gap-6 relative overflow-hidden">
          
          {/* Saffron accent gradient bar */}
          <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-saffron-500 via-saffron-600 to-indigo-600"></div>
          
          {/* Main Search Panel */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="w-full relative flex-1">
              <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
              <input 
                type="text"
                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-saffron-500/20 focus:border-saffron-500 text-xs sm:text-sm font-semibold text-slate-700 transition-all shadow-inner"
                placeholder={aiEnabled ? "Describe the intent (e.g. '8 year benefits scaling criteria', 'rules for pension status')..." : "Search title, memo number, date..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-3.5 text-xs text-slate-400 hover:text-slate-600 font-bold"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="flex gap-3 w-full md:w-auto shrink-0">
              {/* AI toggle button */}
              <button 
                type="button"
                onClick={() => setAiEnabled(!aiEnabled)}
                className={`flex-1 md:flex-none flex items-center justify-center gap-2 py-3.5 px-5 rounded-2xl text-xs font-bold border transition-all active:scale-[0.98] ${
                  aiEnabled 
                    ? "bg-slate-900 border-slate-900 text-white shadow-md" 
                    : "bg-white hover:bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300"
                }`}
              >
                <Sparkles className={`w-4 h-4 ${aiEnabled ? "text-saffron-400 animate-pulse" : "text-slate-400"}`} />
                <span>AI Search {aiEnabled ? "On" : "Off"}</span>
              </button>

              {/* Sort selector */}
              <div className="relative flex-1 md:flex-none select-none">
                <select 
                  className="w-full bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 py-3.5 pl-4 pr-10 rounded-2xl text-xs font-bold text-slate-600 focus:outline-none cursor-pointer appearance-none transition-all shadow-sm"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  disabled={aiEnabled && searchQuery.trim() !== ""}
                >
                  <option value="date-desc">Newest First</option>
                  <option value="date-asc">Oldest First</option>
                  <option value="title-asc">Title: A-Z</option>
                  <option value="title-desc">Title: Z-A</option>
                </select>
                <ArrowUpDown className="absolute right-4 top-4.5 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* AI Banner */}
          <AnimatePresence>
            {aiEnabled && searchQuery.trim() && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="bg-indigo-50/50 border border-indigo-100 rounded-2xl p-4 flex items-start gap-3 text-indigo-900 leading-normal"
              >
                <Sparkles className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5 animate-spin-slow" />
                <div className="text-[11px] sm:text-xs">
                  <span className="font-bold text-indigo-900">AI Intent Search Enabled:</span> Query expanded using departmental context. Sorting results by relevance scores based on synonyms and procedural overlaps (e.g. mapping "scale" to MCAS guidelines).
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Officer Role Filter */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Filter by Officer Rank / Designation</label>
              {selectedRole !== "ALL" && (
                <button 
                  onClick={() => setSelectedRole("ALL")} 
                  className="text-[10.5px] font-extrabold text-saffron-600 hover:text-saffron-700"
                >
                  Clear Role Filter
                </button>
              )}
            </div>
            {/* Horizontal scrollable ranks grid */}
            <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-thin">
              {roles.map(role => (
                <button
                  key={role.id}
                  onClick={() => setSelectedRole(role.id)}
                  className={`py-2 px-4 rounded-xl text-xs font-bold whitespace-nowrap border shrink-0 transition-all ${
                    selectedRole === role.id 
                      ? "bg-saffron-600 border-saffron-600 text-white shadow-md shadow-saffron-500/20" 
                      : "bg-white hover:bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300"
                  }`}
                  title={role.desc}
                >
                  {role.name.split(" (")[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Document Type Categories */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Document Categories</label>
              {selectedCategory !== "ALL" && (
                <button 
                  onClick={() => setSelectedCategory("ALL")} 
                  className="text-[10.5px] font-extrabold text-saffron-600 hover:text-saffron-700"
                >
                  Show All Types
                </button>
              )}
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`py-2 px-4 rounded-xl text-xs font-bold whitespace-nowrap border shrink-0 transition-all ${
                    selectedCategory === cat 
                      ? "bg-slate-900 border-slate-900 text-white" 
                      : "bg-white hover:bg-slate-50 border-slate-200/80 text-slate-600 hover:border-slate-300"
                  }`}
                >
                  {cat === "ALL" ? "All Categories" : cat}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Info card calling to AI bot AVD Advisor */}
        <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden flex flex-col md:flex-row gap-6 items-center justify-between shadow-lg">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-b from-saffron-500/10 to-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-saffron-500/10 border border-saffron-500/30 flex items-center justify-center text-saffron-400 shrink-0">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base flex items-center gap-2">
                Need administrative or scale-progression counsel?
              </h3>
              <p className="text-slate-300 text-xs mt-1 max-w-xl font-medium leading-relaxed">
                Consult with our global <strong>AVD AI Assistant</strong>. Click the floating orange bubble to get instant procedural drafts, MCAS calculation rules, or official representations templates.
              </p>
            </div>
          </div>
          <button 
            type="button" 
            onClick={() => {
              const widget = document.querySelector('button[class*="bg-slate-900 text-white p-4 rounded-full"]');
              if (widget) (widget as HTMLButtonElement).click();
            }}
            className="bg-saffron-600 hover:bg-saffron-700 text-white py-3 px-6 rounded-2xl font-bold text-xs shadow-md shadow-saffron-600/15 active:scale-[0.98] transition-all whitespace-nowrap shrink-0 border border-saffron-500"
          >
            Launch AVD Assistant
          </button>
        </div>

        {/* Search Results Summary */}
        <div className="flex justify-between items-center px-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Showing {Math.min(filteredOrders.length, visibleCount)} of {filteredOrders.length} documents matched
          </span>
          {(selectedCategory !== "ALL" || selectedRole !== "ALL" || searchQuery) && (
            <button 
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("ALL");
                setSelectedRole("ALL");
              }}
              className="text-xs font-bold text-saffron-600 hover:text-saffron-700"
            >
              Reset All Filters
            </button>
          )}
        </div>

        {/* Results Container */}
        <div>
          {/* Desktop Table View */}
          <div className="hidden md:block bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-xs leading-normal">
                <thead>
                  <tr className="bg-slate-900 text-white font-bold uppercase tracking-wider text-[10px] border-b border-slate-800">
                    <th className="py-4.5 px-6">Order Date</th>
                    <th className="py-4.5 px-6">Category Type</th>
                    <th className="py-4.5 px-6">Document Title & Location</th>
                    <th className="py-4.5 px-6">File Size</th>
                    <th className="py-4.5 px-6 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-16 text-center font-bold text-slate-400">
                        No orders or notifications matched your criteria. Try adjusting the filter or search query.
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.slice(0, visibleCount).map((order) => (
                      <tr key={order.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-4.5 px-6 font-bold text-slate-700 whitespace-nowrap">
                          {order.order_date || "YYYY-MM-DD"}
                        </td>
                        <td className="py-4.5 px-6 whitespace-nowrap">
                          <span className={`px-2.5 py-1 rounded-md text-[9.5px] font-bold uppercase tracking-wider ${getBadgeClass(order.order_type)}`}>
                            {order.order_type || "Other"}
                          </span>
                        </td>
                        <td className="py-4.5 px-6">
                          <div className="font-extrabold text-slate-800 leading-snug text-sm mb-1">{order.title}</div>
                          {order.full_path ? (
                            <div className="text-[11px] text-slate-400 font-semibold truncate max-w-md">
                              Location: {order.full_path}
                            </div>
                          ) : (
                            <div className="text-[10px] text-slate-400 font-semibold italic">AVD General Repository</div>
                          )}
                        </td>
                        <td className="py-4.5 px-6 whitespace-nowrap font-bold text-slate-500 uppercase tracking-widest text-[9.5px]">
                          {getFileSizeStr(order.fileSize)}
                        </td>
                        <td className="py-4.5 px-6 text-center whitespace-nowrap">
                          {order.viewUrl ? (
                            <a 
                              href={order.viewUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-saffron-600 text-white font-bold py-2.5 px-4 rounded-xl transition-colors shadow-sm text-xs border border-transparent"
                            >
                              <Download className="w-3.5 h-3.5" /> View/Download
                            </a>
                          ) : (
                            <span className="text-slate-400 italic text-[11px]">Unlinked</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Stacked Card View */}
          <div className="block md:hidden space-y-4">
            {filteredOrders.length === 0 ? (
              <div className="bg-white rounded-3xl p-10 text-center font-bold text-slate-400 border border-slate-200">
                No orders or notifications matched your criteria. Try adjusting filters or search.
              </div>
            ) : (
              filteredOrders.slice(0, visibleCount).map((order) => (
                <div key={order.id} className="bg-white rounded-3xl p-5 border border-slate-200/60 shadow-sm flex flex-col gap-4">
                  {/* Category and Date */}
                  <div className="flex justify-between items-center gap-3">
                    <span className={`px-2.5 py-1 rounded-md text-[9px] font-bold uppercase tracking-wider ${getBadgeClass(order.order_type)}`}>
                      {order.order_type || "Other"}
                    </span>
                    <span className="text-[10.5px] font-bold text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" /> {order.order_date || "YYYY-MM-DD"}
                    </span>
                  </div>

                  {/* Title & Metadata */}
                  <div className="space-y-1">
                    <h4 className="font-extrabold text-slate-800 text-[13px] leading-snug">
                      {order.title}
                    </h4>
                    {order.full_path && (
                      <p className="text-[10px] text-slate-400 font-semibold truncate">
                        Location: {order.full_path}
                      </p>
                    )}
                  </div>

                  {/* File specs */}
                  <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 border-t border-slate-100 pt-3">
                    <span>Format: <strong className="text-slate-600 uppercase">{(order.fileExtension || "pdf").toUpperCase()}</strong></span>
                    <span>Size: <strong className="text-slate-600">{getFileSizeStr(order.fileSize)}</strong></span>
                  </div>

                  {/* Action Button: Touch Target (Min 48px) */}
                  <div className="pt-1">
                    {order.viewUrl ? (
                      <a 
                        href={order.viewUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="w-full flex items-center justify-center gap-1.5 bg-slate-900 text-white font-bold py-3 rounded-2xl hover:bg-saffron-600 transition-all text-xs min-h-[48px] shadow-sm active:scale-[0.99]"
                      >
                        <Download className="w-4 h-4" /> Open / Download File
                      </a>
                    ) : (
                      <button 
                        disabled
                        className="w-full flex items-center justify-center gap-1.5 bg-slate-100 text-slate-400 font-bold py-3 rounded-2xl text-xs min-h-[48px] cursor-not-allowed border border-slate-200/50"
                      >
                        Document Pending
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Load More Button */}
          {filteredOrders.length > visibleCount && (
            <div className="mt-8 flex justify-center">
              <button
                onClick={() => setVisibleCount(prev => prev + 30)}
                className="bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 font-bold py-3 px-8 rounded-2xl text-xs transition-all shadow-sm flex items-center gap-2 hover:border-slate-300 active:scale-[0.98]"
              >
                <Clock className="w-4 h-4 text-slate-400" />
                <span>Load More Documents ({filteredOrders.length - visibleCount} remaining)</span>
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
