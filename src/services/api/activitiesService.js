import activitiesData from "@/services/mockData/activities.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const activitiesService = {
  async getAll() {
    await delay(200);
    return [...activitiesData];
  },

  async getById(id) {
    await delay(150);
    const activity = activitiesData.find(a => a.Id === parseInt(id));
    if (!activity) {
      throw new Error(`Activity with ID ${id} not found`);
    }
    return { ...activity };
  },

  async create(activityData) {
    await delay(300);
    const newId = Math.max(...activitiesData.map(a => a.Id)) + 1;
    const newActivity = {
      ...activityData,
      Id: newId,
      timestamp: new Date().toISOString()
    };
    activitiesData.unshift(newActivity);
    return { ...newActivity };
  },

  async update(id, activityData) {
    await delay(300);
    const index = activitiesData.findIndex(a => a.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Activity with ID ${id} not found`);
    }
    
    const updatedActivity = {
      ...activitiesData[index],
      ...activityData,
      Id: parseInt(id)
    };
    
    activitiesData[index] = updatedActivity;
    return { ...updatedActivity };
  },

  async delete(id) {
    await delay(250);
    const index = activitiesData.findIndex(a => a.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Activity with ID ${id} not found`);
    }
    
    const deletedActivity = activitiesData[index];
    activitiesData.splice(index, 1);
    return { ...deletedActivity };
  }
};