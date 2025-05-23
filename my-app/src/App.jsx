import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ProfilePage from './ProfilePage';

// In SavingsApp.jsx, add this import at the top with other imports:
import GeminiAIButton from './GeminiAIButton';
import LoginPage from "./LoginPage";
import Navbar from './Navbar'; // Import the new Navbar component

function SavingsApp() {
  const location = useLocation()
  const username = location.state?.username || "User";
  const navigate = useNavigate(); // 👈

  const [savingsTargets, setSavingsTargets] = useState(() => {
    const savedTargets = localStorage.getItem('savingsTargets');
    return savedTargets ? JSON.parse(savedTargets) : [];
  });
 
  const [monthlyIncome, setMonthlyIncome] = useState(() => {
    const savedIncome = localStorage.getItem('monthlyIncome');
    return savedIncome ? parseFloat(savedIncome) : 0;
  });
 
  const [newTarget, setNewTarget] = useState({
    name: '',
    goalAmount: '',
    currentAmount: 0,
    type: 'one-time', // 'one-time' or 'periodic'
    period: 'monthly', // 'weekly', 'monthly', 'yearly'
    percentageOfIncome: '',
    fixedAmount: '',
    color: '#' + Math.floor(Math.random()*16777215).toString(16)
  });
 
  const [showAddForm, setShowAddForm] = useState(false);
  const [depositTarget, setDepositTarget] = useState(null);
  const [depositAmount, setDepositAmount] = useState('');
  const [editTarget, setEditTarget] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    goalAmount: '',
    type: 'one-time',
    period: 'monthly',
    percentageOfIncome: '',
    fixedAmount: '',
  });
 
  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('savingsTargets', JSON.stringify(savingsTargets));
  }, [savingsTargets]);
 
  useEffect(() => {
    localStorage.setItem('monthlyIncome', monthlyIncome.toString());
  }, [monthlyIncome]);
 
  const handleAddTarget = (e) => {
    e.preventDefault();
   
    const target = {
      ...newTarget,
      id: Date.now(),
      goalAmount: parseFloat(newTarget.goalAmount),
      percentageOfIncome: newTarget.percentageOfIncome ? parseFloat(newTarget.percentageOfIncome) : 0,
      fixedAmount: newTarget.fixedAmount ? parseFloat(newTarget.fixedAmount) : 0,
      createdAt: new Date().toISOString()
    };
   
    setSavingsTargets([...savingsTargets, target]);
    setNewTarget({
      name: '',
      goalAmount: '',
      currentAmount: 0,
      type: 'one-time',
      period: 'monthly',
      percentageOfIncome: '',
      fixedAmount: '',
      color: '#' + Math.floor(Math.random()*16777215).toString(16),
      archived: false
    });
    setShowAddForm(false);
  };
 
  const handleDeposit = (e) => {
    e.preventDefault();
    const amount = parseFloat(depositAmount);
   
    if (isNaN(amount) || amount <= 0) return;
   
    setSavingsTargets(savingsTargets.map(target => {
      if (target.id === depositTarget.id) {
        if (target.currentAmount + amount >= target.goalAmount) {
          console.log("Progress towards this savings target is complete! Would you like to archive this target and redirect surplus savings to another target, or would you like to continue saving towards this target?");
        }
        return { ...target, currentAmount: target.currentAmount + amount };
      }
      return target;
    }));
   
    setDepositTarget(null);
    setDepositAmount('');
  };
 
  const handleAutomaticDeposit = () => {
    // Process automatic deposits based on rules
    const updatedTargets = savingsTargets.map(target => {
      if (!target.archived && target.type === 'periodic') {
        let depositAmount = 0;
       
        if (target.percentageOfIncome > 0) {
          depositAmount = (monthlyIncome * target.percentageOfIncome) / 100;
          // TODO: If target is complete, ask user if they want to archive this target 
          // and redirect surplus savings to another target, or continue saving towards 
          // this target
          if (target.currentAmount + depositAmount >= target.goalAmount) {
            console.log("Progress towards this savings target is complete! Would you like to archive this target and redirect surplus savings to another target, or would you like to continue saving towards this target?");
          }
        } else if (target.fixedAmount > 0) {
          depositAmount = target.fixedAmount;
        }
       
        return {
          ...target,
          currentAmount: target.currentAmount + depositAmount
        };
      }
      return target;
    });
   
    setSavingsTargets(updatedTargets);
  };
 
  const deleteTarget = (id) => {
    setSavingsTargets(savingsTargets.filter(target => target.id !== id));
  };

  const archiveTarget = (id) => {
    const updatedTargets = savingsTargets.map(target => 
      target.id === id ? {
          ...target,
          archived: true
        } : target
    );
   
    setSavingsTargets(updatedTargets);
  }

  const restoreTarget = (id) => {
    const updatedTargets = savingsTargets.map(target => 
      target.id === id ? {
          ...target,
          archived: false
        } : target
    );
   
    setSavingsTargets(updatedTargets);
  }
 
  const calculateProgress = (target) => {
    return (target.currentAmount / target.goalAmount) * 100;
  };

  const handleEditClick = (target) => {
    setEditTarget(target);
    setEditFormData({
      name: target.name,
      goalAmount: target.goalAmount,
      type: target.type,
      period: target.period,
      percentageOfIncome: target.percentageOfIncome || '',
      fixedAmount: target.fixedAmount || '',
    });
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    
    const updatedTarget = {
      ...editTarget,
      name: editFormData.name,
      goalAmount: parseFloat(editFormData.goalAmount),
      type: editFormData.type,
      period: editFormData.period,
      percentageOfIncome: editFormData.percentageOfIncome ? parseFloat(editFormData.percentageOfIncome) : 0,
      fixedAmount: editFormData.fixedAmount ? parseFloat(editFormData.fixedAmount) : 0,
    };
    
    setSavingsTargets(savingsTargets.map(target => 
      target.id === editTarget.id ? updatedTarget : target
    ));
    
    setEditTarget(null);
  };
 
  return (
    <div>
      {/* Add the Navbar component at the top */}
      <Navbar username={username} />
      <div className="p-6 max-w-4xl mx-auto bg-gray-50 min-h-screen">

        {/* Income Section */}
        <div className="mb-8 p-4 bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Monthly Income</h2>
          <div className="flex gap-4">
            <input
              type="number"
              value={monthlyIncome || ""}
              onChange={(e) => setMonthlyIncome(parseFloat(e.target.value) || 0)}
              className="flex-1 p-2 border rounded"
              placeholder="Enter your monthly income"
            />
            <button
              onClick={handleAutomaticDeposit}
              className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
            >
              Process Auto-deposits
            </button>
          </div>
        </div>

        {/* Targets Dashboard */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Your Active Savings Targets</h2>
            <div className="flex gap-2">
              {showAddForm == false && 
                <GeminiAIButton savingsTargets={savingsTargets} monthlyIncome={monthlyIncome} />
              }
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
              >
                {showAddForm ? "Cancel" : "Add New Target"}
              </button>
            </div>
          </div>

          {/* Add New Target Form */}
          {showAddForm && (
            <form
              onSubmit={handleAddTarget}
              className="mb-6 p-4 bg-white rounded-lg shadow"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block mb-1">Target Name</label>
                  <input
                    type="text"
                    value={newTarget.name}
                    onChange={(e) =>
                      setNewTarget({ ...newTarget, name: e.target.value })
                    }
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-1">Goal Amount</label>
                  <input
                    type="number"
                    value={newTarget.goalAmount}
                    onChange={(e) =>
                      setNewTarget({ ...newTarget, goalAmount: e.target.value })
                    }
                    className="w-full p-2 border rounded"
                    required
                    min={1}
                  />
                </div>

                <div>
                  <label className="block mb-1">Type</label>
                  <select
                    value={newTarget.type}
                    onChange={(e) =>
                      setNewTarget({ ...newTarget, type: e.target.value })
                    }
                    className="w-full p-2 border rounded"
                  >
                    <option value="one-time">One-time Goal</option>
                    <option value="periodic">Periodic Saving</option>
                  </select>
                </div>

                {newTarget.type === "periodic" && (
                  <>
                    <div>
                      <label className="block mb-1">Period</label>
                      <select
                        value={newTarget.period}
                        onChange={(e) =>
                          setNewTarget({ ...newTarget, period: e.target.value })
                        }
                        className="w-full p-2 border rounded"
                      >
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                        <option value="yearly">Yearly</option>
                      </select>
                    </div>

                    <div>
                      <label className="block mb-1">% of Monthly Income</label>
                      <input
                        type="number"
                        value={newTarget.percentageOfIncome}
                        onChange={(e) =>
                          setNewTarget({
                            ...newTarget,
                            percentageOfIncome: e.target.value,
                            fixedAmount: "",
                          })
                        }
                        className="w-full p-2 border rounded"
                        placeholder="Enter percentage"
                        min={0}
                      />
                    </div>

                    <div>
                      <label className="block mb-1">Or Fixed Amount</label>
                      <input
                        type="number"
                        value={newTarget.fixedAmount}
                        onChange={(e) =>
                          setNewTarget({
                            ...newTarget,
                            fixedAmount: e.target.value,
                            percentageOfIncome: "",
                          })
                        }
                        className="w-full p-2 border rounded"
                        placeholder="Enter fixed amount"
                        min={0}
                      />
                    </div>
                  </>
                )}
              </div>

              <button
                type="submit"
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
              >
                Add Target
              </button>
            </form>
          )}

          {/* Deposit Modal */}
          {depositTarget && (
            <div className="fixed inset-0 bg-[rgba(0,0,0,0.3)] flex items-center justify-center p-4 z-20">
              <div className="bg-white p-6 rounded-lg max-w-md w-full">
                <h3 className="text-xl font-semibold mb-4">
                  Deposit to {depositTarget.name}
                </h3>
                <form onSubmit={handleDeposit}>
                  <div className="mb-4">
                    <label className="block mb-1">Amount</label>
                    <input
                      type="number"
                      value={depositAmount}
                      onChange={(e) => setDepositAmount(e.target.value)}
                      className="w-full p-2 border rounded"
                      autoFocus
                      required
                      min={0}
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setDepositTarget(null);
                        setDepositAmount("");
                      }}
                      className="py-2 px-4 border rounded"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
                    >
                      Deposit
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Edit Target Modal */}
          {editTarget && (
          <div className="fixed inset-0 bg-[rgba(0,0,0,0.3)] flex items-center justify-center p-4 z-20">
              <div className="bg-white p-6 rounded-lg max-w-md w-full">
                <h3 className="text-xl font-semibold mb-4">Edit {editTarget.name}</h3>
                <form onSubmit={handleSaveEdit}>
                  <div className="grid grid-cols-1 gap-4 mb-4">
                    <div>
                      <label className="block mb-1">Target Name</label>
                      <input
                        type="text"
                        value={editFormData.name}
                        onChange={(e) => setEditFormData({...editFormData, name: e.target.value})}
                        className="w-full p-2 border rounded"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block mb-1">Goal Amount</label>
                      <input
                        type="number"
                        value={editFormData.goalAmount}
                        onChange={(e) => setEditFormData({...editFormData, goalAmount: e.target.value})}
                        className="w-full p-2 border rounded"
                        required
                        min={1}
                      />
                    </div>
                    
                    <div>
                      <label className="block mb-1">Type</label>
                      <select
                        value={editFormData.type}
                        onChange={(e) => setEditFormData({...editFormData, type: e.target.value})}
                        className="w-full p-2 border rounded"
                      >
                        <option value="one-time">One-time Goal</option>
                        <option value="periodic">Periodic Saving</option>
                      </select>
                    </div>
                    
                    {editFormData.type === 'periodic' && (
                      <>
                        <div>
                          <label className="block mb-1">Period</label>
                          <select
                            value={editFormData.period}
                            onChange={(e) => setEditFormData({...editFormData, period: e.target.value})}
                            className="w-full p-2 border rounded"
                          >
                            <option value="weekly">Weekly</option>
                            <option value="monthly">Monthly</option>
                            <option value="yearly">Yearly</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block mb-1">% of Monthly Income</label>
                          <input
                            type="number"
                            value={editFormData.percentageOfIncome}
                            onChange={(e) => setEditFormData({...editFormData, percentageOfIncome: e.target.value, fixedAmount: ''})}
                            className="w-full p-2 border rounded"
                            placeholder="Enter percentage"
                            min={0}
                          />
                        </div>
                        
                        <div>
                          <label className="block mb-1">Or Fixed Amount</label>
                          <input
                            type="number"
                            value={editFormData.fixedAmount}
                            onChange={(e) => setEditFormData({...editFormData, fixedAmount: e.target.value, percentageOfIncome: ''})}
                            className="w-full p-2 border rounded"
                            placeholder="Enter fixed amount"
                            min={0}
                          />
                        </div>
                      </>
                    )}
                  </div>
                  
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setEditTarget(null)}
                      className="py-2 px-4 border rounded"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        
          {/* Targets List */}
          {savingsTargets.filter(target => !target.archived).length === 0 ? (
            <div className="text-center p-8 bg-white rounded-lg shadow">
              <p className="text-gray-500">
                You don't have any active savings targets yet. Add one to get started!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {savingsTargets.filter(target => !target.archived).map((target) => (
                <div key={target.id} className="bg-white p-4 rounded-lg shadow hover:**:visible">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold">{target.name}</h3>
                    <div className="flex gap-2 invisible">
                      <button
                        onClick={() => handleEditClick(target)}
                        className="text-sm bg-blue-500 text-white py-1 px-2 rounded hover:bg-blue-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setDepositTarget(target)}
                        className="text-sm bg-green-500 text-white py-1 px-2 rounded hover:bg-green-600"
                      >
                        Deposit
                      </button>
                      <button
                        onClick={() => archiveTarget(target.id)}
                        className="text-sm bg-yellow-500 text-white py-1 px-2 rounded hover:bg-yellow-600"
                      >
                        Archive
                      </button>
                      <button
                        onClick={() => deleteTarget(target.id)}
                        className="text-sm bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  <div className="mb-2">
                    <div className="flex justify-between text-sm mb-1">
                      <span>
                        Progress: {calculateProgress(target).toFixed(1)}%
                      </span>
                      <span>
                        ${target.currentAmount.toFixed(2)} / $
                        {target.goalAmount.toFixed(2)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="h-2.5 rounded-full"
                        style={{
                          width: `${Math.min(calculateProgress(target), 100)}%`,
                          backgroundColor: target.color,
                        }}
                      ></div>
                    </div>
                  </div>

                  {target.type === "periodic" && (
                    <div className="text-sm text-gray-600">
                      <p>
                        {target.percentageOfIncome > 0
                          ? `Saving ${target.percentageOfIncome}% of income ${target.period}`
                          : `Saving $${target.fixedAmount} ${target.period}`}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Stats Summary */}
        {savingsTargets.length > 0 && (
          <div className="p-4 bg-white rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Savings Summary</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3 bg-blue-100 rounded">
                <p className="text-sm text-blue-800">Total Saved</p>
                <p className="text-2xl font-bold">
                  $
                  {savingsTargets
                    .reduce((sum, target) => sum + target.currentAmount, 0)
                    .toFixed(2)}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded">
                <p className="text-sm text-green-800">Total Goals</p>
                <p className="text-2xl font-bold">
                  $
                  {savingsTargets
                    .reduce((sum, target) => sum + target.goalAmount, 0)
                    .toFixed(2)}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded">
                <p className="text-sm text-purple-800">Active Targets</p>
                <p className="text-2xl font-bold">{savingsTargets.filter(target => !target.archived).length}</p>
              </div>
              <div className="p-3 bg-orange-100 rounded">
                <p className="text-sm text-orange-800">Completed Targets</p>
                <p className="text-2xl font-bold">
                  {savingsTargets.filter(target => target.currentAmount >= target.goalAmount).length}
                </p>
              </div>
            </div>
          </div>
        )}
      
        {/* Archived Targets Dashboard */}
        {savingsTargets.filter(target => target.archived).length > 0 && (
          <div className="my-8">
            <div className="flex mb-4">
            <h2 className="text-xl font-semibold">Your Archived Targets</h2>
          </div>
        
          {/* Targets List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {savingsTargets.filter(target => target.archived).map(target => (
              <div key={target.id} className="bg-white p-4 rounded-lg shadow opacity-50 hover:opacity-100 hover:**:visible">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold">{target.name}</h3>
                  <div className="flex gap-2 invisible">
                    <button
                      onClick={() => restoreTarget(target.id)}
                      className="text-sm bg-green-500 text-white py-1 px-2 rounded hover:bg-green-600"
                    >
                      Restore
                    </button>
                    <button
                      onClick={() => deleteTarget(target.id)}
                      className="text-sm bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                
                <div className="mb-2">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Progress: {calculateProgress(target).toFixed(1)}%</span>
                    <span>${target.currentAmount.toFixed(2)} / ${target.goalAmount.toFixed(2)}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="h-2.5 rounded-full"
                      style={{
                        width: `${Math.min(calculateProgress(target), 100)}%`,
                        backgroundColor: target.color
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        )}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/Profile" element={<ProfilePage />} />
        <Route path="/SavingsApp" element={<SavingsApp />} />
      </Routes>
    </Router>
  );
}