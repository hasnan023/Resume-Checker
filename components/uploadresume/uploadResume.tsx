"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, FileText, X, CheckCircle2, AlertCircle, Plus } from "lucide-react";

type FileStatus = "idle" | "uploading" | "success" | "error";

interface ResumeFile {
  id: string;
  file: File;
  status: FileStatus;
  progress: number;
}

export default function uploadResume() {
  const [files, setFiles] = useState<ResumeFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = (incoming: File[]) => {
    const newFiles: ResumeFile[] = incoming
      .filter((file) => {
        // Check for duplicates based on name and size
        const isDuplicate = files.some(
          (existingFile) =>
            existingFile.file.name === file.name &&
            existingFile.file.size === file.size
        );
        return !isDuplicate;
      })
      .map((file) => ({
        id: crypto.randomUUID(),
        file,
        status: "idle",
        progress: 0,
      }));
    setFiles((prev) => [...prev, ...newFiles]);
  };

  const simulateUpload = (id: string) => {
    setFiles((prev) =>
      prev.map((f) => (f.id === id ? { ...f, status: "uploading" } : f))
    );

    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 20) + 10;
      if (progress >= 100) {
        clearInterval(interval);
        setFiles((prev) =>
          prev.map((f) =>
            f.id === id ? { ...f, status: "success", progress: 100 } : f
          )
        );
      } else {
        setFiles((prev) =>
          prev.map((f) => (f.id === id ? { ...f, progress } : f))
        );
      }
    }, 300);
  };

  const handleUploadAll = () => {
    files
      .filter((f) => f.status === "idle")
      .forEach((f) => simulateUpload(f.id));
  };

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
    // Clear input value to allow re-uploading the same files
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const dropped = Array.from(e.dataTransfer.files);
    addFiles(dropped);
  }, []);

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => setIsDragging(false);

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) addFiles(Array.from(e.target.files));
  };

  const allDone =
    files.length > 0 && files.every((f) => f.status === "success");
  const hasIdle = files.some((f) => f.status === "idle");

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="min-h-full p-6 md:p-10 bg-background">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-foreground tracking-tight">
          Upload Resumes
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Upload one or multiple resumes — we'll extract and analyze the info automatically.
        </p>
      </div>

      {/* Success Banner */}
      {allDone && (
        <div className="mb-6 flex items-center gap-3 bg-green-50 border border-green-200 text-green-800 dark:bg-green-950 dark:border-green-800 dark:text-green-200 rounded-xl px-4 py-3 text-sm font-medium">
          <CheckCircle2 className="w-5 h-5 text-green-500 dark:text-green-400 flex-shrink-0" />
          All resumes uploaded successfully! You can now view them in{" "}
          <a href="/candidates" className="underline underline-offset-2 hover:text-green-900 dark:hover:text-green-100">
            All Candidates
          </a>
          .
        </div>
      )}

      {/* Drop Zone */}
      <div
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onClick={() => inputRef.current?.click()}
        className={`
          relative cursor-pointer rounded-2xl border-2 border-dashed
          flex flex-col items-center justify-center
          py-16 px-6 text-center
          transition-all duration-200
          ${
            isDragging
              ? "border-primary bg-accent"
              : "border-border bg-card hover:border-foreground hover:bg-accent"
          }
        `}
      >
        <div
          className={`
            w-14 h-14 rounded-2xl flex items-center justify-center mb-4
            transition-colors duration-200
            ${isDragging ? "bg-primary" : "bg-muted"}
          `}
        >
          <Upload
            className={`w-6 h-6 transition-colors duration-200 ${
              isDragging ? "text-primary-foreground" : "text-muted-foreground"
            }`}
          />
        </div>
        <p className="text-sm font-semibold text-foreground">
          {isDragging ? "Drop files here" : "Drag & drop resumes here"}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          or click to browse — PDF, DOC, DOCX supported
        </p>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept=".pdf,.doc,.docx"
          className="hidden"
          onChange={onInputChange}
        />
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="mt-6 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-foreground">
              {files.length} file{files.length > 1 ? "s" : ""} selected
            </p>
            <div className="flex items-center gap-2">
              {/* Add more */}
              <button
                onClick={() => inputRef.current?.click()}
                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-lg hover:bg-accent"
              >
                <Plus className="w-3.5 h-3.5" />
                Add more
              </button>
              {/* Upload all */}
              {hasIdle && (
                <button
                  onClick={handleUploadAll}
                  className="text-xs font-medium bg-primary text-primary-foreground px-4 py-1.5 rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Upload All
                </button>
              )}
            </div>
          </div>

          {files.map((f) => (
            <div
              key={f.id}
              className="bg-card rounded-xl border border-border px-4 py-3 flex items-center gap-4"
            >
              {/* Icon */}
              <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                <FileText className="w-4 h-4 text-muted-foreground" />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {f.file.name}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <p className="text-xs text-muted-foreground">{formatSize(f.file.size)}</p>
                  {f.status === "uploading" && (
                    <p className="text-xs text-muted-foreground">{f.progress}%</p>
                  )}
                  {f.status === "success" && (
                    <p className="text-xs text-green-600 font-medium">Uploaded</p>
                  )}
                  {f.status === "error" && (
                    <p className="text-xs text-red-500 font-medium">Failed</p>
                  )}
                </div>

                {/* Progress bar */}
                {f.status === "uploading" && (
                  <div className="mt-1.5 h-1 w-full bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-300"
                      style={{ width: `${f.progress}%` }}
                    />
                  </div>
                )}
              </div>

              {/* Status icon / remove */}
              <div className="flex-shrink-0">
                {f.status === "success" && (
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                )}
                {f.status === "error" && (
                  <AlertCircle className="w-5 h-5 text-red-400" />
                )}
                {(f.status === "idle" || f.status === "uploading") && (
                  <button
                    onClick={() => removeFile(f.id)}
                    disabled={f.status === "uploading"}
                    className="text-muted-foreground hover:text-foreground transition-colors disabled:opacity-30"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}