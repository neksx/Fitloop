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

async function streamReply(bubble, history, context) {
  const endpoint = document.querySelector('meta[name="fitloop-stylist-api"]')?.content;
  if (!endpoint) return { error: 'AI Stylist is coming soon. Live replies aren’t available yet.' };
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({history, context}),
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
        if (event.plan) return { plan: event.plan };
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

async function executePlan(plan, context, message) {
  if (plan.action === 'clarify') return typeof plan.text === 'string' ? plan.text.slice(0, 500) : 'Уточни, будь ласка, що змінити.';
  const uk = /[а-яіїєґ]/iu.test(message) || /[а-яіїєґ]/iu.test(messages.textContent);
  try {
    const model = await window.FitloopFitting.applyStylistPlan(plan, context);
    const labels = uk ? {create:'Модель створено',delete:'Модель видалено',select:'Модель вибрано',update:'Модель оновлено'} :
      {create:'Model created',delete:'Model deleted',select:'Model selected',update:'Model updated'};
    const values = [
      ['height', `${model.height} ${uk?'см':'cm'}`], ['weight', `${model.weight} ${uk?'кг':'kg'}`],
      ['jacketSize', `${uk?'верх':'top'} ${model.jacketSize}`], ['pantSize', `${uk?'низ':'bottom'} ${model.pantSize}`],
      ['gender', model.gender === 'woman' ? (uk?'жіноча модель':'female model') : (uk?'чоловіча модель':'male model')],
      ['top', window.FitloopCatalog[model.items[0]]?.name], ['bottom', window.FitloopCatalog[model.items[1]]?.name]
    ].filter(([key]) => Object.hasOwn(plan,key)).map(([,value])=>value);
    return `${labels[plan.action]} · ${model.name}${values.length ? ` · ${values.join(', ')}` : ''}.`;
  } catch (error) {
    if (error.message === 'no_model') return uk ? 'Спочатку додай модель.' : 'Add a model first.';
    if (error.message === 'invalid') return uk ? 'Це значення або річ недоступні. Уточни параметри.' : 'That value or garment is unavailable. Try another option.';
    return uk ? 'Не вдалося застосувати зміни. Закрий налаштування моделі й повтори запит.' :
      'The change couldn’t be applied. Close the model settings and try again.';
  }
}

function wardrobeSuggestion(message, attempt = 0) {
  const fitting = window.FitloopFitting.stylistWardrobe;
  const catalog = window.FitloopCatalog;
  const prompt = message.trim().toLowerCase();
  if (prompt === 'find black ksubi jeans') {
    const matches = catalog.filter(product => product.brand === 'KSUBI');
    const item = matches[attempt];
    return item ? {
      text: 'Fitloop has this Ksubi pair in the catalog. I can’t confirm a black option.',
      ids: [item.id], product: item, model: fitting.current()
    } : null;
  }
  if (!['build a look from my wardrobe', 'style my purple jacket'].includes(prompt)) return null;

  const model = fitting.current();
  if (!model) return { text: 'Add a model first so I can match a look to it.' };
  const options = category => catalog.filter(item => item.category === category && item.gender === model.gender);
  const [topId, bottomId] = model.items;
  const keepJacket = prompt === 'style my purple jacket';
  const tops = keepJacket ? [catalog[topId]] : options('Tops');
  const bottoms = options('Bottoms');
  const combinations = tops.filter(Boolean).flatMap(top => bottoms.map(bottom => [top, bottom]))
    .filter(([top, bottom]) => top.id !== topId || bottom.id !== bottomId);
  const rank = ([top, bottom]) => Number(top.id !== topId) + Number(bottom.id !== bottomId)
    + Number(!/skirt|short/i.test(bottom.name));
  combinations.sort((a, b) => rank(b) - rank(a));
  if (!combinations.length) return { text: 'There isn’t another matching combination in this wardrobe yet.' };
  const [top, bottom] = combinations[attempt % combinations.length];
  return {
    text: keepJacket ? `Keep your ${top.name} and try it with ${bottom.name}.` :
      `Try ${top.name} with ${bottom.name}.`,
    ids: [top.id, bottom.id].filter(id => !model.items.includes(id)),
    photos: [top.id, bottom.id],
    model
  };
}

// Artwork bounds omit the white and transparent margins in the original cutouts.
const stylistGarmentBounds = {
  4: '196 674 1276 1149',
  5: '312 675 1036 1199',
  6: '165 609 1339 1221',
  7: '224 674 1225 1141',
  8: '21 182 985 1231',
  9: '126 30 772 1477',
  10: '463 961 749 528',
  11: '413 958 846 577'
};

function renderWardrobeSuggestion(result, reply, message, attempt, onReplace) {
  if (!result.ids) return;
  const fitting = window.FitloopFitting.stylistWardrobe;
  const card = document.createElement('div');
  card.className = 'stylist-result brackets';
  const visual = document.createElement('div');
  visual.className = result.product ? 'stylist-result-visual is-product' : 'stylist-result-visual is-outfit';
  for (const id of result.photos || result.ids) {
    const item = document.createElement('div');
    item.className = 'stylist-result-item';
    item.innerHTML = fitting.art(id);
    const product = window.FitloopCatalog[id];
    const svg = item.querySelector('svg');
    svg.setAttribute('viewBox', stylistGarmentBounds[id] || product.rowBox || product.thumbBox);
    svg.querySelector('image').removeAttribute('transform');
    const [, , width, height] = svg.getAttribute('viewBox').split(' ').map(Number);
    svg.style.aspectRatio = `${width} / ${height}`;
    item.setAttribute('role', 'img');
    item.setAttribute('aria-label', window.FitloopCatalog[id].name);
    visual.append(item);
  }
  if (result.product) {
    const caption = document.createElement('div');
    const brand = document.createElement('strong');
    const name = document.createElement('span');
    brand.textContent = result.product.brand;
    name.textContent = result.product.name;
    caption.className = 'stylist-product-caption';
    caption.append(brand, name);
    visual.append(caption);
  }
  const actions = document.createElement('div');
  actions.className = 'stylist-result-actions';
  const status = document.createElement('div');
  status.className = 'stylist-result-status';
  status.setAttribute('role', 'status');
  status.hidden = true;
  const primary = document.createElement('button');
  primary.type = 'button';
  primary.className = 'button fitting-save stylist-result-primary';
  primary.innerHTML = '<i class="fitting-glass-pane" aria-hidden="true"></i><span>TRY ON</span>';
  actions.append(primary);
  const run = action => async () => {
    status.hidden = false;
    status.textContent = 'Applying…';
    actions.inert = true;
    try {
      if (!result.model) {
        status.textContent = 'Add a model, then ask for this item again.';
        return;
      }
      const success = await action.call(fitting, result.model.id, result.ids);
      status.textContent = success ? 'Applied to your model.' :
        'Select the original model and close its settings, then try again.';
    } catch {
      status.textContent = 'The look could not load. Try again.';
    } finally {
      actions.inert = false;
    }
  };
  primary.addEventListener('click', run(fitting.tryOn));
  const retry = document.createElement('button');
  retry.type = 'button';
  retry.className = 'stylist-result-secondary brackets';
  retry.textContent = 'TRY AGAIN';
  retry.addEventListener('click', () => {
    const next = wardrobeSuggestion(message, attempt + 1);
    if (!next?.ids || next.photos?.join(',') === result.photos?.join(',') && next.ids.join(',') === result.ids.join(',')) {
      status.hidden = false;
      status.textContent = 'No other matching options in the catalog.';
      return;
    }
    reply.querySelector('.message-bubble').textContent = next.text;
    card.remove();
    const updated = renderWardrobeSuggestion(next, reply, message, attempt + 1, onReplace);
    onReplace(updated);
    updated.querySelector('.stylist-result-secondary').focus({ preventScroll: true });
  });
  actions.append(retry);
  card.append(visual, actions, status);
  reply.after(card);
  animate(card, [{ opacity: 0, transform: 'translateY(4px)' }, { opacity: 1, transform: 'none' }], 240);
  return card;
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
  let resultCard;
  recordUndo(() => {
    outgoing.remove();
    reply.remove();
    resultCard?.remove();
  });
  showConversation();

  const to = outgoing.querySelector('.message-bubble').getBoundingClientRect();
  const start = from ? `translate(${from.left + 1 - to.left}px, ${from.top - to.top}px)` : 'translateY(4px)';
  animate(outgoing, [{ transform: start }, { transform: 'none' }], 260);
  animate(reply, [{ opacity: 0, transform: 'translateY(5px)' }, { opacity: 1, transform: 'none' }], 300);
  messages.setAttribute('aria-busy', 'true');
  try {
    const context = window.FitloopFitting.stylistContext();
    const suggestion = wardrobeSuggestion(message);
    let result = suggestion || await streamReply(bubble, history, context);
    if (result.plan) result = { text: await executePlan(result.plan, context, message) };
    if (suggestion) resultCard = renderWardrobeSuggestion(suggestion, reply, message, 0, card => { resultCard = card; });
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
