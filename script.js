
const services = [
    {
        id: 1,
        name: "Limpeza de Pele Profunda",
        description: "Limpeza profunda com extração de cravos e miliuns, higienização e hidratação da pele.",
        duration: "60 min",
        price: 120.00,
        image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        category: "Estética Facial"
    },
    {
        id: 2,
        name: "Massagem Relaxante Corporal",
        description: "Massagem terapêutica para alívio de tensões musculares e relaxamento profundo.",
        duration: "50 min",
        price: 90.00,
        image: "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        category: "Massagem"
    },
    {
        id: 3,
        name: "Design de Sobrancelhas",
        description: "Design personalizado com henna e técnica de epilação com linha ou pinça.",
        duration: "30 min",
        price: 40.00,
        image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        category: "Estética Facial"
    },
    {
        id: 4,
        name: "Depilação a Laser (Sessão)",
        description: "Sessão de depilação a laser para eliminação definitiva dos pelos.",
        duration: "45 min",
        price: 200.00,
        image: "https://images.unsplash.com/photo-1700760933941-3a06a28fbf47?auto=format&fit=crop&w=1200&q=80",
        category: "Depilação"
    },
    {
        id: 5,
        name: "Manicure e Pedicure Completa",
        description: "Cuidados completos para mãos e pés com esmaltação em gel.",
        duration: "70 min",
        price: 60.00,
        image: "https://images.unsplash.com/photo-1604654894610-df63bc536371?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        category: "Unhas"
    },
    {
        id: 6,
        name: "Tratamento Capilar Reconstrutor",
        description: "Hidratação, reconstrução e nutrição para cabelos danificados.",
        duration: "80 min",
        price: 85.00,
        image: "https://images.unsplash.com/photo-1562322140-8baeececf3df?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        category: "Cabelos"
    }
];

// Carrinho de compras
let cart = [];

// Elementos DOM
const servicesContainer = document.getElementById('services-container');
const cartItemsContainer = document.getElementById('cart-items-container');
const emptyCartMessage = document.getElementById('empty-cart-message');
const cartTotalElement = document.getElementById('cart-total');
const cartCountElement = document.getElementById('cart-count');
const btnCart = document.getElementById('btn-cart');
const btnAgendar = document.getElementById('btn-agendar');
const btnFinalizar = document.getElementById('btn-finalizar');
const btnWhatsApp = document.getElementById('btn-whatsapp');

// Modais
let cartModal, scheduleModal;

// Formulário de agendamento
const scheduleForm = document.getElementById('schedule-form');
const clientName = document.getElementById('client-name');
// Variável clientPhone removida
const scheduleDate = document.getElementById('schedule-date');
const scheduleTime = document.getElementById('schedule-time');

// Inicializar quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar modais do Bootstrap
    cartModal = new bootstrap.Modal(document.getElementById('cartModal'));
    scheduleModal = new bootstrap.Modal(document.getElementById('scheduleModal'));
    
    // Configurar data mínima para hoje
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    scheduleDate.min = formattedDate;
    scheduleDate.value = formattedDate;
    
    // Configurar hora padrão (próxima hora cheia)
    const nextHour = today.getHours() + 1;
    scheduleTime.value = `${nextHour.toString().padStart(2, '0')}:00`;
    
    // Carregar carrinho do localStorage (se existir)
    loadCartFromStorage();
    
    // Renderizar serviços
    renderServices();
    
    // Atualizar carrinho
    updateCart();
    
    // Configurar eventos
    setupEventListeners();
});

// Configurar todos os event listeners
function setupEventListeners() {
    // Botão do carrinho
    btnCart.addEventListener('click', openCart);
    
    // Botão de agendar na seção agenda
    btnAgendar.addEventListener('click', function() {
        if (cart.length === 0) {
            showAlert('Adicione serviços ao carrinho antes de agendar.', 'warning');
            return;
        }
        scheduleModal.show();
    });
    
    // Botão finalizar no carrinho
    btnFinalizar.addEventListener('click', function() {
        if (cart.length === 0) {
            showAlert('Seu carrinho está vazio!', 'warning');
            return;
        }
        cartModal.hide();
        setTimeout(() => scheduleModal.show(), 300);
    });
    
    // Botão WhatsApp
    btnWhatsApp.addEventListener('click', sendToWhatsApp);
    
    // Formulário de agendamento - prevenir envio padrão
    scheduleForm.addEventListener('submit', function(e) {
        e.preventDefault();
        sendToWhatsApp();
    });
}

