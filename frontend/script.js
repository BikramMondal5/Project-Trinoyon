document.getElementById('quiz-btn').addEventListener('click', function () {
  initializeQuizOptions();
});
document.addEventListener("DOMContentLoaded", function () {
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

  // Mobile menu toggle
  const menuButton = document.getElementById("menuButton");
  const mobileMenu = document.getElementById("mobileMenu");
  const menuIcon = menuButton.querySelector("i");

  menuButton.addEventListener("click", () => {
    const isOpen = mobileMenu.classList.contains("hidden");
    mobileMenu.classList.toggle("hidden");
    menuIcon.className = isOpen ? "ri-close-line ri-lg" : "ri-menu-line ri-lg";
  });

  // Close mobile menu when clicking outside
  document.addEventListener("click", (event) => {
    const isClickInside =
      menuButton.contains(event.target) || mobileMenu.contains(event.target);
    if (!isClickInside && !mobileMenu.classList.contains("hidden")) {
      mobileMenu.classList.add("hidden");
      menuIcon.className = "ri-menu-line ri-lg";
    }
  });

  // Close mobile menu when window is resized to desktop size
  window.addEventListener("resize", () => {
    if (window.innerWidth >= 1024 && !mobileMenu.classList.contains("hidden")) {
      mobileMenu.classList.add("hidden");
      menuIcon.className = "ri-menu-line ri-lg";
    }
  });

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


  // Don't forget to call the function
  initializeQuizOptions();
});

document.addEventListener("DOMContentLoaded", function () {
  // Initialize Impact Chart
  const chartDom = document.getElementById("impactChart");
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
});