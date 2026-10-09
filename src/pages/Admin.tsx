import { useEffect, useState } from "react";

type LeadEntry = {
  id: string;
  kind: string;
  timestamp: string;
  data: Record<string, string>;
};

export default function Admin() {
  const [leads, setLeads] = useState<LeadEntry[]>([]);

  useEffect(() => {
    const raw = localStorage.getItem("ridecamp_leads");
    if (raw) {
      try {
        setLeads(JSON.parse(raw));
      } catch (e) {
        console.error("Failed to parse leads", e);
      }
    }
  }, []);

  const clearLeads = () => {
    if (confirm("Are you sure you want to clear all leads?")) {
      localStorage.removeItem("ridecamp_leads");
      setLeads([]);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 md:px-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-display font-bold text-navy">Admin Dashboard</h1>
        <button 
          onClick={clearLeads}
          className="rounded-full bg-red-100 px-5 py-2 text-sm font-bold text-red-600 hover:bg-red-200 transition"
        >
          Clear All Leads
        </button>
      </div>

      <div className="grid gap-6">
        {leads.length === 0 ? (
          <div className="rounded-2xl border border-line bg-cloud p-12 text-center text-slate">
            No leads received yet.
          </div>
        ) : (
          [...leads].reverse().map((lead) => (
            <div key={lead.id} className="rounded-2xl border border-line bg-white p-6 shadow-sm">
              <div className="flex justify-between items-start mb-4 pb-4 border-b border-line">
                <div>
                  <h2 className="text-lg font-bold text-navy capitalize">{lead.kind}</h2>
                  <p className="text-xs text-slate">{new Date(lead.timestamp).toLocaleString()}</p>
                </div>
              </div>
              <div className="grid gap-x-4 gap-y-2 sm:grid-cols-2">
                {Object.entries(lead.data).map(([key, value]) => (
                  <div key={key}>
                    <span className="text-xs font-semibold text-slate uppercase block mb-1">{key}</span>
                    <span className="text-sm text-navy">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
