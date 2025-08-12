import React from "react";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
const ComingSoon = ({ section }) => {
  const getIconForSection = (sectionName) => {
    switch (sectionName) {
      case "Companies":
        return "Building2";
      case "Pipeline":
        return "Target";
      case "Activities":
        return "Activity";
      case "Reports":
        return "BarChart3";
      default:
        return "Clock";
    }
  };

  const getDescriptionForSection = (sectionName) => {
    switch (sectionName) {
      case "Companies":
        return "Manage your company accounts and organizational relationships. Track company-wide metrics and contact hierarchies.";
      case "Pipeline":
        return "Visualize your sales pipeline and track deals through each stage. Monitor conversion rates and forecasting.";
      case "Activities":
        return "Log and track all customer interactions including calls, emails, meetings, and follow-ups.";
      case "Reports":
        return "Generate comprehensive reports and analytics to track your sales performance and team productivity.";
      default:
        return "This feature is currently under development and will be available soon.";
    }
  };

  const getFeatureList = (sectionName) => {
    switch (sectionName) {
      case "Companies":
        return [
          "Company profile management",
          "Contact hierarchy tracking",
          "Revenue analytics by company",
          "Integration with contact records"
        ];
      case "Pipeline":
        return [
          "Visual pipeline stages",
          "Deal tracking and forecasting",
          "Conversion rate analytics",
          "Custom pipeline workflows"
        ];
      case "Activities":
        return [
          "Call and email logging",
          "Meeting scheduling",
          "Follow-up reminders",
          "Activity timeline view"
        ];
      case "Reports":
        return [
          "Sales performance metrics",
          "Team productivity reports",
          "Revenue forecasting",
          "Custom report builder"
        ];
      default:
        return ["Feature planning in progress"];
    }
  };
const handleCreatePipeline = () => {
    toast.success(`${section} creation request has been registered! We'll notify you when this feature is available.`);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {section === "Pipeline" && (
        <div className="mb-8">
          <Button 
            onClick={handleCreatePipeline}
            variant="primary"
            className="w-full sm:w-auto flex items-center justify-center"
          >
            <ApperIcon name="Plus" size={16} className="mr-2" />
            Create Pipeline
          </Button>
        </div>
      )}
      
      <div className="text-center mb-8">
        <div className="h-20 w-20 bg-gradient-to-br from-primary/20 to-primary-light/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <ApperIcon name={getIconForSection(section)} size={40} className="text-primary" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          {section} - Coming Soon
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          {getDescriptionForSection(section)}
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <Card className="p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <ApperIcon name="CheckCircle" size={20} className="text-success mr-3" />
            Planned Features
          </h2>
          <ul className="space-y-3">
            {getFeatureList(section).map((feature, index) => (
              <li key={index} className="flex items-center text-gray-600">
                <div className="h-2 w-2 bg-primary rounded-full mr-3 flex-shrink-0"></div>
                {feature}
              </li>
            ))}
          </ul>
        </Card>

        <Card className="p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <ApperIcon name="Calendar" size={20} className="text-info mr-3" />
            Development Timeline
          </h2>
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="h-3 w-3 bg-success rounded-full mr-4"></div>
              <div>
                <p className="font-medium text-gray-900">Planning Phase</p>
                <p className="text-sm text-gray-600">Feature specifications completed</p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="h-3 w-3 bg-warning rounded-full mr-4"></div>
              <div>
                <p className="font-medium text-gray-900">Development Phase</p>
                <p className="text-sm text-gray-600">Currently in progress</p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="h-3 w-3 bg-gray-300 rounded-full mr-4"></div>
              <div>
                <p className="font-medium text-gray-500">Testing Phase</p>
                <p className="text-sm text-gray-500">Coming next</p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-8 text-center">
        <div className="max-w-md mx-auto">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Want to be notified when {section} is ready?
          </h3>
          <p className="text-gray-600 mb-6">
            We'll send you an email as soon as this feature becomes available.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            />
            <Button variant="accent">
              <ApperIcon name="Bell" size={16} className="mr-2" />
              Notify Me
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ComingSoon;