(() => {
  const root = document.createElement('div');
  root.id = 'sst-chatbot';
  root.innerHTML = `
    <button class="sst-chat-launcher" type="button" aria-label="Abrir asistente virtual" aria-expanded="false">
      <span class="sst-chat-launcher-icon">✦</span><span>¿Te ayudo?</span>
    </button>
    <section class="sst-chat-panel" role="dialog" aria-label="Asistente virtual SG-SST" aria-modal="false" hidden>
      <header class="sst-chat-header">
        <div class="sst-chat-avatar">✦</div>
        <div><strong>Asistente SST Integral</strong><small>Orientación para tu copropiedad</small></div>
        <button class="sst-chat-close" type="button" aria-label="Cerrar chat">×</button>
      </header>
      <div class="sst-chat-messages" aria-live="polite">
        <div class="sst-chat-message bot">¡Hola! Soy el asistente virtual de SST Integral. Puedo orientarte sobre SG-SST, servicios, paquetes, normativa y cotizaciones para propiedad horizontal. ¿Qué necesitas resolver?</div>
      </div>
      <div class="sst-chat-suggestions">
        <button type="button">¿Qué incluye la asesoría?</button>
        <button type="button">¿Cuánto cuesta para mi conjunto?</button>
        <button type="button">¿Qué normas aplican?</button>
      </div>
      <form class="sst-chat-form">
        <label class="sst-chat-sr" for="sst-chat-input">Escribe tu pregunta</label>
        <input id="sst-chat-input" maxlength="1200" placeholder="Escribe tu pregunta..." autocomplete="off" required>
        <button type="submit" aria-label="Enviar pregunta">➤</button>
      </form>
      <p class="sst-chat-disclaimer">Orientación informativa. Los casos particulares requieren validación profesional.</p>
    </section>`;
  document.body.appendChild(root);

  const panel = root.querySelector('.sst-chat-panel');
  const launcher = root.querySelector('.sst-chat-launcher');
  const messages = root.querySelector('.sst-chat-messages');
  const form = root.querySelector('.sst-chat-form');
  const input = root.querySelector('#sst-chat-input');
  const close = root.querySelector('.sst-chat-close');
  let busy = false;
  const history = [];

  function toggle(open) {
    panel.hidden = !open;
    launcher.setAttribute('aria-expanded', String(open));
    if (open) input.focus();
  }
  launcher.addEventListener('click', () => toggle(panel.hidden));
  close.addEventListener('click', () => toggle(false));

  function addMessage(text, who) {
    const el = document.createElement('div');
    el.className = 'sst-chat-message ' + who;
    el.textContent = text;
    messages.appendChild(el);
    messages.scrollTop = messages.scrollHeight;
    return el;
  }

  async function ask(question) {
    if (busy || !question.trim()) return;
    busy = true;
    addMessage(question, 'user');
    input.value = '';
    const pending = addMessage('Estoy revisando la información de la página…', 'bot pending');
    const context = (document.querySelector('main') || document.body).innerText
      .replace(/\\s+/g, ' ').slice(0, 18000);
    try {
      const response = await fetch('/.netlify/functions/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, context, history: history.slice(-8) })
      });
      const data = await response.json();
      pending.remove();
      if (!response.ok) throw new Error(data.error || 'No fue posible responder en este momento.');
      const answer = data.answer || 'No tengo información suficiente para responder con seguridad.';
      addMessage(answer, 'bot');
      history.push({ role: 'user', content: question }, { role: 'assistant', content: answer });
    } catch (error) {
      pending.remove();
      addMessage(error.message.includes('configurada')
        ? 'El asistente está instalado, pero falta activar la conexión de IA en Netlify. Mientras tanto puedes escribirnos desde el formulario de contacto de la página.'
        : 'En este momento no pude conectarme. Inténtalo nuevamente o utiliza el formulario de contacto para que podamos ayudarte.', 'bot');
      console.error('SST chatbot:', error);
    } finally {
      busy = false;
      input.focus();
    }
  }

  form.addEventListener('submit', event => {
    event.preventDefault();
    ask(input.value);
  });
  root.querySelectorAll('.sst-chat-suggestions button').forEach(button => {
    button.addEventListener('click', () => ask(button.textContent));
  });
})();