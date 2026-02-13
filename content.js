// Simple test to see if the script even runs
console.log("=== EXTENSION CONTENT SCRIPT LOADED ===");
console.log("Current URL:", window.location.href);
console.log("Document ready state:", document.readyState);

// Check if we can find any elements
setTimeout(() => {
  console.log("=== 5 SECOND CHECK ===");
  console.log("Body exists:", !!document.body);
  console.log("All elements with ID:", Array.from(document.querySelectorAll('[id]')).map(el => el.id));
  
  const textarea = document.getElementById("prompt-textarea");
  console.log("prompt-textarea found:", !!textarea);
  
  const button = document.getElementById("composer-submit-button");
  console.log("composer-submit-button found:", !!button);
  
  // Try to find elements by other means
  const allTextareas = document.querySelectorAll('textarea');
  console.log("All textareas found:", allTextareas.length);
  
  const allButtons = document.querySelectorAll('button');
  console.log("All buttons found:", allButtons.length);
}, 5000);

// Original functionality
function enableSubmitButton() {
  const button = document.getElementById("composer-submit-button");
  if (button) {
    button.disabled = false;
    console.log("✓ Submit button ENABLED!");
    return true;
  }
  console.log("✗ Submit button not found");
  return false;
}

function setupTextareaMonitor() {
  const textarea = document.getElementById("prompt-textarea");
  
  if (textarea) {
    console.log("✓ Found prompt-textarea, setting up monitors...");
    
    const pElement = textarea.querySelector('p[data-placeholder], p');
    
    if (pElement) {
      console.log("✓ Found p element inside textarea");
      
      const textObserver = new MutationObserver(() => {
        console.log("→ Text changed in textarea");
        enableSubmitButton();
      });
      
      textObserver.observe(pElement, {
        characterData: true,
        childList: true,
        subtree: true
      });
      
      pElement.addEventListener('input', () => {
        console.log("→ Input event detected");
        enableSubmitButton();
      });
      
      console.log("✓ Monitoring set up successfully!");
    } else {
      console.log("✗ Could not find p element inside textarea");
    }
    
    const buttonObserver = new MutationObserver(() => {
      enableSubmitButton();
    });
    
    const formOrParent = textarea.closest('form') || textarea.parentElement;
    if (formOrParent) {
      buttonObserver.observe(formOrParent, {
        childList: true,
        subtree: true
      });
      console.log("✓ Button observer set up");
    }
    
    return true;
  }
  
  console.log("✗ prompt-textarea not found");
  return false;
}

if (setupTextareaMonitor()) {
  console.log("✓ Textarea monitor set up immediately");
} else {
  console.log("→ Waiting for prompt-textarea to appear...");
  
  const observer = new MutationObserver(() => {
    if (setupTextareaMonitor()) {
      observer.disconnect();
      console.log("✓ Textarea monitor set up after waiting");
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}
