// User authentication state
let userProfile = null;
const API_URL = 'http://localhost:5000/api';

// Handle user login
async function handleLogin(event) {
  event.preventDefault();
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;

  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      // Store user profile and token
      userProfile = {
        id: data.user.id,
        email: data.user.email,
        name: data.user.name,
        given_name: data.user.name.split(' ')[0],
        token: data.token,
        auth_time: new Date().getTime()
      };
      
      // Save to localStorage
      localStorage.setItem('userProfile', JSON.stringify(userProfile));
      
      // Update UI
      updateAuthUI();
      
      // Close the modal
      const authModal = document.getElementById('authModal');
      if (authModal) {
        authModal.classList.add('hidden');
      }
      
      // Show welcome toast
      showToast(`Welcome back, ${userProfile.given_name}!`, 'success');
    } else {
      showToast(data.message || 'Login failed', 'error');
    }
  } catch (err) {
    console.error('Login error:', err);
    showToast('Server error, please try again', 'error');
  }
}

// Handle user signup
async function handleSignup(event) {
  event.preventDefault();
  const name = document.getElementById('signupName').value;
  const email = document.getElementById('signupEmail').value;
  const password = document.getElementById('signupPassword').value;

  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      // Store user profile and token
      userProfile = {
        id: data.user.id,
        email: data.user.email,
        name: data.user.name,
        given_name: data.user.name.split(' ')[0],
        token: data.token,
        auth_time: new Date().getTime()
      };
      
      // Save to localStorage
      localStorage.setItem('userProfile', JSON.stringify(userProfile));
      
      // Update UI
      updateAuthUI();
      
      // Close the modal
      const authModal = document.getElementById('authModal');
      if (authModal) {
        authModal.classList.add('hidden');
      }
      
      // Show welcome toast
      showToast(`Welcome, ${userProfile.given_name}!`, 'success');
    } else {
      showToast(data.message || 'Registration failed', 'error');
    }
  } catch (err) {
    console.error('Signup error:', err);
    showToast('Server error, please try again', 'error');
  }
}

// Check if authentication is valid
async function isAuthValid() {
  if (!userProfile || !userProfile.token) return false;
  
  try {
    const response = await fetch(`${API_URL}/auth/profile`, {
      headers: {
        'Authorization': `Bearer ${userProfile.token}`
      }
    });

    return response.ok;
  } catch (err) {
    console.error('Auth validation error:', err);
    return false;
  }
}

// Function to toggle between login and signup forms
function toggleAuthForm(form) {
  const loginForm = document.getElementById('loginForm');
  const signupForm = document.getElementById('signupForm');
  const authTitle = document.getElementById('authTitle');
  const authSubtitle = document.getElementById('authSubtitle');

  if (form === 'signup') {
    loginForm.classList.add('hidden');
    signupForm.classList.remove('hidden');
    authTitle.textContent = 'Create Account';
    authSubtitle.textContent = 'Sign up to join our community';
  } else {
    loginForm.classList.remove('hidden');
    signupForm.classList.add('hidden');
    authTitle.textContent = 'Welcome Back';
    authSubtitle.textContent = 'Sign in to continue';
  }
}

// Sign out function
async function signOut() {
  userProfile = null;
  localStorage.removeItem('userProfile');
  
  // Reset button styles immediately
  const signInBtn = document.getElementById('signInBtn');
  const mobileSignInBtn = document.getElementById('mobileSignInBtn');
  
  if (signInBtn) {
    signInBtn.classList.remove('bg-transparent', 'border', 'border-primary', 'hover:bg-transparent');
    signInBtn.classList.add('bg-primary', 'hover:bg-primary/90');
  }
  
  if (mobileSignInBtn) {
    mobileSignInBtn.classList.remove('bg-transparent', 'border', 'border-primary', 'hover:bg-transparent');
    mobileSignInBtn.classList.add('bg-primary', 'hover:bg-primary/90');
  }
  
  updateAuthUI();
  showToast('You have been signed out', 'info');
}

// Show toast notification
function showToast(message, type = 'info') {
  // Create toast container if it doesn't exist
  let toastContainer = document.getElementById('toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    toastContainer.className = 'fixed bottom-4 right-4 z-50 flex flex-col gap-2';
    document.body.appendChild(toastContainer);
  }
  
  // Create toast element
  const toast = document.createElement('div');
  
  // Set toast style based on type
  let bgColor = 'bg-blue-500';
  if (type === 'success') bgColor = 'bg-green-500';
  if (type === 'error') bgColor = 'bg-red-500';
  if (type === 'warning') bgColor = 'bg-yellow-500';
  
  toast.className = `${bgColor} text-white px-4 py-2 rounded-md shadow-lg transform transition-all duration-300 flex items-center`;
  toast.innerHTML = `<span>${message}</span>`;
  
  // Add to container
  toastContainer.appendChild(toast);
  
  // Remove after 3 seconds
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 3000);
}

