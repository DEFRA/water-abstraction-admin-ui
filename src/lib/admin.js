//TODO: Replace all API calls with http API calls to water service
const httpRequest = require('request').defaults({
    proxy:null,
    strictSSL :false
  })
const Helpers = require('./helpers')
const View = require('./view')
const Session = require('./session')
const Idm = require('./connectors/idm')
const Crm = require('./connectors/crm')


//TODO: replace Tactical with calls to IDM or CRM
const Tactical = require('./tactical')

function index (request, reply) {
  //view the admin page
  var viewContext = View.contextDefaults(request)
  viewContext.pageTitle = 'GOV.UK - Admin'
  console.log('*** adminIndex ***')
  reply.view('water/admin/index', viewContext)
}

function permitIndex (request, reply) {
  //view the admin page
  var viewContext = View.contextDefaults(request)
  viewContext.pageTitle = 'GOV.UK - Admin'
  console.log('*** adminIndex ***')
  reply.view('water/admin/permitIndex', viewContext)
}

function idmIndex (request, reply) {
  //view the admin page
  var viewContext = View.contextDefaults(request)
  viewContext.pageTitle = 'GOV.UK - Admin'
  console.log('*** adminIndex ***')
  reply.view('water/admin/idmIndex', viewContext)
}

function waterIndex (request, reply) {
  //view the admin page
  var viewContext = View.contextDefaults(request)
  viewContext.pageTitle = 'GOV.UK - Admin'
  console.log('*** adminIndex ***')
  reply.view('water/admin/waterIndex', viewContext)
}

function fields (request, reply) {
  //view the system fields page
  var viewContext = {}
  var uri = process.env.PERMIT_URI + 'API/1.0/field'
  httpRequest(uri+'?token='+process.env.JWT_TOKEN, (error, response, body)=> {
    var viewContext = View.contextDefaults(request)
    viewContext.pageTitle = 'GOV.UK - Admin/Fields'
    viewContext.data = JSON.parse(body)
    viewContext.debug.data = viewContext.data
    console.log('*** adminIndex ***')
    reply.view('water/admin/fields', viewContext)
  })

}

function regime (request, reply) {
  //view the regimes page
  var uri = process.env.PERMIT_URI + 'API/1.0/regime'
  console.log(uri+'?token='+process.env.JWT_TOKEN)
  httpRequest(uri+'?token='+process.env.JWT_TOKEN, (error, response, body) => {
    var viewContext = View.contextDefaults(request)
    viewContext.pageTitle = 'GOV.UK - Admin/Fields'
    viewContext.data = JSON.parse(body)
    viewContext.debug.regimes=viewContext.data
    reply.view('water/admin/regimes', viewContext)

  })

}
function regimeLicenceTypes (request, reply) {
  //view the regime licence types page
  var viewContext = {}

  var uri = process.env.PERMIT_URI + 'API/1.0/regime/'+request.params.regime_id+'/licencetype'
  console.log(uri)
  httpRequest(uri+'?token='+process.env.JWT_TOKEN,  (error, response, body) => {
    var viewContext = View.contextDefaults(request)
    console.log(body)
    viewContext.pageTitle = 'GOV.UK - Admin/Fields'
    viewContext.data = JSON.parse(body).data
    viewContext.regime_id = request.params.regime_id
    viewContext.debug.data = viewContext.data.data
    reply.view('water/admin/regimeLicenceTypes', viewContext)

  })
}

function regimeLicenceType (request, reply) {
  //view regime licence types page
  var viewContext = View.contextDefaults(request)
  var uri = process.env.PERMIT_URI + 'API/1.0/regime/'+request.params.regime_id+'/licencetype/'+request.params.type_id
  console.log(uri)
  httpRequest(uri+'?token='+process.env.JWT_TOKEN,  (error, response, body) => {
    console.log('got body')
    console.log(body)
    var data=JSON.parse(body)
    if (!data.data[0].attributedata) {
      data.data[0].attributedata = []
    }

    viewContext.debug.data = data.data
    viewContext.data = data.data
    viewContext.regime_id = request.params.regime_id
    viewContext.type_id = request.params.type_id

    httpRequest(uri+'?token='+process.env.JWT_TOKEN, (error, response, body)=> {
      viewContext.fields = JSON.parse(body)
      viewContext.debug.fields = viewContext.fields
      reply.view('water/admin/regimeLicenceType', viewContext)
    })
  })
}

