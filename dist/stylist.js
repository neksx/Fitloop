const launcher = document.querySelector('.launcher');
const panel = document.querySelector('.stylist');
const closeButton = document.querySelector('.close');
const backButton = document.querySelector('.back');
const form = document.querySelector('.composer');
const input = form.querySelector('input');
const sendButton = form.querySelector('.send');
const suggestions = document.querySelector('.suggestions');
const messages = document.querySelector('.messages');
const conversation = document.querySelector('.conversation');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
let transitioning = false;
const undoHistory = [];

function recordUndo(action) {
  undoHistory.push(action);
  backButton.disabled = false;
}

function setOpen(open) {
  launcher.setAttribute('aria-expanded', String(open));
  panel.classList.toggle('is-open', open);
  panel.inert = !open;
  if (open) {
    launcher.classList.remove('is-first-visit');
    closeButton.focus({ preventScroll: true });
  } else {
    launcher.focus({ preventScroll: true });
  }
}

function updateSend() {
  sendButton.disabled = transitioning || !input.value.trim();
}

const clock = new Intl.DateTimeFormat('en-GB', {
  hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Kyiv'
});
const checkIcon = '<path d="m3 8 3 3 7-7"/>';
const actionIcons = {
  Copy: '<rect x="6" y="6" width="8" height="8" rx="1"/><path d="M10 4H4v6"/>',
  Edit: '<path d="m4 11 7-7 2 2-7 7H4zm6-6 2 2"/>',
  Delete: '<path d="M3 5h10M6 5V3h4v2m2 0-1 8H5L4 5m3 2v4m2-4v4"/>'
};

function timestamp(date, className) {
  const time = document.createElement('time');
  time.dateTime = date.toISOString();
  time.textContent = clock.format(date);
  time.className = className;
  return time;
}

async function copyMessage(bubble) {
  if (bubble.querySelector('input') || bubble.classList.contains('is-copying')) return;
  bubble.classList.add('is-copying');
  const text = bubble.textContent;
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(bubble);
    selection.removeAllRanges();
    selection.addRange(range);
    const copied = document.execCommand('copy');
    selection.removeAllRanges();
    if (!copied) {
      bubble.classList.remove('is-copying');
      return;
    }
  }

  const width = bubble.getBoundingClientRect().width;
  const confirmation = document.createElement('span');
  confirmation.className = 'copy-confirmation';
  confirmation.setAttribute('role', 'status');
  confirmation.setAttribute('aria-label', 'Copied');
  confirmation.innerHTML = actionSvg(checkIcon);
  bubble.replaceChildren(confirmation);
  const compactWidth = bubble.getBoundingClientRect().width;
  await Promise.all([
    animate(bubble, [
      { width: width + 'px' },
      { width: compactWidth + 'px', offset: .24 },
      { width: compactWidth + 'px', offset: .76 },
      { width: width + 'px' }
    ], 850),
    animate(confirmation, [
      { opacity: 0 }, { opacity: 1, offset: .25 },
      { opacity: 1, offset: .72 }, { opacity: 0 }
    ], 850),
    new Promise(resolve => window.setTimeout(resolve, reducedMotion.matches ? 650 : 0))
  ]);
  bubble.textContent = text;
  bubble.classList.remove('is-copying');
}

function editMessage(message, actions, confirm, editButton) {
  if (message.querySelector('input') || message.classList.contains('is-copying')) return;
  const original = message.textContent;
  const editor = document.createElement('input');
  editor.value = original;
  editor.setAttribute('aria-label', 'Edit message. Enter to save, Escape to cancel');
  message.replaceChildren(editor);
  actions.classList.add('is-editing');
  confirm.hidden = false;
  animate(confirm, [{ opacity: 0, transform: 'scale(.86)' }, { opacity: 1, transform: 'none' }], 240);
  animate(editor, [{ opacity: .4 }, { opacity: 1 }], 220);

  let saving = false;
  async function finish(value) {
    if (saving) return;
    saving = true;
    await animate(confirm, [{ opacity: 1 }, { opacity: 0, transform: 'scale(.88)' }], 170);
    if (value !== original && message.isConnected) {
      recordUndo(() => { message.textContent = original; });
    }
    message.textContent = value;
    actions.classList.remove('is-editing');
    confirm.hidden = true;
    confirm.onclick = null;
    animate(actions, [{ opacity: 0 }, { opacity: 1 }], 240);
    animate(message, [{ opacity: .65 }, { opacity: 1 }], 240);
    if (!panel.inert) editButton.focus({ preventScroll: true });
  }

  function save() {
    const value = editor.value.trim();
    if (value) finish(value);
    else editor.focus();
  }

  confirm.onclick = save;
  editor.addEventListener('keydown', event => {
    if (event.key !== 'Enter' && event.key !== 'Escape') return;
    event.preventDefault();
    event.stopPropagation();
    if (event.key === 'Enter') save();
    else finish(original);
  });
  editor.focus();
  editor.select();
}