// Função para mostrar alertas
function showAlert(message, type = 'info') {
    // Remover alertas existentes
    const existingAlerts = document.querySelectorAll('.alert');
    existingAlerts.forEach(alert => alert.remove());
    
    // Criar elemento de alerta
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    alertDiv.style.cssText = `
        top: 20px;
        right: 20px;
        z-index: 1060;
        min-width: 300px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;
    
    alertDiv.innerHTML = `
        <div class="d-flex align-items-center">
            <i class="bi ${type === 'success' ? 'bi-check-circle' : type === 'warning' ? 'bi-exclamation-triangle' : 'bi-info-circle'} me-2"></i>
            <div class="flex-grow-1">${message}</div>
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;
    
    // Adicionar ao corpo
    document.body.appendChild(alertDiv);
    
    // Remover após 5 segundos
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.remove();
        }
    }, 5000);
}

// Função para formatar preço em reais
function formatPrice(price) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(price);
}

// Renderizar serviços na página
function renderServices() {
    servicesContainer.innerHTML = '';
    
    services.forEach(service => {
        const serviceElement = document.createElement('div');
        serviceElement.className = 'col-md-6 col-lg-4 mb-4 fade-in';
        serviceElement.innerHTML = `
            <div class="card service-card h-100">
                <img src="${service.image}" class="card-img-top" alt="${service.name}" loading="lazy">
                <div class="card-body d-flex flex-column">
                    <span class="badge bg-secondary mb-2 align-self-start">${service.category}</span>
                    <h5 class="card-title">${service.name}</h5>
                    <p class="card-text flex-grow-1">${service.description}</p>
                    <div class="d-flex justify-content-between align-items-center mt-3">
                        <div>
                            <span class="badge bg-light text-dark"><i class="bi bi-clock"></i> ${service.duration}</span>
                            <span class="ms-2 fw-bold text-pink">${formatPrice(service.price)}</span>
                        </div>
                        <div class="d-flex flex-column align-items-end">
                            <button class="btn btn-pink btn-sm add-to-cart mb-2" data-id="${service.id}">
                                <i class="bi bi-cart-plus"></i> Adicionar
                            </button>
                            <a href="#" class="text-pink text-decoration-underline small go-to-cart" style="cursor: pointer;">
                                Ir para o carrinho
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        servicesContainer.appendChild(serviceElement);
    });
    
    // Adicionar eventos aos botões de adicionar ao carrinho
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const serviceId = parseInt(this.getAttribute('data-id'));
            addToCart(serviceId);
        });
    });

    // NOVO: Adicionar eventos aos links "Ir para o carrinho"
    document.querySelectorAll('.go-to-cart').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault(); // Impede o comportamento padrão do link
            openCart(); // Chama a função que abre o modal do carrinho
        });
    });
}

// Adicionar serviço ao carrinho
function addToCart(serviceId) {
    const service = services.find(s => s.id === serviceId);
    
    if (!service) {
        showAlert('Serviço não encontrado.', 'warning');
        return;
    }
    
    // Verificar se o serviço já está no carrinho
    const existingItem = cart.find(item => item.id === serviceId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...service,
            quantity: 1
        });
    }
    
    updateCart();
    saveCartToStorage();
    
    // Feedback visual
    const button = document.querySelector(`.add-to-cart[data-id="${serviceId}"]`);
    if (button) {
        const originalText = button.innerHTML;
        const originalClass = button.className;
        
        button.innerHTML = '<i class="bi bi-check"></i> Adicionado';
        button.disabled = true;
        button.className = 'btn btn-success btn-sm';
        
        setTimeout(() => {
            button.innerHTML = originalText;
            button.disabled = false;
            button.className = originalClass;
        }, 1500);
    }
    
    // Mostrar alerta
    showAlert(`"${service.name}" adicionado ao carrinho!`, 'success');
}

// Remover item do carrinho
function removeFromCart(serviceId) {
    const itemIndex = cart.findIndex(item => item.id === serviceId);
    if (itemIndex !== -1) {
        const itemName = cart[itemIndex].name;
        cart.splice(itemIndex, 1);
        showAlert(`"${itemName}" removido do carrinho.`, 'info');
        updateCart();
        saveCartToStorage();
    }
}

// Atualizar quantidade de um item no carrinho
function updateQuantity(serviceId, newQuantity) {
    if (newQuantity < 1) {
        removeFromCart(serviceId);
        return;
    }
    
    const item = cart.find(item => item.id === serviceId);
    if (item) {
        item.quantity = newQuantity;
        updateCart();
        saveCartToStorage();
    }
}

// Abrir carrinho
function openCart() {
    cartModal.show();
}

// Atualizar carrinho na interface
function updateCart() {
    // Atualizar contador do carrinho
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountElement.textContent = totalItems;
    
    // Mostrar/ocultar badge se tiver itens
    if (totalItems > 0) {
        cartCountElement.style.display = 'inline-block';
    } else {
        cartCountElement.style.display = 'none';
    }
    
    // Atualizar lista de itens do carrinho
    if (cart.length === 0) {
        emptyCartMessage.style.display = 'block';
        cartItemsContainer.innerHTML = '';
        cartItemsContainer.appendChild(emptyCartMessage);
    } else {
        emptyCartMessage.style.display = 'none';
        
        let cartHTML = '';
        
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            
            cartHTML += `
                <div class="cart-item">
                    <div class="row align-items-center">
                        <div class="col-12 col-md-5">
                            <h6 class="mb-1">${item.name}</h6>
                            <small class="text-muted">${item.duration} • ${item.category}</small>
                        </div>
                        <div class="col-12 col-md-3 mt-2 mt-md-0">
                            <div class="d-flex align-items-center">
                                <button class="btn btn-outline-secondary btn-sm quantity-btn minus-btn" data-id="${item.id}">-</button>
                                <input type="text" class="form-control text-center mx-2 quantity-input" value="${item.quantity}" data-id="${item.id}" readonly>
                                <button class="btn btn-outline-secondary btn-sm quantity-btn plus-btn" data-id="${item.id}">+</button>
                            </div>
                        </div>
                        <div class="col-12 col-md-3 mt-2 mt-md-0 text-md-end">
                            <span class="fw-bold text-pink">${formatPrice(itemTotal)}</span>
                            <div class="small text-muted">${formatPrice(item.price)} cada</div>
                        </div>
                        <div class="col-12 col-md-1 mt-2 mt-md-0 text-md-end">
                            <button class="btn btn-sm btn-outline-danger remove-btn" data-id="${item.id}" title="Remover">
                                <i class="bi bi-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `;
        });
        
        cartItemsContainer.innerHTML = cartHTML;
        
        // Adicionar eventos aos botões do carrinho
        document.querySelectorAll('.minus-btn').forEach(button => {
            button.addEventListener('click', function() {
                const serviceId = parseInt(this.getAttribute('data-id'));
                const item = cart.find(item => item.id === serviceId);
                if (item) {
                    updateQuantity(serviceId, item.quantity - 1);
                }
            });
        });
        
        document.querySelectorAll('.plus-btn').forEach(button => {
            button.addEventListener('click', function() {
                const serviceId = parseInt(this.getAttribute('data-id'));
                const item = cart.find(item => item.id === serviceId);
                if (item) {
                    updateQuantity(serviceId, item.quantity + 1);
                }
            });
        });
        
        document.querySelectorAll('.remove-btn').forEach(button => {
            button.addEventListener('click', function() {
                const serviceId = parseInt(this.getAttribute('data-id'));
                removeFromCart(serviceId);
            });
        });
    }
    
    // Atualizar total
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotalElement.textContent = formatPrice(totalPrice);
}

