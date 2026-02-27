/* ============================================
   PROYECTO SEMANA 01 - GUIDEAPP VIRTUAL TOURS
   ============================================ */

// ============================================
// TODO 1: Objeto de datos del dominio (App GuideApp)
// ============================================
const appData = {
  appName: 'GuideApp',
  description: 'Plataforma líder en turismo inmersivo. Explora el mundo con tecnología 360°, realidad aumentada y guías locales en vivo desde cualquier lugar.',
  identifier: 'GA-2026-APP',
  contact: {
    email: 'soporte@guideapp.app',
    phone: '+34 900 123 456',
    website: 'www.guideapp.app'
  },
  features: [
    { name: 'Realidad Virtual (VR)', level: 100, category: 'Tecnología' },
    { name: 'Audio Guías Multilingües', level: 95, category: 'Servicio' },
    { name: 'Streaming 4K en Vivo', level: 85, category: 'Tecnología' },
    { name: 'Chat con Guías Locales', level: 90, category: 'Interacción' },
    { name: 'Mapas Interactivos', level: 80, category: 'Navegación' },
    { name: 'Modo Offline', level: 75, category: 'Utilidad' }
  ],
  links: [
    { platform: 'Instagram', url: '#', icon: '📸' },
    { platform: 'YouTube', url: '#', icon: '🎥' },
    { platform: 'Facebook', url: '#', icon: '👥' }
  ],
  stats: {
    downloads: '5M+',
    destinations: 150,
    rating: 4.8,
    activeUsers: '1.2M'
  }
};

// ============================================
// TODO 2: Referencias a elementos del DOM
// ============================================
const appNameDisplay = document.getElementById('userName');
const appDescriptionDisplay = document.getElementById('userBio');
const appLocationDisplay = document.getElementById('userLocation');
const appEmailDisplay = document.getElementById('userEmail');
const appPhoneDisplay = document.getElementById('userPhone');
const featuresList = document.getElementById('skillsList');
const statsContainer = document.getElementById('stats');
const linksContainer = document.getElementById('socialLinks');
const themeToggleBtn = document.getElementById('themeToggle');
const copyBtn = document.getElementById('copyEmailBtn');
const toggleFeaturesBtn = document.getElementById('toggleSkills');
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toastMessage');

// ============================================
// TODO 3: Renderizar información básica
// ============================================
const renderBasicInfo = () => {
  const { appName, description, contact: { email, website } } = appData;
  
  appNameDisplay.textContent = appName;
  appDescriptionDisplay.textContent = description;
  appEmailDisplay.textContent = email;
  appPhoneDisplay.textContent = website; 
};

// ============================================
// TODO 4: Renderizar lista de elementos (Features)
// ============================================
const renderFeatures = (showAll = false) => {
  const { features } = appData;
  const featuresToShow = showAll ? features : features.slice(0, 3);

  const featuresHtml = featuresToShow.map(({ name, level }) => `
    <div class="skill-item">
      <p class="skill-name">${name}</p>
      <div class="skill-bar">
        <div class="skill-bar-fill" style="width: ${level}%"></div>
      </div>
      <small style="color: var(--text-secondary)">${level}% optimizado</small>
    </div>
  `).join('');

  featuresList.innerHTML = featuresHtml;
};

// ============================================
// TODO 5: Renderizar enlaces
// ============================================
const renderLinks = () => {
  const { links } = appData;
  
  const linksHtml = links.map(({ platform, url }) => `
    <a href="${url}" class="social-link" target="_blank" rel="noopener noreferrer">
      ${platform}
    </a>
  `).join('');
  
  linksContainer.innerHTML = linksHtml;
};

// ============================================
// TODO 6: Calcular y renderizar estadísticas
// ============================================
const renderStats = () => {
  const { stats } = appData;

  const statsArray = [
    { label: 'Descargas', value: stats.downloads },
    { label: 'Destinos', value: stats.destinations },
    { label: 'Rating App', value: stats.rating },
    { label: 'Usuarios Activos', value: stats.activeUsers }
  ];

  const statsHtml = statsArray.map(({ label, value }) => `
    <div class="stat-item">
      <span class="stat-value">${value}</span>
      <span class="stat-label">${label}</span>
    </div>
  `).join('');

  statsContainer.innerHTML = statsHtml;
};

// ============================================
// TODO 7: Cambio de tema
// ============================================
const toggleTheme = () => {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  
  document.documentElement.setAttribute('data-theme', newTheme);
  themeToggleBtn.querySelector('.theme-icon').textContent = newTheme === 'dark' ? '☀️' : '🌙';
  localStorage.setItem('guideAppTheme', newTheme);
};

const loadTheme = () => {
  const savedTheme = localStorage.getItem('guideAppTheme') ?? 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  themeToggleBtn.querySelector('.theme-icon').textContent = savedTheme === 'dark' ? '☀️' : '🌙';
};

// ============================================
// TODO 8: Copiar información
// ============================================
const copyInfo = () => {
  const { appName, contact: { email } } = appData;
  const textToCopy = `Contacto de ${appName}: ${email}`;

  navigator.clipboard.writeText(textToCopy)
    .then(() => showToast('¡Correo de soporte copiado!'))
    .catch(() => showToast('Error al copiar'));
};

const showToast = (message) => {
  toastMessage.textContent = message;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
};

// ============================================
// TODO 9: Mostrar/Ocultar elementos
// ============================================
let showingAll = false;

const handleToggleFeatures = () => {
  showingAll = !showingAll;
  renderFeatures(showingAll);
  toggleFeaturesBtn.textContent = showingAll ? 'Mostrar menos' : 'Ver todas las funciones';
};

// ============================================
// TODO 10: Event Listeners
// ============================================
themeToggleBtn.addEventListener('click', toggleTheme);
copyBtn.addEventListener('click', copyInfo);
toggleFeaturesBtn.addEventListener('click', handleToggleFeatures);

// ============================================
// TODO 11: Inicializar
// ============================================
const init = () => {
  loadTheme();
  renderBasicInfo();
  renderFeatures();
  renderLinks();
  renderStats();
  console.log('✅ GuideApp inicializada correctamente');
};

init();