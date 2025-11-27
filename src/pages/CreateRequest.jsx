import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../utils/api';
import { Users, Upload, MapPin, Calendar, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const CreateRequest = () => {
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm();

  const category = watch('category');

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const requestData = {
        ...data,
        images: images.map(img => img.url), // In real app, upload to cloud storage
        location: {
          address: data.address,
          city: data.city,
          state: data.state,
          zipCode: data.zipCode
        }
      };

      const response = await api.post('/requests', requestData);
      toast.success('Request created successfully!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create request');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImages(prev => [...prev, { file, url: e.target.result }]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const getSubcategories = (category) => {
    switch (category) {
      case 'food':
        return ['Canned Goods', 'Fresh Produce', 'Dairy', 'Grains', 'Beverages', 'Snacks'];
      case 'clothing':
        return ['Shirts', 'Pants', 'Dresses', 'Jackets', 'Shoes', 'Accessories'];
      case 'medical':
        return ['Medications', 'First Aid', 'Medical Equipment', 'Supplies'];
      case 'shelter':
        return ['Furniture', 'Bedding', 'Kitchen Items', 'Home Decor'];
      case 'education':
        return ['Books', 'School Supplies', 'Electronics', 'Art Supplies'];
      default:
        return ['Other'];
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create Request</h1>
          <p className="mt-2 text-gray-600">
            Let the community know what you need
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Item Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                    Item Title *
                  </label>
                  <input
                    {...register('title', { required: 'Title is required' })}
                    type="text"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                    placeholder="e.g., Winter Jacket, Canned Food"
                  />
                  {errors.title && (
                    <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                    Category *
                  </label>
                  <select
                    {...register('category', { required: 'Category is required' })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                  >
                    <option value="">Select category</option>
                    <option value="food">Food</option>
                    <option value="clothing">Clothing</option>
                    <option value="medical">Medical</option>
                    <option value="shelter">Shelter</option>
                    <option value="education">Education</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.category && (
                    <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
                  )}
                </div>

                {category && (
                  <div>
                    <label htmlFor="subcategory" className="block text-sm font-medium text-gray-700">
                      Subcategory *
                    </label>
                    <select
                      {...register('subcategory', { required: 'Subcategory is required' })}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                    >
                      <option value="">Select subcategory</option>
                      {getSubcategories(category).map(sub => (
                        <option key={sub} value={sub}>{sub}</option>
                      ))}
                    </select>
                    {errors.subcategory && (
                      <p className="mt-1 text-sm text-red-600">{errors.subcategory.message}</p>
                    )}
                  </div>
                )}

                <div>
                  <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
                    Quantity Needed *
                  </label>
                  <input
                    {...register('quantity', { 
                      required: 'Quantity is required',
                      min: { value: 1, message: 'Quantity must be at least 1' }
                    })}
                    type="number"
                    min="1"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                  />
                  {errors.quantity && (
                    <p className="mt-1 text-sm text-red-600">{errors.quantity.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="unit" className="block text-sm font-medium text-gray-700">
                    Unit *
                  </label>
                  <input
                    {...register('unit', { required: 'Unit is required' })}
                    type="text"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                    placeholder="e.g., pieces, kg, liters"
                  />
                  {errors.unit && (
                    <p className="mt-1 text-sm text-red-600">{errors.unit.message}</p>
                  )}
                </div>
              </div>

              <div className="mt-6">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description *
                </label>
                <textarea
                  {...register('description', { required: 'Description is required' })}
                  rows={4}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                  placeholder="Describe what you need, why you need it, and any specific requirements..."
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                )}
              </div>
            </div>

            {/* Priority and Urgency */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Priority & Urgency</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
                    Priority Level *
                  </label>
                  <select
                    {...register('priority', { required: 'Priority is required' })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                  >
                    <option value="">Select priority</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                  {errors.priority && (
                    <p className="mt-1 text-sm text-red-600">{errors.priority.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="urgency" className="block text-sm font-medium text-gray-700">
                    Urgency Type *
                  </label>
                  <select
                    {...register('urgency', { required: 'Urgency is required' })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                  >
                    <option value="">Select urgency</option>
                    <option value="normal">Normal</option>
                    <option value="emergency">Emergency</option>
                    <option value="critical">Critical</option>
                  </select>
                  {errors.urgency && (
                    <p className="mt-1 text-sm text-red-600">{errors.urgency.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Required By Date */}
            <div>
              <label htmlFor="requiredBy" className="block text-sm font-medium text-gray-700">
                Required By Date
              </label>
              <input
                {...register('requiredBy')}
                type="date"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
              />
            </div>

            {/* Images */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Images (Optional)</h3>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                <div className="text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-4">
                    <label htmlFor="images" className="cursor-pointer">
                      <span className="mt-2 block text-sm font-medium text-gray-900">
                        Upload images
                      </span>
                      <span className="mt-1 block text-sm text-gray-500">
                        PNG, JPG up to 10MB each
                      </span>
                    </label>
                    <input
                      id="images"
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="sr-only"
                    />
                  </div>
                </div>
              </div>

              {images.length > 0 && (
                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                  {images.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={image.url}
                        alt={`Upload ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Location */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Location</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                    Street Address
                  </label>
                  <input
                    {...register('address')}
                    type="text"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                    placeholder="Enter street address"
                  />
                </div>

                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                    City *
                  </label>
                  <input
                    {...register('city', { required: 'City is required' })}
                    type="text"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                  />
                  {errors.city && (
                    <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                    State *
                  </label>
                  <input
                    {...register('state', { required: 'State is required' })}
                    type="text"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                  />
                  {errors.state && (
                    <p className="mt-1 text-sm text-red-600">{errors.state.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700">
                    ZIP Code
                  </label>
                  <input
                    {...register('zipCode')}
                    type="text"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                  />
                </div>
              </div>
            </div>

            {/* Emergency Checkbox */}
            <div>
              <div className="flex items-center">
                <input
                  {...register('isEmergency')}
                  type="checkbox"
                  className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                />
                <label htmlFor="isEmergency" className="ml-2 block text-sm text-gray-900">
                  This is an emergency request (for urgent situations)
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Users className="h-4 w-4 mr-2" />
                {loading ? 'Creating...' : 'Create Request'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateRequest;
