import companiesData from "@/services/mockData/companies.json";

// In-memory storage for runtime modifications
let companies = [...companiesData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const companyService = {
  async getAll() {
    await delay(300);
    return [...companies];
  },

  async getById(id) {
    await delay(200);
    const company = companies.find(c => c.Id === parseInt(id));
    if (!company) {
      throw new Error(`Company with ID ${id} not found`);
    }
    return { ...company };
  },

  async create(companyData) {
    await delay(400);
    const newId = Math.max(...companies.map(c => c.Id)) + 1;
    const newCompany = {
      ...companyData,
      Id: newId,
      createdAt: new Date().toISOString(),
      employees: parseInt(companyData.employees) || 1,
      mrr: parseInt(companyData.mrr) || 0
    };
    companies.unshift(newCompany);
    return { ...newCompany };
  },

  async update(id, companyData) {
    await delay(400);
    const index = companies.findIndex(c => c.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Company with ID ${id} not found`);
    }
    
    const updatedCompany = {
      ...companies[index],
      ...companyData,
      Id: parseInt(id),
      employees: parseInt(companyData.employees) || 1,
      mrr: parseInt(companyData.mrr) || 0
    };
    
    companies[index] = updatedCompany;
    return { ...updatedCompany };
  },

  async delete(id) {
    await delay(300);
    const index = companies.findIndex(c => c.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Company with ID ${id} not found`);
    }
    
    const deletedCompany = companies[index];
    companies.splice(index, 1);
    return { ...deletedCompany };
  }
};