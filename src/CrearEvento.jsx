import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Upload, Users, Clock, CurrencyIcon, Type as TypeIcon } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import "./CrearEvento.css";

// Tipos de evento
const EVENT_TYPES = [
  { id: 0, name: 'Presencial' },
  { id: 1, name: 'En vivo' },
  { id: 2, name: 'Grabado' },
];

const CATEGORIES = [
  'Tecnología',
  'Diseño',
  'Marketing',
  'Negocios',
  'Desarrollo Personal',
  'Educación',
];

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

const CrearEvento = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    duration: '',
    type: '0',
    categories: [],
    images: [], // Ahora soportamos múltiples imágenes
    start_date: new Date().toISOString().split('T')[0],
    ponentes: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    } else if (formData.name.length > 70) {
      newErrors.name = 'El nombre no debe exceder 70 caracteres';
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

    if (!formData.ponentes.trim()) {
      newErrors.ponentes = 'Ingresa al menos un ponente';
    }

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    
    if (type === 'file' && files[0]) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        const imageUrl = URL.createObjectURL(file);
        setPreviewImage(imageUrl);
        setFormData(prev => ({
          ...prev,
          image_url: file
        }));
      } else {
        setErrors(prev => ({
          ...prev,
          image_url: 'Por favor, sube solo archivos de imagen'
        }));
      }
      return;
    }

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
    maxSize: 5242880 // 5MB
  });

  // Modificar la sección de precio para usar soles
  const formatPrice = (value) => {
    if (!value) return '';
    return value.replace(/[^0-9.]/g, '');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      // Aquí iría tu lógica de envío al backend
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        if (key === 'image_url' && formData[key]) {
          formDataToSend.append('image', formData[key]);
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });

      // Simular envío
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Datos del formulario:', Object.fromEntries(formDataToSend));
      
      // Mostrar mensaje de éxito
      alert('Evento creado con éxito');
      
      // Limpiar formulario
      setFormData({
        name: '',
        description: '',
        price: '',
        duration: '',
        type: '0',
        categories: [],
        images: [], // Ahora soportamos múltiples imágenes
        start_date: new Date().toISOString().split('T')[0],
        ponentes: ''
      });
      setPreviewImage(null);
    } catch (error) {
      console.error('Error al crear el evento:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

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
              Crear Nuevo Evento
            </h1>
            <p className="mt-2 text-blue-50 text-center"> {/* Cambiado de text-blue-100 a text-blue-50 */}
              Completa los detalles para publicar tu evento
            </p>
          </div>

          <form onSubmit={handleSubmit} className="px-6 py-8 space-y-6">
            <FormField label={<span className="text-gray-900 dark:text-gray-100">Nombre del evento</span>} error={errors.name}>
              <div className="relative">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Ej: Masterclass de Desarrollo Web 2024"
                  maxLength={70}
                />
                <span className="absolute right-2 top-3 text-sm text-gray-400">
                  {formData.name.length}/70
                </span>
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
                    step="15"
                    value={formData.duration}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="60"
                  />
                </div>
              </FormField>
            </div>

            <FormField label="Tipo de evento" error={errors.type}>
              <div className="relative">
                <TypeIcon className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white select-input"
                >
                  {EVENT_TYPES.map(type => (
                    <option key={type.id} value={type.id} className="text-gray-900 dark:text-white bg-white dark:bg-gray-800">
                      {type.name}
                    </option>
                  ))}
                </select>
              </div>
            </FormField>

            <FormField label="Fecha de inicio" error={errors.start_date}>
              <div className="relative">
                <Calendar className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                <input
                  type="datetime-local" // Cambiado de date a datetime-local
                  name="start_date"
                  value={formData.start_date}
                  onChange={handleChange}
                  min={new Date().toISOString().split('.')[0]} // Evita fechas pasadas
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 calendar-input"
                />
              </div>
            </FormField>

            <FormField label="Imágenes del evento (máximo 5)" error={errors.images}>
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

            <FormField label="Ponentes" error={errors.ponentes}>
              <div className="relative">
                <Users className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  name="ponentes"
                  value={formData.ponentes}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ej: Juan Pérez, María García"
                />
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Separa los nombres de los ponentes con comas
              </p>
            </FormField>

            <motion.button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-all
                ${isSubmitting 
                  ? 'bg-blue-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
                }
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
                'Crear Evento'
              )}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default CrearEvento;