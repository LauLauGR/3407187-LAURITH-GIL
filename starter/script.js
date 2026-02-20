/**
 * ============================================
 * PROYECTO SEMANA 02 - GESTOR DE GUIAS VIRTUALES
 * ============================================
 */

// ============================================
// ESTADO GLOBAL
// ============================================
let items = [];
let editingItemId = null;

// ============================================
// TODO 1: CATEGORÍAS Y PRIORIDADES (ACCESO)
// ============================================
const CATEGORIES = {
  Topic1: { name: 'Cultura e Historia', emoji: '🏛️' },
  Topic2: { name: 'Gastronomía', emoji: '🍽️' },
  Topic3: { name: 'Naturaleza y Ecoturismo', emoji: '🌳' },
  Topic4: { name: 'Arquitectura Urbana', emoji: '🏙️' },
  Topic5: { name: 'Aventura y Deporte', emoji: '🚴‍♂️' },
  other: { name: 'Otro', emoji: '📌' }
};

const ACCESS_TYPES = {
  free: { name: 'Gratuita', color: '#22c55e' },
  registered: { name: 'Solo registrados', color: '#f59e0b' },
  premium: { name: 'Premium / Pago', color: '#a855f7' }
};

// ============================================
// TODO 2: PERSISTENCIA (LocalStorage)
// ============================================
const loadItems = () => {
  return JSON.parse(localStorage.getItem('virtualGuidesData') ?? '[]');
};

const saveItems = itemsToSave => {
  localStorage.setItem('virtualGuidesData', JSON.stringify(itemsToSave));
};

// ============================================
// TODO 3-6: CRUD
// ============================================

const createItem = (itemData = {}) => {
  const newItem = {
    id: Date.now(),
    createdAt: new Date().toISOString(),
    updatedAt: null,
    active: true, // Por defecto se crea como "Publicada"
    ...itemData
  };
  const newItems = [...items, newItem];
  saveItems(newItems);
  return newItems;
};

const updateItem = (id, updates) => {
  const updatedItems = items.map(item =>
    item.id === id
      ? { ...item, ...updates, updatedAt: new Date().toISOString() }
      : item
  );
  saveItems(updatedItems);
  return updatedItems;
};

const deleteItem = id => {
  const filteredItems = items.filter(item => item.id !== id);
  saveItems(filteredItems);
  return filteredItems;
};

const toggleItemActive = id => {
  const updatedItems = items.map(item =>
    item.id === id
      ? { ...item, active: !item.active, updatedAt: new Date().toISOString() }
      : item
  );
  saveItems(updatedItems);
  return updatedItems;
};

const clearInactive = () => {
  const activeItems = items.filter(item => item.active);
  saveItems(activeItems);
  return activeItems;
};

// ============================================
// TODO 7: FILTROS Y BÚSQUEDA
// ============================================

const filterByStatus = (itemsToFilter, status = 'all') => {
  if (status === 'active') return itemsToFilter.filter(item => item.active);
  if (status === 'inactive') return itemsToFilter.filter(item => !item.active);
  return itemsToFilter;
};

const filterByTopic = (itemsToFilter, topic = 'all') => {
  if (topic === 'all') return itemsToFilter;
  return itemsToFilter.filter(item => item.topic === topic);
};

const filterByAccess = (itemsToFilter, access = 'all') => {
  if (access === 'all') return itemsToFilter;
  return itemsToFilter.filter(item => item.access === access);
};

const searchItems = (itemsToFilter, query) => {
  if (!query || query.trim() === '') return itemsToFilter;
  const searchTerm = query.toLowerCase();
  return itemsToFilter.filter(item =>
    item.name.toLowerCase().includes(searchTerm) ||
    (item.description ?? '').toLowerCase().includes(searchTerm) ||
    (item.location ?? '').toLowerCase().includes(searchTerm)
  );
};

const applyFilters = (itemsToFilter, filters = {}) => {
  const { status = 'all', topic = 'all', access = 'all', search = '' } = filters;
  
  let result = filterByStatus(itemsToFilter, status);
  result = filterByTopic(result, topic);
  result = filterByAccess(result, access);
  result = searchItems(result, search);
  return result;
};

// ============================================
// TODO 8: ESTADÍSTICAS
// ============================================

const getStats = (itemsToAnalyze = []) => {
  const total = itemsToAnalyze.length;
  const active = itemsToAnalyze.filter(item => item.active).length;
  const inactive = total - active;

  const byTopic = itemsToAnalyze.reduce((acc, item) => {
    acc[item.topic] = (acc[item.topic] ?? 0) + 1;
    return acc;
  }, {});

  return { total, active, inactive, byTopic };
};

// ============================================
// TODO 9-10: RENDERIZADO
// ============================================

const formatDate = dateString => {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });
};

