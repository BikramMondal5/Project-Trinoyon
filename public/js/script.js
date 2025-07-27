// User authentication state - REMOVED
const API_URL = 'http://localhost:5000/api';

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
      
      // Get form data
      const name = document.getElementById('contact-name').value;
      const email = document.getElementById('contact-email').value;
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
document.addEventListener("DOMContentLoaded", function () {
  // Initialize the application
  initApp();
});