function actionSvg(icon) {
  return '<svg viewBox="0 0 16 16" aria-hidden="true">' + icon + '</svg>';
}

function appendMessage(text, className, date = new Date()) {
  const entry = document.createElement('div');
  entry.className = 'message-entry ' + className;
  const message = document.createElement('p');
  message.textContent = text;
  message.className = 'message-bubble brackets';
  const meta = document.createElement('div');
  meta.className = 'message-meta';
  meta.append(timestamp(date, 'message-time'));
  entry.append(message, meta);
  messages.append(entry);
  return entry;
}

function addMessageActions(outgoing) {
  const bubble = outgoing.querySelector('.message-bubble');
  bubble.tabIndex = 0;
  const actions = document.createElement('div');
  actions.className = 'message-actions';
  const confirm = document.createElement('button');
  confirm.type = 'button';
  confirm.className = 'brackets confirm-edit';
  confirm.hidden = true;
  confirm.title = 'Save edit';
  confirm.setAttribute('aria-label', 'Save edit');
  confirm.innerHTML = actionSvg(checkIcon);
  const handlers = {
    Copy: () => copyMessage(bubble),
    Edit: button => editMessage(bubble, actions, confirm, button),
    Delete: () => {
      const next = outgoing.nextElementSibling;
      recordUndo(() => messages.insertBefore(outgoing, next));
      outgoing.remove();
      input.focus({ preventScroll: true });
    }
  };
  for (const [label, icon] of Object.entries(actionIcons)) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'brackets';
    button.title = label;
    button.setAttribute('aria-label', label + ' message');
    button.innerHTML = actionSvg(icon);
    button.addEventListener('click', () => handlers[label](button));
    actions.append(button);
  }
  actions.append(confirm);
  outgoing.querySelector('.message-meta').prepend(actions);
}

function showConversation() {
  suggestions.hidden = true;
  messages.hidden = false;
  backButton.hidden = false;
  conversation.scrollTop = conversation.scrollHeight;
}

function animate(element, frames, duration) {
  if (reducedMotion.matches) return Promise.resolve();
  return element.animate(frames, {
    duration,
    easing: 'cubic-bezier(.22,.72,.24,1)'
  }).finished;
}

async function streamReply(bubble, history) {
  const endpoint = document.querySelector('meta[name="fitloop-stylist-api"]')?.content;
  if (!endpoint) return { error: 'AI Stylist is coming soon. Live replies aren’t available yet.' };
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(history),
    signal: AbortSignal.timeout(45000)
  });
  if (!response.ok || !response.body) throw Error('Stylist service unavailable.');
  const reader = response.body.pipeThrough(new TextDecoderStream()).getReader();
  let pending = '';
  let shown = '';
  let target = '';
  let frame = 0;
  function render() {
    frame = 0;
    const follow = conversation.scrollHeight - conversation.scrollTop - conversation.clientHeight < 28;
    shown = target.slice(0, shown.length + Math.max(2, Math.ceil((target.length - shown.length) / 8)));
    bubble.textContent = shown;
    if (follow) conversation.scrollTop = conversation.scrollHeight;
    if (shown.length < target.length) frame = requestAnimationFrame(render);
  }

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) throw Error('The connection ended before the reply was complete.');
      pending += value;
      const lines = pending.split('\n');
      pending = lines.pop();
      for (const line of lines) {
        if (!line) continue;
        const event = JSON.parse(line);
        if (event.error) return { text: target, error: event.error };
        if (event.done) {
          if (!target.trim()) return { text: '', error: 'No reply came back. Please try again.' };
          if (!reducedMotion.matches && shown !== target && !document.hidden) {
            await new Promise(resolve => setTimeout(resolve, 160));
          }
          return { text: target };
        }
        target += event.text;
        if (reducedMotion.matches) render();
        else if (!frame) frame = requestAnimationFrame(render);
      }
    }
  } finally {
    cancelAnimationFrame(frame);
    reader.cancel().catch(() => {});
  }
}

