(function () {
  'use strict';

  // Get the script tag that loaded this widget
  const currentScript = document.currentScript || document.querySelector('script[data-id]');
  const workspaceId = currentScript?.getAttribute('data-id');

  if (!workspaceId) {
    console.error('Vouchy Widget: Missing data-id attribute');
    return;
  }

  // Determine the base URL for the embed
  const scriptSrc = currentScript.src;
  // Remove /widget.js from the end to get the app root
  const baseUrl = scriptSrc.substring(0, scriptSrc.lastIndexOf('/'));

  // Create iframe
  const iframe = document.createElement('iframe');
  iframe.src = `${baseUrl}/embed/${workspaceId}`;
  iframe.style.width = '100%';
  iframe.style.height = '800px'; // Default height
  iframe.style.border = 'none';
  iframe.style.borderRadius = '12px';
  iframe.style.overflow = 'hidden';
  iframe.title = 'Testimonials Widget';

  // Accessibility
  iframe.setAttribute('loading', 'lazy');

  // Container
  const container = document.createElement('div');
  container.id = `vouchy-widget-${workspaceId}`;
  container.style.width = '100%';
  container.className = 'vouchy-widget-embed';
  container.appendChild(iframe);

  // Insert widget after the script tag
  if (currentScript.parentNode) {
    currentScript.parentNode.insertBefore(container, currentScript.nextSibling);
  }

  // Handle resizing if the iframe sends messages (for future proofing)
  window.addEventListener('message', (event) => {
    // Simple security check: ensure origin matches base URL
    // Note: baseUrl might be relative if sourced relatively, but usually it's absolute
    // if (event.origin !== baseUrl) return; 

    if (event.data && event.data.type === 'vouchy-resize' && event.data.height) {
      iframe.style.height = `${event.data.height}px`;
    }
  });

})();
