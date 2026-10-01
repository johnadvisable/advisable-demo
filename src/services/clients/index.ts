// Re-export all client-related types and functions
export * from './types';
export * from './clientUtils';
export * from './clientQueries';
export { 
  getAllClientsForAdmin, 
  getClientWithTranslation, 
  saveClientWithTranslations, 
  deleteClientCompletely, 
  saveClientCategories, 
  getClientCategoriesForClient,
  getClientCategories,
  // Legacy aliases for backward compatibility
  deleteClientCompletely as deleteClient,
  saveClientWithTranslations as saveClient,
  saveClientWithTranslations as saveClientTranslation
} from './clientMutations';