const renderItem = item => {
  const { id, name, description, location, duration, topic, access, active, createdAt } = item;
  
  return `
    <div class="item ${active ? '' : 'inactive'}" data-item-id="${id}" style="border-left: 5px solid ${ACCESS_TYPES[access].color}; background: white; padding: 15px; margin-bottom: 10px; border-radius: 8px; display: flex; align-items: center; gap: 15px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
      <input type="checkbox" class="item-checkbox" ${active ? 'checked' : ''} style="transform: scale(1.5);">
      <div style="flex-grow: 1;">
        <h3 style="margin: 0; color: #333;">${name}</h3>
        <p style="margin: 5px 0; font-size: 0.9em; color: #666;">${description}</p>
        <div style="font-size: 0.8em; display: flex; gap: 10px; flex-wrap: wrap;">
          <span>📍 ${location}</span>
          <span>⏱️ ${duration}</span>
          <span class="badge">${CATEGORIES[topic]?.emoji} ${CATEGORIES[topic]?.name}</span>
          <span class="badge" style="background: ${ACCESS_TYPES[access].color}22; color: ${ACCESS_TYPES[access].color}">${ACCESS_TYPES[access].name}</span>
          <span>📅 ${formatDate(createdAt)}</span>
        </div>
      </div>
      <div class="item-actions">
        <button class="btn-edit" title="Editar" style="background: none; border: none; cursor: pointer; font-size: 1.2em;">✏️</button>
        <button class="btn-delete" title="Eliminar" style="background: none; border: none; cursor: pointer; font-size: 1.2em;">🗑️</button>
      </div>
    </div>
  `;
};

const renderItems = itemsToRender => {
  const itemList = document.getElementById('item-list');
  const emptyState = document.getElementById('empty-state');

  if (itemsToRender.length === 0) {
    itemList.innerHTML = '';
    emptyState.style.display = 'block';
  } else {
    emptyState.style.display = 'none';
    itemList.innerHTML = itemsToRender.map(renderItem).join('');
  }
};

const renderStats = stats => {
  document.getElementById('stat-total').textContent = stats.total;
  document.getElementById('stat-active').textContent = stats.active;
  document.getElementById('stat-inactive').textContent = stats.inactive;

  const topicStats = Object.entries(stats.byTopic)
    .map(([top, count]) => `${CATEGORIES[top]?.emoji} ${CATEGORIES[top]?.name}: ${count}`)
    .join(' | ');
  
  document.getElementById('stats-details').innerHTML = topicStats || 'Sin datos suficientes para mostrar estadísticas por temática.';
};

// ============================================
// TODO 11-12: EVENT HANDLERS & LISTENERS
// ============================================

const getCurrentFilters = () => ({
  status: document.getElementById('filter-status').value,
  topic: document.getElementById('filter-topic').value,
  access: document.getElementById('filter-priority').value, // En tu HTML el ID es filter-priority
  search: document.getElementById('search-input').value
});

const handleFormSubmit = e => {
  e.preventDefault();
  
  const itemData = {
    name: document.getElementById('item-name').value.trim(),
    description: document.getElementById('item-description').value.trim(),
    location: document.getElementById('item-location').value.trim(),
    duration: document.getElementById('item-duration').value.trim(),
    topic: document.getElementById('item-topic').value,
    access: document.getElementById('item-access').value
  };

  if (!itemData.name) return alert('El título es obligatorio');

  if (editingItemId) {
    items = updateItem(editingItemId, itemData);
  } else {
    items = createItem(itemData);
  }

  resetForm();
  updateUI();
};

const handleItemEdit = itemId => {
  const itemToEdit = items.find(item => item.id === itemId);
  if (!itemToEdit) return;

  document.getElementById('item-name').value = itemToEdit.name;
  document.getElementById('item-description').value = itemToEdit.description;
  document.getElementById('item-location').value = itemToEdit.location;
  document.getElementById('item-duration').value = itemToEdit.duration;
  document.getElementById('item-topic').value = itemToEdit.topic;
  document.getElementById('item-access').value = itemToEdit.access;

  document.getElementById('form-title').textContent = '✏️ Editar Guía Turística';
  document.getElementById('submit-btn').textContent = 'Actualizar';
  document.getElementById('cancel-btn').style.display = 'inline-block';
  editingItemId = itemId;
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const resetForm = () => {
  document.getElementById('item-form').reset();
  document.getElementById('form-title').textContent = '➕ Nueva Guía Turística';
  document.getElementById('submit-btn').textContent = 'Crear';
  document.getElementById('cancel-btn').style.display = 'none';
  editingItemId = null;
};

const updateUI = () => {
  const filtered = applyFilters(items, getCurrentFilters());
  renderItems(filtered);
  renderStats(getStats(items));
};

const attachEventListeners = () => {
  document.getElementById('item-form').addEventListener('submit', handleFormSubmit);
  document.getElementById('cancel-btn').addEventListener('click', resetForm);
  
  ['filter-status', 'filter-topic', 'filter-priority'].forEach(id => {
    document.getElementById(id).addEventListener('change', updateUI);
  });
  
  document.getElementById('search-input').addEventListener('input', updateUI);

  document.getElementById('clear-inactive').addEventListener('click', () => {
    if (confirm('¿Eliminar todas las guías en revisión?')) {
      items = clearInactive();
      updateUI();
    }
  });

  document.getElementById('item-list').addEventListener('click', e => {
    const itemElement = e.target.closest('.item');
    if (!itemElement) return;
    const itemId = parseInt(itemElement.dataset.itemId);

    if (e.target.classList.contains('item-checkbox')) {
      items = toggleItemActive(itemId);
      updateUI();
    } else if (e.target.classList.contains('btn-edit')) {
      handleItemEdit(itemId);
    } else if (e.target.classList.contains('btn-delete')) {
      if (confirm('¿Eliminar esta guía?')) {
        items = deleteItem(itemId);
        updateUI();
      }
    }
  });
};

// ============================================
// TODO 13: INICIALIZACIÓN
// ============================================
const init = () => {
  items = loadItems();
  updateUI();
  attachEventListeners();
  console.log('✅ Gestor de Guías Virtuales inicializado');
};

document.addEventListener('DOMContentLoaded', init);