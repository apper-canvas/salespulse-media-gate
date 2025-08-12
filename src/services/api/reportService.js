import { toast } from 'react-toastify';

class ReportService {
  constructor() {
    this.tableName = 'report_c';
    this.apperClient = null;
    this.initializeClient();
  }

  initializeClient() {
    try {
      const { ApperClient } = window.ApperSDK;
      this.apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
    } catch (error) {
      console.error('Failed to initialize ApperClient:', error);
    }
  }

  async getAll() {
    try {
      if (!this.apperClient) {
        throw new Error('ApperClient not initialized');
      }

      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "CreatedBy" } },
          { field: { Name: "ModifiedOn" } },
          { field: { Name: "ModifiedBy" } },
          { field: { Name: "report_type_c" } },
          { field: { Name: "data_source_c" } },
          { field: { Name: "filters_c" } },
          { field: { Name: "layout_c" } },
          { field: { Name: "format_c" } },
          { field: { Name: "display_fields_c" } },
          { field: { Name: "filter_parameters_c" } },
          { field: { Name: "activity_c" } },
          { field: { Name: "company_c" } },
          { field: { Name: "contact_c" } },
          { field: { Name: "metric_c" } }
        ],
        orderBy: [
          {
            fieldName: "ModifiedOn",
            sorttype: "DESC"
          }
        ],
        pagingInfo: {
          limit: 100,
          offset: 0
        }
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching reports:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  }

  async getById(reportId) {
    try {
      if (!this.apperClient) {
        throw new Error('ApperClient not initialized');
      }

      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "CreatedBy" } },
          { field: { Name: "ModifiedOn" } },
          { field: { Name: "ModifiedBy" } },
          { field: { Name: "report_type_c" } },
          { field: { Name: "data_source_c" } },
          { field: { Name: "filters_c" } },
          { field: { Name: "layout_c" } },
          { field: { Name: "format_c" } },
          { field: { Name: "display_fields_c" } },
          { field: { Name: "filter_parameters_c" } },
          { field: { Name: "activity_c" } },
          { field: { Name: "company_c" } },
          { field: { Name: "contact_c" } },
          { field: { Name: "metric_c" } }
        ]
      };

      const response = await this.apperClient.getRecordById(this.tableName, reportId, params);

      if (!response || !response.data) {
        return null;
      }

      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching report with ID ${reportId}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  }

  async create(reportData) {
    try {
      if (!this.apperClient) {
        throw new Error('ApperClient not initialized');
      }

      // Only include Updateable fields for create operation
      const createData = {
        Name: reportData.Name,
        Tags: reportData.Tags,
        report_type_c: reportData.report_type_c,
        data_source_c: reportData.data_source_c,
        filters_c: reportData.filters_c,
        layout_c: reportData.layout_c,
        format_c: reportData.format_c,
        display_fields_c: reportData.display_fields_c,
        filter_parameters_c: reportData.filter_parameters_c,
        activity_c: reportData.activity_c ? parseInt(reportData.activity_c) : null,
        company_c: reportData.company_c ? parseInt(reportData.company_c) : null,
        contact_c: reportData.contact_c ? parseInt(reportData.contact_c) : null,
        metric_c: reportData.metric_c ? parseInt(reportData.metric_c) : null
      };

      // Remove null/empty values
      Object.keys(createData).forEach(key => {
        if (createData[key] === null || createData[key] === '') {
          delete createData[key];
        }
      });

      const params = {
        records: [createData]
      };

      const response = await this.apperClient.createRecord(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);

        if (failedRecords.length > 0) {
          console.error(`Failed to create report ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }

        if (successfulRecords.length > 0) {
          return successfulRecords[0].data;
        }
      }

      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating report:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  }

  async update(reportId, reportData) {
    try {
      if (!this.apperClient) {
        throw new Error('ApperClient not initialized');
      }

      // Only include Updateable fields for update operation
      const updateData = {
        Id: reportId,
        Name: reportData.Name,
        Tags: reportData.Tags,
        report_type_c: reportData.report_type_c,
        data_source_c: reportData.data_source_c,
        filters_c: reportData.filters_c,
        layout_c: reportData.layout_c,
        format_c: reportData.format_c,
        display_fields_c: reportData.display_fields_c,
        filter_parameters_c: reportData.filter_parameters_c,
        activity_c: reportData.activity_c ? parseInt(reportData.activity_c) : null,
        company_c: reportData.company_c ? parseInt(reportData.company_c) : null,
        contact_c: reportData.contact_c ? parseInt(reportData.contact_c) : null,
        metric_c: reportData.metric_c ? parseInt(reportData.metric_c) : null
      };

      // Remove null/empty values except Id
      Object.keys(updateData).forEach(key => {
        if (key !== 'Id' && (updateData[key] === null || updateData[key] === '')) {
          delete updateData[key];
        }
      });

      const params = {
        records: [updateData]
      };

      const response = await this.apperClient.updateRecord(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);

        if (failedUpdates.length > 0) {
          console.error(`Failed to update report ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }

        if (successfulUpdates.length > 0) {
          return successfulUpdates[0].data;
        }
      }

      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating report:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  }

  async delete(reportIds) {
    try {
      if (!this.apperClient) {
        throw new Error('ApperClient not initialized');
      }

      const params = {
        RecordIds: reportIds
      };

      const response = await this.apperClient.deleteRecord(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);

        if (failedDeletions.length > 0) {
          console.error(`Failed to delete reports ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        return successfulDeletions.length === reportIds.length;
      }

      return false;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting reports:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return false;
    }
  }
}

export const reportService = new ReportService();