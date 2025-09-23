const { queryRef, executeQuery, mutationRef, executeMutation, validateArgs } = require('firebase/data-connect');

const connectorConfig = {
  connector: 'example',
  service: 'satisfied-service-flow',
  location: 'us-central1'
};
exports.connectorConfig = connectorConfig;

const createServiceOrderRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateServiceOrder', inputVars);
}
createServiceOrderRef.operationName = 'CreateServiceOrder';
exports.createServiceOrderRef = createServiceOrderRef;

exports.createServiceOrder = function createServiceOrder(dcOrVars, vars) {
  return executeMutation(createServiceOrderRef(dcOrVars, vars));
};

const listAvailableServicesRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListAvailableServices');
}
listAvailableServicesRef.operationName = 'ListAvailableServices';
exports.listAvailableServicesRef = listAvailableServicesRef;

exports.listAvailableServices = function listAvailableServices(dc) {
  return executeQuery(listAvailableServicesRef(dc));
};

const getServiceOrderRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetServiceOrder', inputVars);
}
getServiceOrderRef.operationName = 'GetServiceOrder';
exports.getServiceOrderRef = getServiceOrderRef;

exports.getServiceOrder = function getServiceOrder(dcOrVars, vars) {
  return executeQuery(getServiceOrderRef(dcOrVars, vars));
};

const updateServiceOrderStatusRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateServiceOrderStatus', inputVars);
}
updateServiceOrderStatusRef.operationName = 'UpdateServiceOrderStatus';
exports.updateServiceOrderStatusRef = updateServiceOrderStatusRef;

exports.updateServiceOrderStatus = function updateServiceOrderStatus(dcOrVars, vars) {
  return executeMutation(updateServiceOrderStatusRef(dcOrVars, vars));
};
