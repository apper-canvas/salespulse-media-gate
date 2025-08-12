import contactsData from "@/services/mockData/contacts.json";

// In-memory storage for runtime modifications
let contacts = [...contactsData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const contactService = {
  async getAll() {
    await delay(300);
    return [...contacts];
  },

  async getById(id) {
    await delay(200);
    const contact = contacts.find(c => c.Id === parseInt(id));
    if (!contact) {
      throw new Error(`Contact with ID ${id} not found`);
    }
    return { ...contact };
  },

  async create(contactData) {
    await delay(400);
    const newId = Math.max(...contacts.map(c => c.Id)) + 1;
    const newContact = {
      ...contactData,
      Id: newId,
      createdAt: new Date().toISOString(),
      mrr: parseInt(contactData.mrr) || 0
    };
    contacts.unshift(newContact);
    return { ...newContact };
  },

  async update(id, contactData) {
    await delay(400);
    const index = contacts.findIndex(c => c.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Contact with ID ${id} not found`);
    }
    
    const updatedContact = {
      ...contacts[index],
      ...contactData,
      Id: parseInt(id),
      mrr: parseInt(contactData.mrr) || 0
    };
    
    contacts[index] = updatedContact;
    return { ...updatedContact };
  },

  async delete(id) {
    await delay(300);
    const index = contacts.findIndex(c => c.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Contact with ID ${id} not found`);
    }
    
    const deletedContact = contacts[index];
    contacts.splice(index, 1);
    return { ...deletedContact };
  }
};