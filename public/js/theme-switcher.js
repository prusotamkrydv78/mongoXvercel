/**
 * Theme Switcher
 * Handles theme switching functionality across the application
 */
document.addEventListener('DOMContentLoaded', function() {
  // Theme toggle button
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = themeToggle ? themeToggle.querySelector('i') : null;
  
  // Check if there's a saved theme preference
  const savedTheme = localStorage.getItem('theme');
  
  // Apply theme based on saved preference or system preference
  if (savedTheme) {
    if (savedTheme === 'dark') {
      document.body.classList.add('dark-theme');
      if (themeIcon) themeIcon.classList.replace('fa-moon', 'fa-sun');
    } else {
      document.body.classList.remove('dark-theme');
      if (themeIcon) themeIcon.classList.replace('fa-sun', 'fa-moon');
    }
  } else {
    // Check system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (prefersDark) {
      document.body.classList.add('dark-theme');
      if (themeIcon) themeIcon.classList.replace('fa-moon', 'fa-sun');
    }
  }
  
  // Theme toggle click handler
  if (themeToggle) {
    themeToggle.addEventListener('click', function() {
      document.body.classList.toggle('dark-theme');
      
      if (document.body.classList.contains('dark-theme')) {
        localStorage.setItem('theme', 'dark');
        themeIcon.classList.replace('fa-moon', 'fa-sun');
      } else {
        localStorage.setItem('theme', 'light');
        themeIcon.classList.replace('fa-sun', 'fa-moon');
      }
      
      // Dispatch a custom event for other components to react to theme change
      document.dispatchEvent(new CustomEvent('themeChanged', {
        detail: {
          isDarkTheme: document.body.classList.contains('dark-theme')
        }
      }));
    });
  }
  
  // Listen for system preference changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    if (!localStorage.getItem('theme')) {
      if (e.matches) {
        document.body.classList.add('dark-theme');
        if (themeIcon) themeIcon.classList.replace('fa-moon', 'fa-sun');
      } else {
        document.body.classList.remove('dark-theme');
        if (themeIcon) themeIcon.classList.replace('fa-sun', 'fa-moon');
      }
      
      // Dispatch theme change event
      document.dispatchEvent(new CustomEvent('themeChanged', {
        detail: {
          isDarkTheme: document.body.classList.contains('dark-theme')
        }
      }));
    }
  });
});
