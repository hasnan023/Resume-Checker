"use client";

import { useState, useEffect } from "react";
import {
  Eye,
  FileText,
  X,
  Pencil,
  Check,
  ChevronDown,
  ChevronUp,
  User,
  Briefcase,
  Wrench,
  RefreshCw,
  Trash2, // Added Trash2 icon
} from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────────────

interface WorkExp {
  company: string;
  role: string;
  duration: string;
}

interface CandidateSummary {
  name: string;
  email: string;
  phone: string;
  location: string;
  workExperience: WorkExp[];
  education: any[];
  skills: string[];
  projects: any[];
}

interface Candidate {
  id: string;
  fileName: string;
  uploadedAt: string;
  summary: CandidateSummary;
}

// ── Editable Field Component ───────────────────────────────────────────────

function EditableText({ value, onChange }: { value: string; onChange: (v: string) => void; }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  const save = () => {
    onChange(draft);
    setEditing(false);
  };

  if (editing) {
    return (
      <div className="flex items-center gap-1.5">
        <input
          autoFocus
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && save()}
          className="flex-1 text-sm border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-gray-900"
        />
        <button onClick={save} className="text-green-600 hover:text-green-800"><Check className="w-4 h-4" /></button>
        <button onClick={() => setEditing(false)} className="text-gray-400 hover:text-gray-600"><X className="w-4 h-4" /></button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5 group">
      <span className="text-sm text-gray-700">{value || "—"}</span>
      <button onClick={() => { setDraft(value); setEditing(true); }} className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-gray-700">
        <Pencil className="w-3 h-3" />
      </button>
    </div>
  );
}

// ── Section Toggle Component ───────────────────────────────────────────────

function Section({ icon: Icon, label, children }: { icon: React.ElementType; label: string; children: React.ReactNode; }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="border border-gray-100 rounded-xl overflow-hidden mb-3">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors">
        <div className="flex items-center gap-2 text-sm font-semibold text-gray-800">
          <Icon className="w-4 h-4 text-gray-500" />
          {label}
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
      </button>
      {open && <div className="px-4 py-3">{children}</div>}
    </div>
  );
}

// ── Summary Modal ──────────────────────────────────────────────────────────

