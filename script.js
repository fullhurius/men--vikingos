document.addEventListener('DOMContentLoaded', function() {
    // Incrementar el contador de visitas
    function incrementVisitCounter() {
        let visitCount = localStorage.getItem('visitCount');
        if (!visitCount) {
            visitCount = 0;
        }
        visitCount = parseInt(visitCount) + 1;
        localStorage.setItem('visitCount', visitCount);
        return visitCount;
    }

    // Mostrar el contador de visitas
    function displayVisitCounter() {
        const visitCount = localStorage.getItem('visitCount') || 0;
        const visitCounterElement = document.createElement('div');
        visitCounterElement.className = 'visit-counter';
        visitCounterElement.textContent = `Visitas: ${visitCount}`;
        document.body.appendChild(visitCounterElement);
    }

    // Incrementar y mostrar el contador de visitas al cargar la página
    const visitCount = incrementVisitCounter();
    displayVisitCounter();

    // Manejo de vistas
    const viewButtons = document.querySelectorAll('.view-btn');
    const menuGrids = document.querySelectorAll('.menu-grid');

    viewButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remover clase active de todos los botones
            viewButtons.forEach(btn => btn.classList.remove('active'));
            // Agregar clase active al botón clickeado
            button.classList.add('active');
            
            // Obtener el tipo de vista
            const viewType = button.dataset.view;
            
            // Actualizar todas las grillas del menú
            menuGrids.forEach(grid => {
                grid.classList.remove('grid-view', 'list-view', 'compact-view');
                grid.classList.add(`${viewType}-view`);
            });
        });
    });

    // Manejo del modal
    const modal = document.getElementById('itemModal');
    const modalImage = document.getElementById('modalImage');
    const modalTitle = document.getElementById('modalTitle');
    const modalDescription = document.getElementById('modalDescription');
    const modalPrice = document.getElementById('modalPrice');
    const closeModal = document.querySelector('.close-modal');

    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', function() {
            const image = this.querySelector('img').src;
            const title = this.querySelector('h3').textContent;
            const description = this.querySelector('.description').textContent;
            const price = this.querySelector('.price').textContent;

            modalImage.src = image;
            modalTitle.textContent = title;
            modalDescription.textContent = description;
            modalPrice.textContent = price;

            modal.classList.add('show');
            document.body.style.overflow = 'hidden';
        });
    });

    // Cerrar modal con el botón X
    closeModal.addEventListener('click', () => {
        modal.classList.remove('show');
        document.body.style.overflow = '';
    });

    // Cerrar modal haciendo clic fuera
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('show');
            document.body.style.overflow = '';
        }
    });

    // Cerrar modal con ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('show')) {
            modal.classList.remove('show');
            document.body.style.overflow = '';
        }
    });

    // Modo administrador
    const adminToggle = document.getElementById('admin-toggle');
    let isAdmin = false;

    adminToggle.addEventListener('click', () => {
        if (!isAdmin) {
            // Solicitar contraseña para activar el modo administrador
            const password = prompt('Introduce la contraseña para activar el modo administrador:');
            if (password === 'admin123') { // Cambia 'admin123' por la contraseña que desees
                isAdmin = true;
                document.body.classList.add('admin-mode');
                alert('Modo administrador activado');
                adminToggle.innerHTML = '<i class="fas fa-sign-out-alt"></i> Salir Admin';
            } else {
                alert('Contraseña incorrecta');
            }
        } else {
            // Salir del modo administrador
            isAdmin = false;
            document.body.classList.remove('admin-mode');
            alert('Modo administrador desactivado');
            adminToggle.innerHTML = '<i class="fas fa-user-shield"></i> Admin';
        }
    });

    // Guardar el estado del menú
    function saveMenuState() {
        const disabledItems = Array.from(document.querySelectorAll('.menu-item.disabled'))
            .map(item => item.querySelector('h3').textContent);
        localStorage.setItem('disabledItems', JSON.stringify(disabledItems));
    }

    // Cargar el estado del menú
    function loadMenuState() {
        const disabledItems = JSON.parse(localStorage.getItem('disabledItems') || '[]');
        disabledItems.forEach(itemName => {
            const item = Array.from(document.querySelectorAll('.menu-item'))
                .find(element => element.querySelector('h3').textContent === itemName);
            if (item) {
                item.classList.add('disabled');
            }
        });
    }

    // Cargar el estado guardado
    loadMenuState();

    // Filtro de búsqueda
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Buscar platos...';
    searchInput.classList.add('search-input');
    
   

    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const menuItems = document.querySelectorAll('.menu-item');

        menuItems.forEach(item => {
            const title = item.querySelector('h3').textContent.toLowerCase();
            const description = item.querySelector('.description').textContent.toLowerCase();
            
            if (title.includes(searchTerm) || description.includes(searchTerm)) {
                item.style.display = '';
            } else {
                item.style.display = 'none';
            }
        });
    });

    // Animación al hacer scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, {
        threshold: 0.1
    });

    document.querySelectorAll('.menu-item').forEach(item => {
        item.classList.add('fade-out');
        observer.observe(item);
    });

    // Botón back to top
    const backToTopBtn = document.querySelector('.back-to-top');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Modo oscuro
    const themeToggle = document.querySelector('.theme-toggle');
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        const icon = themeToggle.querySelector('i');
        if (document.body.classList.contains('dark-theme')) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        }
    });


    // Función para deshabilitar el modo administrador
    function disableAdminMode() {
        const disableButtons = document.querySelectorAll('.disable-btn');
        const enableButtons = document.querySelectorAll('.enable-btn');
        const disabledLabels = document.querySelectorAll('.disabled-label');

        // Eliminar botones y etiquetas de los productos
        disableButtons.forEach(button => button.remove());
        enableButtons.forEach(button => button.remove());
        disabledLabels.forEach(label => label.remove());

        // Ocultar productos deshabilitados
        const disabledItems = JSON.parse(localStorage.getItem('disabledItems') || '[]');
        disabledItems.forEach(itemName => {
            const item = Array.from(document.querySelectorAll('.menu-item'))
                .find(element => element.querySelector('h3').textContent === itemName);
            if (item) {
                item.style.display = 'none';
            }
        });
    }

    // Guardar productos deshabilitados en localStorage
    function saveDisabledItem(itemName) {
        let disabledItems = JSON.parse(localStorage.getItem('disabledItems') || '[]');
        if (!disabledItems.includes(itemName)) {
            disabledItems.push(itemName);
            localStorage.setItem('disabledItems', JSON.stringify(disabledItems));
        }
    }

    // Función para eliminar un producto deshabilitado de localStorage
    function removeDisabledItem(itemName) {
        let disabledItems = JSON.parse(localStorage.getItem('disabledItems') || '[]');
        disabledItems = disabledItems.filter(name => name !== itemName);
        localStorage.setItem('disabledItems', JSON.stringify(disabledItems));
    }

    // Cargar productos deshabilitados al cargar la página
    function loadDisabledItems() {
        const disabledItems = JSON.parse(localStorage.getItem('disabledItems') || '[]');
        disabledItems.forEach(itemName => {
            const item = Array.from(document.querySelectorAll('.menu-item'))
                .find(element => element.querySelector('h3').textContent === itemName);
            if (item) {
                if (document.body.classList.contains('admin-mode')) {
                    // Mostrar productos deshabilitados en modo administrador
                    item.style.display = '';
                    item.style.opacity = '0.5'; // Reducir opacidad para indicar que está deshabilitado
                    item.style.pointerEvents = 'none'; // Deshabilitar interacción
                    if (!item.querySelector('.disabled-label')) {
                        const disabledLabel = document.createElement('span');
                        disabledLabel.textContent = 'Deshabilitado';
                        disabledLabel.className = 'disabled-label';
                        disabledLabel.style.color = 'red';
                        disabledLabel.style.fontWeight = 'bold';
                        disabledLabel.style.marginLeft = '10px';
                        item.querySelector('.menu-item-content').appendChild(disabledLabel);
                    }
                } else {
                    // Ocultar productos deshabilitados para los clientes
                    item.style.display = 'none';
                }
            }
        });
    }

    // Cargar productos deshabilitados al inicio
    loadDisabledItems();

    // Función para mostrar todos los productos
    function showAllItems() {
        const menuItems = document.querySelectorAll('.menu-item');
        menuItems.forEach(item => {
            item.style.display = ''; // Asegurarse de que todos los productos sean visibles
            item.style.opacity = '1'; // Restaurar opacidad
            item.style.pointerEvents = 'auto'; // Restaurar interacción
            const disabledLabel = item.querySelector('.disabled-label');
            if (disabledLabel) disabledLabel.remove(); // Eliminar etiquetas "Deshabilitado"
        });

        // Limpiar el estado de productos deshabilitados en localStorage
        localStorage.removeItem('disabledItems');
    }

    // Llamar a la función para mostrar todos los productos al cargar la página
    showAllItems();
});