//TODO: replace with http call to API and use 301...

function addFieldToregimeLicenceType (request, reply) {
  API.licencetype.createField(request, (data) => {
    reply('<script>location.href=\'/admin/regime/' + request.params.regime_id + '/licencetypes/' + request.params.type_id + '/\'</script>')
  })
}

function findlicenceform(request,reply){
  var viewContext = View.contextDefaults(request)
  viewContext.pageTitle = 'GOV.UK - Admin'
  reply.view('water/admin/search', viewContext)
}

function doFindlicence(request,reply){
  Crm.findDocument(request.params.search).then((response)=>{
    reply (response)
  })
}

function viewLicence(request,reply){
  var viewContext = View.contextDefaults(request)
  const Permit = require('./connectors/permit')
  Permit.getLicence(request.params.licence_id).then((licence) => {
    reply(licence)
  })
  viewContext.licence_id=request.params.licence_id



}

function addShortcode(request,reply){
    API.licence.addshortcode(request.params.licence_id,(res)=>{
      reply.redirect('/admin/licence/'+request.params.licence_id)
    });

}

function users(request,reply){
  console.log('requested users')
  var viewContext = View.contextDefaults(request)
  Idm.getUsers().then((users)=>{
    var viewContext = View.contextDefaults(request)
    viewContext.pageTitle = 'GOV.UK - Admin/Fields'
    viewContext.users = users
    viewContext.debug.users = viewContext.users
    console.log('*** adminIndex ***')
    reply.view('water/admin/viewusers', viewContext)
  })
}


function createUser(request,reply){
  console.log('requested create user')
  Idm.createUser(request.payload).then(()=>{
    //also create CRM record
    var data={};
    data.entity_nm=request.payload.username;
    data.entity_type='individual';
    data.entity_definition={};
    Crm.createEntity(data).then((id)=>{
      console.log(id)
    }).then(()=>{
      users(request,reply)
    })




  })
}


function user(request,reply){
  var viewContext = View.contextDefaults(request)




  viewContext.user_id=request.params.user_id
  Tactical.getUserLicences({user_id:request.params.user_id},(licences)=>{
    console.log(licences)
    viewContext.licences=licences
            reply.view('water/admin/viewuser', viewContext)

  })
}



function crmindex (request, reply) {
  //view the admin page
  var viewContext = View.contextDefaults(request)
  viewContext.pageTitle = 'GOV.UK - Admin'
  console.log('*** crmIndex ***')
  reply.view('water/admin/crmIndex', viewContext)
}

function crmEntities(request,reply){
  if(request.query.filter){
    console.log("With FILTER "+request.query.filter)
  }
  var viewContext = View.contextDefaults(request)
  viewContext.pageTitle = 'GOV.UK - Admin'

  URI=process.env.CRM_URI+'/entity?entity_type='+request.query.entity_type+'&token='+process.env.JWT_TOKEN
    httpRequest(URI, function (error, response, body) {
      var data = JSON.parse(body)
      viewContext.entities=data.data
      console.log(viewContext)
      reply.view('water/admin/crmEntities', viewContext)

    })
}

function crmEntity(request,reply){
  if(request.query.filter){
    console.log("With FILTER "+request.query.filter)
  }
  var viewContext = View.contextDefaults(request)
  viewContext.pageTitle = 'GOV.UK - Admin'

  console.log('get entity')
  console.log('get associations')
  console.log('get documents')

  URI=process.env.CRM_URI+'/entity/'+request.params.entity_id+'?token='+process.env.JWT_TOKEN
    httpRequest(URI, function (error, response, body) {
      console.log('response from '+URI)
      console.log(body)
      var data = JSON.parse(body)
      data.data.entity=data.data.entity[0]
      viewContext.entities=data.data
      viewContext.debug.entities=data



          console.log(viewContext)

          reply.view('water/admin/crmEntity', viewContext)


      console.log(viewContext)

    })
}

function crmNewRegime(request,reply){
  var viewContext = View.contextDefaults(request)
  viewContext.pageTitle = 'GOV.UK - Admin'
  reply.view('water/admin/crmNewRegime', viewContext)
}
function crmNewCompany(request,reply){
  var viewContext = View.contextDefaults(request)
  viewContext.pageTitle = 'GOV.UK - Admin'
  reply.view('water/admin/crmNewCompany', viewContext)
}
function crmNewIndividual(request,reply){
  var viewContext = View.contextDefaults(request)
  viewContext.pageTitle = 'GOV.UK - Admin'
  reply.view('water/admin/crmNewIndividual', viewContext)
}

