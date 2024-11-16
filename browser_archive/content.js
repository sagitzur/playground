function encodeURL(url) {
  // First decode the URL to handle already encoded URLs
  let decodedUrl = decodeURIComponent(url);
  
  // Then encode it properly while preserving special characters
  return encodeURIComponent(decodedUrl)
    .replace(/%3A/g, ':')  // Preserve :
    .replace(/%3F/g, '?')  // Preserve question marks
    .replace(/%3D/g, '=')  // Preserve equals signs
    .replace(/%26/g, '&')  // Preserve ampersands
    .replace(/%2F/g, '/'); // Preserve forward slashes
    
}

function createPopup(link) {
  removePopup(link);
  
  const container = document.createElement('div');
  container.className = 'archive-popup-container';
  
  const popup = document.createElement('div');
  popup.className = 'archive-popup';
  popup.innerHTML = `
    <span class="archive-popup-text">Open in Archive.is</span>
  `;
  
  popup.addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    
    // Use the new encoding function
    const archiveUrl = 'https://archive.md/?run=1&url=' + encodeURL(link.href);
    console.log('Opening URL:', archiveUrl); // Debug log
    window.open(archiveUrl, '_blank');
  });
  
  container.appendChild(popup);
  
  const rect = link.getBoundingClientRect();
  container.style.position = 'absolute';
  container.style.left = rect.left + window.scrollX + 'px';
  container.style.top = (rect.top + window.scrollY - 40) + 'px';
  
  document.body.appendChild(container);
  link.dataset.popupContainer = true;
}

function removePopup(link) {
  const containers = document.querySelectorAll('.archive-popup-container');
  containers.forEach(container => container.remove());
  delete link.dataset.popupContainer;
}

document.addEventListener('mouseover', function(event) {
  const link = event.target.closest('a');
  if (link && !link.dataset.popupContainer) {
    createPopup(link);
  }
});

document.addEventListener('mouseout', function(event) {
  const link = event.target.closest('a');
  if (link) {
    setTimeout(() => {
      const rect = link.getBoundingClientRect();
      const mouseX = event.clientX;
      const mouseY = event.clientY;
      
      if (mouseX < rect.left || mouseX > rect.right || 
          mouseY < rect.top - 40 || mouseY > rect.bottom) {
        removePopup(link);
      }
    }, 100);
  }
});
