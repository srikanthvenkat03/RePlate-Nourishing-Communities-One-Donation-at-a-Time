document.addEventListener("DOMContentLoaded", function() {
  // Attach event listeners to login and signup buttons
  const loginButtons = document.querySelectorAll('.button-login');
  loginButtons.forEach(btn => {
    btn.addEventListener('click', function(e) {
      showLoginForm(e.currentTarget);
    });
  });

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

  let headerMessage = clickedButton.closest('.top') ?
    `<h2 class="login-form-header">For Government</h2>` :
    `<h2 class="login-form-header">Welcome Back!</h2>
     <p class="login-form-subheader">It's nice to see you again.</p>`;

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

    document.getElementById('login-final-btn').addEventListener('click', async function() {
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      try {
        const response = await fetch('/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        const data = await response.json();
        if (response.ok) {
          console.log('Login successful', data);
          // Redirect based on user_type:
          if (data.user.user_type === 'government') {
            window.location.href = '/html/food-info.html';
          } else if (data.user.user_type === 'restaurant') {
            window.location.href = '/html/restaurant-dashboard.html';
          } else {
            // Fallback redirection if needed.
            window.location.href = '/html/index.html';
          }
        } else {
          alert(data.error || 'Login failed');
        }
      } catch (err) {
        console.error('Login error:', err);
      }
    });

    document.getElementById('back-btn').addEventListener('click', function() {
      const container = document.querySelector('.login-form-container');
      if (container) {
        container.classList.add('fade-out');
        setTimeout(() => window.location.href = "/html/index.html", 200);
      } else {
        window.location.href = "/html/index.html";
      }
    });
  }, 200);
}

function showSignupForm(clickedButton) {
  const rightContainer = document.querySelector('.right');
  const topContainer = rightContainer.querySelector('.top');
  const bottomContainer = rightContainer.querySelector('.bottom');
  if (topContainer) topContainer.classList.add('fade-out');
  if (bottomContainer) bottomContainer.classList.add('fade-out');

  setTimeout(() => {
    if (topContainer) topContainer.remove();
    if (bottomContainer) bottomContainer.remove();

    const formContainer = document.createElement('div');
    formContainer.className = 'signup-form-container';
    formContainer.innerHTML = `
      <button class="back-button" id="back-btn">Back</button>
      <div class="signup-form">
        <h2 class="signup-form-header">Join Us!</h2>
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
          <input type="email" id="email" name="email" placeholder="Enter your email">
        </div>
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

    document.getElementById('signup-final-btn').addEventListener('click', async function() {
      const username = document.getElementById('user-name').value;
      const restaurant_name = document.getElementById('restaurant-name').value;
      const email = document.getElementById('email').value;
      const phone = document.getElementById('phone').value;
      const password = document.getElementById('password').value;
      // For signup, user_type is fixed to "restaurant"
      const user_type = 'restaurant';
      try {
        const response = await fetch('/api/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, email, password, restaurant_name, phone, user_type })
        });
        const data = await response.json();
        if (response.ok) {
          console.log('Signup successful', data);
          // After signup, restaurant users go to their dashboard
          window.location.href = '/html/restaurant-dashboard.html';
        } else {
          alert(data.error || 'Signup failed');
        }
      } catch (err) {
        console.error('Signup error:', err);
      }
    });

    document.getElementById('back-btn').addEventListener('click', function() {
      const container = document.querySelector('.signup-form-container');
      if (container) {
        container.classList.add('fade-out');
        setTimeout(() => window.location.href = "/html/index.html", 200);
      } else {
        window.location.href = "/html/index.html";
      }
    });
  }, 200);
}
