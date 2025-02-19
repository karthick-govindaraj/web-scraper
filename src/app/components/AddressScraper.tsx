// app/components/AddressScraper.tsx
"use client";

import { useState } from 'react';
import { ArrowRight } from 'lucide-react';

interface AddressData {
  value: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  zipCode: string;
  error?: string;
  details?: string;
  country?:string;
  phoneNumber?:string;
}

export default function AddressScraper() {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [addressData, setAddressData] = useState<AddressData | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setAddressData(null);
    
    try {
      const response = await fetch('/api/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to scrape address');
      }
      
      if (data.error) {
        setError(data.error);
      } else {
        setAddressData(data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto p-6">
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter website URL to scrape address"
            className="flex-1 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-400 flex items-center justify-center"
          >
            {isLoading ? (
              <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                Scrape Address <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </button>
        </div>
      </form>
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <p className="text-red-700 font-medium">Error</p>
          <p className="text-red-600">{error}</p>
        </div>
      )}
      
      {addressData && !error && (
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Scraped Address Information</h2>
            <p className="text-sm text-gray-500">Results from: {url}</p>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Complete Address</h3>
                  <p className="mt-1 text-lg text-gray-800">{addressData.value || 'Not available'}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Address Line 1</h3>
                  <p className="mt-1 text-lg text-gray-800">{addressData.addressLine1 || 'Not available'}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Address Line 2</h3>
                  <p className="mt-1 text-lg text-gray-800">{addressData.addressLine2 || 'Not available'}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">City</h3>
                  <p className="mt-1 text-lg text-gray-800">{addressData.city || 'Not available'}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Zip Code</h3>
                  <p className="mt-1 text-lg text-gray-800">{addressData.zipCode || 'Not available'}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Phone Number</h3>
                  <p className="mt-1 text-lg text-gray-800">{addressData.phoneNumber || 'Not available'}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 px-6 py-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">
                {new Date().toLocaleString()}
              </span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(JSON.stringify(addressData, null, 2));
                }}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
              >
                Copy JSON Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}