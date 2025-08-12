import { toast } from 'react-toastify';

// Initialize ApperClient with Project ID and Public Key
const getApperClient = () => {
  const { ApperClient } = window.ApperSDK;
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
};

const TABLE_NAME = 'contact_c';

// Field mapping from UI to database
const mapToDatabase = (contactData) => {
  return {
    Name: `${contactData.firstName} ${contactData.lastName}`,
    first_name_c: contactData.firstName,
    last_name_c: contactData.lastName,
    email_c: contactData.email,
    phone_c: contactData.phone || "",
    company_c: contactData.company,
    role_c: contactData.role,
    status_c: contactData.status,
    mrr_c: parseFloat(contactData.mrr) || 0,
    notes_c: contactData.notes || "",
    name1_c: contactData.name1 || "",
    job_title_c: contactData.jobTitle || "",
    department_name_c: contactData.departmentName || "",
    department_id_c: contactData.departmentId ? parseInt(contactData.departmentId) : null,
    job_summary_c: contactData.jobSummary || "",
    parent_contact_number_c: contactData.parentContactNumber || "",
    parent_address_c: contactData.parentAddress || ""
  };
};

// Field mapping from database to UI
const mapFromDatabase = (dbContact) => {
  return {
    Id: dbContact.Id,
    firstName: dbContact.first_name_c || "",
    lastName: dbContact.last_name_c || "",
    email: dbContact.email_c || "",
    phone: dbContact.phone_c || "",
    company: dbContact.company_c || "",
    role: dbContact.role_c || "",
    status: dbContact.status_c || "trial",
    mrr: dbContact.mrr_c || 0,
    notes: dbContact.notes_c || "",
    name1: dbContact.name1_c || "",
    jobTitle: dbContact.job_title_c || "",
    departmentName: dbContact.department_name_c || "",
    departmentId: dbContact.department_id_c || "",
    jobSummary: dbContact.job_summary_c || "",
    parentContactNumber: dbContact.parent_contact_number_c || "",
    parentAddress: dbContact.parent_address_c || "",
    createdAt: dbContact.created_at_c || dbContact.CreatedOn
  };
};

export const contactService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "first_name_c" } },
          { field: { Name: "last_name_c" } },
          { field: { Name: "email_c" } },
          { field: { Name: "phone_c" } },
          { field: { Name: "company_c" } },
          { field: { Name: "role_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "mrr_c" } },
          { field: { Name: "notes_c" } },
          { field: { Name: "name1_c" } },
          { field: { Name: "job_title_c" } },
          { field: { Name: "department_name_c" } },
          { field: { Name: "department_id_c" } },
          { field: { Name: "job_summary_c" } },
          { field: { Name: "parent_contact_number_c" } },
          { field: { Name: "parent_address_c" } },
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
        console.error("Error fetching contacts:", error?.response?.data?.message);
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
          { field: { Name: "first_name_c" } },
          { field: { Name: "last_name_c" } },
          { field: { Name: "email_c" } },
          { field: { Name: "phone_c" } },
          { field: { Name: "company_c" } },
          { field: { Name: "role_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "mrr_c" } },
          { field: { Name: "notes_c" } },
          { field: { Name: "name1_c" } },
          { field: { Name: "job_title_c" } },
          { field: { Name: "department_name_c" } },
          { field: { Name: "department_id_c" } },
          { field: { Name: "job_summary_c" } },
          { field: { Name: "parent_contact_number_c" } },
          { field: { Name: "parent_address_c" } },
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
        console.error(`Error fetching contact with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  },

async create(contactData) {
    try {
      const apperClient = getApperClient();
      const dbData = mapToDatabase(contactData);
      
      const params = {
        records: [dbData]
      };

      const response = await apperClient.createRecord(TABLE_NAME, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create contact ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
          
          if (successfulRecords.length === 0) {
            throw new Error("Failed to create contact");
          }
        }
        
        if (successfulRecords.length > 0) {
          return mapFromDatabase(successfulRecords[0].data);
        }
      }
      
      throw new Error("No response data received");
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating contact:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error creating contact:", error.message);
        throw error;
      }
    }
  },

  async update(id, contactData) {
    try {
      const apperClient = getApperClient();
      const dbData = mapToDatabase(contactData);
      
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
          console.error(`Failed to update contact ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
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
        console.error("Error updating contact:", error?.response?.data?.message);
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
          console.error(`Failed to delete contact ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulDeletions.length > 0;
      }
      
      return true;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting contact:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return false;
    }
  }
};