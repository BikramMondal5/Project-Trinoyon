// API URL
const API_URL = 'http://localhost:5000/api';

// Game navigation handlers
document.querySelector('#play-btn1').addEventListener('click', function(){ checkAuthAndRedirect("frontend/games/First-game.html"); });
document.querySelector('#play-btn2').addEventListener('click', function(){ checkAuthAndRedirect("frontend/games/Second-game.html"); });
document.querySelector('#play-btn3').addEventListener('click', function(){ checkAuthAndRedirect("frontend/games/Third-game.html"); });
document.querySelector('#play-btn4').addEventListener('click', function(){ checkAuthAndRedirect("frontend/games/Fourth-game.html"); });
document.querySelector('#play-btn5').addEventListener('click', function(){ checkAuthAndRedirect("frontend/games/Fifth-game.html"); });
document.querySelector('#play-btn6').addEventListener('click', function(){ checkAuthAndRedirect("frontend/games/Sixth-game.html"); });
document.querySelector('#play-btn7').addEventListener('click', function(){ checkAuthAndRedirect("frontend/games/Seventh-game.html"); });
document.querySelector('#play-btn8').addEventListener('click', function(){ checkAuthAndRedirect("frontend/games/Eighth-game.html"); });
document.querySelector('#play-btn9').addEventListener('click', function(){ checkAuthAndRedirect("frontend/games/Ninth-game.html"); });
document.querySelector('#play-btn10').addEventListener('click', function(){ checkAuthAndRedirect("frontend/games/Tenth-game.html"); });
document.querySelector('#play-btn11').addEventListener('click', function(){ checkAuthAndRedirect("frontend/games/Eleventh-game.html"); });
document.querySelector('#play-btn12').addEventListener('click', function(){ checkAuthAndRedirect("frontend/games/Twelveth-game.html"); });
document.querySelector('#play-pacman').addEventListener('click', function(){ checkAuthAndRedirect("../pacman/index.html"); });
document.querySelector('#play-threefps').addEventListener('click', function(){ checkAuthAndRedirect("../three-fps/build/index.html"); });

// Function to check auth before redirecting
async function checkAuthAndRedirect(url) {
  const userProfile = JSON.parse(localStorage.getItem('userProfile'));
  if (!userProfile || !userProfile.token) {
    // Show authentication modal if not signed in
    document.getElementById('authModal').classList.remove('hidden');
    return;
  }
  
  try {
    // Validate token with backend
    const response = await fetch(`${API_URL}/auth/profile`, {
      headers: {
        'Authorization': `Bearer ${userProfile.token}`
      }
    });

    if (!response.ok) {
      // Token invalid, clear it and show auth modal
      localStorage.removeItem('userProfile');
      document.getElementById('authModal').classList.remove('hidden');
      return;
    }
    
    // If authenticated, track game access and redirect
    try {
      await fetch(`${API_URL}/games/access`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userProfile.token}`
        },
        body: JSON.stringify({
          game_id: url.split('/').pop().split('.')[0]
        })
      });
    } catch (err) {
      console.error('Failed to track game access:', err);
      // Continue with redirect even if tracking fails
    }
    
    // Redirect to game
    window.location.href = url;
  } catch (err) {
    console.error('Auth validation error:', err);
    showToast('Authentication error, please try again', 'error');
    document.getElementById('authModal').classList.remove('hidden');
  }
}

// Authentication modal script
const authModal = document.getElementById('authModal');
const signInBtn = document.getElementById('signInBtn');
const mobileSignInBtn = document.getElementById('mobileSignInBtn');
const closeAuthModal = document.getElementById('closeAuthModal');
const userInfo = document.getElementById("user-info");
const usernameDisplay = document.getElementById("usernameDisplay");

// Initialize UI
async function initializeAuthUI() {
  const userProfile = JSON.parse(localStorage.getItem('userProfile'));
  if (userProfile && userProfile.token) {
    try {
      // Validate token with backend
      const response = await fetch(`${API_URL}/auth/profile`, {
        headers: {
          'Authorization': `Bearer ${userProfile.token}`
        }
      });

      if (response.ok) {
        signInBtn.style.display = "none";
        userInfo.classList.remove("hidden");
        usernameDisplay.textContent = userProfile.name;
      } else {
        // Token invalid, reset UI
        localStorage.removeItem('userProfile');
        signInBtn.style.display = "inline-block";
        userInfo.classList.add("hidden");
      }
    } catch (err) {
      console.error('Auth validation error:', err);
      localStorage.removeItem('userProfile');
      signInBtn.style.display = "inline-block";
      userInfo.classList.add("hidden");
    }
  } else {
    signInBtn.style.display = "inline-block";
    userInfo.classList.add("hidden");
  }
}

// Show toast notification
function showToast(message, type = 'info') {
  let toastContainer = document.getElementById('toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    toastContainer.className = 'fixed bottom-4 right-4 z-50 flex flex-col gap-2';
    document.body.appendChild(toastContainer);
  }
  
  const toast = document.createElement('div');
  
  let bgColor = 'bg-blue-500';
  if (type === 'success') bgColor = 'bg-green-500';
  if (type === 'error') bgColor = 'bg-red-500';
  if (type === 'warning') bgColor = 'bg-yellow-500';
  
  toast.className = `${bgColor} text-white px-4 py-2 rounded-md shadow-lg transform transition-all duration-300 flex items-center`;
  toast.innerHTML = `<span>${message}</span>`;
  
  toastContainer.appendChild(toast);
  
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 3000);
}

// Event Listeners
signInBtn.addEventListener('click', () => {
  authModal.classList.remove('hidden');
});

mobileSignInBtn.addEventListener('click', () => {
  authModal.classList.remove('hidden');
});

closeAuthModal.addEventListener('click', () => {
  authModal.classList.add('hidden');
});

// Close modal when clicking outside
authModal.addEventListener('click', (e) => {
  if (e.target === authModal) {
    authModal.classList.add('hidden');
  }
});

// Initialize UI on page load
document.addEventListener("DOMContentLoaded", initializeAuthUI);

