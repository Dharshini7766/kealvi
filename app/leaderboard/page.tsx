export default function LeaderBoardPage() {
  return (
    <main className="mx-auto max-w-4xl p-6">
      <h1 className="text-3xl font-bold mb-4">
        Leader Board
      </h1>

      <div className="card p-6 mb-4">
        <h2 className="text-2xl font-bold">
          🥇 Favorite Programming Language?
        </h2>
        <p className="text-gray-300">
          15 Votes
        </p>
      </div>

      <div className="card p-6 mb-4">
        <h2 className="text-2xl font-bold">
          🥈 Best Web Framework?
        </h2>
        <p className="text-gray-300">
          10 Votes
        </p>
      </div>
    </main>
  );
}