(() => {
  const client = window.supabaseClient;
  const form = document.getElementById('authForm');
  const message = document.getElementById('authMessage');
  let mode = 'login';
  function showMessage(text, error = false) { message.textContent = text; message.classList.toggle('error', error); }
  function setMode(next) {
    mode = next;
    const signup = mode === 'signup';
    document.getElementById('nameLabel').hidden = !signup;
    document.getElementById('fullName').hidden = !signup;
    document.getElementById('fullName').required = signup;
    document.getElementById('submitButton').textContent = signup ? 'Create account' : 'Log in';
    document.getElementById('loginTab').classList.toggle('button-muted', signup);
    document.getElementById('signupTab').classList.toggle('button-muted', !signup);
    showMessage('');
  }
  document.getElementById('loginTab').addEventListener('click', () => setMode('login'));
  document.getElementById('signupTab').addEventListener('click', () => setMode('signup'));
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (!client) { showMessage('Authentication is not configured yet. Ask the site owner to finish the Supabase setup.', true); return; }
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const button = document.getElementById('submitButton'); button.disabled = true;
    try {
      if (mode === 'signup') {
        const fullName = document.getElementById('fullName').value.trim();
        const { data, error } = await client.auth.signUp({ email, password, options: { data: { full_name: fullName } } });
        if (error) throw error;
        if (!data.session) showMessage('Account created. Check your email to confirm it, then log in.');
        else location.href = new URLSearchParams(location.search).get('next') === 'checkout' ? 'index.html#products' : 'index.html';
      } else {
        const { error } = await client.auth.signInWithPassword({ email, password });
        if (error) throw error;
        location.href = new URLSearchParams(location.search).get('next') === 'checkout' ? 'index.html#products' : 'index.html';
      }
    } catch (error) { showMessage(error.message || 'Authentication failed.', true); }
    finally { button.disabled = false; }
  });
  if (!client) showMessage('Connect the Supabase project to enable sign-up and login.', true);
})();
