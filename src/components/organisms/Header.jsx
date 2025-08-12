import React from "react";
import ApperIcon from "@/components/ApperIcon";
import UserDropdown from "@/components/molecules/UserDropdown";
import Button from "@/components/atoms/Button";

const Header = ({ onMobileMenuToggle }) => {
  return (
    <header className="bg-white border-b border-gray-200 px-4 lg:px-6 h-16 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={onMobileMenuToggle}
          className="lg:hidden"
        >
          <ApperIcon name="Menu" size={20} />
        </Button>
        
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 bg-gradient-to-br from-primary to-primary-light rounded-lg flex items-center justify-center">
            <ApperIcon name="Zap" size={18} className="text-white" />
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
            SalesPulse CRM
          </h1>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="sm">
          <ApperIcon name="Bell" size={18} />
        </Button>
        <UserDropdown />
      </div>
    </header>
  );
};

export default Header;