async function sendMessage(message, preset) {
  const from = preset?.getBoundingClientRect();
  if (preset && !reducedMotion.matches) {
    const otherRows = [...suggestions.querySelectorAll('h2, .preset')]
      .filter(row => row !== preset);
    const animations = otherRows.map(row => row.animate(
      [{ opacity: 1 }, { opacity: 0, transform: 'translateY(-3px)' }],
      { duration: 160, fill: 'forwards' }
    ));
    await Promise.all(animations.map(animation => animation.finished));
    suggestions.hidden = true;
    animations.forEach(animation => animation.cancel());
  }

  const sentAt = new Date();
  if (!messages.firstElementChild) messages.append(timestamp(sentAt, 'session-time'));
  const outgoing = appendMessage(message, 'user-message', sentAt);
  const history = [...messages.querySelectorAll('.message-entry:not(.reply-error)')]
    .slice(-16).map(entry => ({
      role: entry.classList.contains('user-message') ? 'user' : 'assistant',
      content: entry.querySelector('.message-bubble').textContent.slice(0, 4000)
    }));
  const reply = appendMessage('', 'demo-reply');
  const bubble = reply.querySelector('.message-bubble');
  bubble.classList.add('is-typing');
  bubble.setAttribute('aria-label', 'Waiting for AI Stylist');
  addMessageActions(outgoing);
  recordUndo(() => {
    outgoing.remove();
    reply.remove();
  });
  showConversation();

  const to = outgoing.querySelector('.message-bubble').getBoundingClientRect();
  const start = from ? `translate(${from.left + 1 - to.left}px, ${from.top - to.top}px)` : 'translateY(4px)';
  animate(outgoing, [{ transform: start }, { transform: 'none' }], 260);
  animate(reply, [{ opacity: 0, transform: 'translateY(5px)' }, { opacity: 1, transform: 'none' }], 300);
  messages.setAttribute('aria-busy', 'true');
  try {
    const result = await streamReply(bubble, history);
    bubble.textContent = [result.text, result.error].filter(Boolean).join('\n\n');
    reply.classList.toggle('reply-error', Boolean(result.error));
  } catch {
    reply.classList.add('reply-error');
    bubble.textContent = 'AI Stylist couldn’t connect. Please try again in a moment.';
  } finally {
    bubble.classList.remove('is-typing');
    bubble.removeAttribute('aria-label');
    messages.removeAttribute('aria-busy');
    if (conversation.scrollHeight - conversation.scrollTop - conversation.clientHeight < 70) {
      conversation.scrollTop = conversation.scrollHeight;
    }
  }
}

launcher.addEventListener('click', () => setOpen(true));
closeButton.addEventListener('click', () => setOpen(false));
backButton.addEventListener('click', async () => {
  if (transitioning || messages.querySelector('.message-bubble input')) return;
  const undo = undoHistory.pop();
  if (!undo) return;
  undo();
  backButton.disabled = !undoHistory.length;
  if (!backButton.disabled) return;

  transitioning = true;
  messages.replaceChildren();
  messages.hidden = true;
  suggestions.hidden = false;
  backButton.hidden = true;
  conversation.scrollTop = 0;
  if (!panel.inert) input.focus({ preventScroll: true });
  await animate(suggestions, [{ opacity: 0, transform: 'translateY(4px)' }, { opacity: 1, transform: 'none' }], 240);
  transitioning = false;
});
panel.addEventListener('keydown', event => {
  if (event.key === 'Escape') setOpen(false);
});
input.addEventListener('input', updateSend);
for (const preset of document.querySelectorAll('.preset')) {
  preset.addEventListener('click', async () => {
    if (transitioning) return;
    transitioning = true;
    await sendMessage(preset.firstChild.textContent.trim(), preset);
    if (!panel.inert) backButton.focus({ preventScroll: true });
    transitioning = false;
    updateSend();
  });
}
form.addEventListener('submit', event => {
  event.preventDefault();
  const message = input.value.trim();
  if (!message || transitioning) return;
  transitioning = true;
  sendButton.classList.add('is-pressing');
  window.setTimeout(async () => {
    if (input.value.trim() === message) input.value = '';
    sendButton.classList.remove('is-pressing');
    updateSend();
    if (!panel.inert) input.focus();
    await sendMessage(message);
    transitioning = false;
    updateSend();
  }, reducedMotion.matches ? 0 : 160);
});


document.addEventListener('fitloop-screen', event => {
  if (event.detail.index !== 2 && !panel.inert) setOpen(false);
});
