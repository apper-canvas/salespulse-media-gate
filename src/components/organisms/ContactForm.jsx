import React, { useState, useEffect } from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Card from "@/components/atoms/Card";
import { toast } from "react-toastify";
import { contactService } from "@/services/api/contactService";

const ContactForm = ({ contact, onSave, onCancel, isOpen }) => {
const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    role: "",
    status: "trial",
    mrr: 0,
    notes: "",
    name1: "",
    jobTitle: "",
    departmentName: "",
    departmentId: "",
    jobSummary: "",
    parentContactNumber: "",
    parentAddress: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

useEffect(() => {
if (contact) {
      setFormData({
        firstName: contact.firstName || "",
        lastName: contact.lastName || "",
        email: contact.email || "",
        phone: contact.phone || "",
        company: contact.company || "",
        role: contact.role || "",
        status: contact.status || "trial",
        mrr: contact.mrr || 0,
        notes: contact.notes || "",
        name1: contact.name1 || "",
        jobTitle: contact.jobTitle || "",
        departmentName: contact.departmentName || "",
        departmentId: contact.departmentId || "",
        jobSummary: contact.jobSummary || "",
        parentContactNumber: contact.parentContactNumber || "",
        parentAddress: contact.parentAddress || ""
      });
    } else {
setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        company: "",
        role: "",
        status: "trial",
        mrr: 0,
        notes: "",
        name1: "",
        jobTitle: "",
        departmentName: "",
        departmentId: "",
        jobSummary: "",
        parentContactNumber: "",
        parentAddress: ""
      });
    }
    setErrors({});
  }, [contact, isOpen]);

const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.company.trim()) newErrors.company = "Company is required";
    if (!formData.role.trim()) newErrors.role = "Role is required";
    if (!formData.name1.trim()) newErrors.name1 = "Name1 is required";
    if (!formData.jobTitle.trim()) newErrors.jobTitle = "Job title is required";
    if (!formData.departmentName.trim()) newErrors.departmentName = "Department name is required";
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    try {
      let result;
      if (contact) {
        result = await contactService.update(contact.Id, formData);
        if (result) {
          toast.success("Contact updated successfully");
          onSave(result);
        }
      } else {
        result = await contactService.create(formData);
        if (result) {
          toast.success("Contact created successfully");
          onSave(result);
        }
      }
    } catch (error) {
      toast.error("Error saving contact");
      console.error("Error saving contact:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              {contact ? "Edit Contact" : "Add New Contact"}
            </h2>
            <Button variant="ghost" size="sm" onClick={onCancel}>
              <ApperIcon name="X" size={18} />
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="First Name"
                value={formData.firstName}
                onChange={(e) => handleChange("firstName", e.target.value)}
                error={errors.firstName}
                required
              />
              <Input
                label="Last Name"
                value={formData.lastName}
                onChange={(e) => handleChange("lastName", e.target.value)}
                error={errors.lastName}
                required
              />
</div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name1 *
              </label>
              <Input
                type="text"
                value={formData.name1}
                onChange={(e) => handleChange("name1", e.target.value)}
                placeholder="Enter name1"
                error={errors.name1}
                className="w-full"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                error={errors.email}
                required
              />
              <Input
                label="Phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                error={errors.phone}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Company"
                value={formData.company}
                onChange={(e) => handleChange("company", e.target.value)}
                error={errors.company}
                required
              />
              <Input
                label="Role"
                value={formData.role}
                onChange={(e) => handleChange("role", e.target.value)}
                error={errors.role}
                required
              />
            </div>
{/* Job Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Title *
              </label>
              <Input
                type="text"
                value={formData.jobTitle}
                onChange={(e) => handleChange("jobTitle", e.target.value)}
                placeholder="Enter job title"
                error={errors.jobTitle}
              />
              {errors.jobTitle && (
                <p className="mt-1 text-sm text-red-600">{errors.jobTitle}</p>
              )}
            </div>

            {/* Department Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Department Name *
                </label>
                <Input
                  type="text"
                  value={formData.departmentName}
                  onChange={(e) => handleChange("departmentName", e.target.value)}
                  placeholder="Enter department name"
                  error={errors.departmentName}
                />
                {errors.departmentName && (
                  <p className="mt-1 text-sm text-red-600">{errors.departmentName}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Department ID
                </label>
                <Input
                  type="number"
                  value={formData.departmentId}
                  onChange={(e) => handleChange("departmentId", e.target.value)}
                  placeholder="Enter department ID"
                />
              </div>
            </div>

            {/* Job Summary */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Summary
              </label>
              <textarea
                value={formData.jobSummary}
                onChange={(e) => handleChange("jobSummary", e.target.value)}
                placeholder="Enter job summary and key responsibilities"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                rows={3}
              />
            </div>

            {/* Parent Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Parent Contact Number
                </label>
                <Input
                  type="tel"
                  value={formData.parentContactNumber}
                  onChange={(e) => handleChange("parentContactNumber", e.target.value)}
                  placeholder="Enter parent contact number"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Parent Address
                </label>
                <textarea
                  value={formData.parentAddress}
                  onChange={(e) => handleChange("parentAddress", e.target.value)}
                  placeholder="Enter parent contact address"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                  rows={2}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => handleChange("status", e.target.value)}
                  className="flex h-10 w-full rounded-lg border-2 border-gray-200 bg-white px-3 py-2 text-sm transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                >
                  <option value="trial">Trial</option>
                  <option value="active">Active</option>
                  <option value="churned">Churned</option>
                </select>
              </div>
              <Input
                label="Monthly Recurring Revenue (MRR)"
                type="number"
                min="0"
                value={formData.mrr}
                onChange={(e) => handleChange("mrr", parseInt(e.target.value) || 0)}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => handleChange("notes", e.target.value)}
                rows={3}
                className="flex w-full rounded-lg border-2 border-gray-200 bg-white px-3 py-2 text-sm transition-colors placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 resize-none"
                placeholder="Add any additional notes about this contact..."
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
              <Button variant="secondary" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Saving...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <ApperIcon name="Save" size={16} />
                    <span>{contact ? "Update Contact" : "Create Contact"}</span>
                  </div>
                )}
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
};

export default ContactForm;