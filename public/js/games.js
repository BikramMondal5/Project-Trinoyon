// API URL
const API_URL = 'http://localhost:3002/api';

// Game navigation handlers - Direct navigation without authentication
document.querySelector('#play-btn2').addEventListener('click', function() {
  window.location.href = "/Second-game"; 
});
document.querySelector('#play-btn3').addEventListener('click', function() {
  window.location.href = "/Third-game"; 
});
document.querySelector('#play-btn4').addEventListener('click', function() {
  window.location.href = "/Fourth-game"; 
});
document.querySelector('#play-btn5').addEventListener('click', function() {
  window.location.href = "/Fifth-game"; 
});
document.querySelector('#play-btn6').addEventListener('click', function() {
  window.location.href = "/Sixth-game"; 
});

document.querySelector('#play-btn7').addEventListener('click', function() {
  window.location.href = "/Seventh-game"; 
});
document.querySelector('#play-btn1').addEventListener('click', function() {
  window.location.href = "/First-game"; 
});
document.querySelector('#play-btn8').addEventListener('click', function() {
  window.location.href = "/Eighth-game"; 
});
document.querySelector('#play-btn9').addEventListener('click', function() {
  window.location.href = "/Ninth-game"; 
});
document.querySelector('#play-btn10').addEventListener('click', function() {
  window.location.href = "/Tenth-game"; 
});
document.querySelector('#play-btn11').addEventListener('click', function() {
  window.location.href = "/Eleventh-game"; 
});
document.querySelector('#play-btn12').addEventListener('click', function() {
  window.location.href = "/Twelveth-game"; 
});

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

