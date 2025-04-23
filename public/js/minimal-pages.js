/**
 * Minimal Pages JavaScript
 * Shared functionality for minimalistic pages
 */
document.addEventListener('DOMContentLoaded', function() {
  // Handle responsive tables
  const tables = document.querySelectorAll('.table');
  if (tables.length > 0) {
    tables.forEach(table => {
      const wrapper = document.createElement('div');
      wrapper.classList.add('table-responsive');
      table.parentNode.insertBefore(wrapper, table);
      wrapper.appendChild(table);
    });
  }
  
  // Handle card hover effects
  const cards = document.querySelectorAll('.minimal-card, .bookmark-card, .post-card-minimal');
  if (cards.length > 0) {
    cards.forEach(card => {
      card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-5px)';
        this.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.1)';
        this.style.transition = 'transform 0.3s, box-shadow 0.3s';
      });
      
      card.addEventListener('mouseleave', function() {
        this.style.transform = '';
        this.style.boxShadow = '';
      });
    });
  }
  
  // Handle theme changes for charts
  document.addEventListener('themeChanged', function(e) {
    const isDarkTheme = e.detail.isDarkTheme;
    
    // Update Chart.js charts if they exist
    if (window.Chart && Chart.instances) {
      Object.values(Chart.instances).forEach(chart => {
        if (chart.options.scales && chart.options.scales.x) {
          chart.options.scales.x.grid.color = isDarkTheme ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
          chart.options.scales.y.grid.color = isDarkTheme ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
          chart.options.scales.x.ticks.color = isDarkTheme ? '#adb5bd' : '#6c757d';
          chart.options.scales.y.ticks.color = isDarkTheme ? '#adb5bd' : '#6c757d';
          chart.update();
        }
      });
    }
  });
  
  // Handle form validation
  const forms = document.querySelectorAll('form');
  if (forms.length > 0) {
    forms.forEach(form => {
      form.addEventListener('submit', function(e) {
        if (!form.checkValidity()) {
          e.preventDefault();
          e.stopPropagation();
        }
        
        form.classList.add('was-validated');
      }, false);
    });
  }
  
  // Handle tooltips
  const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
  if (tooltipTriggerList.length > 0 && typeof bootstrap !== 'undefined') {
    tooltipTriggerList.map(function(tooltipTriggerEl) {
      return new bootstrap.Tooltip(tooltipTriggerEl);
    });
  }
  
  // Handle confirmation dialogs
  const confirmButtons = document.querySelectorAll('[data-confirm]');
  if (confirmButtons.length > 0) {
    confirmButtons.forEach(button => {
      button.addEventListener('click', function(e) {
        const message = this.getAttribute('data-confirm') || 'Are you sure you want to proceed?';
        if (!confirm(message)) {
          e.preventDefault();
        }
      });
    });
  }
  
  // Handle mobile navigation
  const mobileNav = document.querySelector('.settings-nav');
  if (mobileNav) {
    const handleMobileNav = () => {
      if (window.innerWidth < 768) {
        mobileNav.classList.add('mobile-nav');
      } else {
        mobileNav.classList.remove('mobile-nav');
      }
    };
    
    handleMobileNav();
    window.addEventListener('resize', handleMobileNav);
  }
});
