import React, { useState, useEffect } from 'react';
import { 
  Play,
  Video,
  Tag,
  Calendar,
  Users,
  ArrowRight,
  Search,
  Filter,
  SlidersHorizontal,
  Clock,
  ChevronRight
} from 'lucide-react';
import './EventosPage.css';

const EventosPage = () => {
  // Estados para el manejo de filtros y búsqueda
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [priceFilter, setPriceFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('date'); // 'date', 'price', 'popularity'

  // Datos de ejemplo de eventos (en un caso real, esto vendría de una API)
  const eventos = [
    {
      id: 1,
      imagen: "/imagenes/EDUCACION.jpg",
      categoria: "Educación",
      titulo: "Innovación en la Enseñanza Digital",
      fecha: "15 Marzo 2024",
      estado: "Próximo",
      instructor: "Dr. Juan Pérez",
      participantes: 150,
      descripcion: "Descubre las últimas tendencias en educación digital y cómo implementarlas en tu práctica docente.",
      precio: "Gratuito",
      duracion: "2 horas",
      popularidad: 4.8
    },
    {
      id: 2,
      imagen: "/imagenes/SALUD.jpg",
      categoria: "Salud",
      titulo: "Avances en Telemedicina",
      fecha: "20 Marzo 2024",
      estado: "En vivo",
      instructor: "Dra. María López",
      participantes: 200,
      descripcion: "Exploraremos el futuro de la medicina a distancia y sus aplicaciones prácticas en el contexto actual.",
      precio: "49.99",
      duracion: "3 horas",
      popularidad: 4.9
    },
    {
      id: 3,
      imagen: "/imagenes/INTELIGENCIA ARTIFICIAL.svg",
      categoria: "Tecnología",
      titulo: "Inteligencia Artificial en 2024",
      fecha: "25 Marzo 2024",
      estado: "Grabado",
      instructor: "Ing. Carlos Ruiz",
      participantes: 300,
      descripcion: "Un viaje por las últimas innovaciones en IA y su impacto en la industria tecnológica.",
      precio: "29.99",
      duracion: "4 horas",
      popularidad: 4.7
    }
  ];

  // Efecto para las animaciones de entrada
  useEffect(() => {
    const observerCallback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    };

    const observerOptions = {
      threshold: 0.1,
      rootMargin: '50px'
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    const elements = document.querySelectorAll('.reveal');
    elements.forEach(el => observer.observe(el));

    return () => observer && elements.forEach(el => observer.unobserve(el));
  }, []);

  // Función para filtrar y ordenar eventos
  const getFilteredAndSortedEvents = () => {
    let filtered = eventos.filter(evento => {
      const matchesCategory = activeCategory === 'all' || evento.categoria === activeCategory;
      const matchesSearch = evento.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           evento.descripcion.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPrice = priceFilter === 'all' || 
                          (priceFilter === 'free' && evento.precio === 'Gratuito') ||
                          (priceFilter === 'paid' && evento.precio !== 'Gratuito');
      const matchesDate = dateFilter === 'all' ||
                         (dateFilter === 'upcoming' && evento.estado === 'Próximo') ||
                         (dateFilter === 'live' && evento.estado === 'En vivo') ||
                         (dateFilter === 'recorded' && evento.estado === 'Grabado');
      
      return matchesCategory && matchesSearch && matchesPrice && matchesDate;
    });

    // Ordenar eventos según el criterio seleccionado
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price':
          const priceA = a.precio === 'Gratuito' ? 0 : parseFloat(a.precio);
          const priceB = b.precio === 'Gratuito' ? 0 : parseFloat(b.precio);
          return priceA - priceB;
        case 'popularity':
          return b.popularidad - a.popularidad;
        case 'date':
        default:
          return new Date(a.fecha) - new Date(b.fecha);
      }
    });
  };

  const filteredEvents = getFilteredAndSortedEvents();

  // Handler para la inscripción a eventos
  const handleEventRegistration = (eventoId) => {
    // Aquí iría la lógica de inscripción
    console.log(`Inscripción al evento ${eventoId}`);
  };

  return (
    <div className="eventos-page">
      {/* Header de la página */}
      <header className="eventos-header">
        <div className="container mx-auto px-4">
          <h1 className="eventos-title reveal fade-in">Explora Nuestros Eventos</h1>
          <p className="eventos-subtitle reveal fade-in">
            Descubre eventos educativos de alta calidad impartidos por expertos globales
          </p>
        </div>
      </header>

      {/* Sección de búsqueda y filtros */}
      <section className="search-section">
        <div className="container mx-auto px-4">
          <div className="search-container reveal fade-in">
            <div className="search-bar">
              <Search className="search-icon" />
              <input
                type="text"
                placeholder="Buscar eventos por título o descripción..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            <button 
              className="filter-toggle-button"
              onClick={() => setShowFilters(!showFilters)}
            >
              <SlidersHorizontal size={20} />
              Filtros
            </button>
          </div>

          {/* Panel de filtros expandible */}
          <div className={`filters-panel ${showFilters ? 'show' : ''}`}>
            <div className="filter-group">
              <label>Categoría:</label>
              <div className="filter-buttons">
                <button 
                  className={`filter-button ${activeCategory === 'all' ? 'active' : ''}`}
                  onClick={() => setActiveCategory('all')}
                >
                  Todos
                </button>
                {['Educación', 'Salud', 'Tecnología'].map((cat) => (
                  <button
                    key={cat}
                    className={`filter-button ${activeCategory === cat ? 'active' : ''}`}
                    onClick={() => setActiveCategory(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="filter-group">
              <label>Precio:</label>
              <div className="filter-buttons">
                <button 
                  className={`filter-button ${priceFilter === 'all' ? 'active' : ''}`}
                  onClick={() => setPriceFilter('all')}
                >
                  Todos
                </button>
                <button 
                  className={`filter-button ${priceFilter === 'free' ? 'active' : ''}`}
                  onClick={() => setPriceFilter('free')}
                >
                  Gratuitos
                </button>
                <button 
                  className={`filter-button ${priceFilter === 'paid' ? 'active' : ''}`}
                  onClick={() => setPriceFilter('paid')}
                >
                  De pago
                </button>
              </div>
            </div>

            <div className="filter-group">
              <label>Estado:</label>
              <div className="filter-buttons">
                <button 
                  className={`filter-button ${dateFilter === 'all' ? 'active' : ''}`}
                  onClick={() => setDateFilter('all')}
                >
                  Todos
                </button>
                <button 
                  className={`filter-button ${dateFilter === 'upcoming' ? 'active' : ''}`}
                  onClick={() => setDateFilter('upcoming')}
                >
                  Próximos
                </button>
                <button 
                  className={`filter-button ${dateFilter === 'live' ? 'active' : ''}`}
                  onClick={() => setDateFilter('live')}
                >
                  En vivo
                </button>
                <button 
                  className={`filter-button ${dateFilter === 'recorded' ? 'active' : ''}`}
                  onClick={() => setDateFilter('recorded')}
                >
                  Grabados
                </button>
              </div>
            </div>

            <div className="filter-group">
              <label>Ordenar por:</label>
              <div className="filter-buttons">
                <button 
                  className={`filter-button ${sortBy === 'date' ? 'active' : ''}`}
                  onClick={() => setSortBy('date')}
                >
                  Fecha
                </button>
                <button 
                  className={`filter-button ${sortBy === 'price' ? 'active' : ''}`}
                  onClick={() => setSortBy('price')}
                >
                  Precio
                </button>
                <button 
                  className={`filter-button ${sortBy === 'popularity' ? 'active' : ''}`}
                  onClick={() => setSortBy('popularity')}
                >
                  Popularidad
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Grid de eventos */}
      <section className="eventos-grid-section">
        <div className="container mx-auto px-4">
          {filteredEvents.length > 0 ? (
            <div className="eventos-grid">
              {filteredEvents.map((evento, index) => (
                <div 
                  key={evento.id}
                  className="evento-card reveal"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="evento-image-container">
                    <img 
                      src={evento.imagen}
                      alt={evento.titulo}
                      className="evento-image"
                    />
                    <div className={`evento-estado ${evento.estado.toLowerCase().replace(' ', '-')}`}>
                      {evento.estado === 'En vivo' && <Play size={16} />}
                      {evento.estado === 'Grabado' && <Video size={16} />}
                      {evento.estado === 'Próximo' && <Calendar size={16} />}
                      {evento.estado}
                    </div>
                  </div>
                  
                  <div className="evento-content">
                    <div className="evento-categoria">
                      <Tag size={16} />
                      <span>{evento.categoria}</span>
                    </div>
                    
                    <h3 className="evento-titulo">{evento.titulo}</h3>
                    
                    <div className="evento-detalles">
                      <div className="evento-instructor">
                        <span>Por {evento.instructor}</span>
                      </div>
                      <div className="evento-fecha">
                        <Calendar size={16} />
                        <span>{evento.fecha}</span>
                      </div>
                    </div>
                    
                    <p className="evento-descripcion">
                      {evento.descripcion}
                    </p>
                    
                    <div className="evento-meta">
                      <span className="evento-duracion">
                        <Clock size={16} />
                        {evento.duracion}
                      </span>
                      <span className="evento-precio">
                        {evento.precio === 'Gratuito' ? 'Gratuito' : `$${evento.precio}`}
                      </span>
                    </div>

                    <div className="evento-footer">
                      <span className="evento-participantes">
                        <Users size={16} />
                        {evento.participantes} participantes
                      </span>
                      <button 
                        className="evento-button"
                        onClick={() => handleEventRegistration(evento.id)}
                      >
                        Inscribirse
                        <ArrowRight size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-results">
              <p>No se encontraron eventos que coincidan con los filtros seleccionados.</p>
              <button 
                className="filter-button"
                onClick={() => {
                  setActiveCategory('all');
                  setPriceFilter('all');
                  setDateFilter('all');
                  setSearchTerm('');
                }}
              >
                Limpiar filtros
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default EventosPage;