// Salvar carrinho no localStorage
function saveCartToStorage() {
    try {
        localStorage.setItem('esteticaCart', JSON.stringify(cart));
    } catch (e) {
        console.warn('Não foi possível salvar o carrinho no localStorage:', e);
    }
}

// Carregar carrinho do localStorage
function loadCartFromStorage() {
    try {
        const savedCart = localStorage.getItem('esteticaCart');
        if (savedCart) {
            cart = JSON.parse(savedCart);
        }
    } catch (e) {
        console.warn('Não foi possível carregar o carrinho do localStorage:', e);
        cart = [];
    }
}

// Enviar agendamento para WhatsApp
function sendToWhatsApp() {
    // Validar carrinho
    if (cart.length === 0) {
        showAlert('Adicione serviços ao carrinho antes de agendar.', 'warning');
        return;
    }
    
    // Validar formulário
    if (!clientName.value.trim()) {
        showAlert('Por favor, informe seu nome completo.', 'warning');
        clientName.focus();
        return;
    }
    
    // REMOVIDO: Validação de telefone

    if (!scheduleDate.value) {
        showAlert('Por favor, selecione uma data para o agendamento.', 'warning');
        return;
    }
    
    if (!scheduleTime.value) {
        showAlert('Por favor, selecione um horário para o agendamento.', 'warning');
        return;
    }
    
    // Formatar data
    const dateObj = new Date(scheduleDate.value);
    const formattedDate = dateObj.toLocaleDateString('pt-BR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    // Criar mensagem para WhatsApp
    let message = `*AGENDAMENTO - ESTÉTICA BELLE* ✨\n\n`;
    message += `*📋 Dados do Cliente:*\n`;
    message += `• *Nome:* ${clientName.value.trim()}\n`;
    // REMOVIDO: Linha de telefone e e-mail
    message += `• *Data:* ${formattedDate}\n`;
    message += `• *Horário:* ${scheduleTime.value}\n\n`;
    
    message += `*🛍️ Serviços Solicitados:*\n`;
    let totalPrice = 0;
    
    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        totalPrice += itemTotal;
        message += `${index + 1}. *${item.name}* (${item.duration})\n`;
        message += `   Quantidade: ${item.quantity}\n`;
        message += `   Valor unitário: ${formatPrice(item.price)}\n`;
        message += `   Subtotal: ${formatPrice(itemTotal)}\n\n`;
    });
    
    message += `*💰 VALOR TOTAL: ${formatPrice(totalPrice)}*\n\n`;
    message += `⏰ *Observação:* Este é um agendamento solicitado através do site. Aguardo confirmação.`;
    
    // Número do WhatsApp 
    const phoneNumber = "5538998551312";
    
    // Criar link do WhatsApp
    const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    
    // Abrir WhatsApp em nova aba
    window.open(whatsappURL, '_blank');
    
    // Feedback para o usuário
    showAlert('Redirecionando para o WhatsApp...', 'success');
    
    // Fechar modais
    cartModal.hide();
    scheduleModal.hide();
    
    // Limpar carrinho e formulário (opcional)
    setTimeout(() => {
        cart = [];
        updateCart();
        saveCartToStorage();
        scheduleForm.reset();
        
        // Restaurar data e hora padrão
        const today = new Date();
        const formattedDate = today.toISOString().split('T')[0];
        scheduleDate.value = formattedDate;
        const nextHour = today.getHours() + 1;
        scheduleTime.value = `${nextHour.toString().padStart(2, '0')}:00`;
    }, 1000);
}

// Adicionar funcionalidade de scroll suave para links internos
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            e.preventDefault();
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
            
            // Atualizar estado ativo na navbar
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
            });
            this.classList.add('active');
        }
    });
});

// Adicionar classe ativa na navbar conforme scroll
window.addEventListener('scroll', function() {
    const scrollPosition = window.scrollY + 100;
    
    document.querySelectorAll('section').forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
});
