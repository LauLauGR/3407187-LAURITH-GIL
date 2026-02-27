/**
 * ============================================
 * PROYECTO SEMANA 03 - SISTEMA DE GESTIÓN CON POO
 * Dominio: App de Guías Turísticas Virtuales
 * ============================================
 */

// ============================================
// TODO 1: CLASE BASE - TourExperience
// ============================================
class TourExperience {
  // Campos privados
  #id;
  #name;
  #active;
  #location;
  #dateCreated;

  /**
   * @param {string} name - Nombre de la experiencia
   * @param {string} location - Ciudad o lugar
   */
  constructor(name, location) {
    this.#id = crypto.randomUUID();
    this.#name = name;
    this.#location = location;
    this.#active = true;
    this.#dateCreated = new Date().toISOString();
  }

  // GETTERS
  get id() { return this.#id; }
  get name() { return this.#name; }
  get isActive() { return this.#active; }
  get location() { return this.#location; }
  get dateCreated() { return this.#dateCreated; }

  // SETTERS
  set location(value) {
    if (!value || value.trim() === '') {
      throw new Error('La ubicación no puede estar vacía');
    }
    this.#location = value.trim();
  }

  // MÉTODOS DE INSTANCIA
  activate() {
    if (this.#active) return { success: false, message: 'Ya está activa' };
    this.#active = true;
    return { success: true, message: 'Experiencia activada' };
  }

  deactivate() {
    if (!this.#active) return { success: false, message: 'Ya está desactivada' };
    this.#active = false;
    return { success: true, message: 'Experiencia desactivada' };
  }

  getType() {
    return this.constructor.name;
  }

  // Método que será sobrescrito
  getInfo() {
    throw new Error('El método getInfo() debe ser implementado en la clase hija');
  }
}

// ============================================
// TODO 2: CLASES DERIVADAS
// ============================================

// Tipo 1: Audio Guía
class AudioGuide extends TourExperience {
  #language;
  #duration; // en minutos

  constructor(name, location, language, duration) {
    super(name, location);
    this.#language = language;
    this.#duration = duration;
  }

  getInfo() {
    return {
      id: this.id,
      name: this.name,
      type: 'Audio guía',
      location: this.location,
      extra: `Idioma: ${this.#language} (${this.#duration} min)`,
      active: this.isActive
    };
  }
}

// Tipo 2: Video 360
class Video360 extends TourExperience {
  #resolution;
  #fileSize;

  constructor(name, location, resolution, fileSize) {
    super(name, location);
    this.#resolution = resolution;
    this.#fileSize = fileSize;
  }

  getInfo() {
    return {
      id: this.id,
      name: this.name,
      type: 'Video 360°',
      location: this.location,
      extra: `Calidad: ${this.#resolution} - ${this.#fileSize}MB`,
      active: this.isActive
    };
  }
}

// Tipo 3: Realidad Virtual (VR)
class VRExperience extends TourExperience {
  #deviceRequired;

  constructor(name, location, deviceRequired) {
    super(name, location);
    this.#deviceRequired = deviceRequired;
  }

  getInfo() {
    return {
      id: this.id,
      name: this.name,
      type: 'Tour VR',
      location: this.location,
      extra: `Equipo: ${this.#deviceRequired}`,
      active: this.isActive
    };
  }
}

// ============================================
// TODO 3 y 4: CLASES DE USUARIOS (Person y Roles)
// ============================================
class Person {
  #id;
  #name;
  #email;
  #registrationDate;

  constructor(name, email) {
    this.#id = crypto.randomUUID();
    this.#name = name;
    this.email = email; // Usa el setter para validar
    this.#registrationDate = new Date().toLocaleDateString();
  }

  get id() { return this.#id; }
  get name() { return this.#name; }
  get email() { return this.#email; }
  get registrationDate() { return this.#registrationDate; }

  set email(value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) throw new Error('Email inválido');
    this.#email = value;
  }

  getInfo() {
    return { id: this.#id, name: this.#name, email: this.#email, date: this.#registrationDate };
  }
}

// Roles específicos
class Guide extends Person {
  #specialty;
  constructor(name, email, specialty) {
    super(name, email);
    this.#specialty = specialty;
  }
  get role() { return 'Guía'; }
}

class Tourist extends Person {
  #country;
  constructor(name, email, country) {
    super(name, email);
    this.#country = country;
  }
  get role() { return 'Turista'; }
}

// ============================================
// TODO 5: CLASE PRINCIPAL DEL SISTEMA
// ============================================
class MainSystem {
  #items = [];
  #users = [];

  static {
    this.VERSION = '1.0.0';
    this.SYSTEM_NAME = 'TourManager Pro';
    console.log(`${this.SYSTEM_NAME} v${this.VERSION} Inicializado`);
  }

  addItem(item) {
    if (!(item instanceof TourExperience)) return { success: false };
    this.#items.push(item);
    return { success: true, item };
  }

  removeItem(id) {
    const index = this.#items.findIndex(i => i.id === id);
    if (index === -1) return { success: false };
    this.#items.splice(index, 1);
    return { success: true };
  }

  findItem(id) {
    return this.#items.find(i => i.id === id) || null;
  }

  getAllItems() { return [...this.#items]; }

  addUser(user) {
    this.#users.push(user);
    return { success: true };
  }

  getAllUsers() { return [...this.#users]; }

  getStats() {
    const total = this.#items.length;
    const active = this.#items.filter(i => i.isActive).length;
    return {
      total,
      active,
      inactive: total - active,
      users: this.#users.length
    };
  }
}

// ============================================
// TODO 6 - 11: LÓGICA DE INTERFAZ (DOM)
// ============================================

const system = new MainSystem();
let editingId = null; // Para saber si estamos creando o editando

// Referencias DOM
const itemList = document.getElementById('item-list');
const itemForm = document.getElementById('item-form');
const itemTypeSelect = document.getElementById('item-type');
const dynamicFields = document.getElementById('dynamic-fields');
const itemModal = document.getElementById('item-modal');
const btnCreate = document.getElementById('add-item-btn');

// --- GESTIÓN DE CAMPOS DINÁMICOS ---
// Cambia los campos del formulario según el tipo seleccionado
itemTypeSelect.addEventListener('change', () => {
    const type = itemTypeSelect.value;
    dynamicFields.innerHTML = ''; // Limpiar campos previos

    if (type === 'audio') {
        dynamicFields.innerHTML = `
            <div class="form-group">
                <label>Idioma</label>
                <input type="text" id="extra-1" placeholder="Ej: Español" required>
            </div>
            <div class="form-group">
                <label>Duración (min)</label>
                <input type="number" id="extra-2" required>
            </div>`;
    } else if (type === 'video360' || type === 'vr') {
        dynamicFields.innerHTML = `
            <div class="form-group">
                <label>${type === 'vr' ? 'Dispositivo' : 'Resolución'}</label>
                <input type="text" id="extra-1" placeholder="Ej: 4K o Oculus Quest" required>
            </div>`;
    }
});

// --- RENDERIZADO DE LA LISTA ---
const renderItems = (itemsToRender = system.getAllItems()) => {
    if (itemsToRender.length === 0) {
        document.getElementById('empty-state').style.display = 'block';
        itemList.innerHTML = '';
    } else {
        document.getElementById('empty-state').style.display = 'none';
        itemList.innerHTML = itemsToRender.map(item => {
            const info = item.getInfo();
            return `
                <div class="item-card">
                    <div class="item-header">
                        <h3>${info.name}</h3>
                        <span class="badge">${info.type}</span>
                    </div>
                    <p><strong>Ubicación:</strong> ${info.location}</p>
                    <p><small>${info.extra}</small></p>
                    <div class="item-actions">
                        <button onclick="viewDetails('${info.id}')" class="btn-secondary">Ver Detalles</button>
                        <button onclick="deleteItem('${info.id}')" class="btn-danger">Eliminar</button>
                    </div>
                </div>`;
        }).join('');
    }
    updateHeaderStats();
};

// --- CREAR NUEVOS ELEMENTOS ---
itemForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('item-name').value;
    const location = document.getElementById('item-location').value;
    const type = itemTypeSelect.value;
    const val1 = document.getElementById('extra-1')?.value;
    const val2 = document.getElementById('extra-2')?.value;

    let newTour;
    if (type === 'audio') {
        newTour = new AudioGuide(name, location, val1, val2);
    } else if (type === 'video360') {
        newTour = new Video360(name, location, val1, "Generado");
    } else {
        newTour = new VRExperience(name, location, val1);
    }

    system.addItem(newTour);
    renderItems();
    closeModal();
    itemForm.reset();
});

// --- FILTROS Y BÚSQUEDA ---
const applyFilters = () => {
    const searchText = document.getElementById('search-input').value.toLowerCase();
    const typeFilter = document.getElementById('filter-type').value;

    let filtered = system.getAllItems().filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchText) || 
                            item.location.toLowerCase().includes(searchText);
        const matchesType = typeFilter === 'all' || item.getType().toLowerCase().includes(typeFilter);
        return matchesSearch && matchesType;
    });

    renderItems(filtered);
};

document.getElementById('search-input').addEventListener('input', applyFilters);
document.getElementById('filter-type').addEventListener('change', applyFilters);

// --- ESTADÍSTICAS EN EL HEADER ---
const updateHeaderStats = () => {
    const stats = system.getStats();
    document.getElementById('stat-total').textContent = stats.total;
    document.getElementById('stat-active').textContent = stats.active;
};

// --- FUNCIONES DE APOYO ---
const closeModal = () => {
    itemModal.style.display = 'none';
    itemForm.reset();
    dynamicFields.innerHTML = '';
};

btnCreate.onclick = () => itemModal.style.display = 'block';
document.getElementById('close-modal').onclick = closeModal;
document.getElementById('cancel-btn').onclick = closeModal;

window.deleteItem = (id) => {
    if (confirm('¿Eliminar este tour?')) {
        system.removeItem(id);
        renderItems();
    }
};

window.viewDetails = (id) => {
    const item = system.findItem(id);
    const info = item.getInfo();
    alert(`DETALLES DEL TOUR:\n\nNombre: ${info.name}\nTipo: ${info.type}\nDestino: ${info.location}\nInfo extra: ${info.extra}\nID: ${info.id}`);
};

// ============================================
// INICIALIZACIÓN Y DATOS DE PRUEBA
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // Tours de prueba
    const tour1 = new AudioGuide('Secretos del Prado', 'Madrid, España', 'Español', 90);
    const tour2 = new Video360('Buceo en la Gran Barrera', 'Australia', '8K', 2500);
    const tour3 = new VRExperience('Caminata en Marte', 'NASA Virtual', 'Oculus Quest 2');
    const tour4 = new AudioGuide('Historia del Coliseo', 'Roma, Italia', 'Italiano', 45);
    const tour5 = new Video360('Vuelo sobre los Alpes', 'Suiza', '4K', 1800);

    // agregar al sistema
    system.addItem(tour1);
    system.addItem(tour2);
    system.addItem(tour3);
    system.addItem(tour4);
    system.addItem(tour5);

    // Agregar algunos usuarios de prueba
    const guia1 = new Guide('Carlos Arango', 'carlos@guia.com', 'Historia Antigua');
    const turista1 = new Tourist('Elena Gómez', 'elena@viajes.com', 'Colombia');
    
    system.addUser(guia1);
    system.addUser(turista1);

    // Renderizar todo por primera vez
    renderItems(); 

    console.log('✅ Sistema cargado con datos de prueba de turismo');
});