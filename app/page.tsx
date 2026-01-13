export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-indigo-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center space-y-8">
          {/* Hero with gradient text */}
          <div className="relative">
            <h1 className="text-7xl font-bold tracking-tight bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent pb-2">
              Color³
            </h1>
            <div className="flex justify-center gap-2 mt-4">
              <div className="w-3 h-3 rounded-full bg-indigo-400 animate-pulse"></div>
              <div className="w-3 h-3 rounded-full bg-indigo-500 animate-pulse delay-100"></div>
              <div className="w-3 h-3 rounded-full bg-purple-500 animate-pulse delay-200"></div>
            </div>
          </div>

          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            A playful exploration of synesthetic color patterns in time.
          </p>

          {/* Main description */}
          <div className="pt-8 space-y-6 max-w-2xl mx-auto text-left text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
            <p>
              Do you associate colors with time? Does January feel green, or
              does Friday have a particular shade?
            </p>
            <p>
              Color³ lets you map your personal color associations to months,
              days of the week, and days of the month — then discovers{" "}
              <strong className="text-indigo-600 dark:text-indigo-400">Color³ days</strong>: rare calendar dates where all three
              color families align.
            </p>
            <p className="text-base text-gray-600 dark:text-gray-400 italic">
              💡 Color³ days are based on color families — like "blue"
              or "red" — not exact shades, allowing for expressive
              freedom in your choices.
            </p>
          </div>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <a
              href="/personal"
              className="px-8 py-4 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-all shadow-md hover:shadow-lg"
            >
              Start Mapping →
            </a>
            <a
              href="/collective"
              className="px-8 py-4 bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 border-2 border-indigo-200 dark:border-indigo-800 rounded-lg font-semibold hover:bg-indigo-50 dark:hover:bg-gray-700 transition-all shadow-md hover:shadow-lg"
            >
              Collective Patterns
            </a>
          </div>

          {/* How it works */}
          <div className="pt-16 mt-16 border-t border-gray-200 dark:border-gray-800">
            <h2 className="text-3xl font-bold mb-8 text-gray-900 dark:text-gray-100">
              How It Works
            </h2>
            <div className="grid md:grid-cols-3 gap-6 text-left">
              <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 hover:shadow-md transition-shadow">
                <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-gray-100">1. Map Your Colors</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Assign colors to each month, day of the week, and day of the
                  month using your intuition.
                </p>
              </div>
              <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 hover:shadow-md transition-shadow">
                <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-gray-100">2. Discover Color³ Days</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  See when your color families align across all three
                  dimensions — these are your Color³ days.
                </p>
              </div>
              <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 hover:shadow-md transition-shadow">
                <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-gray-100">3. Explore Together</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Submit anonymously and see how your patterns compare with
                  others&apos; associations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