function SummaryModal({ candidate, onClose, onUpdate }: { candidate: Candidate; onClose: () => void; onUpdate: (id: string, summary: CandidateSummary) => void; }) {
  const [view, setView] = useState<"preview" | "summary">("preview");
  const [summary, setSummary] = useState<CandidateSummary>(candidate.summary);

  const update = (patch: Partial<CandidateSummary>) => {
    const updated = { ...summary, ...patch };
    setSummary(updated);
    onUpdate(candidate.id, updated);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[95vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center"><FileText className="w-4 h-4 text-gray-600" /></div>
            <div>
              <p className="text-sm font-semibold text-gray-900">{candidate.fileName}</p>
              <p className="text-xs text-gray-400">Uploaded {candidate.uploadedAt}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700"><X className="w-5 h-5" /></button>
        </div>

        <div className="flex gap-1 px-6 pt-4">
          {(["preview", "summary"] as const).map((tab) => (
            <button key={tab} onClick={() => setView(tab)} className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors capitalize ${view === tab ? "bg-gray-900 text-white" : "text-gray-500 hover:bg-gray-100"}`}>
              {tab === "preview" ? "View Resume" : "Summary"}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {view === "preview" ? (
            <div className="w-full h-[600px] bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
               <iframe src={`http://127.0.0.1:8000/resumes/${candidate.id}/file`} className="w-full h-full border-none" title="Resume PDF Viewer" />
            </div>
          ) : (
            <div className="space-y-3">
              <Section icon={User} label="Name & Contact Info">
                <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                  {(["name", "email", "phone", "location"] as const).map((field) => (
                    <div key={field}>
                      <p className="text-xs text-gray-400 capitalize mb-0.5">{field}</p>
                      <EditableText value={summary[field as keyof CandidateSummary] as string} onChange={(v) => update({ [field]: v })} />
                    </div>
                  ))}
                </div>
              </Section>

              <Section icon={Wrench} label="Skills">
                <div className="flex flex-wrap gap-2">
                  {summary.skills.map((s, i) => (
                    <div key={i} className="flex items-center gap-1 bg-gray-100 rounded-lg px-2.5 py-1 text-sm text-gray-700">
                      <EditableText value={s} onChange={(v) => {
                        const updated = [...summary.skills];
                        updated[i] = v;
                        update({ skills: updated });
                      }} />
                    </div>
                  ))}
                </div>
              </Section>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Candidate Card Component ───────────────────────────────────────────────

function CandidateCard({ 
  candidate, 
  onView, 
  onDelete 
}: { 
  candidate: Candidate; 
  onView: (candidate: Candidate) => void; 
  onDelete: (id: string) => void; 
}) {
  const s = candidate.summary;
  const initials = s.name ? s.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) : "?";

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col gap-4 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gray-900 flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">{initials}</div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">{s.name}</p>
            <p className="text-xs text-gray-400 truncate">{s.email}</p>
          </div>
        </div>
        {/* Re-added Delete Button */}
        <button 
          onClick={() => onDelete(candidate.id)}
          className="text-gray-300 hover:text-red-500 transition-colors p-1"
          title="Delete candidate"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-2">
          <FileText className="w-3.5 h-3.5 text-gray-300 flex-shrink-0" />
          <p className="text-xs text-gray-400 truncate">{candidate.fileName}</p>
        </div>
      </div>

      <div className="flex items-center justify-between pt-1 border-t border-gray-50">
        <p className="text-[11px] text-gray-400">ID: {candidate.id}</p>
        <button onClick={() => onView(candidate)} className="flex items-center gap-1.5 text-xs font-medium text-gray-900 bg-gray-100 hover:bg-gray-200 transition-colors px-3 py-1.5 rounded-lg">
          <Eye className="w-3.5 h-3.5" />
          View
        </button>
      </div>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────

export default function UploadedFiles() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Candidate | null>(null);

  const loadCandidates = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://127.0.0.1:8000/resumes/");
      const data = await response.json();

      const mapped = data.map((res: any) => ({
        id: res.id.toString(),
        fileName: res.filename,
        uploadedAt: res.created_at,
        summary: {
          name: res.filename.split(".")[0],
          email: "Not extracted",
          phone: "",
          location: "",
          workExperience: [],
          education: [],
          skills: [],
          projects: [],
        }
      }));
      setCandidates(mapped);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadCandidates(); }, []);

  // Added deleteCandidate function
  const deleteCandidate = async (id: string) => {
    if (!confirm("Are you sure you want to delete this resume?")) return;

    try {
      const response = await fetch(`http://127.0.0.1:8000/resumes/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setCandidates((prev) => prev.filter((c) => c.id !== id));
      } else {
        console.error("Failed to delete from server");
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const updateSummary = (id: string, summary: CandidateSummary) => {
    setCandidates((prev) => prev.map((c) => (c.id === id ? { ...c, summary } : c)));
  };

  return (
    <div className="min-h-full p-6 md:p-10 bg-background">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-foreground tracking-tight">All Candidates</h1>
          <p className="mt-1 text-sm text-muted-foreground">{candidates.length} records found</p>
        </div>
        <button onClick={loadCandidates} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <RefreshCw className={`w-5 h-5 text-gray-500 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {loading ? (
        <div className="py-24 text-center text-gray-400 italic">Connecting to FastAPI...</div>
      ) : candidates.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <FileText className="w-10 h-10 text-gray-200 mb-3" />
          <p className="text-sm font-medium text-gray-500">Database is empty</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {candidates.map((c) => (
            <CandidateCard 
              key={c.id} 
              candidate={c} 
              onView={setSelected} 
              onDelete={deleteCandidate} // Passing delete function
            />
          ))}
        </div>
      )}

      {selected && (
        <SummaryModal candidate={selected} onClose={() => setSelected(null)} onUpdate={updateSummary} />
      )}
    </div>
  );
}