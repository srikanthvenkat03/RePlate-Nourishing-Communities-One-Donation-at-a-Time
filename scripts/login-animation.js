document.addEventListener("DOMContentLoaded", function() {
  // Existing login button event listeners
  const loginButtons = document.querySelectorAll('.button-login');
  loginButtons.forEach(btn => {
    btn.addEventListener('click', function(e) {
      showLoginForm(e.currentTarget);
    });
  });

  // New signup button event listener
  const signupButtons = document.querySelectorAll('.button-signup');
  signupButtons.forEach(btn => {
    btn.addEventListener('click', function(e) {
      showSignupForm(e.currentTarget);
    });
  });
});

function showLoginForm(clickedButton) {
  const rightContainer = document.querySelector('.right');
  const topContainer = rightContainer.querySelector('.top');
  const bottomContainer = rightContainer.querySelector('.bottom');

  let headerMessage = '';
  if (clickedButton.closest('.top')) {
    headerMessage = `<h2 class="login-form-header">For Government</h2>`;
  } else if (clickedButton.closest('.bottom')) {
    headerMessage = `<h2 class="login-form-header">Welcome Back !</h2>
                     <p class="login-form-subheader">Its nice to see you again.</p>`;
  }

  if (topContainer) topContainer.classList.add('fade-out');
  if (bottomContainer) bottomContainer.classList.add('fade-out');

  setTimeout(() => {
    if (topContainer) topContainer.remove();
    if (bottomContainer) bottomContainer.remove();

    const formContainer = document.createElement('div');
    formContainer.className = 'login-form-container';

    formContainer.innerHTML = `
      <button class="back-button" id="back-btn">Back</button>
      <div class="login-form">
        ${headerMessage}
        <div class="form-group animate-email">
          <label for="email">Email or Username:</label>
          <input type="text" id="email" name="email" placeholder="Enter your email or username">
        </div>
        <div class="form-group animate-password">
          <label for="password">Password:</label>
          <input type="password" id="password" name="password" placeholder="Enter your password">
        </div>
        <button class="button-login-final animate-button" id="login-final-btn">Login</button>
      </div>
    `;
    rightContainer.appendChild(formContainer);

    const loginFinalBtn = document.getElementById('login-final-btn');
    loginFinalBtn.addEventListener('click', function() {
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      console.log('Logging in with', email, password);
      // Further login processing logic…
    });

    const backBtn = document.getElementById('back-btn');
    backBtn.addEventListener('click', function() {
      const container = document.querySelector('.login-form-container');
      if (container) {
        container.classList.add('fade-out');
        setTimeout(function() {
          window.location.href = "login.html";
        }, 200);
      } else {
        window.location.href = "login.html";
      }
    });
  }, 200);
}

function showSignupForm(clickedButton) {
  const rightContainer = document.querySelector('.right');
  const topContainer = rightContainer.querySelector('.top');
  const bottomContainer = rightContainer.querySelector('.bottom');

  // Fade out the original sections
  if (topContainer) topContainer.classList.add('fade-out');
  if (bottomContainer) bottomContainer.classList.add('fade-out');

  // After fade-out, remove old sections and inject the signup form
  setTimeout(() => {
    if (topContainer) topContainer.remove();
    if (bottomContainer) bottomContainer.remove();

    // Create a new container for the signup form
    const formContainer = document.createElement('div');
    formContainer.className = 'signup-form-container';

    formContainer.innerHTML = `
      <button class="back-button" id="back-btn">Back</button>
      <div class="signup-form">
        <h2 class="signup-form-header">Join Us !</h2>
        <div class="form-group animate-username">
          <label for="user-name">User Name:</label>
          <input type="text" id="user-name" name="user-name" placeholder="Enter your user name">
        </div>
        <div class="form-group animate-restaurant">
          <label for="restaurant-name">Restaurant Name:</label>
          <input type="text" id="restaurant-name" name="restaurant-name" placeholder="Enter your restaurant name">
        </div>
        <div class="form-group animate-email">
          <label for="email">Email:</label>
          <input type="email" id="email" name="email" placeholder="Enter your email or phone">
        <div class="form-group animate-phone">
          <label for="phone">Phone:</label>
          <input type="text" id="phone" name="phone" placeholder="Enter your phone">
        </div>
        <div class="form-group animate-password">
          <label for="password">Password:</label>
          <input type="password" id="password" name="password" placeholder="Enter your password">
        </div>
        <button class="button-signup-final animate-button" id="signup-final-btn">Signup</button>
      </div>
    `;
    rightContainer.appendChild(formContainer);

    // Signup button logic
    const signupFinalBtn = document.getElementById('signup-final-btn');
    signupFinalBtn.addEventListener('click', function() {
      const userName = document.getElementById('user-name').value;
      const restaurantName = document.getElementById('restaurant-name').value;
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      console.log('Signing up with', userName, restaurantName, email, password);
      // Further signup processing logic…
    });

    // Back button logic
    const backBtn = document.getElementById('back-btn');
    backBtn.addEventListener('click', function() {
      const container = document.querySelector('.signup-form-container');
      if (container) {
        container.classList.add('fade-out');
        setTimeout(function() {
          window.location.href = "login.html";
        }, 200);
      } else {
        window.location.href = "login.html";
      }
    });
  }, 200);
}
