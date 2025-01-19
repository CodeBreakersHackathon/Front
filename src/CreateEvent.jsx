import React, { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Upload, Users, Clock, CurrencyIcon, Type as TypeIcon, MapIcon } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { useNavigate } from 'react-router-dom';
import "./CrearEvento.css";
import { API_URL } from './apiConstants';

// Tipos de evento según el backend
const EVENT_TYPES = [
  { value: 'conference', label: 'Conferencia' },
  { value: 'workshop', label: 'Taller' },
  { value: 'seminar', label: 'Seminario' },
  { value: 'course', label: 'Curso' }
];

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isTeacher, setIsTeacher] = useState(false);
  const [token, setToken] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const authToken = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');
    
    if (!authToken) {
      navigate('/login');
      return;
    }

    setToken(authToken);
    setIsAuthenticated(true);
    setIsTeacher(userRole === 'teacher');
    
    if (userRole !== 'professor') {
      alert('Solo los profesores pueden crear eventos');
      navigate('/dashboard');
    }
  }, [navigate]);

  return { isAuthenticated, isTeacher, token };
};

const FormField = ({ label, error, children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="space-y-2"
  >
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    {children}
    {error && (
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-sm text-red-500"
      >
        {error}
      </motion.p>
    )}
  </motion.div>
);

const CreateEvent = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isTeacher, token } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    type: 'event',
    eventType: 'conference',
    location: '',
    eventDate: new Date().toISOString().split('.')[0],
    duration: '',
    record_key: '',
    images: []
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'La descripción es requerida';
    }

    if (!formData.price || parseFloat(formData.price) < 0) {
      newErrors.price = 'El precio debe ser mayor o igual a 0';
    }

    if (!formData.duration || parseInt(formData.duration) < 15) {
      newErrors.duration = 'La duración mínima es de 15 minutos';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'La ubicación es requerida';
    }

    if (!formData.eventDate) {
      newErrors.eventDate = 'La fecha del evento es requerida';
    }

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const onDrop = useCallback((acceptedFiles) => {
    const newImages = acceptedFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));
    
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...newImages]
    }));
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxFiles: 5,
    maxSize: 5242880
  });

  const formatPrice = (value) => {
    if (!value) return '';
    return value.replace(/[^0-9.]/g, '');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated || !isTeacher) {
      alert('Debes iniciar sesión como profesor para crear eventos');
      navigate('/login');
      return;
    }

    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const eventPayload = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        type: formData.type,
        eventType: formData.eventType,
        location: formData.location,
        eventDate: new Date(formData.eventDate).toISOString(),
        duration: parseInt(formData.duration),
        record_key: formData.record_key || undefined
      };

      // Upload images if any exist
      if (formData.images.length > 0) {
        const imageUploadPromises = formData.images.map(async (image) => {
          const imageFormData = new FormData();
          imageFormData.append('image', image.file);
          
          const response = await fetch(`${API_URL}/upload`, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: imageFormData,
          });
          
          const data = await response.json();
          return data.imageUrl;
        });

        const imageUrls = await Promise.all(imageUploadPromises);
        eventPayload.images = imageUrls;
      }

      const response = await fetch(`${API_URL}/activity`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(eventPayload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error creating event');
      }

      const data = await response.json();
      alert('Evento creado con éxito');
      navigate('/dashboard');

    } catch (error) {
      console.error('Error al crear el evento:', error);
      if (error.message.includes('401')) {
        alert('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
        navigate('/login');
      } else {
        alert('Error al crear el evento. Por favor, intente nuevamente.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // No renderizar nada si no está autenticado o no es profesor
  if (!isAuthenticated || !isTeacher) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto"
      >
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-blue-600 px-6 py-8">
            <h1 className="text-3xl font-bold text-white text-center">
              Nuevo Evento
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="px-6 py-8 space-y-6">
            <FormField label="Nombre del evento" error={errors.name}>
              <div className="relative">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Ej: Masterclass de Desarrollo Web 2024"
                />
              </div>
            </FormField>

            <FormField label="Descripción" error={errors.description}>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Describe los detalles y objetivos de tu evento"
              />
            </FormField>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField label="Precio (S/.)" error={errors.price}>
                <div className="relative">
                  <span className="absolute left-3 top-3.5 text-gray-400">S/.</span>
                  <input
                    type="text"
                    name="price"
                    value={formData.price}
                    onChange={(e) => {
                      const formatted = formatPrice(e.target.value);
                      handleChange({
                        target: {
                          name: 'price',
                          value: formatted
                        }
                      });
                    }}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0.00"
                  />
                </div>
              </FormField>

              <FormField label="Duración (minutos)" error={errors.duration}>
                <div className="relative">
                  <Clock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                  <input
                    type="number"
                    name="duration"
                    min="15"
                    value={formData.duration}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="60"
                  />
                </div>
              </FormField>
            </div>

            <FormField label="Tipo de evento" error={errors.eventType}>
              <div className="relative">
                <TypeIcon className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                <select
                  name="eventType"
                  value={formData.eventType}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                >
                  {EVENT_TYPES.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
            </FormField>

            <FormField label="Ubicación" error={errors.location}>
              <div className="relative">
                <MapIcon className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ej: Av. Principal 123, Lima"
                />
              </div>
            </FormField>

            <FormField label="Fecha y hora del evento" error={errors.eventDate}>
              <div className="relative">
                <Calendar className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                <input
                  type="datetime-local"
                  name="eventDate"
                  value={formData.eventDate}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </FormField>

            <FormField label="Imágenes del evento" error={errors.images}>
              <div 
                {...getRootProps()} 
                className={`dropzone-area ${isDragActive ? 'active' : ''}`}
              >
                <input {...getInputProps()} />
                <div className="dropzone-content">
                  <Upload className="h-12 w-12 text-gray-400" />
                  <p>Arrastra tus imágenes aquí o haz clic para seleccionar</p>
                  <p className="text-sm text-gray-500">Máximo 5 imágenes (5MB cada una)</p>
                </div>
              </div>
              {formData.images.length > 0 && (
                <div className="image-preview-grid">
                  {formData.images.map((image, index) => (
                    <div key={index} className="image-preview-item">
                      <img src={image.preview} alt={`Preview ${index + 1}`} />
                      <button
                        type="button"
                        onClick={() => {
                          setFormData(prev => ({
                            ...prev,
                            images: prev.images.filter((_, i) => i !== index)
                          }));
                        }}
                        className="delete-image"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </FormField>


            <motion.button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-all
                ${isSubmitting 
                  ? 'bg-blue-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'}
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
              whileHover={{ scale: isSubmitting ? 1 : 1.01 }}
              whileTap={{ scale: isSubmitting ? 1 : 0.99 }}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin" />
                  <span>Creando evento...</span>
                </div>
              ) : (
                'Crear evento'
              )}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default CreateEvent;