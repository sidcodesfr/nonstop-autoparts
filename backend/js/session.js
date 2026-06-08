document.addEventListener('DOMContentLoaded', async () => {
  const logoutBtn = document.getElementById('logout-btn');
  const accountLink = document.getElementById('account-link');

  try {
    const response = await fetch('/auth/user', {
      credentials: 'include'
    });

    if (response.ok) {
      const user = await response.json();

      // Show logout icon
      if (logoutBtn) logoutBtn.style.display = 'inline-block';

      // Redirect "My Account" icon to user profile
      if (accountLink) accountLink.href = 'user_profile.html';
    } else {
      // User not logged in
      if (logoutBtn) logoutBtn.style.display = 'none';
      if (accountLink) accountLink.href = 'loginpagefinal.html';
    }
  } catch (err) {
    console.error('Session check failed:', err);
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', async (e) => {
      e.preventDefault();

      const logoutRes = await fetch('/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });

      if (logoutRes.ok) {
        window.location.href = 'loginpagefinal.html';
      } else {
        alert('Logout failed. Please try again.');
      }
    });
  }
});