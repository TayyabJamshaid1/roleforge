"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  console.error(error);

  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-3">
        <h1 className="text-2xl font-bold">
          Something went wrong
        </h1>

        <p>
          Please try again. If the problem continues, contact support.
        </p>

        <button
          onClick={reset}
          className="rounded bg-black px-4 py-2 text-white"
        >
          Try again
        </button>
      </div>
    </main>
  );
}