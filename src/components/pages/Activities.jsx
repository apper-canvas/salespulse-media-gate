import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { activitiesService } from '@/services/api/activitiesService';
import Button from '@/components/atoms/Button';
import Card from '@/components/atoms/Card';
import Input from '@/components/atoms/Input';
import Badge from '@/components/atoms/Badge';
import ApperIcon from '@/components/ApperIcon';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import ActivityForm from '@/components/organisms/ActivityForm';
import { format } from 'date-fns';

function Activities() {
  const [activities, setActivities] = useState([]);
  const [filteredActivities, setFilteredActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState(null);

  useEffect(() => {
    loadActivities();
  }, []);

  useEffect(() => {
    filterActivities();
  }, [activities, searchQuery, filterType]);

  const loadActivities = async () => {
    try {
      setLoading(true);
      const data = await activitiesService.getAll();
      setActivities(data);
      setError(null);
    } catch (err) {
      setError('Failed to load activities');
      console.error('Error loading activities:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterActivities = () => {
    let filtered = activities;

    if (searchQuery) {
      filtered = filtered.filter(activity =>
        activity.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        activity.type?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filterType !== 'all') {
      filtered = filtered.filter(activity => activity.type === filterType);
    }

    // Sort by timestamp, newest first
    filtered.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    setFilteredActivities(filtered);
  };

  const handleCreateActivity = () => {
    setEditingActivity(null);
    setIsFormOpen(true);
  };

  const handleEditActivity = (activity) => {
    setEditingActivity(activity);
    setIsFormOpen(true);
  };

  const handleDeleteActivity = async (activity) => {
    if (!window.confirm(`Are you sure you want to delete this ${activity.type} activity?`)) {
      return;
    }

    try {
      await activitiesService.delete(activity.Id);
      setActivities(prev => prev.filter(a => a.Id !== activity.Id));
      toast.success('Activity deleted successfully');
    } catch (err) {
      toast.error('Failed to delete activity');
      console.error('Error deleting activity:', err);
    }
  };

  const handleFormSubmit = async (activityData) => {
    try {
      if (editingActivity) {
        const updated = await activitiesService.update(editingActivity.Id, activityData);
        setActivities(prev => prev.map(a => a.Id === editingActivity.Id ? updated : a));
        toast.success('Activity updated successfully');
      } else {
        const created = await activitiesService.create(activityData);
        setActivities(prev => [created, ...prev]);
        toast.success('Activity created successfully');
      }
      setIsFormOpen(false);
      setEditingActivity(null);
    } catch (err) {
      toast.error(editingActivity ? 'Failed to update activity' : 'Failed to create activity');
      console.error('Error saving activity:', err);
    }
  };

  const getActivityTypeIcon = (type) => {
    switch (type) {
      case 'email':
        return 'Mail';
      case 'call':
        return 'Phone';
      case 'meeting':
        return 'Calendar';
      default:
        return 'Activity';
    }
  };

  const getActivityTypeVariant = (type) => {
    switch (type) {
      case 'email':
        return 'info';
      case 'call':
        return 'success';
      case 'meeting':
        return 'warning';
      default:
        return 'secondary';
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error} onRetry={loadActivities} />;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Activities</h1>
          <p className="text-gray-600 mt-1">
            Track and manage your customer interactions
          </p>
        </div>
        <Button 
          onClick={handleCreateActivity}
          className="flex items-center gap-2"
        >
          <ApperIcon name="Plus" size={16} />
          Create Activity
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <Input
            placeholder="Search activities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon="Search"
          />
        </div>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
        >
          <option value="all">All Types</option>
          <option value="email">Email</option>
          <option value="call">Call</option>
          <option value="meeting">Meeting</option>
        </select>
      </div>

      {/* Activities List */}
      {filteredActivities.length === 0 ? (
        <Empty 
          icon="Activity"
          title="No activities found"
          description={searchQuery || filterType !== 'all' ? 
            "No activities match your current search or filter criteria." :
            "Get started by creating your first activity."
          }
          action={
            <Button onClick={handleCreateActivity}>
              <ApperIcon name="Plus" size={16} />
              Create Activity
            </Button>
          }
        />
      ) : (
        <div className="space-y-4">
          {filteredActivities.map((activity) => (
            <Card key={activity.Id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                      <ApperIcon 
                        name={getActivityTypeIcon(activity.type)} 
                        size={20} 
                        className="text-gray-600" 
                      />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant={getActivityTypeVariant(activity.type)}>
                        {activity.type}
                      </Badge>
                      <span className="text-sm text-gray-500">
                        {format(new Date(activity.timestamp), 'MMM dd, yyyy HH:mm')}
                      </span>
                    </div>
                    <p className="text-gray-900 leading-relaxed">
                      {activity.description}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditActivity(activity)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <ApperIcon name="Edit" size={16} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteActivity(activity)}
                    className="text-gray-500 hover:text-red-600"
                  >
                    <ApperIcon name="Trash2" size={16} />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Activity Form Modal */}
      {isFormOpen && (
        <ActivityForm
          activity={editingActivity}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setIsFormOpen(false);
            setEditingActivity(null);
          }}
        />
      )}
    </div>
  );
}

export default Activities;