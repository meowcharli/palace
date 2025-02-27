// This script injects a morphing search bar that transforms in place

document.addEventListener('DOMContentLoaded', function() {
  const searchContainer = document.getElementById('search-bar-container');
  
  if (!searchContainer) return;
  
  // Remove the fallback link
  searchContainer.innerHTML = '';
  
  // Create our morphing search UI
  let isExpanded = false;
  let searchQuery = '';
  let overlay = null;
  
  // Create the initial collapsed button
  const createCollapsedButton = () => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'inline-flex items-center bg-white text-black px-3 py-1 md:px-4 md:py-2 rounded-full text-[0.85rem] md:text-[0.95rem] border border-gray-200 transition-colors duration-200 hover:bg-[#FFEFF4] hover:text-[#89131F]';
    button.setAttribute('aria-label', 'Search');
    button.innerHTML = `
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        class="h-4 w-4 mr-1" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor"
      >
        <path 
          stroke-linecap="round" 
          stroke-linejoin="round" 
          stroke-width="2" 
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
        />
      </svg>
      Search
    `;
    
    button.addEventListener('click', expandSearch);
    return button;
  };
  
  // Create the expanded search input
  const createExpandedSearch = () => {
    const form = document.createElement('form');
    form.className = 'relative flex items-center';
    form.style.width = '280px';
    
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (searchQuery.trim()) {
        window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
      }
    });
    
    const inputContainer = document.createElement('div');
    inputContainer.className = 'relative w-full';
    
    const input = document.createElement('input');
    input.type = 'text';
    input.value = searchQuery;
    input.placeholder = 'Search articles...';
    input.className = 'w-full bg-white text-black border border-gray-200 rounded-full py-1 pl-4 pr-20 md:py-2 focus:outline-none focus:ring-2 focus:ring-[#89131F]';
    
    input.addEventListener('input', (e) => {
      searchQuery = e.target.value;
    });
    
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'absolute right-0 top-0 h-full flex items-center pr-2';
    
    const submitBtn = document.createElement('button');
    submitBtn.type = 'submit';
    submitBtn.className = 'h-full px-2 flex items-center justify-center text-gray-500 hover:text-[#89131F]';
    submitBtn.setAttribute('aria-label', 'Submit search');
    submitBtn.innerHTML = `
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        class="h-4 w-4" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor"
      >
        <path 
          stroke-linecap="round" 
          stroke-linejoin="round" 
          stroke-width="2" 
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
        />
      </svg>
    `;
    
    const closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.className = 'h-full px-2 flex items-center justify-center text-gray-500 hover:text-[#89131F]';
    closeBtn.setAttribute('aria-label', 'Close search');
    closeBtn.innerHTML = `
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        class="h-4 w-4" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor"
      >
        <path 
          stroke-linecap="round" 
          stroke-linejoin="round" 
          stroke-width="2" 
          d="M6 18L18 6M6 6l12 12" 
        />
      </svg>
    `;
    
    closeBtn.addEventListener('click', collapseSearch);
    
    buttonContainer.appendChild(submitBtn);
    buttonContainer.appendChild(closeBtn);
    
    inputContainer.appendChild(input);
    inputContainer.appendChild(buttonContainer);
    
    form.appendChild(inputContainer);
    
    // Focus the input after a brief delay
    setTimeout(() => {
      input.focus();
    }, 50);
    
    return form;
  };
  
  // Create a dimmed overlay
  const createOverlay = () => {
    const overlayElement = document.createElement('div');
    overlayElement.className = 'fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300';
    overlayElement.style.opacity = '0';
    document.body.appendChild(overlayElement);
    
    // Trigger reflow and animate in
    setTimeout(() => {
      overlayElement.style.opacity = '1';
    }, 10);
    
    overlayElement.addEventListener('click', collapseSearch);
    
    return overlayElement;
  };
  
  // Expand the search
  const expandSearch = () => {
    if (isExpanded) return;
    
    isExpanded = true;
    
    // Clear the container
    searchContainer.innerHTML = '';
    
    // Add the overlay
    overlay = createOverlay();
    
    // Add expanded search UI
    searchContainer.appendChild(createExpandedSearch());
    
    // Add keyboard listener for Escape
    document.addEventListener('keydown', handleEscKey);
  };
  
  // Collapse the search
  const collapseSearch = () => {
    if (!isExpanded) return;
    
    isExpanded = false;
    searchQuery = '';
    
    // Remove the overlay
    if (overlay) {
      overlay.style.opacity = '0';
      setTimeout(() => {
        document.body.removeChild(overlay);
        overlay = null;
      }, 300);
    }
    
    // Clear the container
    searchContainer.innerHTML = '';
    
    // Add collapsed button
    searchContainer.appendChild(createCollapsedButton());
    
    // Remove keyboard listener
    document.removeEventListener('keydown', handleEscKey);
  };
  
  // Handle Escape key
  const handleEscKey = (e) => {
    if (e.key === 'Escape') {
      collapseSearch();
    }
  };
  
  // Initialize with collapsed button
  searchContainer.appendChild(createCollapsedButton());
});
