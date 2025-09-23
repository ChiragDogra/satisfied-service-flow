import { queryRef, executeQuery, mutationRef, executeMutation, validateArgs } from 'firebase/data-connect';

export const connectorConfig = {
  connector: 'example',
  service: 'satisfied-service-flow',
  location: 'us-central1'
};

export const createServiceOrderRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateServiceOrder', inputVars);
}
createServiceOrderRef.operationName = 'CreateServiceOrder';

export function createServiceOrder(dcOrVars, vars) {
  return executeMutation(createServiceOrderRef(dcOrVars, vars));
}

export const listAvailableServicesRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListAvailableServices');
}
listAvailableServicesRef.operationName = 'ListAvailableServices';

export function listAvailableServices(dc) {
  return executeQuery(listAvailableServicesRef(dc));
}

export const getServiceOrderRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetServiceOrder', inputVars);
}
getServiceOrderRef.operationName = 'GetServiceOrder';

export function getServiceOrder(dcOrVars, vars) {
  return executeQuery(getServiceOrderRef(dcOrVars, vars));
}

export const updateServiceOrderStatusRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateServiceOrderStatus', inputVars);
}
updateServiceOrderStatusRef.operationName = 'UpdateServiceOrderStatus';

export function updateServiceOrderStatus(dcOrVars, vars) {
  return executeMutation(updateServiceOrderStatusRef(dcOrVars, vars));
}

