import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import 'boxicons/css/boxicons.min.css';
import DefaultAvatar from '../../assets/avatar.png';
import { API_BASE_URL } from '../../config/apiConfig';
import { useToast } from '../common/Toast';

const Navbar = ({ user }) => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const searchRef = useRef(null);
  
  // Notification state
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(false);
  const notificationRef = useRef(null);

  // Add state for message count
  const [unreadMessageCount, setUnreadMessageCount] = useState(0);

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  // Fetch notifications and count
  useEffect(() => {
    const fetchUnreadCounts = async () => {
      if (!user) return;
      
      try {
        const token = localStorage.getItem('token');
        
        // Fetch notification count
        const notifResponse = await fetch(`${API_BASE_URL}/users/notifications/count`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (notifResponse.ok) {
          const notifData = await notifResponse.json();
          setUnreadCount(notifData.count);
        }
        
        // Fetch message count
        const msgResponse = await fetch(`${API_BASE_URL}/messages/unread-count`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (msgResponse.ok) {
          const msgData = await msgResponse.json();
          setUnreadMessageCount(msgData.count);
        }
      } catch (error) {
        console.error('Error fetching unread counts:', error);
      }
    };
    
    fetchUnreadCounts();
    
    // Poll for updates
    const intervalId = setInterval(fetchUnreadCounts, 30000);
    
    return () => clearInterval(intervalId);
  }, [user]);
  
  // Fetch notifications when dropdown is opened
  const fetchNotifications = async () => {
    if (!user) return;
    
    setIsLoadingNotifications(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/users/notifications`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setNotifications(data);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setIsLoadingNotifications(false);
    }
  };
  
  // Toggle notifications dropdown
  const toggleNotifications = () => {
    if (!showNotifications) {
      fetchNotifications();
    }
    setShowNotifications(!showNotifications);
  };
  
  // Mark notification as read
  const markAsRead = async (notificationId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/users/notifications/mark-read`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify([notificationId])
      });
      
      if (response.ok) {
        // Update local state
        setNotifications(prev => 
          prev.map(notification => 
            notification.id === notificationId 
              ? { ...notification, read: true } 
              : notification
          )
        );
        
        // Update unread count
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
      addToast('Failed to mark notification as read', 'error');
    }
  };
  
  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/users/notifications/mark-all-read`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        // Update local state
        setNotifications(prev => 
          prev.map(notification => ({ ...notification, read: true }))
        );
        
        // Reset unread count
        setUnreadCount(0);
        addToast('All notifications marked as read', 'success');
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      addToast('Failed to mark all notifications as read', 'error');
    }
  };
  
  // Clear all notifications
  const clearAllNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/users/notifications/clear-all`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        // Clear notifications and reset count
        setNotifications([]);
        setUnreadCount(0);
        addToast('All notifications cleared', 'success');
      }
    } catch (error) {
      console.error('Error clearing all notifications:', error);
      addToast('Failed to clear notifications', 'error');
    }
  };
  
  // Handle notification click (navigate to relevant page)
  const handleNotificationClick = (notification) => {
    // Mark as read
    if (!notification.read) {
      markAsRead(notification.id);
    }
    
    // Navigate based on notification type
    switch (notification.type) {
      case 'FOLLOW':
        // Navigate to follower's profile
        navigate(`/profile/${notification.senderId}`);
        break;
      case 'LIKE':
      case 'COMMENT':
      case 'SHARE':
        // Navigate to the post
        navigate(`/post/${notification.resourceId}`);
        break;
      default:
        // Default behavior - just close the dropdown
        break;
    }
    
    setShowNotifications(false);
  };

  // Add a method to refresh search results with current follow status
  const refreshSearch = async (query) => {
    setIsSearching(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/users/search?query=${encodeURIComponent(query)}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Search failed');
      }

      // Get fresh data from server with correct follow status
      const data = await response.json();
      console.log('Search results with server follow status:', data);
      setSearchResults(data);
    } catch (error) {
      console.error('Error refreshing search results:', error);
    } finally {
      setIsSearching(false);
    }
  };

  // Search users functionality - modify to use the refreshSearch method
  const searchUsers = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    await refreshSearch(query);
    setShowResults(true);
  };

  // Debounce search input
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm) {
        searchUsers(searchTerm);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  // Handle user selection from search
  const handleUserSelect = (userId) => {
    navigate(`/profile/${userId}`);
    setShowResults(false);
    setSearchTerm('');
  };

  // Handle follow/unfollow user - fixed implementation
  const handleFollowUser = async (userId, isFollowing) => {
    try {
      // Keep track of the previous state in case we need to revert
      const originalFollowState = isFollowing;
      
      // Immediately update UI for better user experience
      setSearchResults(prev => 
        prev.map(user => 
          user.id === userId 
            ? { ...user, isFollowing: !isFollowing } 
            : user
        )
      );
      
      // Make the API request based on the original state
      const token = localStorage.getItem('token');
      const endpoint = originalFollowState ? 'unfollow' : 'follow';
      
      const response = await fetch(`${API_BASE_URL}/users/${endpoint}/${userId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        // If the request failed, revert the UI change
        setSearchResults(prev => 
          prev.map(user => 
            user.id === userId 
              ? { ...user, isFollowing: originalFollowState } 
              : user
          )
        );
        
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to ${endpoint} user`);
      }
      
      // Show success message
      addToast(
        originalFollowState 
          ? 'Successfully unfollowed user' 
          : 'Successfully followed user', 
        'success'
      );
      
      // After a small delay, refresh the search results to ensure consistency with backend
      setTimeout(async () => {
        if (searchTerm) {
          try {
            const token = localStorage.getItem('token');
            const searchResponse = await fetch(`${API_BASE_URL}/users/search?query=${encodeURIComponent(searchTerm)}`, {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });
            
            if (searchResponse.ok) {
              const data = await searchResponse.json();
              // Preserve the modified follow status for the user we just changed
              const updatedResults = data.map(user => 
                user.id === userId 
                  ? { ...user, isFollowing: !originalFollowState } 
                  : user
              );
              setSearchResults(updatedResults);
            }
          } catch (err) {
            console.error('Error refreshing search results:', err);
          }
        }
      }, 500); // Half-second delay to ensure backend processing completes
      
    } catch (error) {
      console.error(`Error ${isFollowing ? 'unfollowing' : 'following'} user:`, error);
      addToast(error.message || `Failed to ${isFollowing ? 'unfollow' : 'follow'} user. Please try again.`, 'error');
    }
  };

  // Format notification time
  const formatTime = (dateTime) => {
    if (!dateTime) return '';
    
    const date = new Date(dateTime);
    const now = new Date();
    const diffMs = now - date;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);
    
    if (diffSec < 60) return 'just now';
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHour < 24) return `${diffHour}h ago`;
    if (diffDay < 7) return `${diffDay}d ago`;
    
    return date.toLocaleDateString();
  };

  // Ensure focus events also trigger a refresh of search results
  const handleSearchFocus = () => {
    if (searchTerm.trim()) {
      refreshSearch(searchTerm);
      setShowResults(true);
    }
  };

  // Add useEffect to refresh search results when component mounts or user changes
  useEffect(() => {
    // If there's an active search when the component mounts or user changes,
    // refresh the results to get the current follow status
    if (searchTerm.trim() && showResults) {
      refreshSearch(searchTerm);
    }
  }, [user]);

  return (
    <nav className="bg-gradient-to-r from-slate-900/90 to-slate-800/90 backdrop-blur-lg shadow-xl sticky top-0 z-50 border-b border-slate-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <span 
              className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent text-xl font-bold cursor-pointer mr-6 tracking-wider"
              onClick={() => navigate('/dashboard')}
            >
              StudyTube
            </span>
            
            {/* Search Bar */}
            <div className="relative" ref={searchRef}>
              <div className="relative">
                <input
                  type="text"
                  className="bg-slate-800/50 border border-slate-600/50 backdrop-blur-sm text-white rounded-full pl-10 pr-10 w-64 py-2 transition-all duration-300 focus:ring-1 focus:ring-blue-400 focus:border-blue-400 focus:shadow-glow-blue"
                  placeholder="Search for users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onFocus={handleSearchFocus}
                />
                <div className="absolute left-3 top-2.5 text-slate-400">
                  <i className='bx bx-search-alt'></i>
                </div>
                <div className="absolute right-3 top-2.5">
                  {isSearching ? (
                    <div className="animate-spin h-5 w-5 border-2 border-blue-400 border-t-transparent rounded-full"></div>
                  ) : (
                    searchTerm && (
                      <button 
                        onClick={() => setSearchTerm('')}
                        className="text-slate-400 hover:text-blue-400 transition-colors"
                      >
                        <i className='bx bx-x-circle'></i>
                      </button>
                    )
                  )}
                </div>
              </div>
              
              {/* Search Results Dropdown */}
              {showResults && (
                <div className="absolute mt-2 w-80 bg-slate-800/90 backdrop-blur-md rounded-xl shadow-glow-blue overflow-hidden z-10 border border-slate-700/50">
                  {searchResults.length > 0 ? (
                    <ul>
                      {searchResults.map((result) => (
                        <li key={result.id} className="border-b border-slate-700/50 last:border-0">
                          <div className="flex items-center justify-between p-3 hover:bg-slate-700/50 transition-colors duration-200">
                            <div 
                              className="flex items-center cursor-pointer"
                              onClick={() => handleUserSelect(result.id)}
                            >
                              <img 
                                src={result.profilePicture || DefaultAvatar} 
                                alt={result.fullName || result.username}
                                className="h-10 w-10 rounded-full object-cover border-2 border-slate-600"
                              />
                              <div className="ml-3">
                                <p className="font-medium text-white">
                                  {result.firstName && result.lastName 
                                    ? `${result.firstName} ${result.lastName}`
                                    : result.firstName || result.lastName || result.username}
                                </p>
                                <p className="text-xs text-blue-300">@{result.username}</p>
                                <p className="text-sm text-slate-400 truncate">{result.bio || 'No bio'}</p>
                              </div>
                            </div>
                            <button 
                              className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-300 ${
                                result.isFollowing 
                                  ? 'bg-slate-600 text-slate-200 hover:bg-slate-500' 
                                  : 'bg-gradient-to-r from-blue-500 to-cyan-400 text-white hover:shadow-glow-blue'
                              }`}
                              onClick={() => handleFollowUser(result.id, result.isFollowing)}
                            >
                              {result.isFollowing ? 'Unfollow' : 'Follow'}
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="p-4 text-center text-slate-400">
                      No users found matching "{searchTerm}"
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button 
              className="p-2 rounded-full bg-slate-800/50 hover:bg-blue-500/20 hover:text-blue-400 transition-all duration-300 text-slate-300"
              onClick={() => navigate('/dashboard')}
              title="Dashboard"
            >
              <i className='bx bxs-dashboard text-xl'></i>
            </button>
            
            {/* Learning Plans Button - Updated icon */}
            <button 
              className="p-2 rounded-full bg-slate-800/50 hover:bg-blue-500/20 hover:text-blue-400 transition-all duration-300 text-slate-300"
              onClick={() => navigate('/learning-plans')}
              title="Learning Plans"
            >
              <i className='bx bxs-graduation text-xl'></i>
            </button>
            
            {/* Removing Notification and Message icons */}
            
            <div className="relative ml-3">
              <div>
                <button 
                  className="flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300"
                  onClick={() => navigate('/profile')}
                  title="Profile"
                >
                  <img 
                    className="h-9 w-9 rounded-full object-cover border-2 border-blue-400/50 hover:border-blue-400 hover:shadow-glow-blue transition-all duration-300"
                    src={user?.profilePicture || DefaultAvatar} 
                    alt={user?.username || 'User'}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;