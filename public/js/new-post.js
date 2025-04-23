/**
 * New Post Page JavaScript
 * Handles functionality specific to the new post creation page
 */
document.addEventListener('DOMContentLoaded', function() {
  // Initialize Bootstrap components
  initializeBootstrapComponents();

  // Add event listener for preview button
  const previewBtn = document.getElementById('previewPostBtn');
  if (previewBtn) {
    previewBtn.addEventListener('click', function() {
      showPostPreview();
    });
  }

  /**
   * Initialize Bootstrap components
   */
  function initializeBootstrapComponents() {
    // Initialize tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    if (tooltipTriggerList.length > 0 && typeof bootstrap !== 'undefined') {
      tooltipTriggerList.map(function(tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
      });
    }

    // Initialize modals
    const previewModalElement = document.getElementById('previewModal');
    if (previewModalElement && typeof bootstrap !== 'undefined') {
      // Pre-initialize the modal to ensure it's ready
      new bootstrap.Modal(previewModalElement);
    }
  }

  /**
   * Show post preview in modal
   */
  function showPostPreview() {
    try {
      const title = document.getElementById('postTitle').value || 'Untitled Post';
      const content = document.getElementById('postContent').value || 'No content';

      // Set title and content
      document.getElementById('previewTitle').textContent = title;
      document.getElementById('previewContent').innerHTML = content.replace(/\n/g, '<br>');

      // Set category (if available)
      let categoryText = 'Uncategorized';
      const category = document.getElementById('postCategory');
      if (category && category.options && category.selectedIndex >= 0) {
        categoryText = category.options[category.selectedIndex].text;
      }
      document.getElementById('previewCategoryText').textContent = categoryText;

      // Handle tags (if available)
      const tagsContainer = document.getElementById('previewTags');
      if (tagsContainer) {
        const tagsElement = document.getElementById('postTags');
        const tags = tagsElement ? tagsElement.value : '';

        if (tags && tags.trim()) {
          const tagsList = tags.split(',').map(tag => tag.trim());
          tagsContainer.innerHTML = tagsList.map(tag =>
            `<span class="badge bg-light text-dark me-2">${tag}</span>`
          ).join('');
        } else {
          tagsContainer.innerHTML = '';
        }
      }

      // Handle images
      handleImagesPreview();

      // Show the modal
      const previewModalElement = document.getElementById('previewModal');
      if (typeof bootstrap !== 'undefined') {
        const previewModal = bootstrap.Modal.getInstance(previewModalElement) || new bootstrap.Modal(previewModalElement);
        previewModal.show();
      } else {
        console.error('Bootstrap is not loaded. Cannot show modal.');
        alert('Preview is not available. Please make sure Bootstrap is loaded.');
      }
    } catch (error) {
      console.error('Error showing preview:', error);
      alert('An error occurred while trying to show the preview. Please try again.');
    }
  }

  /**
   * Handle images preview in modal
   */
  function handleImagesPreview() {
    const previewCoverImage = document.getElementById('previewCoverImage');
    const previewCoverImageSrc = document.getElementById('previewCoverImageSrc');
    const previewContent = document.getElementById('previewContent');

    // Get selected files
    const imagesInput = document.getElementById('imagesInput');
    let selectedFiles = [];

    // Try to get files from the input element
    if (imagesInput && imagesInput.files && imagesInput.files.length > 0) {
      selectedFiles = Array.from(imagesInput.files);
    } else {
      // Try to get files from the global selectedFiles variable in the page script
      try {
        const pageScript = document.querySelector('script:not([src])');
        if (pageScript && pageScript.textContent.includes('selectedFiles')) {
          // The page has a selectedFiles variable, we'll use it from the window object
          selectedFiles = window.selectedFiles || [];
        }
      } catch (e) {
        console.error('Error accessing page script variables:', e);
      }
    }

    // Clear any existing gallery
    const existingGallery = previewContent.querySelector('.preview-gallery');
    if (existingGallery) {
      existingGallery.remove();
    }

    if (selectedFiles.length > 0) {
      // Show the first image as cover
      const reader = new FileReader();
      reader.onload = function(e) {
        previewCoverImageSrc.src = e.target.result;
        previewCoverImage.classList.remove('d-none');
      }
      reader.readAsDataURL(selectedFiles[0]);

      // If there are more images, create a gallery
      if (selectedFiles.length > 1) {
        const galleryDiv = document.createElement('div');
        galleryDiv.className = 'preview-gallery mt-4';

        // Add a heading for additional images
        const galleryHeading = document.createElement('h4');
        galleryHeading.textContent = 'Additional Images';
        galleryHeading.className = 'mb-3';
        galleryDiv.appendChild(galleryHeading);

        // Create a grid for the gallery
        const galleryGrid = document.createElement('div');
        galleryGrid.className = 'preview-gallery-grid';
        galleryDiv.appendChild(galleryGrid);

        // Add all images except the first one (which is the cover)
        for (let i = 1; i < selectedFiles.length; i++) {
          const file = selectedFiles[i];
          const reader = new FileReader();

          reader.onload = function(e) {
            const imgContainer = document.createElement('div');
            imgContainer.className = 'gallery-item';

            const img = document.createElement('img');
            img.src = e.target.result;
            img.alt = `Image ${i + 1}`;
            imgContainer.appendChild(img);

            galleryGrid.appendChild(imgContainer);
          };

          reader.readAsDataURL(file);
        }

        // Add the gallery after the content
        previewContent.appendChild(galleryDiv);
      }
    } else {
      previewCoverImage.classList.add('d-none');
    }
  }
});