// Filtro de precios
function addPriceFilter() {
    const filterContainer = document.createElement('div');
    filterContainer.className = 'price-filter';
    filterContainer.innerHTML = `
        <label>Filtrar por precio:</label>
        <select id="priceFilter">
            <option value="all">Todos</option>
            <option value="0-10">€0 - €10</option>
            <option value="10-20">€10 - €20</option>
            <option value="20+">€20+</option>
        </select>
    `;

    document.querySelector('.view-controls').appendChild(filterContainer);

    document.getElementById('priceFilter').addEventListener('change', (e) => {
        const [min, max] = e.target.value.split('-');
        const items = document.querySelectorAll('.menu-item');
        
        items.forEach(item => {
            const price = parseFloat(item.querySelector('.price').textContent);
            if (e.target.value === 'all' || 
               (min === '20+' && price >= 20) ||
               (price >= parseFloat(min) && price <= parseFloat(max))) {
                item.style.display = '';
            } else {
                item.style.display = 'none';
            }
        });
    });
}

// Categorías populares
function addPopularCategories() {
    const categories = document.createElement('div');
    categories.className = 'popular-categories';
    categories.innerHTML = `
        <div class="category-chip" data-category="hamburguesas">
            <i class="fas fa-hamburger"></i> Hamburguesas
        </div>
        <div class="category-chip" data-category="pizzas">
            <i class="fas fa-pizza-slice"></i> Pizzas
        </div>
        <div class="category-chip" data-category="ensaladas">
            <i class="fas fa-leaf"></i> Ensaladas
        </div>
    `;

    document.querySelector('main').insertBefore(categories, document.querySelector('.menu-section'));

    categories.querySelectorAll('.category-chip').forEach(chip => {
        chip.addEventListener('click', () => {
            document.querySelector(`#${chip.dataset.category}`).scrollIntoView({ 
                behavior: 'smooth' 
            });
        });
    });
}