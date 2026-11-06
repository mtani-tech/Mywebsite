(() => {
  const client = window.supabaseClient;
  const status = document.getElementById('adminStatus');
  const content = document.getElementById('dashboardContent');
  const form = document.getElementById('productForm');
  const productList = document.getElementById('adminProducts');
  const ordersList = document.getElementById('adminOrders');
  const money = value => new Intl.NumberFormat('en-TZ', { style: 'currency', currency: 'TZS', maximumFractionDigits: 0 }).format(Number(value) || 0);
  function setStatus(text, error = false) { status.textContent = text; status.classList.toggle('error', error); }
  function appendText(parent, tag, text, className = '') { const el = document.createElement(tag); el.textContent = text ?? ''; if (className) el.className = className; parent.append(el); return el; }
  async function init() {
    if (!client) { setStatus('Database is not configured. See README.md to connect Supabase.', true); return; }
    const { data: { user } } = await client.auth.getUser();
    if (!user) { location.href = 'auth.html'; return; }
    if (user.app_metadata?.role !== 'admin') { setStatus('Access denied. This account has not been granted the admin role.', true); return; }
    content.hidden = false; setStatus(`Signed in as ${user.email}`); await Promise.all([loadProducts(), loadOrders()]);
  }
  async function loadProducts() {
    const { data, error } = await client.from('products').select('*').order('created_at', { ascending: false });
    if (error) { setStatus('Unable to load products. Check database policies.', true); return; }
    productList.replaceChildren();
    if (!data.length) { appendText(productList, 'p', 'No products added yet.'); return; }
    data.forEach(product => {
      const row = document.createElement('article'); row.className = 'admin-row';
      appendText(row, 'strong', product.name); appendText(row, 'span', `${product.category} · ${money(product.price)} · ${product.active ? 'Visible' : 'Hidden'}`);
      const actions = document.createElement('div'); actions.className = 'row-actions';
      const edit = document.createElement('button'); edit.className = 'button button-small button-muted'; edit.textContent = 'Edit'; edit.addEventListener('click', () => fillForm(product));
      const remove = document.createElement('button'); remove.className = 'button button-small button-danger'; remove.textContent = 'Delete'; remove.addEventListener('click', () => deleteProduct(product.id));
      actions.append(edit, remove); row.append(actions); productList.append(row);
    });
  }
  function fillForm(p) {
    document.getElementById('productId').value = p.id; document.getElementById('productName').value = p.name;
    document.getElementById('productCategory').value = p.category; document.getElementById('productDescription').value = p.description;
    document.getElementById('productPrice').value = p.price; document.getElementById('productImage').value = p.image_url || '';
    document.getElementById('productActive').checked = p.active; document.getElementById('productFormHeading').textContent = 'Edit product'; document.getElementById('cancelEdit').hidden = false;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  function clearForm() { form.reset(); document.getElementById('productId').value = ''; document.getElementById('productActive').checked = true; document.getElementById('productFormHeading').textContent = 'Add a product'; document.getElementById('cancelEdit').hidden = true; }
  form.addEventListener('submit', async event => {
    event.preventDefault();
    const id = document.getElementById('productId').value;
    const record = { name: document.getElementById('productName').value.trim(), category: document.getElementById('productCategory').value, description: document.getElementById('productDescription').value.trim(), price: Number(document.getElementById('productPrice').value), image_url: document.getElementById('productImage').value.trim() || null, active: document.getElementById('productActive').checked };
    const result = id ? await client.from('products').update(record).eq('id', id) : await client.from('products').insert(record);
    if (result.error) { setStatus(`Could not save product: ${result.error.message}`, true); return; }
    clearForm(); setStatus('Product saved.'); await loadProducts();
  });
  document.getElementById('cancelEdit').addEventListener('click', clearForm);
  async function deleteProduct(id) { if (!confirm('Delete this product?')) return; const { error } = await client.from('products').delete().eq('id', id); if (error) setStatus(`Could not delete product: ${error.message}`, true); else { setStatus('Product deleted.'); await loadProducts(); } }
  async function loadOrders() {
    const { data, error } = await client.from('orders').select('*').order('created_at', { ascending: false });
    ordersList.replaceChildren();
    if (error) { appendText(ordersList, 'p', 'Could not load orders. Check database policies.'); return; }
    if (!data.length) { appendText(ordersList, 'p', 'No order requests yet.'); return; }
    data.forEach(order => {
      const row = document.createElement('article'); row.className = 'admin-row order-row';
      appendText(row, 'strong', `Order ${order.id.slice(0, 8)} · ${money(order.total_tzs)}`);
      appendText(row, 'p', `Customer: ${order.user_id} · ${new Date(order.created_at).toLocaleString()}`);
      (Array.isArray(order.items) ? order.items : []).forEach(item => appendText(row, 'p', `${item.name} × ${item.quantity}`));
      const select = document.createElement('select'); ['pending', 'confirmed', 'completed', 'cancelled'].forEach(value => { const option = document.createElement('option'); option.value = value; option.textContent = value; option.selected = order.status === value; select.append(option); });
      select.addEventListener('change', async () => { const { error: updateError } = await client.from('orders').update({ status: select.value }).eq('id', order.id); if (updateError) setStatus(`Could not update order: ${updateError.message}`, true); else setStatus('Order status updated.'); });
      row.append(select); ordersList.append(row);
    });
  }
  document.getElementById('adminSignOut').addEventListener('click', async () => { await client?.auth.signOut(); location.href = 'index.html'; });
  init();
})();
