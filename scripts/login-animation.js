/* login-animation.js */
document.addEventListener("DOMContentLoaded", function() {
  // Attach event listeners to all login buttons
  const loginButtons = document.querySelectorAll('.button-login');
  loginButtons.forEach(btn => {
    btn.addEventListener('click', function(e) {
      showLoginForm(e.currentTarget);
    });
  });
});

function showLoginForm(clickedButton) {
  const rightContainer = document.querySelector('.right');
  const topContainer = rightContainer.querySelector('.top');
  const bottomContainer = rightContainer.querySelector('.bottom');

  // Determine header message based on which login button was clicked
  // Determine header message based on which login button was clicked
let headerMessage = '';
if (clickedButton.closest('.top')) {
  headerMessage = `<h2 class="login-form-header">For Government</h2>`;
} else if (clickedButton.closest('.bottom')) {
  headerMessage = `<h2 class="login-form-header">Welcome Back !</h2>
                   <p class="login-form-subheader">Its nice to see you again.</p>`;
}


  // Start fade-out of the existing containers
  if (topContainer) topContainer.classList.add('fade-out');
  if (bottomContainer) bottomContainer.classList.add('fade-out');

  // After fade-out transition (200ms), remove the old sections and inject the new login form
  setTimeout(() => {
    if (topContainer) topContainer.remove();
    if (bottomContainer) bottomContainer.remove();

    // Create a new container for the login form
    const formContainer = document.createElement('div');
    formContainer.className = 'login-form-container';

    // Inject the back button, header message, and login form (with animated elements) into the container
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

    // Attach final login logic
    const loginFinalBtn = document.getElementById('login-final-btn');
    loginFinalBtn.addEventListener('click', function() {
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      console.log('Logging in with', email, password);
      // Insert further login processing logic here.
    });

    // Attach event listener to the back button for a smooth transition back to the original page
    const backBtn = document.getElementById('back-btn');
    backBtn.addEventListener('click', function() {
      // Add fade-out to the entire login form container
      const container = document.querySelector('.login-form-container');
      if (container) {
        container.classList.add('fade-out');
        // After the fade-out animation, redirect to the original login.html page
        setTimeout(function() {
          window.location.href = "login.html"; // Change this fallback as needed.
        }, 200);
      } else {
        window.location.href = "login.html";
      }
    });
  }, 200); // Matches the fade-out transition duration
}