function crmDoNewEntity(request,reply){
  console.log(request.payload)
  var data={};
  data.entity_nm=request.payload.entity_nm;
  data.entity_type=request.payload.entity_type;
  data.entity_definition=request.payload.entity_definition;
  Crm.createEntity(data).then((id)=>{
    console.log(id)
    reply.redirect('/admin/crm/entities/'+id);
  })

}

function crmAllEntitiesJSON(request,reply){
  URI=process.env.CRM_URI+'/entity?token='+process.env.JWT_TOKEN
    httpRequest(URI, function (error, response, body) {
      console.log('response from '+URI)
      console.log(body)
      var data = JSON.parse(body)
      return reply(data.data)
    })
}

function crmAssociateEntity(request,reply){
  console.log('crmAssociateEntity')
  console.log(request.payload)
  var entity_1=request.payload.entity1
  var entity_2=request.payload.entity2
  var data={};
  var method='post'
  if (request.payload.associationType=='up'){
    data.entity_up_type=entity_1.split('|')[0]
    data.entity_up_id=entity_1.split('|')[1]
    data.entity_down_type=entity_2.split('|')[0]
    data.entity_down_id=entity_2.split('|')[1]
    data.access_type=''
    data.inheritable=''
  } else {
    data.entity_up_type=entity_2.split('|')[0]
    data.entity_up_id=entity_2.split('|')[1]
    data.entity_down_type=entity_1.split('|')[0]
    data.entity_down_id=entity_1.split('|')[1]
    data.access_type=''
    data.inheritable=''
  }
  console.log(data)
  var URI=process.env.CRM_URI+'/entityAssociation'
  var method='post'
    httpRequest({
              method: method,
              url: URI + '?token=' + process.env.JWT_TOKEN,
              form: data
          },
          function (err, httpResponse, body) {
              console.log('got http ' + method + ' response')
              console.log(body)
              reply.redirect('/admin/crm/entities/'+data.entity_up_id);

          });



}

function crmDocumentHeaders(request,reply){
  var viewContext = View.contextDefaults(request)
  viewContext.pageTitle = 'GOV.UK - Admin'
  Crm.findDocument(request.params.search).then((response)=>{
    viewContext.permits=response.data
    viewContext.debug.permits=response.data[0]
    reply.view('water/admin/crmDocumentHeaders', viewContext)
  })
}

function setDocumentOwner(request,reply){
  console.log('set document owner')
  console.log('payload')
  console.log(request.payload)
  var params={
    entity_id:request.payload.entity_id,
    document_id:request.params.document_id
  }
  console.log(params)
  Crm.updateDocumentOwner(params).then((res)=>{
      console.log('got resolve')
      reply(res)
  }).catch((err)=>{
      console.log('got reject')
      reply(err)
  })
}

function getDocument(request,reply){
  var viewContext = View.contextDefaults(request)
  console.log('get document')
  console.log('document:')
  var params={
    document_id:request.params.document_id
  }
  console.log(params)
  Crm.getDocument(params).then((res)=>{
    viewContext.document_id=request.params.document_id
    viewContext.document=res
    viewContext.debug.document=res
    reply.view('water/admin/crmDocument', viewContext)
  })
}



module.exports = {
  index: index,
  fields: fields,
  regimes: regime,
  regimeLicenceTypes: regimeLicenceTypes,
  regimeLicenceType: regimeLicenceType,
  addFieldToregimeLicenceType: addFieldToregimeLicenceType,
  findlicence:findlicenceform,
  doFindlicence:doFindlicence,
  viewlicence:viewLicence,
  addShortcode:addShortcode,
  users:users,
  user:user,
  createUser:createUser,
  crm:crmindex,
  crmEntities:crmEntities,
  crmEntity:crmEntity,
  crmNewRegime:crmNewRegime,
  crmNewCompany:crmNewCompany,
  crmNewIndividual:crmNewIndividual,
  crmDoNewEntity:crmDoNewEntity,

  crmAllEntitiesJSON:crmAllEntitiesJSON,
  crmAssociateEntity:crmAssociateEntity,
  permitIndex:permitIndex,
  crmDocumentHeaders:crmDocumentHeaders,
  setDocumentOwner:setDocumentOwner,
  idmIndex:idmIndex,
  waterIndex:waterIndex,
  getDocument:getDocument
}
