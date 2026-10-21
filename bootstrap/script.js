document.addEventListener('DOMContentLoaded', () => {

  // 1. Fitur Toggle Show/Hide Password
  const togglePasswordIcons = document.querySelectorAll('.toggle-password');

  togglePasswordIcons.forEach(icon => {
    icon.addEventListener('click', () => {
      const targetId = icon.getAttribute('data-target');
      const passwordInput = document.getElementById(targetId);

      if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        icon.classList.remove('bi-eye-slash');
        icon.classList.add('bi-eye');
      } else {
        passwordInput.type = 'password';
        icon.classList.remove('bi-eye');
        icon.classList.add('bi-eye-slash');
      }
    });
  });

  // 2. Validasi Password Match pada Register
  const registerForm = document.getElementById('registerForm');
  const registerPassword = document.getElementById('registerPassword');
  const confirmPassword = document.getElementById('confirmPassword');

  registerForm.addEventListener('submit', (e) => {
    if (registerPassword.value !== confirmPassword.value) {
      e.preventDefault();
      alert('Kata sandi dan konfirmasi kata sandi tidak cocok!');
      confirmPassword.focus();
    }
  });

});