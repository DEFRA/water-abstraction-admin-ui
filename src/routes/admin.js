/*
  UI only - NO direct interactions with data
*/
const Admin = require('../lib/admin');
const Water = require('../controllers/water');
const GenericUI = require('../controllers/genericUI');
const AdminUser = require('../controllers/adminUser');
const ImportContacts = require('../controllers/importContacts');
const ImportStations = require('../controllers/importGaugingStations');
const moduleRoutes = require('../modules/routes');
const usersController = require('../controllers/users');
const helpers = require('../lib/helpers');

const routes = [
  ...moduleRoutes,
  {
    method: 'GET',
    path: '/admin/status',
    handler: () => 'ok',
    config: {
      auth: false,
      description: 'Get service status'
    }
  },
  {
    method: 'GET',
    path: '/admin/stats',
    handler: Admin.stats,
    config: {
      auth: 'simple',
      description: 'Get service statistics'
    }
  },
  {
    method: 'GET',
    path: '/admin',
    handler: Admin.index,
    config: {
      auth: 'simple',
      description: 'Get Admin UI index'
    }
  },
  // this route is only useful in development because when deployed
  // this will not be accessible because it will be routed to the internal
  // VML application due to path to port mapping.
  {
    method: 'GET',
    path: '/',
    handler: (request, h) => h.redirect('/admin'),
    config: {
      auth: false,
      description: 'Get Admin UI index'
    }
  },
  {
    method: 'GET',
    path: '/admin/permit',
    handler: Admin.permitIndex,
    config: {
      auth: 'simple',
      description: 'UI entry point for permit repo admin'
    }
  },
  {
    method: 'GET',
    path: '/admin/idm',
    handler: Admin.idmIndex,
    config: {
      auth: 'simple',
      description: 'UI entry point for IDM admin'
    }
  },
  {
    method: 'GET',
    path: '/admin/findlicence',
    handler: Admin.findlicence,
    config: {
      auth: 'simple',
      description: 'Get Admin UI licence search'
    }
  },
  {
    method: 'GET',
    path: '/admin/findlicence/{search*}',
    handler: Admin.doFindlicence,
    config: {
      auth: 'simple',
      description: 'Perform admin UI licence search'
    }
  },
  {
    method: 'GET',
    path: '/admin/licence/{licence_id}',
    handler: Admin.viewlicence,
    config: {
      auth: 'simple',
      description: 'View licence by ID'
    }
  },
  {
    method: 'GET',
    path: '/admin/licence/{licence_id}/raw',
    handler: Admin.viewLicenceRaw,
    config: {
      auth: 'simple',
      description: 'View RAW licence by ID'
    }
  },
  {
    method: 'GET',
    path: '/admin/idm/users',
    handler: usersController.users,
    config: {
      auth: 'simple',
      description: 'View users'
    }
  },
  {
    method: 'POST',
    path: '/admin/idm/users',
    handler: usersController.createUser,
    config: {
      auth: 'simple',
      description: 'Create user'
    }
  },
  {
    method: 'GET',
    path: '/admin/idm/users/{user_id}',
    handler: usersController.user,
    config: {
      auth: 'simple',
      description: 'View user'
    }
  },
  {
    method: 'POST',
    path: '/admin/idm/users/{user_id}',
    handler: usersController.updateUser,
    config: {
      auth: 'simple',
      description: 'Update password'
    }
  },
  {
    method: 'GET',
    path: '/admin/idm/users/{user_id}/delete',
    handler: usersController.getDeleteUser,
    config: {
      auth: 'simple',
      description: 'Check user details before confirming delete'
    }
  },
  {
    method: 'POST',
    path: '/admin/idm/users/{user_id}/delete',
    handler: usersController.postDeleteUser,
    config: {
      auth: 'simple',
      description: 'Deletes the user'
    }
  },
  {
    method: 'GET',
    path: '/admin/idm/users/deleted',
    handler: usersController.getUserDeleted,
    config: {
      auth: 'simple',
      description: 'Displays the result of the user deletion'
    }
  },
  {
    method: 'GET',
    path: '/admin/regime',
    handler: Admin.regimes,
    config: {
      auth: 'simple',
      description: 'View regimes'
    }
  },
  {
    method: 'GET',
    path: '/admin/regime/{regimeId}/licencetypes',
    handler: Admin.regimeLicenceTypes,
    config: {
      auth: 'simple',
      description: 'View licence types for regime '
    }
  },
  {
    method: 'GET',
    path: '/admin/crm',
    handler: Admin.crm,
    config: {
      auth: 'simple',
      description: 'UI entry point for tactical crm'
    }
  },
  {
    method: 'GET',
    path: '/admin/crm/entities',
    handler: Admin.crmEntities,
    config: {
      auth: 'simple',
      description: 'Entity list for tactical crm'
    }
  },
  {
    method: 'GET',
    path: '/admin/crm/entities/newRegime',
    handler: Admin.crmNewRegime,
    config: {
      auth: 'simple',
      description: 'Create Regime form for tactical crm'
    }
  },
  {
    method: 'GET',
    path: '/admin/crm/entities/newCompany',
    handler: Admin.crmNewCompany,
    config: {
      auth: 'simple',
      description: 'Create Company form for tactical crm'
    }
  },
  {
    method: 'GET',
    path: '/admin/crm/entities/newIndividual',
    handler: Admin.crmNewIndividual,
    config: {
      auth: 'simple',
      description: 'Create individual form for tactical crm'
    }
  },
  {
    method: 'POST',
    path: '/admin/crm/entities/new',
    handler: Admin.crmDoNewEntity,
    config: {
      auth: 'simple',
      description: 'Create new entity in CRM'
    }
  },
  {
    method: 'GET',
    path: '/admin/crm/documents',
    handler: Admin.crmDocumentHeaders,
    config: {
      auth: 'simple',
      description: 'Create new entity in CRM'
    }
  },
  {
    method: 'GET',
    path: '/admin/crm/document/{document_id}',
    handler: Admin.getDocument,
    config: {
      auth: 'simple',
      description: 'Get document info'
    }
  },
  {
    method: 'GET',
    path: '/admin/crm/document/{document_id}/unlink',
    handler: Admin.getUnlinkDocument,
    config: {
      auth: 'simple',
      description: 'Unlink document from company/verification'
    }
  },
  {
    method: 'GET',
    path: '/admin/crm/document/unlink-success',
    handler: Admin.getUnlinkSuccess,
    config: {
      auth: 'simple',
      description: 'Documents unlinked successfully'
    }
  },
  {
    method: 'POST',
    path: '/admin/idm/crm/document/{document_id}/owner',
    handler: Admin.setDocumentOwner,
    config: {
      auth: 'simple',
      description: 'Set document owner in CRM'
    }
  },
  {
    method: 'GET',
    path: '/admin/crm/entities/{entity_id}',
    handler: Admin.crmEntity,
    config: {
      auth: 'simple',
      description: 'Get specific entity in crm'
    }
  },
  {
    method: 'GET',
    path: '/admin/crm/allentities',
    handler: Admin.crmAllEntitiesJSON,
    config: {
      auth: 'simple',
      description: 'Get all entities in JSON from CRM'
    }
  },
  {
    method: 'POST',
    path: '/admin/import',
    handler: Admin.loadLicences,
    config: {
      auth: 'simple',
      description: 'load licences'
    }
  },
  {
    method: 'GET',
    path: '/admin/import',
    handler: Admin.loadLicencesUI,
    config: {
      auth: 'simple',
      description: 'load licences ui'
    }
  },
  {
    method: 'POST',
    path: '/admin/crm/entities/{entity_id}/roles',
    handler: Admin.addRole,
    config: {
      auth: 'simple',
      description: 'add role to user'
    }
  },
  {
    method: 'POST',
    path: '/admin/crm/entities/{entity_id}/roles/{role_id}',
    handler: Admin.deleteRole,
    config: {
      auth: 'simple',
      description: 'delete role from user'
    }
  },
  {
    method: 'GET',
    path: '/admin/crm/verifications',
    handler: Admin.crmGetVerifications,
    config: {
      auth: 'simple',
      description: 'view list of verifications'
    }
  },
  {
    method: 'GET',
    path: '/admin/nald/import',
    handler: Admin.naldImport,
    config: {
      auth: 'simple',
      description: 'Import NALD data to temp DB'
    }
  },
  {
    method: 'GET',
    path: '/admin/nald/licence',
    handler: Admin.naldLicence,
    config: {
      auth: 'simple',
      description: 'View legacy nald licence'
    }
  },
  {
    method: 'GET',
    path: '/admin/water',
    handler: Water.index,
    config: {
      auth: 'simple',
      description: 'Water admin index'
    }
  },
  {
    method: 'GET',
    path: '/admin/water/scheduler',
    handler: Water.scheduler,
    config: {
      auth: 'simple',
      description: 'Water admin scheduler page'
    }
  },
  {
    method: 'POST',
    path: '/admin/water/scheduler',
    handler: Water.schedulerAdd,
    config: {
      auth: 'simple',
      description: 'Add new scheduler item'
    }
  },
  {
    method: 'GET',
    path: '/admin/generic',
    handler: GenericUI.menu,
    config: {
      auth: 'simple',
      description: 'generic menu UI for standard objects'
    }
  },
  {
    method: 'GET',
    path: '/admin/generic/{endpoint}',
    handler: GenericUI.submenu,
    config: {
      auth: 'simple',
      description: 'generic submenu UI for standard objects'
    }
  },
  {
    method: 'GET',
    path: '/admin/generic/{endpoint}/{obj}',
    handler: GenericUI.list,
    config: {
      auth: 'simple',
      description: 'generic UI for listview for standard objects'
    }
  },
  {
    method: 'POST',
    path: '/admin/generic/{endpoint}/{obj}',
    handler: GenericUI.createorUpdate,
    config: {
      auth: 'simple',
      description: 'generic UI for listview for standard objects'
    }
  },
  {
    method: 'GET',
    path: '/admin/createAdminUser',
    handler: AdminUser.createAdminUsersUI,
    config: {
      auth: 'simple',
      description: 'Create new admin users from list'
    }
  },
  {
    method: 'POST',
    path: '/admin/createAdminUser',
    handler: AdminUser.create,
    config: {
      auth: 'simple',
      description: 'Create new admin users from list'
    }
  },
  {
    method: 'GET',
    path: '/admin/import-contacts',
    handler: ImportContacts.getImportContacts,
    config: {
      auth: 'simple',
      description: 'Import iep/area email addresses to documents'
    }
  },
  {
    method: 'POST',
    path: '/admin/import-contacts',
    handler: ImportContacts.postImportContacts,
    config: {
      auth: 'simple',
      description: 'Post handler for import iep/area email addresses to documents'
    }
  },
  {
    method: 'GET',
    path: '/admin/import-stations',
    handler: ImportStations.getImportStations,
    config: {
      auth: 'simple',
      description: 'Import gauging stations linked to licence'
    }
  },
  {
    method: 'POST',
    path: '/admin/import-stations',
    handler: ImportStations.postImportStations,
    config: {
      auth: 'simple',
      description: 'Post handler for import gauging stations'
    }
  }
];

if (helpers.showUnlinkAll(process.env)) {
  routes.push({
    method: 'GET',
    path: '/admin/crm/document/unlink-all',
    handler: Admin.getUnlinkAllDocuments,
    config: {
      auth: 'simple',
      description: 'Unlink document from company/verification'
    }
  });
}

module.exports = routes;
