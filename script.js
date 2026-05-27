/* =========================================
   Shay's Hub - JavaScript Logic
   ========================================= */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- State ---
    let cart = [];
    
    // --- DOM Elements ---
    const cartToggleBtn = document.querySelector('.cart-toggle');
    const cartSidebar = document.getElementById('cart-sidebar');
    const cartOverlay = document.getElementById('cart-overlay');
    const closeCartBtn = document.getElementById('close-cart');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartCountEl = document.getElementById('cart-count');
    const cartTotalPriceEl = document.getElementById('cart-total-price');
    const productCards = document.querySelectorAll('.product-card');

    // --- Format Currency ---
    const formatCurrency = (amount) => {
        return '₦' + parseInt(amount).toLocaleString('en-NG');
    };

    // --- Dynamic Pricing Update ---
    productCards.forEach(card => {
        const selectEl = card.querySelector('.print-type-select');
        const priceEl = card.querySelector('.price');
        const addToCartBtn = card.querySelector('.add-to-cart-btn');
        
        // Update price when select changes
        if (selectEl && priceEl) {
            selectEl.addEventListener('change', (e) => {
                const newPrice = e.target.value;
                priceEl.textContent = formatCurrency(newPrice);
                
                // Add a small bounce animation to the price to show it updated
                priceEl.style.transform = 'scale(1.1)';
                priceEl.style.color = 'var(--clr-primary)';
                setTimeout(() => {
                    priceEl.style.transform = 'scale(1)';
                    priceEl.style.color = 'var(--clr-text-main)';
                }, 300);
            });
        }
        
        // Add to Cart
        if (addToCartBtn) {
            addToCartBtn.addEventListener('click', () => {
                const id = card.dataset.id;
                const title = card.querySelector('h3').textContent;
                const price = parseInt(selectEl.value);
                const typeText = selectEl.options[selectEl.selectedIndex].text.split('(')[0].trim();
                
                const sizeEl = card.querySelector('.size-select');
                const size = sizeEl ? sizeEl.value : '';
                
                const colorEl = card.querySelector('.color-input');
                const color = colorEl ? colorEl.value.trim() : '';
                
                const designEl = card.querySelector('.design-input');
                const design = designEl ? designEl.value.trim() : '';
                
                const posEl = card.querySelector('.pos-select');
                const pos = posEl ? posEl.value : '';
                
                const fileEl = card.querySelector('.file-input');
                const hasFile = fileEl && fileEl.files.length > 0;
                
                // For the image, handle the case where it might be an SVG (totebag)
                const imgEl = card.querySelector('img');
                const imgSrc = imgEl ? imgEl.src : '';
                
                addToCart({
                    id: `${id}-${typeText}-${size}-${color}-${design}-${pos}`.replace(/\s+/g, '-'), // Unique ID based on product and custom options
                    title,
                    price,
                    type: typeText,
                    size,
                    color,
                    pos,
                    design,
                    hasFile,
                    img: imgSrc
                });
                
                // Animate button
                const originalText = addToCartBtn.textContent;
                addToCartBtn.textContent = 'Added ✓';
                addToCartBtn.style.backgroundColor = '#4CAF50';
                
                setTimeout(() => {
                    addToCartBtn.textContent = originalText;
                    addToCartBtn.style.backgroundColor = '';
                }, 1500);
            });
        }
    });

    // --- Cart Functions ---
    const addToCart = (item) => {
        // Check if item already exists in cart
        const existingItem = cart.find(cartItem => cartItem.id === item.id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ ...item, quantity: 1 });
        }
        
        updateCartUI();
        openCart(); // Automatically open cart to show feedback
    };

    const removeFromCart = (id) => {
        cart = cart.filter(item => item.id !== id);
        updateCartUI();
    };

    const updateCartUI = () => {
        // Update count
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCountEl.textContent = totalItems;
        
        // Update items list
        cartItemsContainer.innerHTML = '';
        
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<div class="empty-cart-msg">Your cart is empty.</div>';
            cartTotalPriceEl.textContent = '₦0';
            return;
        }
        
        let totalPrice = 0;
        
        cart.forEach(item => {
            totalPrice += item.price * item.quantity;
            
            const itemEl = document.createElement('div');
            itemEl.className = 'cart-item';
            
            // Image fallback for SVG
            const imageHTML = item.img 
                ? `<img src="${item.img}" alt="${item.title}" class="cart-item-img">`
                : `<div class="cart-item-img" style="display:flex; align-items:center; justify-content:center; background-color:#FDFBF7;">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#6A1B2A" stroke-width="1.5"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
                   </div>`;

            itemEl.innerHTML = `
                ${imageHTML}
                <div class="cart-item-details">
                    <div class="cart-item-title">${item.title} (x${item.quantity})</div>
                    <div class="cart-item-type">${item.type} | Size: ${item.size || 'N/A'} | Color: ${item.color || 'N/A'}</div>
                    ${item.pos ? `<div class="cart-item-type">Print Pos: ${item.pos}</div>` : ''}
                    ${item.design ? `<div class="cart-item-type">Design: ${item.design}</div>` : ''}
                    ${item.hasFile ? `<div class="cart-item-type" style="color: #4CAF50; font-weight: 500;">✓ Custom Image Provided</div>` : ''}
                    <div class="cart-item-price">${formatCurrency(item.price * item.quantity)}</div>
                    <button class="remove-item" data-id="${item.id}">Remove</button>
                </div>
            `;
            
            cartItemsContainer.appendChild(itemEl);
        });
        
        // Attach remove event listeners
        document.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', (e) => {
                removeFromCart(e.target.dataset.id);
            });
        });
        
        // Update total price
        cartTotalPriceEl.textContent = formatCurrency(totalPrice);
    };

    // --- Sidebar Toggles ---
    const openCart = () => {
        cartSidebar.classList.add('open');
        cartOverlay.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    };

    const closeCart = () => {
        cartSidebar.classList.remove('open');
        cartOverlay.classList.remove('active');
        document.body.style.overflow = '';
    };

    cartToggleBtn.addEventListener('click', openCart);
    closeCartBtn.addEventListener('click', closeCart);
    cartOverlay.addEventListener('click', closeCart);
    
    // --- Checkout Logic ---
    const checkoutBtn = document.getElementById('checkout-btn');
    const paystackBtn = document.getElementById('paystack-btn');
    
    // WhatsApp Checkout
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (cart.length === 0) {
                alert('Your cart is empty. Please add some items before checking out.');
                return;
            }
            
            let message = "Hello Shay's Hub! I would like to place an order:%0A%0A";
            let total = 0;
            let hasImageUpload = false;
            
            cart.forEach(item => {
                const itemTotal = item.price * item.quantity;
                total += itemTotal;
                message += `- ${item.title} x${item.quantity}%0A`;
                message += `  Style: ${item.type}%0A`;
                message += `  Size: ${item.size || 'N/A'}%0A`;
                message += `  Color: ${item.color || 'N/A'}%0A`;
                if (item.pos) message += `  Print Pos: ${item.pos}%0A`;
                if (item.design) message += `  Design text: ${item.design}%0A`;
                if (item.hasFile) {
                    message += `  Custom Image: Yes (will attach below)%0A`;
                    hasImageUpload = true;
                }
                message += `  Price: ₦${itemTotal.toLocaleString('en-NG')}%0A%0A`;
            });
            
            message += `*Total: ₦${total.toLocaleString('en-NG')}*%0A%0A`;
            
            if (hasImageUpload) {
                message += "⚠️ *IMPORTANT: I have a custom design image for my order. I will send the image to you in this chat now!*%0A%0A";
            }
            
            message += "Please let me know how to proceed with payment and delivery.";
            
            // Shay's Hub Phone Number (from contact info)
            const phone = "2349013460894";
            const whatsappUrl = `https://wa.me/${phone}?text=${message}`;
            
            window.open(whatsappUrl, '_blank');
        });
    }

    // Paystack Checkout
    if (paystackBtn) {
        paystackBtn.addEventListener('click', () => {
            if (cart.length === 0) {
                alert('Your cart is empty. Please add some items before checking out.');
                return;
            }
            
            const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            
            // Collect email from user (simple prompt for now)
            const email = prompt("Please enter your email address for the receipt:", "");
            if (!email) return;

            // Initialize Paystack Inline
            let handler = PaystackPop.setup({
                key: 'pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', // Replace with your actual test public key
                email: email,
                amount: totalAmount * 100, // amount in kobo
                currency: "NGN",
                ref: '' + Math.floor((Math.random() * 1000000000) + 1), 
                callback: function(response) {
                    alert('Payment complete! Reference: ' + response.reference + '\nYour order has been placed successfully.');
                    // In the future, send order details to Firebase here
                    cart = [];
                    updateCartUI();
                    closeCart();
                },
                onClose: function() {
                    // Do nothing if window is closed
                }
            });
            handler.openIframe();
        });
    }
    
    // Smooth scroll for nav links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
  
                window.scrollTo({
                     top: offsetPosition,
                     behavior: "smooth"
                });
            }
        });
    });
});
