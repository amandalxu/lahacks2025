import React, { useState, useEffect, useRef } from 'react';

function GeminiAIButton({ savingsTargets, monthlyIncome }) {
  const [isOpen, setIsOpen] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const ITEMS_PER_SECTION = 3; // Number of savings targets per scrollable section
  const panelRef = useRef(null);
  const buttonRef = useRef(null);

  // Handle click outside to close the panel
  useEffect(() => {
    function handleClickOutside(event) {
      if (isOpen && 
          panelRef.current && 
          !panelRef.current.contains(event.target) &&
          buttonRef.current && 
          !buttonRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    // Add event listener
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      // Remove event listener on cleanup
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const generateAnalysis = () => {
    setIsLoading(true);
    
    // Simulate AI processing time
    setTimeout(() => {
      // Generate predictions based on current savings data
      const predictions = savingsTargets.map(target => {
        const monthlySavingRate = calculateMonthlySavingRate(target);
        const remainingAmount = target.goalAmount - target.currentAmount;
        const goalExceeded = target.currentAmount >= target.goalAmount;
        
        const daysToGoal = !goalExceeded && monthlySavingRate > 0 
          ? Math.ceil((remainingAmount / monthlySavingRate) * 30)
          : Infinity;
          
        const prediction = {
          name: target.name,
          currentAmount: target.currentAmount,
          goalAmount: target.goalAmount,
          daysToGoal: daysToGoal,
          goalExceeded: goalExceeded,
          monthlySavingRate: monthlySavingRate,
          percentComplete: (target.currentAmount / target.goalAmount) * 100,
          recommendations: generateRecommendations(target, monthlySavingRate, monthlyIncome, goalExceeded)
        };
        
        return prediction;
      });
      
      setAnalysis(predictions);
      setIsLoading(false);
    }, 1500);
  };

  // Calculate monthly saving rate based on history or periodic settings
  const calculateMonthlySavingRate = (target) => {
    if (target.type === 'periodic') {
      if (target.percentageOfIncome > 0) {
        return (monthlyIncome * target.percentageOfIncome) / 100;
      } else if (target.fixedAmount > 0) {
        if (target.period === 'weekly') {
          return target.fixedAmount * 4.33; // Avg weeks in a month
        } else if (target.period === 'monthly') {
          return target.fixedAmount;
        } else if (target.period === 'yearly') {
          return target.fixedAmount / 12;
        }
      }
    }
    
    // For one-time goals or if no periodic data, estimate based on creation date
    const creationDate = new Date(target.createdAt);
    const now = new Date();
    const monthsSinceCreation = (now - creationDate) / (30 * 24 * 60 * 60 * 1000);
    
    // If less than a week old, use default small value
    if (monthsSinceCreation < 0.25) {
      return target.currentAmount > 0 ? target.currentAmount : 1;
    }
    
    return target.currentAmount / Math.max(monthsSinceCreation, 0.1);
  };

  // Generate personalized recommendations
  const generateRecommendations = (target, monthlySavingRate, monthlyIncome, goalExceeded) => {
    const recommendations = [];
    const remainingAmount = target.goalAmount - target.currentAmount;
    
    // If goal is exceeded
    if (goalExceeded) {
      // Array of spunky congratulatory messages
      const congratsMessages = [
        "🎉 BOOM! You've crushed your savings goal! Financial rockstar status: ACHIEVED!",
        "💰 Holy savings, Batman! You've blown past your goal! Time to do a victory dance!",
        "🚀 Look at you go! You've zoomed past your target! Saving game: LEGENDARY!",
        "✨ You're absolutely CRUSHING IT! Goal surpassed and looking fabulous doing it!",
        "🏆 Mission accomplished and then some! Your future self is high-fiving you right now!"
      ];
      
      // Randomly select one congratulatory message
      const randomIndex = Math.floor(Math.random() * congratsMessages.length);
      recommendations.push(congratsMessages[randomIndex]);
      recommendations.push("Consider setting an even bigger goal or treating yourself to something nice with a portion of the extra savings!");
      return recommendations;
    }
    
    // If saving rate is very low
    if (monthlySavingRate < (monthlyIncome * 0.01)) {
      recommendations.push("Consider increasing your monthly contribution to reach your goal faster.");
    }
    
    // If goal is very far away
    if (remainingAmount / monthlySavingRate > 12) {
      const suggestedIncrease = (remainingAmount / 12 - monthlySavingRate).toFixed(2);
      recommendations.push(`To reach your goal within a year, consider saving an additional $${suggestedIncrease} monthly.`);
    }
    
    // If goal is almost complete
    if (target.currentAmount / target.goalAmount > 0.9) {
      recommendations.push("You're very close to your goal! Consider a final push to complete it.");
    }
    
    // Add additional recommendations for demo purposes (to show scrollbar)
    if (!goalExceeded && recommendations.length <= 2) {
      recommendations.push("Setting up automatic transfers can help maintain consistent savings.");
      recommendations.push("Review your budget for areas where you might reduce spending to accelerate savings.");
    }
    
    return recommendations;
  };

  // Divide the analysis into one section (since we are showing everything in Current Goals now)
  const getSections = (analysisData) => {
    if (!analysisData) return [[]];
    
    return [analysisData];
  };

  const sections = analysis ? getSections(analysis) : [[]];

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={() => {
          if (!isOpen) {
            generateAnalysis();
          }
          setIsOpen(!isOpen);
        }}
        className="bg-purple-600 text-white py-2 px-4 rounded flex items-center hover:bg-purple-700"
      >
        {isOpen ? "Close AI Analysis" : "Basic Analysis"}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 ml-2"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {isOpen && (
        <div 
          ref={panelRef}
          className="absolute z-10 mt-2 w-96 md:w-120 bg-white shadow-xl rounded-lg overflow-hidden right-0"
        >
          {/* Fixed header */}
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold">AI Savings Analysis</h3>
          </div>
          
          {/* Loading state */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-6">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
              <p className="mt-3 text-gray-600">Analyzing your savings patterns...</p>
            </div>
          ) : (
            <>
              {/* Current Goals */}
              {sections[0].length > 0 && (
                <div className="border-b border-gray-200">
                  <h4 className="px-4 pt-3 pb-2 font-medium text-gray-700">Current Goals</h4>
                  <div
                    className="px-4 overflow-y-auto"
                    style={{
                      maxHeight: `calc(2 * (3 * 72px + 12px))`, // Adjust height for two full sections based on 3 items per section
                      scrollbarWidth: 'thin',
                    }}
                  >
                    <div className="space-y-3 pb-3">
                      {sections[0].map((item, index) => (
                        <div key={`section1-${index}`} className="border rounded-lg p-3">
                          <h4 className="font-semibold text-purple-600">{item.name}</h4>
                          <p className="text-sm mb-1">
                            Progress: {item.percentComplete.toFixed(1)}% (${item.currentAmount.toFixed(2)} of ${item.goalAmount.toFixed(2)})
                          </p>
                          <p className="text-sm mb-1">
                            Monthly saving rate: ${item.monthlySavingRate.toFixed(2)}
                          </p>
                          <p className="text-sm mb-2">
                            {item.goalExceeded
                              ? "🎯 GOAL SMASHED! You're killin' it with your savings! 🎯"
                              : item.daysToGoal === Infinity 
                                ? "You need to start saving regularly to reach this goal." 
                                : `Estimated time to goal: ${Math.floor(item.daysToGoal / 30)} months and ${item.daysToGoal % 30} days`}
                          </p>
                          
                          {item.recommendations.length > 0 && (
                            <div className="mt-2">
                              <p className="text-xs font-semibold text-gray-600">Recommendations:</p>
                              <ul className="text-xs text-gray-600 list-disc pl-4">
                                {item.recommendations.map((rec, idx) => (
                                  <li key={idx} className="mb-1">{rec}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* No data message */}
              {!analysis || analysis.length === 0 ? (
                <div className="p-4">
                  <p className="text-gray-600">No savings targets found to analyze.</p>
                </div>
              ) : (
                <div className="px-4 py-3 text-xs text-gray-500">
                  Analysis is based on your current saving patterns and may change as your habits evolve.
                </div>
              )}
            </>
          )}
          
          {/* Fixed footer */}
          <div className="bg-gray-50 px-4 py-3 flex justify-end border-t border-gray-200">
            <button
              onClick={() => setIsOpen(false)}
              className="text-sm text-gray-600 hover:text-gray-800"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default GeminiAIButton;
