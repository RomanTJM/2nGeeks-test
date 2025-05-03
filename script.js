// Мобильное меню
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const mobileMenu = document.querySelector('.mobile-menu');
const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');
const body = document.body;

function toggleMobileMenu() {
    mobileMenuBtn.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    mobileMenuOverlay.classList.toggle('active');
    body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
}

mobileMenuBtn.addEventListener('click', toggleMobileMenu);
mobileMenuOverlay.addEventListener('click', toggleMobileMenu);

// Закрытие мобильного меню при клике на ссылку
const mobileMenuLinks = mobileMenu.querySelectorAll('a');
mobileMenuLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (mobileMenu.classList.contains('active')) {
            toggleMobileMenu();
        }
    });
});

// Закрытие мобильного меню при изменении размера окна
window.addEventListener('resize', () => {
    if (window.innerWidth > 767 && mobileMenu.classList.contains('active')) {
        toggleMobileMenu();
    }
});

// Плавная прокрутка для навигационных ссылок
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });

            mobileMenu.classList.remove('active');
            mobileMenuBtn.classList.remove('active');
        }
    });
});

// Анимация появления элементов при прокрутке
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Наблюдаем за элементами, которые нужно анимировать
document.querySelectorAll('.game-card, .step').forEach(element => {
    observer.observe(element);
});

// Обработка формы подписки на новости
const newsletterForm = document.querySelector('.newsletter-form');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = newsletterForm.querySelector('input[type="email"]').value;

        console.log('Subscribed email:', email);
        newsletterForm.reset();
        alert('Спасибо за подписку!');
    });
}

// Анимация кнопок
document.querySelectorAll('.primary-button, .secondary-button').forEach(button => {
    button.addEventListener('click', () => {
        button.classList.add('clicked');
        setTimeout(() => {
            button.classList.remove('clicked');
        }, 200);
    });
});

// Фиксированное меню при прокрутке
const header = document.querySelector('.header');
let lastScroll = 0;
const scrollThreshold = 100; 

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    // Добавляем класс scroll-up сразу при старте прокрутки
    if (currentScroll > 0) {
        header.classList.add('scroll-up');
    } else {
        header.classList.remove('scroll-up');
    }
    
    // Проверяем направление прокрутки только если прошли определенное расстояние
    if (Math.abs(currentScroll - lastScroll) > scrollThreshold) {
        if (currentScroll > lastScroll && currentScroll > header.offsetHeight) {

            header.classList.remove('scroll-up');
            header.classList.add('scroll-down');
        } else {

            header.classList.remove('scroll-down');
            header.classList.add('scroll-up');
        }
        lastScroll = currentScroll;
    }
});

// Языковой селектор
const languageBtn = document.querySelector('.language-btn');
const languageSpan = languageBtn.querySelector('span');
const languageLinks = document.querySelectorAll('.language-dropdown a');

// Объект с названиями языков
const languages = {
    'en': 'English',
    'fr': 'Français',
    'it': 'Italiano',
    'de': 'Deutsch',
    'es': 'Español',
    'es-la': 'Español (Latinoamérica)',
    'pt-br': 'Português brasileiro'
};

languageLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const lang = link.getAttribute('data-lang');
        
        // Обновляем текст кнопки
        languageSpan.textContent = languages[lang];
        
        // Обновляем активный класс
        languageLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        

        document.documentElement.lang = lang;
    });
});

// Корзина
const cartBtn = document.querySelector('.cart-btn');
const cartSidebar = document.querySelector('.cart-sidebar');
const cartOverlay = document.querySelector('.cart-overlay');
const closeCartBtn = document.querySelector('.close-cart');
const cartItemsContainer = document.querySelector('.cart-items');
const emptyCart = document.querySelector('.empty-cart');
const cartCount = document.querySelector('.cart-count');
const totalAmount = document.querySelector('.total-amount');
let cartItems = [];

// Открытие/закрытие корзины
function toggleCart() {
    cartSidebar.classList.toggle('active');
    cartOverlay.classList.toggle('active');
    document.body.style.overflow = cartSidebar.classList.contains('active') ? 'hidden' : '';
}

cartBtn.addEventListener('click', toggleCart);
closeCartBtn.addEventListener('click', toggleCart);
cartOverlay.addEventListener('click', toggleCart);

// Обработка нажатия Escape для закрытия корзины
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && cartSidebar.classList.contains('active')) {
        toggleCart();
    }
});

