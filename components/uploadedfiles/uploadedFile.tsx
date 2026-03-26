"use client";

import { useState } from "react";
import {
  Trash2,
  Eye,
  FileText,
  X,
  Pencil,
  Check,
  ChevronDown,
  ChevronUp,
  User,
  Briefcase,
  GraduationCap,
  Wrench,
  FolderGit2,
} from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────────────

interface WorkExp {
  company: string;
  role: string;
  duration: string;
}

interface Education {
  institution: string;
  degree: string;
  year: string;
}

interface Project {
  name: string;
  description: string;
}

interface CandidateSummary {
  name: string;
  email: string;
  phone: string;
  location: string;
  workExperience: WorkExp[];
  education: Education[];
  skills: string[];
  projects: Project[];
}

interface Candidate {
  id: string;
  fileName: string;
  uploadedAt: string;
  summary: CandidateSummary | null;
}

// ── Mock Data ──────────────────────────────────────────────────────────────

const mockCandidates: Candidate[] = [
  {
    id: "1",
    fileName: "john_doe_resume.pdf",
    uploadedAt: "2026-03-24",
    summary: {
      name: "John Doe",
      email: "john@example.com",
      phone: "+1 555 0101",
      location: "New York, USA",
      workExperience: [
        { company: "Google", role: "Senior Frontend Engineer", duration: "2021 – Present" },
        { company: "Stripe", role: "Frontend Engineer", duration: "2019 – 2021" },
      ],
      education: [
        { institution: "MIT", degree: "B.Sc. Computer Science", year: "2019" },
      ],
      skills: ["React", "TypeScript", "Next.js", "GraphQL", "TailwindCSS"],
      projects: [
        { name: "OpenDash", description: "Open source analytics dashboard with 2k+ GitHub stars." },
        { name: "FormKit", description: "Headless form builder library for React." },
      ],
    },
  },
  {
    id: "2",
    fileName: "sara_khan_cv.pdf",
    uploadedAt: "2026-03-25",
    summary: {
      name: "Sara Khan",
      email: "sara.khan@email.com",
      phone: "+44 7700 900123",
      location: "London, UK",
      workExperience: [
        { company: "DeepMind", role: "ML Engineer", duration: "2022 – Present" },
        { company: "Revolut", role: "Data Scientist", duration: "2020 – 2022" },
      ],
      education: [
        { institution: "Oxford University", degree: "M.Sc. AI & Machine Learning", year: "2020" },
        { institution: "LUMS", degree: "B.Sc. Mathematics", year: "2018" },
      ],
      skills: ["Python", "PyTorch", "TensorFlow", "SQL", "Kubernetes"],
      projects: [
        { name: "NLPipe", description: "NLP pipeline for multilingual document classification." },
      ],
    },
  },
  {
    id: "3",
    fileName: "ali_resume_2026.docx",
    uploadedAt: "2026-03-26",
    summary: null,
  },
];

// ── Editable Field ─────────────────────────────────────────────────────────

function EditableText({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
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
        <button onClick={save} className="text-green-600 hover:text-green-800">
          <Check className="w-4 h-4" />
        </button>
        <button onClick={() => setEditing(false)} className="text-gray-400 hover:text-gray-600">
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5 group">
      <span className="text-sm text-gray-700">{value}</span>
      <button
        onClick={() => { setDraft(value); setEditing(true); }}
        className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-gray-700"
      >
        <Pencil className="w-3 h-3" />
      </button>
    </div>
  );
}

// ── Section Toggle ─────────────────────────────────────────────────────────

