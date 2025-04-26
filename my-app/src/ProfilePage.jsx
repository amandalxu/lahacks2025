import React from "react";
import { Link } from "react-router-dom";

export default function ProfilePage({ savingsTargets = [] }) {
  const defaultParis = {
    name: "Paris",
    goalAmount: 10000,
    currentAmount: 3000,
  };

  const defaultBike = {
    name: "1k bike",
    goalAmount: 1000,
    currentAmount: 0,
  };

  const parisTarget =
    savingsTargets.find((target) => target?.name === "Paris") || defaultParis;
  const bikeTarget =
    savingsTargets.find((target) => target?.name === "1k bike") || defaultBike;

  const parisPercentage = Math.floor(
    (parisTarget.currentAmount / parisTarget.goalAmount) * 100
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with sign out */}
      
      <div className="relative bg-blue-600 text-white py-8 px-4 mt-4 mb-4 mx-4 rounded-lg max-w-4xl mx-auto">
  {/* Sign out button absolutely positioned */}
  <button className="absolute top-8 right-4 bg-white text-blue-600 font-semibold py-2 px-4 rounded-lg shadow border hover:bg-gray-100 whitespace-nowrap">
    Sign out →
  </button>

  {/* Centered Title */}
  <h1 className="text-4xl font-bold text-center">Amy, let's save!</h1>
</div>


      {/* Content area with flexbox layout */}
      <div className="p-6 max-w-4xl mx-auto bg-white min-h-screen">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-blue-600">Profile Page</h1>
          <Link
            to="/"
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Back to Savings
          </Link>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Left sidebar */}
          <div className="md:col-span-1">
            <Link to="/" className="block mb-4">
              <button className="w-full text-left bg-blue-500 text-white py-4 px-6 rounded-lg shadow hover:bg-blue-600">
                Saving Goals
              </button>
            </Link>
          </div>

          {/* Main content area */}
          <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Bank accounts card */}
            <div className="bg-white p-6 rounded-lg shadow text-gray-800">
            <h2 className="text-xl font-semibold mb-4">
                Connected bank accounts
            </h2>

            {/* Bank of America */}
            <div className="text-sm mb-4 flex justify-between items-center">
                <span className="w-1/2">Bank of America</span>
                <div className="flex items-center justify-between w-1/2">
                <span className="mr-2">XXXXXXXX1234</span>
                <div className="h-3 w-3 rounded-full bg-green-500"></div>
                </div>
            </div>

            {/* Chase */}
            <div className="text-sm flex justify-between items-center">
                <span className="w-1/2">Chase</span>
                <div className="flex items-center justify-between w-1/2">
                <span className="mr-2">XXXXXXXX4567</span>
                </div>
            </div>
            </div>


            {/* 1k bike progress card */}
            <div className="bg-white p-6 rounded-lg shadow text-gray-800">
              <h2 className="text-xl font-semibold mb-4">Progress - 1k bike</h2>
              <p className="text-sm text-gray-500">
                No progress data visualized yet.
              </p>
            </div>

            {/* Paris progress card */}
            <div className="bg-white p-6 rounded-lg shadow text-gray-800">
              <h2 className="text-xl font-semibold mb-4">Progress - Paris</h2>

              <div className="flex items-center">
                <div className="relative inline-block w-32 h-32">
                  {/* Increased viewBox size to accommodate r=50 with stroke */}
                  <svg
                    className="absolute inset-0 w-full h-full -rotate-90 transform"
                    viewBox="0 0 120 120"
                  >
                    {/* Background circle - keeping r=50 */}
                    <circle
                      cx="60"
                      cy="60"
                      r="55"
                      fill="none"
                      stroke="#D1D5DB" // Light gray color
                      strokeWidth="8"
                      strokeDasharray="1" // 2 * PI * 50
                      strokeDashoffset="0"
                      strokeLinecap="round"
                    />

                    {/* Current progress - keeping r=50 */}
                    <circle
                      cx="60"
                      cy="60"
                      r="55"
                      fill="none"
                      stroke="#3B82F6" // Blue color
                      strokeWidth="8"
                      strokeDasharray="345" // 2 * PI * 55
                      strokeDashoffset={345 - (345 * parisPercentage) / 100}
                      strokeLinecap="round"
                    />
                  </svg>

                  {/* Percentage text */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold">{parisPercentage}%</span>
                    <span className="text-xs text-center text-gray-600">
                      Out of <br />
                      ${parisTarget.goalAmount.toLocaleString()} goal
                    </span>
                  </div>
                </div>

                <div className="ml-8">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-blue-600 mr-2"></div>
                    <span>
                      Savings: ${parisTarget.currentAmount.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Placeholder / future feature card */}
            <div className="bg-white p-6 rounded-lg shadow text-gray-800">
              <p className="text-gray-400 text-sm">
                More savings features coming soon!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}