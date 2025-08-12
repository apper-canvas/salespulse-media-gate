import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";

const MetricCard = ({ metric }) => {
  const getTrendIcon = () => {
    switch (metric.trend) {
      case "up":
        return <ApperIcon name="TrendingUp" size={16} className="text-success" />;
      case "down":
        return <ApperIcon name="TrendingDown" size={16} className="text-error" />;
      default:
        return <ApperIcon name="Minus" size={16} className="text-gray-400" />;
    }
  };

  const getTrendColor = () => {
    switch (metric.trend) {
      case "up":
        return "text-success";
      case "down":
        return "text-error";
      default:
        return "text-gray-400";
    }
  };

  const formatValue = (value, label) => {
    if (label.includes("MRR") || label.includes("Value")) {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(value);
    }
    return new Intl.NumberFormat("en-US").format(value);
  };

  return (
    <Card className="p-6 hover:shadow-card-hover transition-all duration-200">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-2">{metric.label}</p>
          <p className="text-3xl font-bold text-gray-900 mb-2">
            {formatValue(metric.value, metric.label)}
          </p>
          <div className="flex items-center space-x-1">
            {getTrendIcon()}
            <span className={`text-sm font-medium ${getTrendColor()}`}>
              {metric.change > 0 ? "+" : ""}{metric.change}%
            </span>
            <span className="text-sm text-gray-500">vs last month</span>
          </div>
        </div>
        <div className="ml-4">
          <div className="h-12 w-12 bg-gradient-to-br from-primary/20 to-primary-light/20 rounded-lg flex items-center justify-center">
            {metric.label.includes("MRR") && <ApperIcon name="DollarSign" size={24} className="text-primary" />}
            {metric.label.includes("Customers") && <ApperIcon name="Users" size={24} className="text-primary" />}
            {metric.label.includes("Pipeline") && <ApperIcon name="Target" size={24} className="text-primary" />}
            {metric.label.includes("Deals") && <ApperIcon name="TrendingUp" size={24} className="text-primary" />}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default MetricCard;