function Section({
  icon: Icon,
  label,
  children,
}: {
  icon: React.ElementType;
  label: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(true);
  return (
    <div className="border border-gray-100 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors"
      >
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

function SummaryModal({
  candidate,
  onClose,
  onUpdate,
}: {
  candidate: Candidate;
  onClose: () => void;
  onUpdate: (id: string, summary: CandidateSummary) => void;
}) {
  const [view, setView] = useState<"preview" | "summary">("preview");
  const [summary, setSummary] = useState<CandidateSummary>(
    candidate.summary ?? {
      name: "",
      email: "",
      phone: "",
      location: "",
      workExperience: [],
      education: [],
      skills: [],
      projects: [],
    }
  );

  const update = (patch: Partial<CandidateSummary>) => {
    const updated = { ...summary, ...patch };
    setSummary(updated);
    onUpdate(candidate.id, updated);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center">
              <FileText className="w-4 h-4 text-gray-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">{candidate.fileName}</p>
              <p className="text-xs text-gray-400">Uploaded {candidate.uploadedAt}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 px-6 pt-4">
          {(["preview", "summary"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setView(tab)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors capitalize ${
                view === tab
                  ? "bg-gray-900 text-white"
                  : "text-gray-500 hover:bg-gray-100"
              }`}
            >
              {tab === "preview" ? "View Resume" : "Editable Summary"}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {view === "preview" ? (
            <div className="flex flex-col items-center justify-center min-h-[320px] bg-gray-50 rounded-xl border border-dashed border-gray-200 text-center gap-3">
              <FileText className="w-10 h-10 text-gray-300" />
              <p className="text-sm font-medium text-gray-500">Resume preview</p>
              <p className="text-xs text-gray-400 max-w-xs">
                In production, render the PDF/DOCX here using a viewer like{" "}
                <code className="bg-gray-100 px-1 rounded">react-pdf</code> or an iframe.
              </p>
              <button
                onClick={() => setView("summary")}
                className="mt-2 text-sm font-medium bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Go to Editable Summary →
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Contact Info */}
              <Section icon={User} label="Name & Contact Info">
                <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                  {(["name", "email", "phone", "location"] as const).map((field) => (
                    <div key={field}>
                      <p className="text-xs text-gray-400 capitalize mb-0.5">{field}</p>
                      <EditableText
                        value={summary[field]}
                        onChange={(v) => update({ [field]: v })}
                      />
                    </div>
                  ))}
                </div>
              </Section>

              {/* Work Experience */}
              <Section icon={Briefcase} label="Work Experience">
                <div className="space-y-3">
                  {summary.workExperience.map((w, i) => (
                    <div key={i} className="grid grid-cols-3 gap-3 pb-3 border-b border-gray-50 last:border-0 last:pb-0">
                      {(["company", "role", "duration"] as const).map((f) => (
                        <div key={f}>
                          <p className="text-xs text-gray-400 capitalize mb-0.5">{f}</p>
                          <EditableText
                            value={w[f]}
                            onChange={(v) => {
                              const updated = [...summary.workExperience];
                              updated[i] = { ...updated[i], [f]: v };
                              update({ workExperience: updated });
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  ))}
                  <button
                    onClick={() =>
                      update({
                        workExperience: [
                          ...summary.workExperience,
                          { company: "", role: "", duration: "" },
                        ],
                      })
                    }
                    className="text-xs text-gray-400 hover:text-gray-700 transition-colors"
                  >
                    + Add entry
                  </button>
                </div>
              </Section>

              {/* Education */}
              <Section icon={GraduationCap} label="Education">
                <div className="space-y-3">
                  {summary.education.map((e, i) => (
                    <div key={i} className="grid grid-cols-3 gap-3 pb-3 border-b border-gray-50 last:border-0 last:pb-0">
                      {(["institution", "degree", "year"] as const).map((f) => (
                        <div key={f}>
                          <p className="text-xs text-gray-400 capitalize mb-0.5">{f}</p>
                          <EditableText
                            value={e[f]}
                            onChange={(v) => {
                              const updated = [...summary.education];
                              updated[i] = { ...updated[i], [f]: v };
                              update({ education: updated });
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  ))}
                  <button
                    onClick={() =>
                      update({
                        education: [
                          ...summary.education,
                          { institution: "", degree: "", year: "" },
                        ],
                      })
                    }
                    className="text-xs text-gray-400 hover:text-gray-700 transition-colors"
                  >
                    + Add entry
                  </button>
                </div>
              </Section>

              {/* Skills */}
              <Section icon={Wrench} label="Skills">
                <div className="flex flex-wrap gap-2">
                  {summary.skills.map((s, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-1 bg-gray-100 rounded-lg px-2.5 py-1 text-sm text-gray-700"
                    >
                      <EditableText
                        value={s}
                        onChange={(v) => {
                          const updated = [...summary.skills];
                          updated[i] = v;
                          update({ skills: updated });
                        }}
                      />
                      <button
                        onClick={() =>
                          update({ skills: summary.skills.filter((_, idx) => idx !== i) })
                        }
                        className="text-gray-400 hover:text-red-500 transition-colors ml-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => update({ skills: [...summary.skills, "New Skill"] })}
                    className="text-xs text-gray-400 hover:text-gray-700 bg-gray-50 border border-dashed border-gray-200 rounded-lg px-2.5 py-1 transition-colors"
                  >
                    + Add skill
                  </button>
                </div>
              </Section>

              {/* Projects */}
              <Section icon={FolderGit2} label="Projects">
                <div className="space-y-3">
                  {summary.projects.map((p, i) => (
                    <div key={i} className="space-y-1.5 pb-3 border-b border-gray-50 last:border-0 last:pb-0">
                      <div>
                        <p className="text-xs text-gray-400 mb-0.5">Project Name</p>
                        <EditableText
                          value={p.name}
                          onChange={(v) => {
                            const updated = [...summary.projects];
                            updated[i] = { ...updated[i], name: v };
                            update({ projects: updated });
                          }}
                        />
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 mb-0.5">Description</p>
                        <EditableText
                          value={p.description}
                          onChange={(v) => {
                            const updated = [...summary.projects];
                            updated[i] = { ...updated[i], description: v };
                            update({ projects: updated });
                          }}
                        />
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={() =>
                      update({
                        projects: [...summary.projects, { name: "", description: "" }],
                      })
                    }
                    className="text-xs text-gray-400 hover:text-gray-700 transition-colors"
                  >
                    + Add project
                  </button>
                </div>
              </Section>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Candidate Card ─────────────────────────────────────────────────────────

function CandidateCard({
  candidate,
  onDelete,
  onView,
}: {
  candidate: Candidate;
  onDelete: (id: string) => void;
  onView: (candidate: Candidate) => void;
}) {
  const s = candidate.summary;
  const initials = s?.name
    ? s.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col gap-4 hover:shadow-md transition-shadow duration-200">
      {/* Top row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gray-900 flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">
              {s?.name ?? "Unknown"}
            </p>
            <p className="text-xs text-gray-400 truncate">{s?.email ?? "—"}</p>
          </div>
        </div>
        <button
          onClick={() => onDelete(candidate.id)}
          className="text-gray-300 hover:text-red-500 transition-colors flex-shrink-0 mt-0.5"
          title="Delete candidate"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Meta */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-2">
          <FileText className="w-3.5 h-3.5 text-gray-300 flex-shrink-0" />
          <p className="text-xs text-gray-400 truncate">{candidate.fileName}</p>
        </div>
        {s?.location && (
          <p className="text-xs text-gray-400 pl-5">{s.location}</p>
        )}
      </div>

      {/* Skills preview */}
      {s?.skills && s.skills.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {s.skills.slice(0, 4).map((skill) => (
            <span
              key={skill}
              className="text-[11px] bg-gray-100 text-gray-600 rounded-md px-2 py-0.5 font-medium"
            >
              {skill}
            </span>
          ))}
          {s.skills.length > 4 && (
            <span className="text-[11px] text-gray-400 py-0.5">
              +{s.skills.length - 4} more
            </span>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-1 border-t border-gray-50">
        <p className="text-[11px] text-gray-400">Uploaded {candidate.uploadedAt}</p>
        <button
          onClick={() => onView(candidate)}
          className="flex items-center gap-1.5 text-xs font-medium text-gray-900 bg-gray-100 hover:bg-gray-200 transition-colors px-3 py-1.5 rounded-lg"
        >
          <Eye className="w-3.5 h-3.5" />
          View
        </button>
      </div>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────

export default function uploadedFiles() {
  const [candidates, setCandidates] = useState<Candidate[]>(mockCandidates);
  const [selected, setSelected] = useState<Candidate | null>(null);

  const deleteCandidate = (id: string) => {
    setCandidates((prev) => prev.filter((c) => c.id !== id));
  };

  const updateSummary = (id: string, summary: CandidateSummary) => {
    setCandidates((prev) =>
      prev.map((c) => (c.id === id ? { ...c, summary } : c))
    );
  };

  return (
    <div className="min-h-full p-6 md:p-10 bg-background">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-foreground tracking-tight">
          All Candidates
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {candidates.length} resume{candidates.length !== 1 ? "s" : ""} uploaded
        </p>
      </div>

      {/* Grid */}
      {candidates.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <FileText className="w-10 h-10 text-gray-200 mb-3" />
          <p className="text-sm font-medium text-gray-500">No candidates yet</p>
          <p className="text-xs text-gray-400 mt-1">
            Upload resumes to see them here
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {candidates.map((c) => (
            <CandidateCard
              key={c.id}
              candidate={c}
              onDelete={deleteCandidate}
              onView={setSelected}
            />
          ))}
        </div>
      )}

      {/* Modal */}
      {selected && (
        <SummaryModal
          candidate={selected}
          onClose={() => setSelected(null)}
          onUpdate={updateSummary}
        />
      )}
    </div>
  );
}