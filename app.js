(() => {
  const client = window.supabaseClient;
  const status = document.getElementById('statusMessage');
  const formatMoney = value => new Intl.NumberFormat('en-TZ', { style: 'currency', currency: 'TZS', maximumFractionDigits: 0 }).format(Number(value) || 0);
  let products = [];
  let cart = JSON.parse(localStorage.getItem('mtani-cart') || '[]');
  const grid = document.getElementById('productGrid');

  function setStatus(message, error = false) { status.textContent = message; status.classList.toggle('error', error); }
  function escapeText(value) { return String(value ?? ''); }

  function drawProducts() {
    const query = document.getElementById('searchInput').value.trim().toLowerCase();
    const category = document.getElementById('categoryFilter').value;
    grid.replaceChildren();
    const shown = products.filter(p => (!category || p.category === category) && (!query || `${p.name} ${p.description} ${p.category}`.toLowerCase().includes(query)));
    if (!shown.length) { grid.innerHTML = '<p class="empty-state">No products to show yet. Please check back soon.</p>'; return; }
    shown.forEach(product => {
      const card = document.createElement('article'); card.className = 'product-card';
      if (product.image_url) { const image = document.createElement('img'); image.className = 'product-image'; image.src = product.image_url; image.alt = product.name; image.loading = 'lazy'; card.append(image); }
      const categoryLabel = document.createElement('p'); categoryLabel.className = 'eyebrow'; categoryLabel.textContent = product.category;
      const title = document.createElement('h3'); title.textContent = product.name;
      const description = document.createElement('p'); description.className = 'product-description'; description.textContent = product.description;
      const price = document.createElement('strong'); price.className = 'price'; price.textContent = formatMoney(product.price);
      const add = document.createElement('button'); add.className = 'button button-small'; add.textContent = 'Add to cart'; add.addEventListener('click', () => addToCart(product.id));
      card.append(categoryLabel, title, description, price, add); grid.append(card);
    });
  }
  function addToCart(id) {
    const item = cart.find(row => row.id === id);
    if (item) item.quantity = Math.min(item.quantity + 1, 50); else cart.push({ id, quantity: 1 });
    saveCart();
  }
  function saveCart() { localStorage.setItem('mtani-cart', JSON.stringify(cart)); drawCart(); }
  function drawCart() {
    const box = document.getElementById('cartItems'); box.replaceChildren();
    cart = cart.filter(row => products.some(p => p.id === row.id));
    let total = 0;
    if (!cart.length) { const empty = document.createElement('p'); empty.textContent = 'Your cart is empty.'; box.append(empty); }
    cart.forEach(row => {
      const product = products.find(p => p.id === row.id); total += Number(product.price) * row.quantity;
      const line = document.createElement('div'); line.className = 'cart-line';
      const label = document.createElement('span'); label.textContent = `${product.name} × ${row.quantity}`;
      const amount = document.createElement('strong'); amount.textContent = formatMoney(Number(product.price) * row.quantity);
      const remove = document.createElement('button'); remove.className = 'text-button'; remove.textContent = 'Remove'; remove.setAttribute('aria-label', `Remove ${product.name}`); remove.addEventListener('click', () => { cart = cart.filter(item => item.id !== row.id); saveCart(); });
      line.append(label, amount, remove); box.append(line);
    });
    document.getElementById('cartTotal').textContent = formatMoney(total);
    document.getElementById('cartCount').textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('checkoutButton').disabled = cart.length === 0;
  }
  async function loadProducts() {
    if (!client) { setStatus('Store database is not connected yet. The owner needs to add the Supabase project URL and public key, then run the setup SQL.', true); drawCart(); return; }
    const { data, error } = await client.from('products').select('id,name,category,description,price,image_url,active').eq('active', true).order('created_at', { ascending: false });
    if (error) { setStatus('Could not load products. Check that the database setup has been completed.', true); console.error(error); return; }
    products = data || [];
    const categories = [...new Set(products.map(p => p.category).filter(Boolean))];
    const select = document.getElementById('categoryFilter');
    categories.forEach(value => { const option = document.createElement('option'); option.value = value; option.textContent = value; select.append(option); });
    setStatus(products.length ? `${products.length} product${products.length === 1 ? '' : 's'} available` : 'The catalog is ready. Products will appear here when the admin adds them.');
    drawProducts(); drawCart();
  }

  document.getElementById('searchInput').addEventListener('input', drawProducts);
  document.getElementById('categoryFilter').addEventListener('change', drawProducts);
  document.getElementById('checkoutButton').addEventListener('click', async () => {
    if (!client) { setStatus('The store database is not connected yet.', true); return; }
    const { data: { user } } = await client.auth.getUser();
    if (!user) { location.href = 'auth.html?next=checkout'; return; }
    const button = document.getElementById('checkoutButton'); button.disabled = true;
    const currentItems = cart.map(row => { const p = products.find(product => product.id === row.id); return { product_id: p.id, name: p.name, quantity: row.quantity, unit_price: Number(p.price) }; });
    const total = currentItems.reduce((sum, item) => sum + item.unit_price * item.quantity, 0);
    const { error } = await client.from('orders').insert({ user_id: user.id, items: currentItems, total_tzs: total, status: 'pending' });
    if (error) { setStatus('Could not submit your order request. Please try again or contact us on WhatsApp.', true); console.error(error); button.disabled = false; return; }
    cart = []; saveCart(); setStatus('Order request sent! We will contact you to confirm availability and payment.');
  });
  const logout = document.getElementById('signOutButton');
  if (client) client.auth.getUser().then(({ data }) => {
    if (!data.user) return;
    document.getElementById('accountLink').textContent = data.user.email || 'My account';
    logout.hidden = false;
    if (data.user.app_metadata?.role === 'admin') document.getElementById('adminLink').hidden = false;
  });
  logout.addEventListener('click', async () => { await client?.auth.signOut(); location.reload(); });
  loadProducts();
})();
