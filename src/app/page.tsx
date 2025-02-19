// app/page.tsx
import AddressScraper from './components/AddressScraper';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Address Scraper</h1>
          <p className="mt-1 text-gray-600">Extract address information from any website</p>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <AddressScraper />
        
        <div className="mt-12 bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">How to use this address scraper</h2>
          <ol className="list-decimal pl-5 space-y-2 text-gray-700">
            <li>Enter the complete URL of a website (including https://)</li>
            <li>Click the "Scrape Address" button to extract address information</li>
            <li>The tool will search for address elements and format the results</li>
            <li>Copy the JSON data for use in your applications</li>
          </ol>
          <p className="mt-4 text-sm text-gray-500">
            Note: This tool works best on websites with standard address formatting.
            Results may vary depending on how the target website structures its address information.
          </p>
        </div>
      </main>
      
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 text-sm">
            Address Scraper Tool • Built with Next.js 15
          </p>
        </div>
      </footer>
    </div>
  );
}