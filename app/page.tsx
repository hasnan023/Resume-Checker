export default function HomePage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Welcome to AI Resume Reader</h1>
      <p className="text-muted-foreground mb-8">
        Upload and analyze resumes with AI-powered insights.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        <div className="bg-card p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-3">Upload Resume</h2>
          <p className="text-muted-foreground">Upload your resume files for analysis</p>
        </div>
        
        <div className="bg-card p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-3">Resume Analysis</h2>
          <p className="text-muted-foreground">Get AI-powered insights from your resumes</p>
        </div>
      </div>
    </div>
  );
}