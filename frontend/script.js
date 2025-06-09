// User authentication state
let userProfile = null;

// Google auth callback function - must be in global scope for Google Sign-In
window.handleCredentialResponse = function(response) {
  try {
    // Decode the JWT token
    const base64Url = response.credential.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    
    const responsePayload = JSON.parse(jsonPayload);
    
    // Store user profile
    userProfile = {
      email: responsePayload.email,
      name: responsePayload.name,
      given_name: responsePayload.given_name,
      picture: responsePayload.picture
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
    
    console.log("User authenticated:", userProfile);
  } catch (error) {
    console.error("Authentication error:", error);
    alert("Authentication failed. Please try again.");
    
    // Close the modal even on error
    const authModal = document.getElementById('authModal');
    if (authModal) {
      authModal.classList.add('hidden');
    }
  }
};

// Handle authentication errors
window.handleAuthError = function(error) {
  console.error("Google Sign-In Error:", error);
  alert("Sign-in failed. Please try again later.");
};

// Update UI based on auth state
function updateAuthUI() {
  const signInBtn = document.getElementById('signInBtn');
  const mobileSignInBtn = document.getElementById('mobileSignInBtn');
  
  if (!signInBtn) return;
  
  if (userProfile) {
    signInBtn.textContent = `Hi, ${userProfile.given_name}`;
    if (mobileSignInBtn) {
      mobileSignInBtn.textContent = `Hi, ${userProfile.given_name}`;
    }
    
    // Update email field if on contact page
    const emailInput = document.getElementById('contact-email');
    if (emailInput) {
      emailInput.value = userProfile.email;
      emailInput.setAttribute('readonly', true);
    }
  } else {
    signInBtn.textContent = 'Sign Up';
    if (mobileSignInBtn) {
      mobileSignInBtn.textContent = 'Sign Up';
    }
    
    // Clear readonly on email field if on contact page
    const emailInput = document.getElementById('contact-email');
    if (emailInput) {
      emailInput.removeAttribute('readonly');
    }
  }
}

// Main document ready function
document.addEventListener("DOMContentLoaded", function () {
  // Check if user is already signed in (from localStorage)
  const savedProfile = localStorage.getItem('userProfile');
  if (savedProfile) {
    try {
      userProfile = JSON.parse(savedProfile);
      updateAuthUI();
    } catch (e) {
      localStorage.removeItem('userProfile');
    }
  }

  // Auth modal controls
  const authModal = document.getElementById('authModal');
  const signInBtn = document.getElementById('signInBtn');
  const mobileSignInBtn = document.getElementById('mobileSignInBtn');
  const closeAuthModal = document.getElementById('closeAuthModal');
  
  // Auth modal functionality
  if (signInBtn) {
    signInBtn.addEventListener('click', function() {
      if (userProfile) {
        // If already logged in, show sign out option
        if (confirm('Do you want to sign out?')) {
          userProfile = null;
          localStorage.removeItem('userProfile');
          updateAuthUI();
        }
      } else {
        // Show auth modal
        authModal.classList.remove('hidden');
      }
    });
  }
  
  if (mobileSignInBtn) {
    mobileSignInBtn.addEventListener('click', function() {
      if (userProfile) {
        // If already logged in, show sign out option
        if (confirm('Do you want to sign out?')) {
          userProfile = null;
          localStorage.removeItem('userProfile');
          updateAuthUI();
        }
      } else {
        // Show auth modal
        authModal.classList.remove('hidden');
      }
    });
  }
  
  if (closeAuthModal) {
    closeAuthModal.addEventListener('click', function() {
      authModal.classList.add('hidden');
    });
  }
  
  // Close modal when clicking outside
  if (authModal) {
    authModal.addEventListener('click', function(e) {
      if (e.target === authModal) {
        authModal.classList.add('hidden');
      }
    });
  }

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
      alert("Please enter a valid donation amount");
      return;
    }
    
    // Create UPI payment link with the specified UPI ID
    const upiId = "arijit.sarkar7156@okhdfcbank";
    const upiLink = `upi://pay?pa=${upiId}&pn=Arijit%20Sarkar&am=${amount}&cu=INR&tn=Donation%20from%20${encodeURIComponent(name)}`;
    
    // Open the UPI payment link
    window.location.href = upiLink;
  };

  // Contact form submission handler
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function(event) {
      event.preventDefault();
      
      // Check if user is authenticated
      if (!userProfile) {
        // Show authentication modal if not signed in
        authModal.classList.remove('hidden');
        return;
      }
      
      // Get form data
      const name = document.getElementById('contact-name').value;
      const email = userProfile.email; // Use authenticated email
      const subject = document.getElementById('contact-subject').value;
      const message = document.getElementById('contact-message').value;
      const isVolunteer = document.getElementById('volunteer').checked;
      
      // Email validation - redundant for Google authenticated emails, but kept for safety
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        alert('Please sign in with a valid email address');
        return;
      }
      
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
      const formStatus = document.getElementById('form-status');
      const formSuccess = document.getElementById('form-success');
      
      setTimeout(() => {
        submitButton.textContent = originalButtonText;
        submitButton.disabled = false;
        formStatus.classList.remove('hidden');
        formSuccess.classList.remove('hidden');
        
        // Reset the form
        contactForm.reset();
        
        // Restore the authenticated user's email in the form
        document.getElementById('contact-email').value = userProfile.email;
        
        // Hide success message after 5 seconds
        setTimeout(() => {
          formStatus.classList.add('hidden');
          formSuccess.classList.add('hidden');
        }, 5000);
      }, 1000);
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
});