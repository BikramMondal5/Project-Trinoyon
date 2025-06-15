document.querySelector('#play-btn1').addEventListener('click',function(){
    window.location.href="frontend/games/First-game.html";
});
document.querySelector('#play-btn2').addEventListener('click',function(){
    window.location.href="frontend/games/Second-game.html";
});
document.querySelector('#play-btn3').addEventListener('click',function(){
    window.location.href="frontend/games/Third-game.html";
});
document.querySelector('#play-btn4').addEventListener('click',function(){
    window.location.href="frontend/games/Fourth-game.html";
});
document.querySelector('#play-btn5').addEventListener('click',function(){
    window.location.href="frontend/games/Fifth-game.html";
});
document.querySelector('#play-btn6').addEventListener('click',function(){
    window.location.href="frontend/games/Sixth-game.html";
});
document.querySelector('#play-btn7').addEventListener('click',function(){
    window.location.href="frontend/games/Seventh-game.html";
});
document.querySelector('#play-btn8').addEventListener('click',function(){
    window.location.href="frontend/games/Eighth-game.html";
});
document.querySelector('#play-btn9').addEventListener('click',function(){
    window.location.href="frontend/games/Ninth-game.html";
});
document.querySelector('#play-btn10').addEventListener('click',function(){
    window.location.href="frontend/games/Tenth-game.html";
});
document.querySelector('#play-btn11').addEventListener('click',function(){
    window.location.href="frontend/games/Eleventh-game.html";
});
document.querySelector('#play-btn12').addEventListener('click',function(){
    window.location.href="frontend/games/Twelveth-game.html";
});
document.querySelector('#play-pacman').addEventListener('click',function(){
    window.location.href="../pacman/index.html";
});


  document.addEventListener("DOMContentLoaded", function () {
    const username = localStorage.getItem("loggedInUser");
    const signInBtn = document.getElementById("signInBtn");
    const userInfo = document.getElementById("user-info");
    const usernameDisplay = document.getElementById("usernameDisplay");

    if (username) {
      signInBtn.style.display = "none";
      userInfo.classList.remove("hidden");
      usernameDisplay.textContent = username;
    } else {
      signInBtn.style.display = "inline-block";
      userInfo.classList.add("hidden");
    }
  });

  function logout() {
    localStorage.removeItem("loggedInUser");
    location.reload(); // Or redirect to login
  }

