import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";

const Empty = ({ 
  title = "No items found", 
  description = "Get started by creating your first item.",
  actionLabel = "Add New",
  onAction,
  icon = "Plus"
}) => {
  return (
    <Card className="p-12 text-center">
      <div className="flex flex-col items-center space-y-4">
        <div className="h-16 w-16 bg-gradient-to-br from-primary/20 to-primary-light/20 rounded-full flex items-center justify-center">
          <ApperIcon name={icon} size={32} className="text-primary" />
        </div>
        
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {title}
          </h3>
          <p className="text-sm text-gray-600 mb-6">
            {description}
          </p>
        </div>
        
        {onAction && (
          <Button onClick={onAction} variant="accent">
            <ApperIcon name="Plus" size={16} className="mr-2" />
            {actionLabel}
          </Button>
        )}
      </div>
    </Card>
  );
};

export default Empty;