import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Card from '@/components/atoms/Card';
import Input from '@/components/atoms/Input';
import Badge from '@/components/atoms/Badge';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import SearchBar from '@/components/molecules/SearchBar';
import { reportService } from '@/services/api/reportService';

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [formData, setFormData] = useState({
    Name: '',
    Tags: '',
    report_type_c: '',
    data_source_c: '',
    filters_c: '',
    layout_c: '',
    format_c: '',
    display_fields_c: '',
    filter_parameters_c: '',
    activity_c: '',
    company_c: '',
    contact_c: '',
    metric_c: ''
  });

  // Load reports on component mount
  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await reportService.getAll();
      setReports(data || []);
    } catch (err) {
      setError('Failed to load reports');
      console.error('Error loading reports:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const newReport = await reportService.create(formData);
      if (newReport) {
        setReports(prev => [newReport, ...prev]);
        setShowCreateModal(false);
        resetForm();
        toast.success('Report created successfully');
      }
    } catch (error) {
      console.error('Error creating report:', error);
      toast.error('Failed to create report');
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      const updatedReport = await reportService.update(selectedReport.Id, formData);
      if (updatedReport) {
        setReports(prev => prev.map(report => 
          report.Id === selectedReport.Id ? updatedReport : report
        ));
        setShowEditModal(false);
        resetForm();
        toast.success('Report updated successfully');
      }
    } catch (error) {
      console.error('Error updating report:', error);
      toast.error('Failed to update report');
    }
  };

  const handleDelete = async () => {
    try {
      const success = await reportService.delete([selectedReport.Id]);
      if (success) {
        setReports(prev => prev.filter(report => report.Id !== selectedReport.Id));
        setShowDeleteModal(false);
        setSelectedReport(null);
        toast.success('Report deleted successfully');
      }
    } catch (error) {
      console.error('Error deleting report:', error);
      toast.error('Failed to delete report');
    }
  };

  const resetForm = () => {
    setFormData({
      Name: '',
      Tags: '',
      report_type_c: '',
      data_source_c: '',
      filters_c: '',
      layout_c: '',
      format_c: '',
      display_fields_c: '',
      filter_parameters_c: '',
      activity_c: '',
      company_c: '',
      contact_c: '',
      metric_c: ''
    });
    setSelectedReport(null);
  };

  const openCreateModal = () => {
    resetForm();
    setShowCreateModal(true);
  };

  const openEditModal = (report) => {
    setSelectedReport(report);
    setFormData({
      Name: report.Name || '',
      Tags: report.Tags || '',
      report_type_c: report.report_type_c || '',
      data_source_c: report.data_source_c || '',
      filters_c: report.filters_c || '',
      layout_c: report.layout_c || '',
      format_c: report.format_c || '',
      display_fields_c: report.display_fields_c || '',
      filter_parameters_c: report.filter_parameters_c || '',
      activity_c: report.activity_c?.Id || report.activity_c || '',
      company_c: report.company_c?.Id || report.company_c || '',
      contact_c: report.contact_c?.Id || report.contact_c || '',
      metric_c: report.metric_c?.Id || report.metric_c || ''
    });
    setShowEditModal(true);
  };

  const openDeleteModal = (report) => {
    setSelectedReport(report);
    setShowDeleteModal(true);
  };

  // Filter reports based on search term
  const filteredReports = reports.filter(report =>
    report.Name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.report_type_c?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.data_source_c?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.Tags?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return 'N/A';
    }
  };

  const ReportModal = ({ show, onClose, title, onSubmit, submitText }) => {
    if (!show) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">{title}</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <ApperIcon name="X" size={20} />
            </button>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Report Name *
                </label>
                <Input
                  type="text"
                  value={formData.Name}
                  onChange={(e) => setFormData(prev => ({ ...prev, Name: e.target.value }))}
                  required
                  placeholder="Enter report name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Report Type
                </label>
                <Input
                  type="text"
                  value={formData.report_type_c}
                  onChange={(e) => setFormData(prev => ({ ...prev, report_type_c: e.target.value }))}
                  placeholder="e.g., Summary, Detailed, Chart"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Data Source
                </label>
                <Input
                  type="text"
                  value={formData.data_source_c}
                  onChange={(e) => setFormData(prev => ({ ...prev, data_source_c: e.target.value }))}
                  placeholder="e.g., Contacts, Companies, Activities"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Format
                </label>
                <Input
                  type="text"
                  value={formData.format_c}
                  onChange={(e) => setFormData(prev => ({ ...prev, format_c: e.target.value }))}
                  placeholder="e.g., PDF, Excel, CSV"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tags
              </label>
              <Input
                type="text"
                value={formData.Tags}
                onChange={(e) => setFormData(prev => ({ ...prev, Tags: e.target.value }))}
                placeholder="Enter tags separated by commas"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Filters
              </label>
              <textarea
                value={formData.filters_c}
                onChange={(e) => setFormData(prev => ({ ...prev, filters_c: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                rows="3"
                placeholder="Enter filter criteria"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Layout Configuration
              </label>
              <textarea
                value={formData.layout_c}
                onChange={(e) => setFormData(prev => ({ ...prev, layout_c: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                rows="3"
                placeholder="Enter layout configuration"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Display Fields
              </label>
              <textarea
                value={formData.display_fields_c}
                onChange={(e) => setFormData(prev => ({ ...prev, display_fields_c: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                rows="2"
                placeholder="Enter fields to display"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Filter Parameters
              </label>
              <textarea
                value={formData.filter_parameters_c}
                onChange={(e) => setFormData(prev => ({ ...prev, filter_parameters_c: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                rows="2"
                placeholder="Enter filter parameters"
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button type="submit">
                {submitText}
              </Button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const DeleteConfirmationModal = () => {
    if (!showDeleteModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <div className="flex items-center mb-4">
            <div className="flex-shrink-0 w-10 h-10 mx-auto bg-red-100 rounded-full flex items-center justify-center">
              <ApperIcon name="AlertTriangle" size={20} className="text-red-600" />
            </div>
          </div>

          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Delete Report
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Are you sure you want to delete "{selectedReport?.Name}"? This action cannot be undone.
            </p>
          </div>

          <div className="flex space-x-3">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => setShowDeleteModal(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              className="flex-1"
              onClick={handleDelete}
            >
              Delete
            </Button>
          </div>
        </div>
      </div>
    );
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadReports} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
          <p className="text-gray-600">Manage and generate reports</p>
        </div>
        <Button onClick={openCreateModal}>
          <ApperIcon name="Plus" size={16} className="mr-2" />
          Create Report
        </Button>
      </div>

      {/* Search and Filters */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <SearchBar
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Search reports by name, type, or tags..."
            />
          </div>
        </div>
      </Card>

      {/* Reports Grid */}
      {filteredReports.length === 0 ? (
        <Empty
          message="No reports found"
          description="Create your first report to get started"
          action={
            <Button onClick={openCreateModal}>
              <ApperIcon name="Plus" size={16} className="mr-2" />
              Create Report
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReports.map((report) => (
            <Card key={report.Id} className="p-6 hover:shadow-card-hover transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-primary to-primary-light rounded-lg flex items-center justify-center">
                    <ApperIcon name="FileBarChart" size={20} className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{report.Name}</h3>
                    <p className="text-sm text-gray-500">
                      {report.report_type_c || 'Report'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => openEditModal(report)}
                    className="p-1 text-gray-400 hover:text-primary transition-colors"
                    title="Edit report"
                  >
                    <ApperIcon name="Edit2" size={16} />
                  </button>
                  <button
                    onClick={() => openDeleteModal(report)}
                    className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                    title="Delete report"
                  >
                    <ApperIcon name="Trash2" size={16} />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                {report.data_source_c && (
                  <div className="flex items-center text-sm text-gray-600">
                    <ApperIcon name="Database" size={14} className="mr-2" />
                    <span>Source: {report.data_source_c}</span>
                  </div>
                )}

                {report.format_c && (
                  <div className="flex items-center text-sm text-gray-600">
                    <ApperIcon name="FileType" size={14} className="mr-2" />
                    <span>Format: {report.format_c}</span>
                  </div>
                )}

                <div className="flex items-center text-sm text-gray-600">
                  <ApperIcon name="Calendar" size={14} className="mr-2" />
                  <span>Created: {formatDate(report.CreatedOn)}</span>
                </div>

                {report.Tags && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {report.Tags.split(',').slice(0, 2).map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag.trim()}
                      </Badge>
                    ))}
                    {report.Tags.split(',').length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{report.Tags.split(',').length - 2}
                      </Badge>
                    )}
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Modals */}
      <ReportModal
        show={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Report"
        onSubmit={handleCreate}
        submitText="Create Report"
      />

      <ReportModal
        show={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Report"
        onSubmit={handleEdit}
        submitText="Update Report"
      />

      <DeleteConfirmationModal />
    </div>
  );
};

export default Reports;