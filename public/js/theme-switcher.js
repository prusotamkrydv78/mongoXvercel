/**
 * Theme Switcher
 * Handles theme switching functionality across the application
 */

// Define the theme switcher as a global object to avoid conflicts
window.ThemeSwitcher = {
  // Initialize the theme switcher
  init: function() {
    // Theme toggle button
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = themeToggle ? themeToggle.querySelector('i') : null;

    // Apply theme based on saved preference or system preference
    this.applyTheme(themeIcon);

    // Theme toggle click handler
    if (themeToggle) {
      themeToggle.addEventListener('click', () => {
        this.toggleTheme(themeIcon);
      });
    }

    // Listen for system preference changes
    this.listenForSystemChanges(themeIcon);
  },

  // Apply the theme based on saved preference or system preference
  applyTheme: function(themeIcon) {
    const savedTheme = localStorage.getItem('theme');
    const body = document.body;

    if (savedTheme) {
      this.setTheme(savedTheme, themeIcon);
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.setTheme(prefersDark ? 'dark' : 'light', themeIcon);
    }
  },

  // Set the theme to dark or light
  setTheme: function(theme, themeIcon) {
    const body = document.body;
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');

    if (theme === 'dark') {
      body.classList.add('dark-theme');
      if (themeIcon) {
        themeIcon.className = ''; // Clear all classes
        themeIcon.classList.add('fas', 'fa-sun');
      }

      // Update meta theme color for mobile browsers
      if (metaThemeColor) {
        metaThemeColor.setAttribute('content', '#1e293b'); // dark navbar color
      }
    } else {
      body.classList.remove('dark-theme');
      if (themeIcon) {
        themeIcon.className = ''; // Clear all classes
        themeIcon.classList.add('fas', 'fa-moon');
      }

      // Update meta theme color for mobile browsers
      if (metaThemeColor) {
        metaThemeColor.setAttribute('content', '#1f2937'); // light navbar color
      }
    }

    // Store the theme preference
    localStorage.setItem('theme', theme);

    // Dispatch a custom event for other components to react to theme change
    this.dispatchThemeChangedEvent();
  },

  // Toggle between dark and light theme
  toggleTheme: function(themeIcon) {
    const body = document.body;
    const isDarkTheme = body.classList.contains('dark-theme');

    this.setTheme(isDarkTheme ? 'light' : 'dark', themeIcon);
  },

  // Listen for system preference changes
  listenForSystemChanges: function(themeIcon) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
      if (!localStorage.getItem('theme')) {
        this.setTheme(e.matches ? 'dark' : 'light', themeIcon);
      }
    });
  },

  // Dispatch a custom event for theme changes
  dispatchThemeChangedEvent: function() {
    document.dispatchEvent(new CustomEvent('themeChanged', {
      detail: {
        isDarkTheme: document.body.classList.contains('dark-theme')
      }
    }));
  }
};

// Initialize the theme switcher when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  window.ThemeSwitcher.init();
});
