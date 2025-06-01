
(() => {
  const estimateTokens = (text) => Math.ceil(text.trim().length / 4);

  const createBadge = () => {
    let existing = document.getElementById('floating-token-badge');
    if (existing) return;

    let badge = document.createElement('div');
    badge.id = 'floating-token-badge';
    badge.style.position = 'absolute';
    badge.style.bottom = '4px';
    badge.style.right = '8px';
    badge.style.background = 'rgba(0,0,0,0.75)';
    badge.style.color = '#fff';
    badge.style.padding = '4px 8px';
    badge.style.borderRadius = '8px';
    badge.style.fontSize = '12px';
    badge.style.zIndex = '9999';
    badge.style.fontFamily = 'monospace';
    badge.textContent = '~0 tokens';

    let wrapper = document.getElementById('chat-input')?.closest('.relative');
    if (wrapper) {
      wrapper.style.position = 'relative';
      wrapper.appendChild(badge);
    }
  };

  const updateBadge = () => {
    const editor = document.getElementById('chat-input');
    const badge = document.getElementById('floating-token-badge');
    if (!badge || !editor) return;

    const visibleText = editor.innerText.trim();
    const count = estimateTokens(visibleText);
    badge.textContent = `~${count} tokens`;
  };

  const attachAll = () => {
    const editor = document.getElementById('chat-input');
    if (!editor) return;

    createBadge();
    updateBadge();

    editor.addEventListener('input', updateBadge);
    editor.addEventListener('blur', updateBadge);
    editor.addEventListener('paste', () => setTimeout(updateBadge, 50));

    const observer = new MutationObserver(() => updateBadge());
    observer.observe(editor, { childList: true, subtree: true, characterData: true });
  };

  const observeForEditor = () => {
    const root = document.body;
    const shellObserver = new MutationObserver(() => {
      if (document.getElementById('chat-input') && !document.getElementById('floating-token-badge')) {
        setTimeout(attachAll, 100);
      }
    });
    shellObserver.observe(root, { childList: true, subtree: true });
  };

  // Initial load
  setTimeout(() => {
    attachAll();
    observeForEditor();
  }, 500);
})();
