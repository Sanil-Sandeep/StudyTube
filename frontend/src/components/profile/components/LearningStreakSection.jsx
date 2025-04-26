import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../../../config/apiConfig';

// Add refreshTrigger prop to cause component to refresh when learning updates change
const LearningStreakSection = ({ user, refreshTrigger }) => {
  const [streakData, setStreakData] = useState({
    currentStreak: 0,
    longestStreak: 0,
    lastLearningDate: null,
    heatmapData: {}
  });
  const [isLoading, setIsLoading] = useState(true);

  // Include refreshTrigger in the dependency array to refetch when it changes
  useEffect(() => {
    if (user) {
      fetchStreakData();
    }
  }, [user, refreshTrigger]);

  const fetchStreakData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/learning/streak/${user.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch streak data');
      }

      const data = await response.json();
      setStreakData(data);
    } catch (error) {
      console.error('Error fetching streak data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 shadow-lg rounded-xl p-6 mt-4 border border-indigo-100">
        <h2 className="text-lg font-semibold text-indigo-800 mb-4 flex items-center">
          <i className='bx bx-line-chart mr-2'></i>Learning Progress
        </h2>
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    );
  }

  // Function to get color based on streak count
  const getStreakColor = (streak) => {
    if (streak >= 30) return "from-accent-1 to-DarkColor";
    if (streak >= 14) return "from-accent-2 to-accent-1";
    if (streak >= 7) return "from-accent-3 to-accent-2";
    if (streak > 0) return "from-DarkColor to-accent-3";
    return "from-gray-400 to-gray-500";
  };

  // Function to get achievement level name
  const getStreakLevel = (streak) => {
    if (streak >= 30) return "Master";
    if (streak >= 14) return "Expert";
    if (streak >= 7) return "Intermediate";
    if (streak >= 3) return "Beginner";
    if (streak > 0) return "Started";
    return "No streak";
  };

  // Get time since last learning
  const getTimeSinceLastLearning = () => {
    if (!streakData.lastLearningDate) return null;
    
    const lastDate = new Date(streakData.lastLearningDate);
    const now = new Date();
    const diffDays = Math.floor((now - lastDate) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    return `${diffDays} days ago`;
  };

  // Calculate next milestone
  const getNextMilestone = () => {
    const streak = streakData.currentStreak;
    if (streak < 3) return { goal: 3, progress: streak / 3 * 100 };
    if (streak < 7) return { goal: 7, progress: streak / 7 * 100 };
    if (streak < 14) return { goal: 14, progress: streak / 14 * 100 };
    if (streak < 30) return { goal: 30, progress: streak / 30 * 100 };
    return { goal: 30, progress: 100 };
  };

  const nextMilestone = getNextMilestone();
  const streakColorClass = getStreakColor(streakData.currentStreak);
  const timeSinceLastLearning = getTimeSinceLastLearning();

  return (
    <div className="card p-6 mt-4 overflow-hidden relative">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-56 h-56 bg-gradient-to-b from-DarkColor/10 to-transparent rounded-full opacity-30 -mr-20 -mt-20 blur-2xl"></div>
      <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-t from-accent-1/10 to-transparent rounded-full opacity-30 -ml-10 -mb-10 blur-xl"></div>
      
      {/* Header section */}
      <div className="relative">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-gray-800 flex items-center">
            <i className='bx bx-line-chart text-indigo-600 mr-2 text-xl'></i>
            Learning Progress
          </h2>
          <div className="text-xs text-gray-500 flex items-center">
            <i className='bx bx-refresh mr-1'></i>
            Last updated: {new Date().toLocaleDateString()}
          </div>
        </div>

        {/* Main streak display */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Current streak card */}
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-5 shadow-sm border border-indigo-100 relative overflow-hidden">
            <div className="absolute -bottom-6 -right-6 w-32 h-32 rounded-full bg-gradient-to-tr from-indigo-100 to-purple-100 opacity-50"></div>
            
            <h3 className="text-sm font-medium text-gray-600 mb-1">Current Streak</h3>
            
            <div className="flex items-center justify-between">
              <div className="flex items-end">
                <div className={`text-4xl font-extrabold bg-gradient-to-r ${streakColorClass} bg-clip-text text-transparent`}>
                  {streakData.currentStreak}
                </div>
                <div className="text-sm ml-2 text-gray-600 mb-1">days</div>
              </div>
              
              <div className={`relative w-16 h-16 rounded-full p-0.5 bg-gradient-to-r ${streakColorClass} shadow-lg flex items-center justify-center`}>
                <div className="bg-white rounded-full w-full h-full flex items-center justify-center">
                  <div className={`text-lg font-bold bg-gradient-to-r ${streakColorClass} bg-clip-text text-transparent`}>
                    {getStreakLevel(streakData.currentStreak)}
                  </div>
                </div>
              </div>
            </div>
            
            {streakData.currentStreak > 0 ? (
              <div className="mt-2 text-sm text-indigo-600">
                <i className='bx bx-badge-check mr-1'></i>
                {streakData.currentStreak >= 7 ? "You're on fire! Keep going!" : "Great progress! Keep learning!"}
              </div>
            ) : (
              <div className="mt-2 text-sm text-gray-500">
                <i className='bx bx-bulb mr-1'></i>
                Start your learning streak today!
              </div>
            )}
          </div>
          
          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-4 h-full">
            {/* Longest streak */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex flex-col justify-center">
              <div className="text-sm text-gray-500 mb-1">Longest Streak</div>
              <div className="text-2xl font-bold text-indigo-700">{streakData.longestStreak}</div>
              <div className="text-xs text-gray-500">days in a row</div>
            </div>
            
            {/* Active days */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex flex-col justify-center">
              <div className="text-sm text-gray-500 mb-1">Active Days</div>
              <div className="text-2xl font-bold text-purple-700">
                {Object.keys(streakData.heatmapData || {}).length}
              </div>
              <div className="text-xs text-gray-500">total days</div>
            </div>
            
            {/* Last activity */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 col-span-2 flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-500">Last Learning</div>
                <div className="text-lg font-semibold text-gray-700">{timeSinceLastLearning || "Not started"}</div>
              </div>
              
              {streakData.lastLearningDate && (
                <div className={`p-2 rounded-full ${
                  (new Date() - new Date(streakData.lastLearningDate)) / (1000 * 60 * 60 * 24) < 2
                  ? "bg-green-100 text-green-600"
                  : "bg-amber-100 text-amber-600"
                }`}>
                  <i className={`bx ${
                    (new Date() - new Date(streakData.lastLearningDate)) / (1000 * 60 * 60 * 24) < 2
                    ? "bx-check"
                    : "bx-time"
                  } text-xl`}></i>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Progress section */}
        {streakData.currentStreak > 0 && (
          <div className="mb-8 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-1">
              <div className="text-sm font-medium text-gray-700">Progress to next milestone</div>
              <div className="text-sm font-medium text-indigo-600">{nextMilestone.goal} days</div>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2.5 mb-1">
              <div className={`h-2.5 rounded-full bg-gradient-to-r ${streakColorClass}`} 
                style={{ width: `${Math.min(nextMilestone.progress, 100)}%` }}></div>
            </div>
            <div className="text-xs text-gray-500">
              {streakData.currentStreak < nextMilestone.goal ? 
                `${nextMilestone.goal - streakData.currentStreak} more days to reach your next milestone` : 
                'You reached your milestone! Keep the streak going!'}
            </div>
          </div>
        )}
        
        {/* Activity heatmap */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
            <i className='bx bx-calendar-check text-indigo-500 mr-1'></i> 
            Learning Activity
          </h3>
          
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
            {Object.keys(streakData.heatmapData || {}).length > 0 ? (
              <div>
                <div className="flex flex-wrap gap-2 justify-center">
                  {Object.entries(streakData.heatmapData)
                    .sort(([dateA], [dateB]) => new Date(dateA) - new Date(dateB))
                    .slice(-28)
                    .map(([date, count]) => {
                      const formattedDate = new Date(date).toLocaleDateString(undefined, { 
                        weekday: 'short', 
                        month: 'short', 
                        day: 'numeric'
                      });
                      
                      // Generate gradient class based on count
                      const gradientClass = 
                        count > 3 ? "from-indigo-600 to-purple-600" : 
                        count > 2 ? "from-indigo-500 to-purple-500" : 
                        count > 1 ? "from-indigo-400 to-purple-400" : 
                        "from-indigo-300 to-purple-300";
                      
                      return (
                        <div 
                          key={date} 
                          className={`w-8 h-8 rounded-md flex items-center justify-center transition-all hover:scale-110 cursor-pointer shadow-sm bg-gradient-to-br ${gradientClass}`}
                          title={`${formattedDate}: ${count} learning ${count === 1 ? 'update' : 'updates'}`}
                        >
                          <span className="text-xs text-white font-bold">{count}</span>
                        </div>
                      );
                    })
                  }
                </div>
                
                <div className="mt-4 flex justify-center items-center text-xs text-gray-600 gap-3">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-gradient-to-br from-indigo-300 to-purple-300 rounded-sm"></div>
                    <span>1</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-sm"></div>
                    <span>2</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-sm"></div>
                    <span>3</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-sm"></div>
                    <span>4+</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <div className="inline-block p-4 rounded-full bg-indigo-50 mb-2">
                  <i className='bx bx-calendar-x text-3xl text-indigo-300'></i>
                </div>
                <p className="text-gray-600 font-medium">No learning activity recorded yet</p>
                <p className="text-sm text-gray-500 mt-1">Start learning to see your activity here</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Achievements badges */}
        <div className="pt-2">
          <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
            <i className='bx bx-trophy text-amber-500 mr-1'></i> 
            Milestone Achievements
          </h3>
          
          <div className="grid grid-cols-4 gap-3">
            <div className={`p-3 rounded-xl text-center transition-all ${
              streakData.currentStreak >= 3 
              ? "bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200 shadow-sm" 
              : "bg-gray-50 border border-gray-100 opacity-50"
            }`}>
              <div className={`w-10 h-10 rounded-full mx-auto flex items-center justify-center ${
                streakData.currentStreak >= 3 
                ? "bg-gradient-to-r from-amber-400 to-amber-500" 
                : "bg-gray-200"
              }`}>
                <i className={`bx bxs-flame text-xl ${
                  streakData.currentStreak >= 3 ? "text-white" : "text-gray-400"
                }`}></i>
              </div>
              <div className={`mt-2 text-xs font-medium ${
                streakData.currentStreak >= 3 ? "text-amber-700" : "text-gray-500"
              }`}>3 Days</div>
            </div>
            
            <div className={`p-3 rounded-xl text-center transition-all ${
              streakData.longestStreak >= 7 
              ? "bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 shadow-sm" 
              : "bg-gray-50 border border-gray-100 opacity-50"
            }`}>
              <div className={`w-10 h-10 rounded-full mx-auto flex items-center justify-center ${
                streakData.longestStreak >= 7 
                ? "bg-gradient-to-r from-purple-400 to-purple-500" 
                : "bg-gray-200"
              }`}>
                <i className={`bx bxs-flame text-xl ${
                  streakData.longestStreak >= 7 ? "text-white" : "text-gray-400"
                }`}></i>
              </div>
              <div className={`mt-2 text-xs font-medium ${
                streakData.longestStreak >= 7 ? "text-purple-700" : "text-gray-500"
              }`}>7 Days</div>
            </div>
            
            <div className={`p-3 rounded-xl text-center transition-all ${
              streakData.longestStreak >= 14 
              ? "bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 shadow-sm" 
              : "bg-gray-50 border border-gray-100 opacity-50"
            }`}>
              <div className={`w-10 h-10 rounded-full mx-auto flex items-center justify-center ${
                streakData.longestStreak >= 14 
                ? "bg-gradient-to-r from-blue-400 to-blue-500" 
                : "bg-gray-200"
              }`}>
                <i className={`bx bxs-flame text-xl ${
                  streakData.longestStreak >= 14 ? "text-white" : "text-gray-400"
                }`}></i>
              </div>
              <div className={`mt-2 text-xs font-medium ${
                streakData.longestStreak >= 14 ? "text-blue-700" : "text-gray-500"
              }`}>14 Days</div>
            </div>
            
            <div className={`p-3 rounded-xl text-center transition-all ${
              streakData.longestStreak >= 30 
              ? "bg-gradient-to-br from-indigo-50 to-indigo-100 border border-indigo-200 shadow-sm" 
              : "bg-gray-50 border border-gray-100 opacity-50"
            }`}>
              <div className={`w-10 h-10 rounded-full mx-auto flex items-center justify-center ${
                streakData.longestStreak >= 30 
                ? "bg-gradient-to-r from-indigo-500 to-indigo-600" 
                : "bg-gray-200"
              }`}>
                <i className={`bx bxs-crown text-xl ${
                  streakData.longestStreak >= 30 ? "text-white" : "text-gray-400"
                }`}></i>
              </div>
              <div className={`mt-2 text-xs font-medium ${
                streakData.longestStreak >= 30 ? "text-indigo-700" : "text-gray-500"
              }`}>30 Days</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearningStreakSection;