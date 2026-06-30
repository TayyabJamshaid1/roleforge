export default function ServiceUnavailablePage() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold">
          Service temporarily unavailable
        </h1>
        <p>Please try again in a few minutes.</p>
      </div>
    </main>
  );
}