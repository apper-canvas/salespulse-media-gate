import React, { useState, useEffect } from "react";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import ApperIcon from "@/components/ApperIcon";
import { toast } from "react-toastify";
import { companyService } from "@/services/api/companyService";

const INDUSTRIES = [
  "Technology",
  "Healthcare",
  "Finance",
  "Education",
  "Retail",
  "Manufacturing",
  "Real Estate",
  "Consulting",
  "Media",
  "Transportation",
  "Energy",
  "Agriculture",
  "Government",
  "Non-profit",
  "Other"
];

const SUBSCRIPTION_PLANS = [
  "Starter",
  "Professional", 
  "Enterprise"
];

const CompanyForm = ({ company, onSave, onCancel, isOpen }) => {
  const [formData, setFormData] = useState({
    name: "",
    industry: "",
    employees: "",
    website: "",
    subscriptionPlan: "",
    status: "trial",
    mrr: ""
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      if (company) {
        setFormData({
          name: company.name || "",
          industry: company.industry || "",
          employees: company.employees?.toString() || "",
          website: company.website || "",
          subscriptionPlan: company.subscriptionPlan || "",
          status: company.status || "trial",
          mrr: company.mrr?.toString() || ""
        });
      } else {
        setFormData({
          name: "",
          industry: "",
          employees: "",
          website: "",
          subscriptionPlan: "",
          status: "trial",
          mrr: ""
        });
      }
      setErrors({});
    }
  }, [company, isOpen]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Company name is required";
    }

    if (!formData.industry) {
      newErrors.industry = "Industry is required";
    }

    if (!formData.employees || parseInt(formData.employees) < 1) {
      newErrors.employees = "Employee count must be at least 1";
    }

    if (formData.website && !isValidUrl(formData.website)) {
      newErrors.website = "Please enter a valid website URL";
    }

    if (!formData.subscriptionPlan) {
      newErrors.subscriptionPlan = "Subscription plan is required";
    }

    if (!formData.mrr || parseInt(formData.mrr) < 0) {
      newErrors.mrr = "MRR must be 0 or greater";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string) => {
    try {
      new URL(string.startsWith('http') ? string : `https://${string}`);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);

    try {
      const companyData = {
        ...formData,
        employees: parseInt(formData.employees),
        mrr: parseInt(formData.mrr),
        website: formData.website ? (formData.website.startsWith('http') ? formData.website : `https://${formData.website}`) : ""
      };

      let savedCompany;
      if (company?.Id) {
        savedCompany = await companyService.update(company.Id, companyData);
        toast.success("Company updated successfully");
      } else {
        savedCompany = await companyService.create(companyData);
        toast.success("Company created successfully");
      }

      onSave(savedCompany);
    } catch (error) {
      toast.error(company?.Id ? "Error updating company" : "Error creating company");
      console.error("Error saving company:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    onCancel();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-900">
              {company ? "Edit Company" : "Add New Company"}
            </h2>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleCancel}
            >
              <ApperIcon name="X" size={20} />
            </Button>
          </div>

          {/* Form Content */}
          <div className="p-6 space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Name *
                  </label>
                  <Input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    placeholder="Enter company name"
                    error={errors.name}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Industry *
                  </label>
                  <select
                    value={formData.industry}
                    onChange={(e) => handleChange("industry", e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary ${
                      errors.industry ? "border-error" : "border-gray-300"
                    }`}
                  >
                    <option value="">Select industry</option>
                    {INDUSTRIES.map(industry => (
                      <option key={industry} value={industry}>
                        {industry}
                      </option>
                    ))}
                  </select>
                  {errors.industry && (
                    <p className="text-error text-sm mt-1">{errors.industry}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Employee Count *
                  </label>
                  <Input
                    type="number"
                    value={formData.employees}
                    onChange={(e) => handleChange("employees", e.target.value)}
                    placeholder="Number of employees"
                    min="1"
                    error={errors.employees}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Website
                  </label>
                  <Input
                    type="text"
                    value={formData.website}
                    onChange={(e) => handleChange("website", e.target.value)}
                    placeholder="company.com"
                    error={errors.website}
                  />
                </div>
              </div>
            </div>

            {/* Subscription Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Subscription Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subscription Plan *
                  </label>
                  <select
                    value={formData.subscriptionPlan}
                    onChange={(e) => handleChange("subscriptionPlan", e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary ${
                      errors.subscriptionPlan ? "border-error" : "border-gray-300"
                    }`}
                  >
                    <option value="">Select plan</option>
                    {SUBSCRIPTION_PLANS.map(plan => (
                      <option key={plan} value={plan}>
                        {plan}
                      </option>
                    ))}
                  </select>
                  {errors.subscriptionPlan && (
                    <p className="text-error text-sm mt-1">{errors.subscriptionPlan}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => handleChange("status", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  >
                    <option value="trial">Trial</option>
                    <option value="active">Active</option>
                    <option value="churned">Churned</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    MRR (Monthly Recurring Revenue) *
                  </label>
                  <Input
                    type="number"
                    value={formData.mrr}
                    onChange={(e) => handleChange("mrr", e.target.value)}
                    placeholder="0"
                    min="0"
                    error={errors.mrr}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <ApperIcon name="Loader2" size={16} className="mr-2 animate-spin" />
                  {company ? "Updating..." : "Creating..."}
                </>
              ) : (
                company ? "Update Company" : "Create Company"
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default CompanyForm;