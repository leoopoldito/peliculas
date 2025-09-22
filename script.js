// Configuración Inicial
const API_KEY = '512681dfe122112e6b932b219f0c825f';
const API_URL = 'https://api.themoviedb.org/3/search/movie';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

// Referencias a Elementos del DOM
const searchInput = document.getElementById('searchInput');
const resultsContainer = document.getElementById('resultsContainer');
const placeholderText = document.querySelector('.placeholder-text');

// Función para buscar películas
async function searchMovies(query) {
    // Si la búsqueda está vacía, no hacemos nada y mostramos el texto inicial
    if (!query) {
        resultsContainer.innerHTML = ''; // Limpia resultados anteriores
        placeholderText.style.display = 'block'; // Muestra el placeholder
        return;
    }

    placeholderText.style.display = 'none'; // Oculta el placeholder al buscar

    try {
        // Hacemos la petición a la API con fetch y async/await
        const response = await fetch(`${API_URL}?api_key=${API_KEY}&query=${encodeURIComponent(query)}&language=es-ES`);

        // Manejo de errores de la petición
        if (!response.ok) {
            throw new Error(`Error en la API: ${response.statusText}`);
        }

        const data = await response.json();
        renderMovies(data.results);

    } catch (error) {
        console.error('No se pudo obtener la información:', error);
        resultsContainer.innerHTML = `<p class="error-text">No se pudieron cargar las películas. Inténtalo más tarde.</p>`;
    }
}

// Función para renderizar las películas en el DOM
function renderMovies(movies) {
    // Limpiamos los resultados anteriores
    resultsContainer.innerHTML = '';

    if (movies.length === 0) {
        resultsContainer.innerHTML = `<p class="placeholder-text">No se encontraron películas para tu búsqueda.</p>`;
        return;
    }

    // Iteramos sobre cada película y creamos su tarjeta HTML
    movies.forEach(movie => {
        const movieCard = document.createElement('div');
        movieCard.classList.add('movie-card');

        // Usamos un póster de reemplazo si la película no tiene uno
        const posterPath = movie.poster_path
            ? `${IMAGE_BASE_URL}${movie.poster_path}`
            : 'https://via.placeholder.com/220x330?text=No+Image';

        movieCard.innerHTML = `
            <img src="${posterPath}" alt="Póster de ${movie.title}">
            <div class="movie-info">
                <h3>${movie.title}</h3>
            </div>
            <div class="movie-overview">
                <h4>Resumen</h4>
                <p>${movie.overview || 'No hay resumen disponible.'}</p>
            </div>
        `;

        resultsContainer.appendChild(movieCard);
    });
}

// Event Listener para la búsqueda en tiempo real
let searchTimeout;
searchInput.addEventListener('input', () => {
    // Limpiamos el temporizador anterior para no hacer peticiones en cada tecla
    clearTimeout(searchTimeout);

    // Creamos un nuevo temporizador para buscar después de 500ms de inactividad
    searchTimeout = setTimeout(() => {
        const query = searchInput.value.trim();
        searchMovies(query);
    }, 500);
});

// Búsqueda inicial para mostrar algo al cargar (opcional)
searchMovies('acción');