import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Button from '@/components/atoms/Button';
import Card from '@/components/atoms/Card';
import Input from '@/components/atoms/Input';
import ApperIcon from '@/components/ApperIcon';

function ActivityForm({ activity, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    type: 'email',
    description: '',
    contactId: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (activity) {
      setFormData({
        type: activity.type || 'email',
        description: activity.description || '',
        contactId: activity.contactId || ''
      });
    }
  }, [activity]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.type) {
      newErrors.type = 'Activity type is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.trim().length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }

    if (!formData.contactId) {
      newErrors.contactId = 'Contact selection is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the form errors');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        ...formData,
        description: formData.description.trim()
      });
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  // Sample contact options (in real app, this would come from contacts service)
  const contactOptions = [
    { Id: '1', name: 'Sarah Johnson' },
    { Id: '2', name: 'Michael Chen' },
    { Id: '3', name: 'Emily Rodriguez' },
    { Id: '4', name: 'David Kim' },
    { Id: '5', name: 'Lisa Anderson' },
    { Id: '6', name: 'James Wilson' },
    { Id: '7', name: 'Amanda Foster' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              {activity ? 'Edit Activity' : 'Create Activity'}
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600"
            >
              <ApperIcon name="X" size={20} />
            </Button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Activity Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Activity Type
              </label>
              <select
                value={formData.type}
                onChange={(e) => handleChange('type', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent ${
                  errors.type ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="email">Email</option>
                <option value="call">Call</option>
                <option value="meeting">Meeting</option>
              </select>
              {errors.type && (
                <p className="mt-1 text-sm text-red-600">{errors.type}</p>
              )}
            </div>

            {/* Contact */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contact
              </label>
              <select
                value={formData.contactId}
                onChange={(e) => handleChange('contactId', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent ${
                  errors.contactId ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="">Select a contact...</option>
                {contactOptions.map((contact) => (
                  <option key={contact.Id} value={contact.Id}>
                    {contact.name}
                  </option>
                ))}
              </select>
              {errors.contactId && (
                <p className="mt-1 text-sm text-red-600">{errors.contactId}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Describe the activity..."
                rows={4}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent resize-none ${
                  errors.description ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description}</p>
              )}
              <p className="mt-1 text-sm text-gray-500">
                {formData.description.length}/500 characters
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="flex-1"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    {activity ? 'Updating...' : 'Creating...'}
                  </div>
                ) : (
                  activity ? 'Update Activity' : 'Create Activity'
                )}
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
}

export default ActivityForm;