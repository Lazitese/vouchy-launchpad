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
  let baseOrigin;
  try {
    baseOrigin = new URL(baseUrl).origin;
  } catch (e) {
    baseOrigin = null;
  }

  // Create iframe
  const iframe = document.createElement('iframe');
  iframe.src = `${baseUrl}/embed/${workspaceId}`;
  iframe.style.width = '100%';
  iframe.style.height = '800px'; // Default height
  iframe.style.border = 'none';
  iframe.style.borderRadius = '12px';
  iframe.style.overflow = 'hidden';
  iframe.title = 'Testimonials Widget';

  // Security hardening
  iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin');
  iframe.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
  iframe.setAttribute('allow', 'fullscreen');

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
    // Security check: accept resize messages only from our own embed origin
    if (baseOrigin && event.origin !== baseOrigin) return;

    if (event.data && event.data.type === 'vouchy-resize' && event.data.height) {
      iframe.style.height = `${event.data.height}px`;
    }
  });

})();
