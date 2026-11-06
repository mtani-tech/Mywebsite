(() => {
  const client = window.supabaseClient;
  const status = document.getElementById('statusMessage');
  const formatMoney = value => new Intl.NumberFormat('en-TZ', { style: 'currency', currency: 'TZS', maximumFractionDigits: 0 }).format(Number(value) || 0);
  const waNumber = '255639784923';
  const image = (id, width = 800) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=80`;
  const categoryImages = {
    'Computers': image('photo-1496181133206-80ce9b88a853'), 'Phones': image('photo-1511707171634-5f897ff02aa9'),
    'Coding & electronics': image('photo-1518770660439-4636190af475'), 'Networking': image('photo-1558494949-ef010cbdcc31'),
    'Power & solar': image('photo-1509391366360-2e959784a276'), 'Software': image('photo-1498050108023-c5249f4df085'),
    'Digital resources': image('photo-1516321318423-f06f85e504b3'), 'Accessories': image('photo-1587829741301-dc798b83add3')
  };
  // Discovery examples only. They are not verified offers or statements of local stock/prices.
  const examples = [
    { id:'example-laptop', name:'Laptop for coding and study', category:'Computers', description:'Compare processor, memory, storage, battery condition and warranty with the seller.', image_url:categoryImages.Computers },
    { id:'example-phone', name:'Android smartphone', category:'Phones', description:'Ask about storage, network compatibility, condition, accessories and warranty.', image_url:categoryImages.Phones },
    { id:'example-arduino', name:'Arduino-compatible starter kit', category:'Coding & electronics', description:'A starter option to explore electronics, sensors and beginner coding projects.', image_url:categoryImages['Coding & electronics'] },
    { id:'example-raspberry', name:'Single-board computer for projects', category:'Coding & electronics', description:'Ask about board model, power supply, storage and compatible accessories.', image_url:image('photo-1518770660439-4636190af475') },
    { id:'example-keyboard', name:'Keyboard and mouse set', category:'Accessories', description:'Choose a layout and connection type that fits your computer and workspace.', image_url:categoryImages.Accessories },
    { id:'example-ssd', name:'SSD or memory upgrade', category:'Computers', description:'Confirm your computer model and component compatibility before ordering.', image_url:image('photo-1591488320449-011701bb6704') },
    { id:'example-router', name:'Wi-Fi router', category:'Networking', description:'Check network compatibility, coverage needs and internet provider requirements.', image_url:categoryImages.Networking },
    { id:'example-power', name:'Power bank and surge protection', category:'Power & solar', description:'Ask about capacity, safety certification, warranty and supported devices.', image_url:categoryImages['Power & solar'] },
    { id:'example-software', name:'Genuine software and licenses', category:'Software', description:'Ask for the official product, license terms, supported devices and proof of authenticity.', image_url:categoryImages.Software },
    { id:'example-course', name:'Digital learning resources', category:'Digital resources', description:'Find reputable learning materials and confirm access terms before purchase.', image_url:categoryImages['Digital resources'] },
    { id:'example-usb', name:'USB drive and adapter', category:'Accessories', description:'Ask about storage capacity, connector type and compatibility with your devices.', image_url:image('photo-1625948515291-69613efd103f') },
    { id:'example-headset', name:'Headset for online study', category:'Accessories', description:'Compare connection type, microphone, comfort and device compatibility.', image_url:image('photo-1593305841991-05c297ba4575') }
  ];
  let products = [];
  let usingExamples = false;
  let cart = JSON.parse(localStorage.getItem('mtani-cart') || '[]');
  let favorites = new Set(JSON.parse(localStorage.getItem('mtani-favorites') || '[]'));
  const grid = document.getElementById('productGrid');

  function setStatus(message, error = false) { status.textContent = message; status.classList.toggle('error', error); }
  function whatsappUrl(message) { return `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`; }
  function drawProducts() {
    const query = document.getElementById('searchInput').value.trim().toLowerCase();
    const category = document.getElementById('categoryFilter').value;
    const sort = document.getElementById('sortFilter').value;
    const onlyFavorites = document.getElementById('favoritesOnly').checked;
    let shown = products.filter(p => (!category || p.category === category) && (!query || `${p.name} ${p.description} ${p.category}`.toLowerCase().includes(query)) && (!onlyFavorites || favorites.has(p.id)));
    if (sort === 'name') shown.sort((a,b) => a.name.localeCompare(b.name));
    if (sort === 'price-low') shown.sort((a,b) => (a.price ?? Infinity) - (b.price ?? Infinity));
    grid.replaceChildren();
    if (!shown.length) { const empty = document.createElement('p'); empty.className='empty-state'; empty.textContent = onlyFavorites ? 'No saved items match. Use the heart on a product to save it.' : 'No products match your search yet.'; grid.append(empty); return; }
    shown.forEach(product => {
      const card = document.createElement('article'); card.className='product-card';
      const photo = document.createElement('img'); photo.className='product-image'; photo.src=product.image_url || categoryImages[product.category] || categoryImages.Computers; photo.alt=product.name; photo.loading='lazy'; photo.onerror=()=>{photo.src=categoryImages[product.category] || categoryImages.Computers;}; card.append(photo);
      const label=document.createElement('p'); label.className='eyebrow'; label.textContent=product.category;
      const title=document.createElement('h3'); title.textContent=product.name;
      const description=document.createElement('p'); description.className='product-description'; description.textContent=product.description || 'Contact the seller for product details.';
      const vendor=document.createElement('p'); vendor.className='seller-label'; vendor.textContent=product.vendor_name ? `Seller: ${product.vendor_name}` : (usingExamples ? 'Example listing · seller and stock not verified' : 'Seller details available on enquiry');
      const price=document.createElement('strong'); price.className='price'; price.textContent=product.price == null ? 'Ask for current price' : formatMoney(product.price);
      const actions=document.createElement('div'); actions.className='product-actions';
      const enquire=document.createElement('a'); enquire.className='button button-small'; enquire.textContent='Ask / buy'; enquire.href=whatsappUrl(`Hello MTANI TECH, I am interested in: ${product.name} (${product.category}). Please confirm current availability, condition, warranty, seller and total price.`); enquire.target='_blank'; enquire.rel='noopener noreferrer';
      const save=document.createElement('button'); save.type='button'; save.className='icon-button'; save.textContent=favorites.has(product.id)?'♥':'♡'; save.setAttribute('aria-label', favorites.has(product.id)?`Remove ${product.name} from saved items`:`Save ${product.name}`); save.addEventListener('click',()=>{ if(favorites.has(product.id)) favorites.delete(product.id); else favorites.add(product.id); localStorage.setItem('mtani-favorites',JSON.stringify([...favorites])); drawProducts(); });
      const add=document.createElement('button'); add.type='button'; add.className='button button-small button-muted'; add.textContent='Add to enquiry'; add.addEventListener('click',()=>addToCart(product.id));
      actions.append(enquire,add,save); card.append(label,title,description,vendor,price,actions);
      if(product.product_type==='digital_free' && product.download_url){ const download=document.createElement('a'); download.className='text-link'; download.textContent='Download free resource'; download.href=product.download_url; download.target='_blank'; download.rel='noopener noreferrer'; card.append(download); }
      if(product.product_type==='digital_paid') { const note=document.createElement('p'); note.className='small-note'; note.textContent='Digital item: ask the seller about safe purchase and delivery. Paid download links are not exposed on this public site.'; card.append(note); }
      grid.append(card);
    });
  }
  function addToCart(id) { const item=cart.find(row=>row.id===id); if(item) item.quantity=Math.min(item.quantity+1,50); else cart.push({id,quantity:1}); saveCart(); }
  function saveCart(){localStorage.setItem('mtani-cart',JSON.stringify(cart));drawCart();}
  function drawCart(){
    const box=document.getElementById('cartItems'); box.replaceChildren(); cart=cart.filter(row=>products.some(p=>p.id===row.id));
    let total=0, priced=true;
    if(!cart.length){const empty=document.createElement('p');empty.textContent='Your enquiry list is empty.';box.append(empty);}
    cart.forEach(row=>{const p=products.find(product=>product.id===row.id);if(p.price==null)priced=false;else total+=Number(p.price)*row.quantity;
      const line=document.createElement('div');line.className='cart-line';const name=document.createElement('span');name.textContent=`${p.name} × ${row.quantity}`;
      const amount=document.createElement('strong');amount.textContent=p.price==null?'Price on enquiry':formatMoney(Number(p.price)*row.quantity);
      const remove=document.createElement('button');remove.type='button';remove.className='text-button';remove.textContent='Remove';remove.addEventListener('click',()=>{cart=cart.filter(x=>x.id!==row.id);saveCart();});line.append(name,amount,remove);box.append(line);
    });
    document.getElementById('cartTotal').textContent=priced?formatMoney(total):'Ask seller';
    document.getElementById('cartCount').textContent=cart.reduce((n,row)=>n+row.quantity,0);document.getElementById('checkoutButton').disabled=!cart.length;
  }
  function setCategories(){const select=document.getElementById('categoryFilter');const selected=select.value;select.replaceChildren(new Option('All categories',''));[...new Set(products.map(p=>p.category).filter(Boolean))].sort().forEach(c=>select.add(new Option(c,c)));select.value=selected;}
  async function loadProducts(){
    if(client){const {data,error}=await client.from('products').select('id,name,category,description,price,image_url,active,product_type,download_url,vendor_name,stock_quantity').eq('active',true).order('created_at',{ascending:false});if(!error&&data?.length){products=data;usingExamples=false;setStatus(`${products.length} seller listing${products.length===1?'':'s'} · confirm stock, condition and price before payment.`);}else{products=examples;usingExamples=true;setStatus(error?'Showing example categories while live listings are unavailable. Please enquire to confirm current stock and price.':'The marketplace is ready for verified seller listings. Examples are shown until sellers add products.');}}
    else{products=examples;usingExamples=true;setStatus('Example product ideas · stock, sellers and prices are not verified. Ask on WhatsApp or connect the marketplace database for live listings.');}
    setCategories();drawProducts();drawCart();
  }
  document.getElementById('searchInput').addEventListener('input',drawProducts);document.getElementById('categoryFilter').addEventListener('change',drawProducts);document.getElementById('sortFilter').addEventListener('change',drawProducts);document.getElementById('favoritesOnly').addEventListener('change',drawProducts);
  document.querySelectorAll('[data-category-link]').forEach(link=>link.addEventListener('click',()=>{document.getElementById('categoryFilter').value=link.dataset.categoryLink;drawProducts();}));
  document.getElementById('checkoutButton').addEventListener('click',async()=>{
    const lines=cart.map(row=>{const p=products.find(item=>item.id===row.id);return `${p.name} × ${row.quantity} — ${p.price==null?'price requested':formatMoney(Number(p.price)*row.quantity)}`;}).join('\n');
    const message=`Hello MTANI TECH, please help me enquire about these products:\n${lines}\nPlease confirm availability, seller, condition, warranty, delivery/pickup and final total.`;
    if(usingExamples||!client){window.open(whatsappUrl(message),'_blank','noopener,noreferrer');return;}
    const {data:{user}}=await client.auth.getUser();if(!user){location.href='auth.html?next=checkout';return;}
    const currentItems=cart.map(row=>{const p=products.find(x=>x.id===row.id);return{product_id:p.id,name:p.name,quantity:row.quantity,unit_price:p.price};});
    const total=currentItems.reduce((sum,item)=>sum+(Number(item.unit_price)||0)*item.quantity,0);
    const {error}=await client.from('orders').insert({user_id:user.id,items:currentItems,total_tzs:total,status:'pending'});
    if(error){setStatus('Could not submit the enquiry. Please use WhatsApp instead.',true);return;}
    cart=[];saveCart();setStatus('Order enquiry submitted. The seller will confirm details before payment.');window.open(whatsappUrl(message),'_blank','noopener,noreferrer');
  });
  const logout=document.getElementById('signOutButton');if(client)client.auth.getUser().then(({data})=>{if(!data.user)return;document.getElementById('accountLink').textContent=data.user.email||'My account';logout.hidden=false;if(data.user.app_metadata?.role==='admin')document.getElementById('adminLink').hidden=false;});
  logout.addEventListener('click',async()=>{await client?.auth.signOut();location.reload();});
  loadProducts();
})();
