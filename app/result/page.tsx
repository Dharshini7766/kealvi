export default function ResultPage() {
  return (
    <main className="mx-auto max-w-4xl p-6">
      <h1 className="text-3xl font-bold mb-6">
        Results
      </h1>

      <div className="card p-6 mb-4">
        <h2>Total Polls</h2>
        <p className="text-4xl font-bold text-green-400">
          10
        </p>
      </div>

      <div className="card p-6 mb-4">
        <h2>Total Votes</h2>
        <p className="text-4xl font-bold text-blue-400">
          56
        </p>
      </div>

      <div className="card p-6">
        <h2 className="text-xl font-semibold mb-4">
          📊 Poll Distribution
        </h2>

        <div className="mb-4">
          <p>Sports</p>
          <div className="w-full bg-gray-700 rounded-full h-4">
            <div
              className="bg-blue-500 h-4 rounded-full"
              style={{ width: "60%" }}
            ></div>
          </div>
          <p>60%</p>
        </div>

        <div>
          <p>Movies</p>
          <div className="w-full bg-gray-700 rounded-full h-4">
            <div
              className="bg-purple-500 h-4 rounded-full"
              style={{ width: "40%" }}
            ></div>
          </div>
          <p>40%</p>
        </div>
      </div>
    </main>
  );
}