// Функция обновления корзины
function updateCart() {
    cartCount.textContent = cartItems.length;
    
    if (cartItems.length === 0) {
        cartItemsContainer.style.display = 'none';
        emptyCart.style.display = 'block';
        return;
    }

    cartItemsContainer.style.display = 'block';
    emptyCart.style.display = 'none';

    let total = 0;
    cartItemsContainer.innerHTML = cartItems.map(item => {
        total += item.price;
        return `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-details">
                    <div class="cart-item-title">${item.name}</div>
                    <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                </div>
                <button class="remove-item" data-id="${item.id}">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
    }).join('');

    totalAmount.textContent = `$${total.toFixed(2)}`;

    // Добавляем обработчики для кнопок удаления
    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            const id = button.getAttribute('data-id');
            removeFromCart(id);
        });
    });
}

// Функция удаления товара из корзины
function removeFromCart(id) {
    cartItems = cartItems.filter(item => item.id !== id);
    updateCart();
}

// Функция добавления товара в корзину
function addToCart(item) {
    cartItems.push(item);
    updateCart();
    
    // Показываем корзину при добавлении товара
    if (!cartSidebar.classList.contains('active')) {
        toggleCart();
    }
}

// Обработчик для кнопки оформления заказа
const checkoutBtn = document.querySelector('.checkout-btn');
checkoutBtn.addEventListener('click', () => {
    if (cartItems.length > 0) {
        alert('Proceeding to checkout...');

    }
});

// Модальное окно регистрации
const signUpBtns = document.querySelectorAll('.sign-up-btn');
const signupModal = document.querySelector('.signup-modal');
const modalOverlay = document.querySelector('.modal-overlay');
const closeModalBtn = document.querySelector('.close-modal');

// Функция открытия/закрытия модального окна
function toggleModal() {
    // Если открыто мобильное меню — закрываем его
    if (mobileMenu.classList.contains('active')) {
        toggleMobileMenu();
    }
    signupModal.classList.toggle('active');
    modalOverlay.classList.toggle('active');
    document.body.style.overflow = signupModal.classList.contains('active') ? 'hidden' : '';
    // Автофокус на первый input при открытии
    if (signupModal.classList.contains('active')) {
        const firstInput = signupModal.querySelector('input, select, textarea');
        if (firstInput) {
            setTimeout(() => firstInput.focus(), 100);
        }
    }
}

// Обработчики событий для модального окна
signUpBtns.forEach(btn => {
    btn.addEventListener('click', toggleModal);
});
closeModalBtn.addEventListener('click', toggleModal);


// Обработка формы регистрации
const signupForm = document.querySelector('.signup-form');
signupForm.addEventListener('submit', (e) => {
    e.preventDefault();

    console.log('Form submitted');
    toggleModal();
});

// Переключение видимости пароля
document.querySelectorAll('.toggle-password').forEach(button => {
    button.addEventListener('click', () => {
        const input = button.previousElementSibling;
        const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
        input.setAttribute('type', type);
        button.querySelector('i').classList.toggle('fa-eye');
        button.querySelector('i').classList.toggle('fa-eye-slash');
    });
});

// Слайдер
const slider = {
    currentSlide: 0,
    slides: document.querySelectorAll('.slide'),
    dotsContainer: document.querySelector('.slider-dots'),
    prevBtn: document.querySelector('.slider-nav.prev'),
    nextBtn: document.querySelector('.slider-nav.next'),
    isAnimating: false,
    
    init() {
        // Создаем точки
        this.createDots();
        
        // Добавляем обработчики событий
        this.prevBtn.addEventListener('click', () => this.prevSlide());
        this.nextBtn.addEventListener('click', () => this.nextSlide());
        
        // Устанавливаем начальное состояние слайдов
        this.updateSlides();
        
        // Автоматическое переключение слайдов
        setInterval(() => this.nextSlide(), 5000);
    },

    createDots() {
        // Очищаем контейнер точек
        this.dotsContainer.innerHTML = '';
        
        // Создаем точку для каждого слайда
        this.slides.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.className = `dot ${index === this.currentSlide ? 'active' : ''}`;
            dot.addEventListener('click', () => this.goToSlide(index));
            this.dotsContainer.appendChild(dot);
        });
    },

    updateDots() {
        // Обновляем активную точку
        const dots = this.dotsContainer.querySelectorAll('.dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentSlide);
        });
    },

    updateSlides() {
        this.slides.forEach((slide, index) => {
            slide.classList.remove('active', 'prev', 'next');
            
            if (index === this.currentSlide) {
                slide.classList.add('active');
            } else if (index === this.getPrevIndex()) {
                slide.classList.add('prev');
            } else if (index === this.getNextIndex()) {
                slide.classList.add('next');
            }
            
            // Устанавливаем позицию для остальных слайдов
            if (index !== this.currentSlide && 
                index !== this.getPrevIndex() && 
                index !== this.getNextIndex()) {
                if (index < this.currentSlide) {
                    slide.style.transform = 'translateX(-200%) scale(0.8)';
                } else {
                    slide.style.transform = 'translateX(200%) scale(0.8)';
                }
            } else {
                slide.style.transform = '';
            }
        });

        // Обновляем точки
        this.updateDots();
    },

    getPrevIndex() {
        return (this.currentSlide - 1 + this.slides.length) % this.slides.length;
    },

    getNextIndex() {
        return (this.currentSlide + 1) % this.slides.length;
    },
    
    async showSlide(index) {
        if (this.isAnimating || index === this.currentSlide) return;
        this.isAnimating = true;

        const direction = index > this.currentSlide ? 1 : -1;
        this.currentSlide = index;
        
        this.updateSlides();

        // Ждем окончания анимации
        await new Promise(resolve => setTimeout(resolve, 500));
        
        this.isAnimating = false;
    },
    
    nextSlide() {
        if (this.isAnimating) return;
        const next = this.getNextIndex();
        this.showSlide(next);
    },
    
    prevSlide() {
        if (this.isAnimating) return;
        const prev = this.getPrevIndex();
        this.showSlide(prev);
    },
    
    goToSlide(index) {
        this.showSlide(index);
    }
};

// Инициализация слайдера
slider.init();

// FAQ Accordion
const accordionItems = document.querySelectorAll('.accordion-item');

accordionItems.forEach(item => {
    const header = item.querySelector('.accordion-header');
    
    header.addEventListener('click', () => {

        item.classList.toggle('active');
    });
});

// Управление выпадающими меню
const dropdowns = document.querySelectorAll('.dropdown');

// Обработка клика по переключателю выпадающего меню
dropdowns.forEach(dropdown => {
    const toggle = dropdown.querySelector('.dropdown-toggle');
    
    toggle.addEventListener('click', (e) => {

        if (window.innerWidth <= 767) {
            e.preventDefault();
            dropdown.classList.toggle('active');
        }
    });
});

// Закрытие выпадающих меню при клике вне их области
document.addEventListener('click', (e) => {
    if (!e.target.closest('.dropdown')) {
        dropdowns.forEach(dropdown => {
            if (!dropdown.contains(e.target)) {
                dropdown.classList.remove('active');
            }
        });
    }
});

// Обработка клавиши Escape - закрываем все меню
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        dropdowns.forEach(dropdown => {
            dropdown.classList.remove('active');
        });
    }
});

// Закрытие выпадающих меню при изменении размера окна
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        if (window.innerWidth > 767) {
            dropdowns.forEach(dropdown => {
                dropdown.classList.remove('active');
            });
        }
    }, 250);
});

// Обработка доступности с клавиатуры
dropdowns.forEach(dropdown => {
    const toggle = dropdown.querySelector('.dropdown-toggle');
    const menu = dropdown.querySelector('.dropdown-menu');
    const items = menu.querySelectorAll('a');

    toggle.addEventListener('keydown', (e) => {
        const isExpanded = dropdown.classList.contains('active');

        switch (e.key) {
            case 'Enter':
            case ' ':
                e.preventDefault();
                dropdown.classList.toggle('active');
                if (dropdown.classList.contains('active')) {
                    items[0]?.focus();
                }
                break;
            case 'Escape':
                if (isExpanded) {
                    dropdown.classList.remove('active');
                    toggle.focus();
                }
                break;
        }
    });
});

document.addEventListener('DOMContentLoaded', function() {

    // Добавляем отслеживание для friends-img-go
    const friendsImg = document.querySelector('.gather-illustration img:last-child');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                friendsImg.classList.add('visible');
            } else {
                friendsImg.classList.remove('visible');
            }
        });
    }, {
        threshold: 0.3 
    });

    if (friendsImg) {
        observer.observe(friendsImg);
    }
}); 

document.addEventListener('DOMContentLoaded', function() {
    const image = document.querySelector('.scroll-fade-image');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                image.style.opacity = '1';
            } else {
                image.style.opacity = '0';
            }
        });
    }, {
        threshold: 0.5
    });

    observer.observe(image);
});

// Обработчик для мобильных: фокус по тапу в input в модальном окне
signupModal.querySelectorAll('input, select, textarea').forEach(el => {
    el.addEventListener('touchstart', function() {
        this.focus();
    });
});

// --- Свайп для слайдера на мобильных устройствах ---
(function() {
    const sliderContainer = document.querySelector('.slider-container');
    if (!sliderContainer) return;
    let startX = 0;
    let endX = 0;
    let isTouch = false;

    sliderContainer.addEventListener('touchstart', function(e) {
        if (e.touches.length === 1) {
            isTouch = true;
            startX = e.touches[0].clientX;
        }
    });

    sliderContainer.addEventListener('touchmove', function(e) {
        if (!isTouch) return;
        endX = e.touches[0].clientX;
    });

    sliderContainer.addEventListener('touchend', function(e) {
        if (!isTouch) return;
        const diff = endX - startX;
        if (Math.abs(diff) > 50) { 
            if (diff < 0) {
                slider.nextSlide(); 
            } else {
                slider.prevSlide(); 
            }
        }
        isTouch = false;
        startX = 0;
        endX = 0;
    });
})();

document.addEventListener('DOMContentLoaded', function() {
    const packRow = document.querySelector('.pack-row.top');
    const imagesContainer = packRow.querySelector('.pack-images-container');
    const images = imagesContainer.querySelectorAll('img');
});