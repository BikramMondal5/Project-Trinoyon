// User authentication state - removed
const API_URL = 'http://localhost:5000/api';

// Initialize EmailJS
(function() {
  // Load EmailJS with credentials from config.js
  emailjs.init(window.appConfig?.emailjs?.publicKey || "your_emailjs_public_key");
})();

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
  // Handle contact form submission
  const contactForm = document.getElementById('contactForm');
  
  if (contactForm) {
    contactForm.addEventListener('submit', function(event) {
      event.preventDefault();
      
      // Get form status element
      const statusElement = document.getElementById('form-status');
      
      // Disable submit button and show loading state
      const submitButton = document.getElementById('submit-button');
      const originalButtonText = submitButton.innerHTML;
      submitButton.disabled = true;
      submitButton.innerHTML = 'Sending...';
      
      // Prepare template parameters
      const templateParams = {
        from_name: document.getElementById('from_name').value,
        reply_to: document.getElementById('reply_to').value,
        subject: document.getElementById('subject').value,
        message: document.getElementById('message').value,
        is_volunteer: document.getElementById('volunteer').checked ? 'Yes' : 'No',
        to_email: "codesnippets45@gmail.com" // Adding recipient email
      };
      
      // Get EmailJS credentials from config file
      const serviceID = window.appConfig?.emailjs?.serviceID || "service_xxx";
      const templateID = window.appConfig?.emailjs?.templateID || "template_xxx";
      
      // Send the form using EmailJS
      emailjs.send(serviceID, templateID, templateParams)
        .then(function(response) {
          console.log('SUCCESS!', response.status, response.text);
          
          // Show success message
          statusElement.classList.remove('hidden', 'bg-red-500');
          statusElement.classList.add('bg-green-500', 'text-white');
          statusElement.innerHTML = 'Message sent successfully! We\'ll get back to you soon.';
          
          // Reset form
          contactForm.reset();
        })
        .catch(function(error) {
          console.log('FAILED...', error);
          
          // Show error message
          statusElement.classList.remove('hidden', 'bg-green-500');
          statusElement.classList.add('bg-red-500', 'text-white');
          statusElement.innerHTML = 'Failed to send message. Please try again later.';
        })
        .finally(function() {
          // Re-enable submit button
          submitButton.disabled = false;
          submitButton.innerHTML = originalButtonText;
        });
    });
  }

  // Initialize rest of the application
  initApp();
});