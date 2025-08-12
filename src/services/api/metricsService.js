import metricsData from "@/services/mockData/metrics.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const metricsService = {
  async getAll() {
    await delay(250);
    return [...metricsData];
  },

  async getById(index) {
    await delay(200);
    const metric = metricsData[index];
    if (!metric) {
      throw new Error(`Metric at index ${index} not found`);
    }
    return { ...metric };
  },

  async create(metricData) {
    await delay(300);
    const newMetric = { ...metricData };
    metricsData.push(newMetric);
    return { ...newMetric };
  },

  async update(index, metricData) {
    await delay(300);
    if (index < 0 || index >= metricsData.length) {
      throw new Error(`Metric at index ${index} not found`);
    }
    
    const updatedMetric = {
      ...metricsData[index],
      ...metricData
    };
    
    metricsData[index] = updatedMetric;
    return { ...updatedMetric };
  },

  async delete(index) {
    await delay(250);
    if (index < 0 || index >= metricsData.length) {
      throw new Error(`Metric at index ${index} not found`);
    }
    
    const deletedMetric = metricsData[index];
    metricsData.splice(index, 1);
    return { ...deletedMetric };
  }
};