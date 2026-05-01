export const collectionCrudFeatures = [
  {
    key: 'adminCollectionList',
    method: 'GET',
    path: '/admin/:collectionName',
    storeFunction: 'query|getAll',
    description: 'List admin-managed collection records, optionally filtered.',
  },
  {
    key: 'adminCollectionGetById',
    method: 'GET',
    path: '/admin/:collectionName/:id',
    storeFunction: 'getById',
    description: 'Get one record from any allowed admin-managed collection.',
  },
  {
    key: 'adminCollectionCreate',
    method: 'POST',
    path: '/admin/:collectionName',
    storeFunction: 'createRecord',
    description: 'Create one record in any allowed admin-managed collection.',
  },
  {
    key: 'adminCollectionUpdate',
    method: 'PUT',
    path: '/admin/:collectionName/:id',
    storeFunction: 'updateRecord',
    description: 'Update one record in any allowed admin-managed collection.',
  },
  {
    key: 'adminCollectionDelete',
    method: 'DELETE',
    path: '/admin/:collectionName/:id',
    storeFunction: 'deleteRecord',
    description: 'Delete one record in any allowed admin-managed collection.',
  },
];
