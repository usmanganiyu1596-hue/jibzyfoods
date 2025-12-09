// Minimal cart implementation with WhatsApp prefill
const cartBtn = document.getElementById('cart-btn');
const cartDrawer = document.getElementById('cart-drawer');
const closeCart = document.getElementById('close-cart');
const cartItemsEl = document.getElementById('cart-items');
const cartCountEl = document.getElementById('cart-count');
const cartTotalEl = document.getElementById('cart-total');
const snackbar = document.getElementById('snackbar');
const clearCartBtn = document.getElementById('clear-cart');
const placeOrderBtn = document.getElementById('place-order');
const placeOrderQuickBtn = document.getElementById('place-order-quick');

let cart = [];

function formatNaira(n){return '₦'+Number(n).toLocaleString()}

function showSnackbar(msg){
  snackbar.textContent = msg;
  snackbar.classList.add('show');
  setTimeout(()=>snackbar.classList.remove('show'),2500);
}

function saveCart(){
  localStorage.setItem('jibzy_cart', JSON.stringify(cart));
}

function loadCart(){
  const raw = localStorage.getItem('jibzy_cart');
  if(raw){
    try{cart = JSON.parse(raw)}catch(e){cart = []}
  }
}

function updateCartUI(){
  cartCountEl.textContent = cart.reduce((s,i)=>s+i.qty,0);
  // items
  cartItemsEl.innerHTML = '';
  if(cart.length===0){
    cartItemsEl.innerHTML = '<p class="empty">Your cart is empty.</p>';
  } else {
    cart.forEach(item=>{
      const el = document.createElement('div');
      el.className = 'cart-item';
      el.innerHTML = `
        <img src="${item.image}" alt="${item.name}" />
        <div class="cart-item-details">
          <h5>${item.name}</h5>
          <div class="controls">
            <button class="qty-btn" data-action="decrease" data-id="${item.id}">-</button>
            <strong>${item.qty}</strong>
            <button class="qty-btn" data-action="increase" data-id="${item.id}">+</button>
            <button class="qty-btn" data-action="remove" data-id="${item.id}">Remove</button>
          </div>
          <div class="price">${formatNaira(item.price * item.qty)}</div>
        </div>
      `;
      cartItemsEl.appendChild(el);
    });
  }
  const total = cart.reduce((s,i)=>s + i.price * i.qty,0);
  cartTotalEl.textContent = formatNaira(total);
  saveCart();
}

function addToCart(p){
  const existing = cart.find(i=>i.id===p.id);
  if(existing){ existing.qty += 1; }
  else cart.push({...p, qty:1});
  updateCartUI();
  showSnackbar(`${p.name} added to cart`);
}

function removeFromCart(id){
  const idx = cart.findIndex(i=>i.id===id);
  if(idx>-1){
    const name = cart[idx].name;
    cart.splice(idx,1);
    updateCartUI();
    showSnackbar(`${name} removed from cart`);
  }
}

function changeQty(id, delta){
  const item = cart.find(i=>i.id===id);
  if(!item) return;
  item.qty += delta;
  if(item.qty<=0) removeFromCart(id);
  else updateCartUI();
}

// wire product buttons
document.querySelectorAll('.product').forEach(prod=>{
  const btn = prod.querySelector('.add-to-cart');
  const id = Number(prod.dataset.id);
  const name = prod.dataset.name;
  const price = Number(prod.dataset.price);
  const img = prod.querySelector('img').src;
  btn.addEventListener('click', ()=> addToCart({id,name,price,image:img}));
});

// open/close cart
cartBtn.addEventListener('click', ()=> cartDrawer.classList.add('open'));
closeCart.addEventListener('click', ()=> cartDrawer.classList.remove('open'));

// cart item controls
cartItemsEl.addEventListener('click', (e)=>{
  const btn = e.target.closest('button');
  if(!btn) return;
  const id = Number(btn.dataset.id);
  const action = btn.dataset.action;
  if(action==='remove') removeFromCart(id);
  if(action==='increase') changeQty(id, 1);
  if(action==='decrease') changeQty(id, -1);
});

clearCartBtn.addEventListener('click', ()=>{
  if(confirm('Clear the cart?')){ cart = []; updateCartUI(); showSnackbar('Cart cleared'); }
});

// place order: open wa.me with prefilled message (and keep wa.link as fallback)
function buildOrderMessage(){
  if(cart.length===0) return 'Hi, I would like to place an order. Cart is empty.';
  let lines = ['Hello JIBZYFOODS, I want to place an order:'];
  cart.forEach(i=> lines.push(`${i.qty} x ${i.name} — ₦${(i.price * i.qty).toLocaleString()}`));
  lines.push('Total: ' + formatNaira(cart.reduce((s,i)=>s+i.price*i.qty,0)));
  lines.push('Delivery details: [your address here]');
  lines.push('Name: [your name]');
  return lines.join('\n');
}

function openWhatsAppWithMessage(msg, fallback){
  const encoded = encodeURIComponent(msg);
  const waUrl = `https://wa.me/?text=${encoded}`;
  // try opening wa.me; if blocked, open fallback if provided
  try{
    window.open(waUrl, '_blank');
  }catch(e){
    if(fallback) window.open(fallback, '_blank');
  }
}

placeOrderBtn.addEventListener('click', (e)=>{
  e.preventDefault();
  const msg = buildOrderMessage();
  const fallback = placeOrderBtn.dataset.waFallback || placeOrderBtn.getAttribute('href');
  // copy to clipboard for convenience
  navigator.clipboard?.writeText(msg).then(()=>{
    showSnackbar('Order message copied. Opening WhatsApp...');
  }).catch(()=>{
    showSnackbar('Opening WhatsApp...');
  }).finally(()=> openWhatsAppWithMessage(msg, fallback));
});

placeOrderQuickBtn.addEventListener('click', (e)=>{
  e.preventDefault();
  const msg = buildOrderMessage();
  const fallback = placeOrderQuickBtn.dataset.waFallback || placeOrderQuickBtn.getAttribute('href');
  navigator.clipboard?.writeText(msg).then(()=> showSnackbar('Order message copied to clipboard')).catch(()=> showSnackbar('Opening WhatsApp...')).finally(()=> openWhatsAppWithMessage(msg, fallback));
});

// persist load
loadCart();
updateCartUI();