// Update UI based on auth state
function updateAuthUI() {
  const signInBtn = document.getElementById('signInBtn');
  const mobileSignInBtn = document.getElementById('mobileSignInBtn');
  
  if (!signInBtn) return;
  
  if (userProfile) {
    // Change button style to transparent with border
    signInBtn.classList.remove('bg-primary', 'hover:bg-primary/90');
    signInBtn.classList.add('bg-transparent', 'border', 'border-primary', 'hover:bg-transparent');
    
    // Create user menu for desktop
    signInBtn.innerHTML = `
      <div class="flex items-center gap-2">
        <div class="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
          <span class="text-primary text-sm">${userProfile.given_name[0]}</span>
        </div>
        <span class="text-primary">${userProfile.given_name}</span>
      </div>
    `;
    
    // Update mobile button
    if (mobileSignInBtn) {
      mobileSignInBtn.classList.remove('bg-primary', 'hover:bg-primary/90');
      mobileSignInBtn.classList.add('bg-transparent', 'border', 'border-primary', 'hover:bg-transparent');
      
      mobileSignInBtn.innerHTML = `
        <div class="flex items-center gap-2">
          <div class="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
            <span class="text-primary text-sm">${userProfile.given_name[0]}</span>
          </div>
          <span class="text-primary">${userProfile.given_name}</span>
        </div>
      `;
    }
    
    // Update sign in button to show dropdown on click
    signInBtn.onclick = function(e) {
      e.preventDefault();
      
      // Create dropdown if it doesn't exist
      let dropdown = document.getElementById('user-dropdown');
      if (!dropdown) {
        dropdown = document.createElement('div');
        dropdown.id = 'user-dropdown';
        dropdown.className = 'absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50';
        dropdown.innerHTML = `
          <div class="px-4 py-2 border-b border-gray-100">
            <p class="text-sm font-medium text-gray-900">${userProfile.name}</p>
            <p class="text-xs text-gray-500">${userProfile.email}</p>
          </div>
          <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profile</a>
          <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Donation History</a>
          <button id="sign-out-btn" class="w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-gray-100">Sign out</button>
        `;
        
        // Position the dropdown
        const rect = signInBtn.getBoundingClientRect();
        dropdown.style.top = `${rect.bottom}px`;
        dropdown.style.right = `${window.innerWidth - rect.right}px`;
        
        document.body.appendChild(dropdown);
        
        // Add sign out event listener
        document.getElementById('sign-out-btn').addEventListener('click', function() {
          signOut();
          dropdown.remove();
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function closeDropdown(e) {
          if (!dropdown.contains(e.target) && e.target !== signInBtn) {
            dropdown.remove();
            document.removeEventListener('click', closeDropdown);
          }
        });
      } else {
        dropdown.remove();
      }
    };
    
    // Update mobile sign in button to show sign out option
    if (mobileSignInBtn) {
      mobileSignInBtn.onclick = function() {
        if (confirm('Do you want to sign out?')) {
          signOut();
        }
      };
    }
    
    // Update email field if on contact page
    const emailInput = document.getElementById('contact-email');
    const nameInput = document.getElementById('contact-name');
    if (emailInput) {
      emailInput.value = userProfile.email;
      emailInput.setAttribute('readonly', true);
      
      // Also prefill name if available
      if (nameInput && !nameInput.value) {
        nameInput.value = userProfile.name;
      }
    }
  } else {
    // Reset to default state
    signInBtn.textContent = 'Sign In';
    
    // Reset button style to original
    signInBtn.classList.remove('bg-transparent', 'border', 'border-primary');
    signInBtn.classList.add('bg-primary');
    
    signInBtn.onclick = function() {
      document.getElementById('authModal').classList.remove('hidden');
    };
    
    if (mobileSignInBtn) {
      mobileSignInBtn.textContent = 'Sign In';
      
      // Reset mobile button style to original
      mobileSignInBtn.classList.remove('bg-transparent', 'border', 'border-primary');
      mobileSignInBtn.classList.add('bg-primary');
      
      mobileSignInBtn.onclick = function() {
        document.getElementById('authModal').classList.remove('hidden');
      };
    }
    
    // Clear readonly on email field if on contact page
    const emailInput = document.getElementById('contact-email');
    if (emailInput) {
      emailInput.removeAttribute('readonly');
      if (emailInput.value === userProfile?.email) {
        emailInput.value = '';
      }
    }
  }
}

// Function to initialize the application
function initApp() {
  // Quiz button initialization if it exists
  const quizBtn = document.getElementById('quiz-btn');
  if (quizBtn) {
    quizBtn.addEventListener('click', function () {
      initializeQuizOptions();
    });
  }

  // Process payment function for donation form
  window.processPayment = function(event) {
    event.preventDefault();
    
    // Get the amount from the form
    const amount = document.getElementById('amount').value;
    const name = document.getElementById('name').value || "Donor";
    
    if (!amount || amount <= 0) {
      showToast("Please enter a valid donation amount", "warning");
      return;
    }
    
    // Use the openGooglePay function to redirect to Google Pay app
    openGooglePay(amount);
  };

  // Contact form submission handler
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function(event) {
      event.preventDefault();
      
      // Check if user is authenticated
      if (!userProfile || !isAuthValid()) {
        // Show authentication modal if not signed in or auth expired
        showToast("Please sign in to submit the form", "info");
        authModal.classList.remove('hidden');
        return;
      }
      
      // Get form data
      const name = document.getElementById('contact-name').value;
      const email = userProfile.email; // Use authenticated email
      const subject = document.getElementById('contact-subject').value;
      const message = document.getElementById('contact-message').value;
      const isVolunteer = document.getElementById('volunteer').checked;
      
      // Show loading state
      const submitButton = document.getElementById('contact-submit-btn');
      const originalButtonText = submitButton.textContent;
      submitButton.textContent = 'Sending...';
      submitButton.disabled = true;
      
      // Construct mailto URL with form data
      const volunteerText = isVolunteer ? "\n\nI am interested in volunteering." : "";
      const mailtoSubject = `${subject} - Contact Form Submission from ${name}`;
      const mailtoBody = `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}${volunteerText}`;
      const mailtoUrl = `mailto:codesnippets45@gmail.com?subject=${encodeURIComponent(mailtoSubject)}&body=${encodeURIComponent(mailtoBody)}`;
      
      // Open default email client with pre-filled email
      window.location.href = mailtoUrl;
      
      // Show success message after a short delay
      setTimeout(() => {
        submitButton.textContent = originalButtonText;
        submitButton.disabled = false;
        showToast("Message sent successfully!", "success");
        
        // Reset the form
        contactForm.reset();
        
        // Restore the authenticated user's email in the form
        document.getElementById('contact-email').value = userProfile.email;
      }, 1000);
    });
  }

  // Add event listener for donation form
  const donationForm = document.getElementById('donationForm');
  const proceedToPayBtn = document.getElementById('proceedToPayBtn');
  
  if (donationForm && proceedToPayBtn) {
    proceedToPayBtn.addEventListener('click', function() {
      const amount = document.getElementById('amount').value;
      
      if (!amount || isNaN(amount) || amount <= 0) {
        showToast("Please enter a valid donation amount", "warning");
        return;
      }
      
      // Use the openGooglePay function to redirect to Google Pay app
      // without passing the amount parameter
      openGooglePay();
    });
  }

  // Mobile menu toggle
  const menuButton = document.getElementById("menuButton");
  const mobileMenu = document.getElementById("mobileMenu");
  if (menuButton && mobileMenu) {
    const menuIcon = menuButton.querySelector("i");

    menuButton.addEventListener("click", () => {
      const isOpen = mobileMenu.classList.contains("hidden");
      mobileMenu.classList.toggle("hidden");
      if (menuIcon) {
        menuIcon.className = isOpen ? "ri-close-line ri-lg" : "ri-menu-line ri-lg";
      }
    });

    // Close mobile menu when clicking outside
    document.addEventListener("click", (event) => {
      const isClickInside =
        menuButton.contains(event.target) || mobileMenu.contains(event.target);
      if (!isClickInside && !mobileMenu.classList.contains("hidden")) {
        mobileMenu.classList.add("hidden");
        if (menuIcon) {
          menuIcon.className = "ri-menu-line ri-lg";
        }
      }
    });

    // Close mobile menu when window is resized to desktop size
    window.addEventListener("resize", () => {
      if (window.innerWidth >= 1024 && !mobileMenu.classList.contains("hidden")) {
        mobileMenu.classList.add("hidden");
        if (menuIcon) {
          menuIcon.className = "ri-menu-line ri-lg";
        }
      }
    });
  }

  // Quiz options selection
  function initializeQuizOptions() {
    const quizOptions = document.querySelectorAll(".quiz-option");
    if (quizOptions.length === 0) return; // Exit if no quiz options found

    quizOptions.forEach((option) => {
      option.addEventListener("click", function () {
        quizOptions.forEach((opt) => opt.classList.remove("selected"));
        this.classList.add("selected");

        // Update the radio button visual
        quizOptions.forEach((opt) => {
          const radio = opt.querySelector("div > div");
          if (opt.classList.contains("selected")) {
            radio.classList.add("bg-primary/20", "border-primary");
            radio.classList.remove("border-gray-400");
            radio.innerHTML = '<div class="w-2 h-2 rounded-full bg-primary"></div>';
          } else {
            radio.classList.remove("bg-primary/20", "border-primary");
            radio.classList.add("border-gray-400");
            radio.innerHTML = "";
          }
        });
      });
    });
  }

  // Initialize quiz options if they exist
  initializeQuizOptions();
  
  // Initialize Impact Chart
  const chartDom = document.getElementById("impactChart");
  if (chartDom) {
    const myChart = echarts.init(chartDom);
    const option = {
      animation: false,
      tooltip: {
        trigger: "axis",
        backgroundColor: "rgba(255, 255, 255, 0.8)",
        borderColor: "#ddd",
        borderWidth: 1,
        textStyle: {
          color: "#333",
        },
      },
      legend: {
        data: [
          "Meals Served",
          "People Sheltered",
          "Clothing Items",
          "Medical Checkups",
        ],
        bottom: 0,
      },
      grid: {
        top: 20,
        right: 20,
        bottom: 60,
        left: 60,
      },
      xAxis: {
        type: "category",
        data: [
          "Day 1",
          "Day 2",
          "Day 3",
          "Day 4",
          "Day 5",
          "Day 6",
          "Day 7",
          "Day 8",
          "Day 9",
        ],
        axisLine: {
          lineStyle: {
            color: "#ddd",
          },
        },
        axisLabel: {
          color: "#1f2937",
        },
      },
      yAxis: {
        type: "value",
        axisLine: {
          lineStyle: {
            color: "#ddd",
          },
        },
        axisLabel: {
          color: "#1f2937",
        },
        splitLine: {
          lineStyle: {
            color: "#eee",
          },
        },
      },
      series: [
        {
          name: "Meals Served",
          type: "line",
          smooth: true,
          data: [0, 0, 0, 0, 0, 0, 0, 0, 0],
          itemStyle: {
            color: "rgba(87, 181, 231, 1)",
          },
          areaStyle: {
            color: {
              type: "linear",
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: "rgba(87, 181, 231, 0.2)",
                },
                {
                  offset: 1,
                  color: "rgba(87, 181, 231, 0.05)",
                },
              ],
            },
          },
        },
        {
          name: "People Sheltered",
          type: "line",
          smooth: true,
          data: [0, 0, 0, 0, 0, 0, 0, 0, 0],
          itemStyle: {
            color: "rgba(141, 211, 199, 1)",
          },
          areaStyle: {
            color: {
              type: "linear",
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: "rgba(141, 211, 199, 0.2)",
                },
                {
                  offset: 1,
                  color: "rgba(141, 211, 199, 0.05)",
                },
              ],
            },
          },
        },
        {
          name: "Clothing Items",
          type: "line",
          smooth: true,
          data: [0, 0, 0, 0, 0, 0, 0, 0, 0],
          itemStyle: {
            color: "rgba(251, 191, 114, 1)",
          },
          areaStyle: {
            color: {
              type: "linear",
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: "rgba(251, 191, 114, 0.2)",
                },
                {
                  offset: 1,
                  color: "rgba(251, 191, 114, 0.05)",
                },
              ],
            },
          },
        },
        {
          name: "Medical Checkups",
          type: "line",
          smooth: true,
          data: [0, 0, 0, 0, 0, 0, 0, 0, 0],
          itemStyle: {
            color: "rgba(252, 141, 98, 1)",
          },
          areaStyle: {
            color: {
              type: "linear",
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: "rgba(252, 141, 98, 0.2)",
                },
                {
                  offset: 1,
                  color: "rgba(252, 141, 98, 0.05)",
                },
              ],
            },
          },
        },
      ],
    };
    myChart.setOption(option);
    
    // Responsive chart
    window.addEventListener("resize", function () {
      myChart.resize();
    });
  }
}

// Main document ready function
document.addEventListener("DOMContentLoaded", async function () {
  // Check if user is already signed in (from localStorage)
  const savedProfile = localStorage.getItem('userProfile');
  if (savedProfile) {
    try {
      userProfile = JSON.parse(savedProfile);
      // Check if auth is still valid
      if (await isAuthValid()) {
        updateAuthUI();
      } else {
        // Auth expired, clear it
        userProfile = null;
        localStorage.removeItem('userProfile');
      }
    } catch (e) {
      localStorage.removeItem('userProfile');
    }
  }

  // Initialize rest of the application
  initApp();
});