import { toast } from 'react-toastify';

// Initialize ApperClient with Project ID and Public Key
const getApperClient = () => {
  const { ApperClient } = window.ApperSDK;
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
};

const TABLE_NAME = 'company_c';

// Field mapping from UI to database
const mapToDatabase = (companyData) => {
  return {
    Name: companyData.name,
    industry_c: companyData.industry,
    employees_c: parseInt(companyData.employees) || 1,
    website_c: companyData.website || "",
    subscription_plan_c: companyData.subscriptionPlan,
    status_c: companyData.status,
    mrr_c: parseFloat(companyData.mrr) || 0
  };
};

// Field mapping from database to UI
const mapFromDatabase = (dbCompany) => {
  return {
    Id: dbCompany.Id,
    name: dbCompany.Name || "",
    industry: dbCompany.industry_c || "",
    employees: dbCompany.employees_c || 1,
    website: dbCompany.website_c || "",
    subscriptionPlan: dbCompany.subscription_plan_c || "",
    status: dbCompany.status_c || "trial",
    mrr: dbCompany.mrr_c || 0,
    createdAt: dbCompany.created_at_c || dbCompany.CreatedOn
  };
};

export const companyService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "industry_c" } },
          { field: { Name: "employees_c" } },
          { field: { Name: "website_c" } },
          { field: { Name: "subscription_plan_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "mrr_c" } },
          { field: { Name: "created_at_c" } },
          { field: { Name: "CreatedOn" } }
        ],
        orderBy: [
          {
            fieldName: "CreatedOn",
            sorttype: "DESC"
          }
        ],
        pagingInfo: {
          limit: 100,
          offset: 0
        }
      };

      const response = await apperClient.fetchRecords(TABLE_NAME, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      if (!response.data || response.data.length === 0) {
        return [];
      }

      return response.data.map(mapFromDatabase);
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching companies:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient();
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "industry_c" } },
          { field: { Name: "employees_c" } },
          { field: { Name: "website_c" } },
          { field: { Name: "subscription_plan_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "mrr_c" } },
          { field: { Name: "created_at_c" } },
          { field: { Name: "CreatedOn" } }
        ]
      };

      const response = await apperClient.getRecordById(TABLE_NAME, id, params);
      
      if (!response || !response.data) {
        return null;
      }

      return mapFromDatabase(response.data);
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching company with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  },

  async create(companyData) {
    try {
      const apperClient = getApperClient();
      const dbData = mapToDatabase(companyData);
      
      const params = {
        records: [dbData]
      };

      const response = await apperClient.createRecord(TABLE_NAME, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create company ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulRecords.length > 0) {
          return mapFromDatabase(successfulRecords[0].data);
        }
      }
      
      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating company:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  },

  async update(id, companyData) {
    try {
      const apperClient = getApperClient();
      const dbData = mapToDatabase(companyData);
      
      const params = {
        records: [{
          Id: parseInt(id),
          ...dbData
        }]
      };

      const response = await apperClient.updateRecord(TABLE_NAME, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update company ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulUpdates.length > 0) {
          return mapFromDatabase(successfulUpdates[0].data);
        }
      }
      
      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating company:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  },

  async delete(id) {
    try {
      const apperClient = getApperClient();
      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await apperClient.deleteRecord(TABLE_NAME, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete company ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulDeletions.length > 0;
      }
      
      return true;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting company:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return false;
    }
  }
};