import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import { format } from "date-fns";

const ContactDetail = ({ contact, onEdit, onClose, isOpen }) => {
  if (!isOpen || !contact) return null;

  const getBadgeVariant = (status) => {
    switch (status) {
      case "trial":
        return "trial";
      case "active":
        return "active";
      case "churned":
        return "churned";
      default:
        return "default";
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h2 className="text-2xl font-bold text-gray-900">
                  {contact.firstName} {contact.lastName}
                </h2>
                <Badge variant={getBadgeVariant(contact.status)}>
                  {contact.status.charAt(0).toUpperCase() + contact.status.slice(1)}
                </Badge>
              </div>
              <p className="text-lg text-gray-600">
{contact.jobTitle && `${contact.jobTitle} • `}{contact.role} at {contact.company}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="accent" onClick={() => onEdit(contact)}>
                <ApperIcon name="Edit2" size={16} className="mr-2" />
                Edit
              </Button>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <ApperIcon name="X" size={18} />
              </Button>
            </div>
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <Card className="p-4">
              <h3 className="text-sm font-medium text-gray-500 mb-3">Contact Information</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <ApperIcon name="Mail" size={18} className="text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="text-sm font-medium text-gray-900">{contact.email}</p>
                  </div>
                </div>
                {contact.phone && (
                  <div className="flex items-center space-x-3">
                    <ApperIcon name="Phone" size={18} className="text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Phone</p>
                      <p className="text-sm font-medium text-gray-900">{contact.phone}</p>
                    </div>
                  </div>
                )}
              </div>
            </Card>

<Card className="p-4">
              <h3 className="text-sm font-medium text-gray-500 mb-3">Professional Information</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <ApperIcon name="Building2" size={18} className="text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Company</p>
                    <p className="text-sm font-medium text-gray-900">{contact.company}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <ApperIcon name="Briefcase" size={18} className="text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Role</p>
                    <p className="text-sm font-medium text-gray-900">{contact.role}</p>
                  </div>
                </div>
                {contact.jobTitle && (
                  <div className="flex items-center space-x-3">
                    <ApperIcon name="User" size={18} className="text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Job Title</p>
                      <p className="text-sm font-medium text-gray-900">{contact.jobTitle}</p>
                    </div>
                  </div>
                )}
                {contact.departmentName && (
                  <div className="flex items-center space-x-3">
                    <ApperIcon name="Users" size={18} className="text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Department</p>
                      <p className="text-sm font-medium text-gray-900">
                        {contact.departmentName}
                        {contact.departmentId && ` (ID: ${contact.departmentId})`}
                      </p>
                    </div>
                  </div>
                )}
                <div className="flex items-center space-x-3">
                  <ApperIcon name="DollarSign" size={18} className="text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Monthly Revenue</p>
                    <p className="text-sm font-medium text-gray-900">{formatCurrency(contact.mrr)}</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Job Summary */}
            {contact.jobSummary && (
              <Card className="p-4">
                <h3 className="text-sm font-medium text-gray-500 mb-3">Job Summary</h3>
                <p className="text-sm text-gray-900 leading-relaxed">{contact.jobSummary}</p>
              </Card>
            )}

            {/* Parent Contact Information */}
            {(contact.parentContactNumber || contact.parentAddress) && (
              <Card className="p-4">
                <h3 className="text-sm font-medium text-gray-500 mb-3">Parent Contact Information</h3>
                <div className="space-y-3">
                  {contact.parentContactNumber && (
                    <div className="flex items-center space-x-3">
                      <ApperIcon name="Phone" size={18} className="text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Parent Contact Number</p>
                        <p className="text-sm font-medium text-gray-900">{contact.parentContactNumber}</p>
                      </div>
                    </div>
                  )}
                  {contact.parentAddress && (
                    <div className="flex items-center space-x-3">
                      <ApperIcon name="MapPin" size={18} className="text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Parent Address</p>
                        <p className="text-sm font-medium text-gray-900">{contact.parentAddress}</p>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            )}
          </div>

          {/* Notes */}
          {contact.notes && (
            <Card className="p-4 mb-6">
              <h3 className="text-sm font-medium text-gray-500 mb-3">Notes</h3>
              <p className="text-sm text-gray-700">{contact.notes}</p>
            </Card>
          )}

          {/* Activity History */}
          <Card className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-500">Activity History</h3>
              <Button variant="ghost" size="sm">
                <ApperIcon name="Plus" size={16} className="mr-2" />
                Add Activity
              </Button>
            </div>
            
            <div className="text-center py-8">
              <ApperIcon name="Activity" size={48} className="text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-500 mb-2">No activities yet</p>
              <p className="text-xs text-gray-400">Activities with this contact will appear here</p>
            </div>
          </Card>

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 mt-6 border-t border-gray-100 text-xs text-gray-500">
            <span>Contact ID: {contact.Id}</span>
            <span>Created: {format(new Date(contact.createdAt), "MMM dd, yyyy")}</span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ContactDetail;