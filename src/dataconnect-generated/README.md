# Generated TypeScript README
This README will guide you through the process of using the generated JavaScript SDK package for the connector `example`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

**If you're looking for the `React README`, you can find it at [`dataconnect-generated/react/README.md`](./react/README.md)**

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

# Table of Contents
- [**Overview**](#generated-javascript-readme)
- [**Accessing the connector**](#accessing-the-connector)
  - [*Connecting to the local Emulator*](#connecting-to-the-local-emulator)
- [**Queries**](#queries)
  - [*ListAvailableServices*](#listavailableservices)
  - [*GetServiceOrder*](#getserviceorder)
- [**Mutations**](#mutations)
  - [*CreateServiceOrder*](#createserviceorder)
  - [*UpdateServiceOrderStatus*](#updateserviceorderstatus)

# Accessing the connector
A connector is a collection of Queries and Mutations. One SDK is generated for each connector - this SDK is generated for the connector `example`. You can find more information about connectors in the [Data Connect documentation](https://firebase.google.com/docs/data-connect#how-does).

You can use this generated SDK by importing from the package `@dataconnect/generated` as shown below. Both CommonJS and ESM imports are supported.

You can also follow the instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#set-client).

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
```

## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, you can use the following code.
You can also follow the emulator instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#instrument-clients).

```typescript
import { connectDataConnectEmulator, getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
connectDataConnectEmulator(dataConnect, 'localhost', 9399);
```

After it's initialized, you can call your Data Connect [queries](#queries) and [mutations](#mutations) from your generated SDK.

# Queries

There are two ways to execute a Data Connect Query using the generated Web SDK:
- Using a Query Reference function, which returns a `QueryRef`
  - The `QueryRef` can be used as an argument to `executeQuery()`, which will execute the Query and return a `QueryPromise`
- Using an action shortcut function, which returns a `QueryPromise`
  - Calling the action shortcut function will execute the Query and return a `QueryPromise`

The following is true for both the action shortcut function and the `QueryRef` function:
- The `QueryPromise` returned will resolve to the result of the Query once it has finished executing
- If the Query accepts arguments, both the action shortcut function and the `QueryRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Query
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each query. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-queries).

## ListAvailableServices
You can execute the `ListAvailableServices` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listAvailableServices(): QueryPromise<ListAvailableServicesData, undefined>;

interface ListAvailableServicesRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListAvailableServicesData, undefined>;
}
export const listAvailableServicesRef: ListAvailableServicesRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listAvailableServices(dc: DataConnect): QueryPromise<ListAvailableServicesData, undefined>;

interface ListAvailableServicesRef {
  ...
  (dc: DataConnect): QueryRef<ListAvailableServicesData, undefined>;
}
export const listAvailableServicesRef: ListAvailableServicesRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listAvailableServicesRef:
```typescript
const name = listAvailableServicesRef.operationName;
console.log(name);
```

### Variables
The `ListAvailableServices` query has no variables.
### Return Type
Recall that executing the `ListAvailableServices` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListAvailableServicesData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListAvailableServicesData {
  services: ({
    id: UUIDString;
    name: string;
    description?: string | null;
    price: number;
    estimatedDuration?: number | null;
  } & Service_Key)[];
}
```
### Using `ListAvailableServices`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listAvailableServices } from '@dataconnect/generated';


// Call the `listAvailableServices()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listAvailableServices();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listAvailableServices(dataConnect);

console.log(data.services);

// Or, you can use the `Promise` API.
listAvailableServices().then((response) => {
  const data = response.data;
  console.log(data.services);
});
```

### Using `ListAvailableServices`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listAvailableServicesRef } from '@dataconnect/generated';


// Call the `listAvailableServicesRef()` function to get a reference to the query.
const ref = listAvailableServicesRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listAvailableServicesRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.services);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.services);
});
```

## GetServiceOrder
You can execute the `GetServiceOrder` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getServiceOrder(vars: GetServiceOrderVariables): QueryPromise<GetServiceOrderData, GetServiceOrderVariables>;

interface GetServiceOrderRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetServiceOrderVariables): QueryRef<GetServiceOrderData, GetServiceOrderVariables>;
}
export const getServiceOrderRef: GetServiceOrderRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getServiceOrder(dc: DataConnect, vars: GetServiceOrderVariables): QueryPromise<GetServiceOrderData, GetServiceOrderVariables>;

interface GetServiceOrderRef {
  ...
  (dc: DataConnect, vars: GetServiceOrderVariables): QueryRef<GetServiceOrderData, GetServiceOrderVariables>;
}
export const getServiceOrderRef: GetServiceOrderRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getServiceOrderRef:
```typescript
const name = getServiceOrderRef.operationName;
console.log(name);
```

### Variables
The `GetServiceOrder` query requires an argument of type `GetServiceOrderVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetServiceOrderVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `GetServiceOrder` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetServiceOrderData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetServiceOrderData {
  serviceOrder?: {
    id: UUIDString;
    title: string;
    description: string;
    status: string;
    priority?: string | null;
    customerNotes?: string | null;
    notes?: string | null;
    estimatedCompletionDate?: DateString | null;
    customer: {
      id: UUIDString;
      displayName: string;
      email: string;
      phoneNumber?: string | null;
    } & User_Key;
      assignedTechnician?: {
        id: UUIDString;
        displayName: string;
        email: string;
        phoneNumber?: string | null;
      } & User_Key;
        serviceOrderItems_on_serviceOrder: ({
          id: UUIDString;
          service: {
            id: UUIDString;
            name: string;
            description?: string | null;
            price: number;
          } & Service_Key;
            quantity: number;
            priceAtTimeOfOrder: number;
            notes?: string | null;
        } & ServiceOrderItem_Key)[];
          updates_on_serviceOrder: ({
            id: UUIDString;
            content: string;
            newStatus?: string | null;
            timestamp: TimestampString;
            user: {
              id: UUIDString;
              displayName: string;
            } & User_Key;
          } & Update_Key)[];
  } & ServiceOrder_Key;
}
```
### Using `GetServiceOrder`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getServiceOrder, GetServiceOrderVariables } from '@dataconnect/generated';

// The `GetServiceOrder` query requires an argument of type `GetServiceOrderVariables`:
const getServiceOrderVars: GetServiceOrderVariables = {
  id: ..., 
};

// Call the `getServiceOrder()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getServiceOrder(getServiceOrderVars);
// Variables can be defined inline as well.
const { data } = await getServiceOrder({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getServiceOrder(dataConnect, getServiceOrderVars);

console.log(data.serviceOrder);

// Or, you can use the `Promise` API.
getServiceOrder(getServiceOrderVars).then((response) => {
  const data = response.data;
  console.log(data.serviceOrder);
});
```

### Using `GetServiceOrder`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getServiceOrderRef, GetServiceOrderVariables } from '@dataconnect/generated';

// The `GetServiceOrder` query requires an argument of type `GetServiceOrderVariables`:
const getServiceOrderVars: GetServiceOrderVariables = {
  id: ..., 
};

// Call the `getServiceOrderRef()` function to get a reference to the query.
const ref = getServiceOrderRef(getServiceOrderVars);
// Variables can be defined inline as well.
const ref = getServiceOrderRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getServiceOrderRef(dataConnect, getServiceOrderVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.serviceOrder);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.serviceOrder);
});
```

# Mutations

There are two ways to execute a Data Connect Mutation using the generated Web SDK:
- Using a Mutation Reference function, which returns a `MutationRef`
  - The `MutationRef` can be used as an argument to `executeMutation()`, which will execute the Mutation and return a `MutationPromise`
- Using an action shortcut function, which returns a `MutationPromise`
  - Calling the action shortcut function will execute the Mutation and return a `MutationPromise`

The following is true for both the action shortcut function and the `MutationRef` function:
- The `MutationPromise` returned will resolve to the result of the Mutation once it has finished executing
- If the Mutation accepts arguments, both the action shortcut function and the `MutationRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Mutation
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each mutation. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-mutations).

## CreateServiceOrder
You can execute the `CreateServiceOrder` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createServiceOrder(vars: CreateServiceOrderVariables): MutationPromise<CreateServiceOrderData, CreateServiceOrderVariables>;

interface CreateServiceOrderRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateServiceOrderVariables): MutationRef<CreateServiceOrderData, CreateServiceOrderVariables>;
}
export const createServiceOrderRef: CreateServiceOrderRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createServiceOrder(dc: DataConnect, vars: CreateServiceOrderVariables): MutationPromise<CreateServiceOrderData, CreateServiceOrderVariables>;

interface CreateServiceOrderRef {
  ...
  (dc: DataConnect, vars: CreateServiceOrderVariables): MutationRef<CreateServiceOrderData, CreateServiceOrderVariables>;
}
export const createServiceOrderRef: CreateServiceOrderRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createServiceOrderRef:
```typescript
const name = createServiceOrderRef.operationName;
console.log(name);
```

### Variables
The `CreateServiceOrder` mutation requires an argument of type `CreateServiceOrderVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateServiceOrderVariables {
  data: {
    id?: UUIDString | null;
    id_expr?: {
    };
      assignedTechnicianId?: UUIDString | null;
      assignedTechnicianId_expr?: {
      };
        customerId?: UUIDString | null;
        customerId_expr?: {
        };
          assignedTechnician?: User_Key | null;
          customer?: User_Key | null;
          createdAt?: TimestampString | null;
          createdAt_expr?: {
          };
            createdAt_time?: {
              now?: {
              };
                at?: TimestampString | null;
                add?: {
                  milliseconds?: number;
                  seconds?: number;
                  minutes?: number;
                  hours?: number;
                  days?: number;
                  weeks?: number;
                  months?: number;
                  years?: number;
                };
                  sub?: {
                    milliseconds?: number;
                    seconds?: number;
                    minutes?: number;
                    hours?: number;
                    days?: number;
                    weeks?: number;
                    months?: number;
                    years?: number;
                  };
                    truncateTo?: Timestamp_Interval | null;
            };
              createdAt_update?: ({
                inc?: {
                  milliseconds?: number;
                  seconds?: number;
                  minutes?: number;
                  hours?: number;
                  days?: number;
                  weeks?: number;
                  months?: number;
                  years?: number;
                };
                  dec?: {
                    milliseconds?: number;
                    seconds?: number;
                    minutes?: number;
                    hours?: number;
                    days?: number;
                    weeks?: number;
                    months?: number;
                    years?: number;
                  };
              })[];
                customerNotes?: string | null;
                customerNotes_expr?: {
                };
                  description?: string | null;
                  description_expr?: {
                  };
                    estimatedCompletionDate?: DateString | null;
                    estimatedCompletionDate_expr?: {
                    };
                      estimatedCompletionDate_date?: {
                        today?: {
                        };
                          on?: DateString | null;
                          add?: {
                            days?: number;
                            weeks?: number;
                            months?: number;
                            years?: number;
                          };
                            sub?: {
                              days?: number;
                              weeks?: number;
                              months?: number;
                              years?: number;
                            };
                              truncateTo?: Date_Interval | null;
                      };
                        estimatedCompletionDate_update?: ({
                          inc?: {
                            days?: number;
                            weeks?: number;
                            months?: number;
                            years?: number;
                          };
                            dec?: {
                              days?: number;
                              weeks?: number;
                              months?: number;
                              years?: number;
                            };
                        })[];
                          lastUpdated?: TimestampString | null;
                          lastUpdated_expr?: {
                          };
                            lastUpdated_time?: {
                              now?: {
                              };
                                at?: TimestampString | null;
                                add?: {
                                  milliseconds?: number;
                                  seconds?: number;
                                  minutes?: number;
                                  hours?: number;
                                  days?: number;
                                  weeks?: number;
                                  months?: number;
                                  years?: number;
                                };
                                  sub?: {
                                    milliseconds?: number;
                                    seconds?: number;
                                    minutes?: number;
                                    hours?: number;
                                    days?: number;
                                    weeks?: number;
                                    months?: number;
                                    years?: number;
                                  };
                                    truncateTo?: Timestamp_Interval | null;
                            };
                              lastUpdated_update?: ({
                                inc?: {
                                  milliseconds?: number;
                                  seconds?: number;
                                  minutes?: number;
                                  hours?: number;
                                  days?: number;
                                  weeks?: number;
                                  months?: number;
                                  years?: number;
                                };
                                  dec?: {
                                    milliseconds?: number;
                                    seconds?: number;
                                    minutes?: number;
                                    hours?: number;
                                    days?: number;
                                    weeks?: number;
                                    months?: number;
                                    years?: number;
                                  };
                              })[];
                                notes?: string | null;
                                notes_expr?: {
                                };
                                  priority?: string | null;
                                  priority_expr?: {
                                  };
                                    status?: string | null;
                                    status_expr?: {
                                    };
                                      title?: string | null;
                                      title_expr?: {
                                      };
  };
}
```
### Return Type
Recall that executing the `CreateServiceOrder` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateServiceOrderData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateServiceOrderData {
  serviceOrder_insert: ServiceOrder_Key;
}
```
### Using `CreateServiceOrder`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createServiceOrder, CreateServiceOrderVariables } from '@dataconnect/generated';

// The `CreateServiceOrder` mutation requires an argument of type `CreateServiceOrderVariables`:
const createServiceOrderVars: CreateServiceOrderVariables = {
  data: ..., 
};

// Call the `createServiceOrder()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createServiceOrder(createServiceOrderVars);
// Variables can be defined inline as well.
const { data } = await createServiceOrder({ data: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createServiceOrder(dataConnect, createServiceOrderVars);

console.log(data.serviceOrder_insert);

// Or, you can use the `Promise` API.
createServiceOrder(createServiceOrderVars).then((response) => {
  const data = response.data;
  console.log(data.serviceOrder_insert);
});
```

### Using `CreateServiceOrder`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createServiceOrderRef, CreateServiceOrderVariables } from '@dataconnect/generated';

// The `CreateServiceOrder` mutation requires an argument of type `CreateServiceOrderVariables`:
const createServiceOrderVars: CreateServiceOrderVariables = {
  data: ..., 
};

// Call the `createServiceOrderRef()` function to get a reference to the mutation.
const ref = createServiceOrderRef(createServiceOrderVars);
// Variables can be defined inline as well.
const ref = createServiceOrderRef({ data: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createServiceOrderRef(dataConnect, createServiceOrderVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.serviceOrder_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.serviceOrder_insert);
});
```

## UpdateServiceOrderStatus
You can execute the `UpdateServiceOrderStatus` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updateServiceOrderStatus(vars: UpdateServiceOrderStatusVariables): MutationPromise<UpdateServiceOrderStatusData, UpdateServiceOrderStatusVariables>;

interface UpdateServiceOrderStatusRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateServiceOrderStatusVariables): MutationRef<UpdateServiceOrderStatusData, UpdateServiceOrderStatusVariables>;
}
export const updateServiceOrderStatusRef: UpdateServiceOrderStatusRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateServiceOrderStatus(dc: DataConnect, vars: UpdateServiceOrderStatusVariables): MutationPromise<UpdateServiceOrderStatusData, UpdateServiceOrderStatusVariables>;

interface UpdateServiceOrderStatusRef {
  ...
  (dc: DataConnect, vars: UpdateServiceOrderStatusVariables): MutationRef<UpdateServiceOrderStatusData, UpdateServiceOrderStatusVariables>;
}
export const updateServiceOrderStatusRef: UpdateServiceOrderStatusRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateServiceOrderStatusRef:
```typescript
const name = updateServiceOrderStatusRef.operationName;
console.log(name);
```

### Variables
The `UpdateServiceOrderStatus` mutation requires an argument of type `UpdateServiceOrderStatusVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateServiceOrderStatusVariables {
  id: UUIDString;
  data: {
    id?: UUIDString | null;
    id_expr?: {
    };
      assignedTechnicianId?: UUIDString | null;
      assignedTechnicianId_expr?: {
      };
        customerId?: UUIDString | null;
        customerId_expr?: {
        };
          assignedTechnician?: User_Key | null;
          customer?: User_Key | null;
          createdAt?: TimestampString | null;
          createdAt_expr?: {
          };
            createdAt_time?: {
              now?: {
              };
                at?: TimestampString | null;
                add?: {
                  milliseconds?: number;
                  seconds?: number;
                  minutes?: number;
                  hours?: number;
                  days?: number;
                  weeks?: number;
                  months?: number;
                  years?: number;
                };
                  sub?: {
                    milliseconds?: number;
                    seconds?: number;
                    minutes?: number;
                    hours?: number;
                    days?: number;
                    weeks?: number;
                    months?: number;
                    years?: number;
                  };
                    truncateTo?: Timestamp_Interval | null;
            };
              createdAt_update?: ({
                inc?: {
                  milliseconds?: number;
                  seconds?: number;
                  minutes?: number;
                  hours?: number;
                  days?: number;
                  weeks?: number;
                  months?: number;
                  years?: number;
                };
                  dec?: {
                    milliseconds?: number;
                    seconds?: number;
                    minutes?: number;
                    hours?: number;
                    days?: number;
                    weeks?: number;
                    months?: number;
                    years?: number;
                  };
              })[];
                customerNotes?: string | null;
                customerNotes_expr?: {
                };
                  description?: string | null;
                  description_expr?: {
                  };
                    estimatedCompletionDate?: DateString | null;
                    estimatedCompletionDate_expr?: {
                    };
                      estimatedCompletionDate_date?: {
                        today?: {
                        };
                          on?: DateString | null;
                          add?: {
                            days?: number;
                            weeks?: number;
                            months?: number;
                            years?: number;
                          };
                            sub?: {
                              days?: number;
                              weeks?: number;
                              months?: number;
                              years?: number;
                            };
                              truncateTo?: Date_Interval | null;
                      };
                        estimatedCompletionDate_update?: ({
                          inc?: {
                            days?: number;
                            weeks?: number;
                            months?: number;
                            years?: number;
                          };
                            dec?: {
                              days?: number;
                              weeks?: number;
                              months?: number;
                              years?: number;
                            };
                        })[];
                          lastUpdated?: TimestampString | null;
                          lastUpdated_expr?: {
                          };
                            lastUpdated_time?: {
                              now?: {
                              };
                                at?: TimestampString | null;
                                add?: {
                                  milliseconds?: number;
                                  seconds?: number;
                                  minutes?: number;
                                  hours?: number;
                                  days?: number;
                                  weeks?: number;
                                  months?: number;
                                  years?: number;
                                };
                                  sub?: {
                                    milliseconds?: number;
                                    seconds?: number;
                                    minutes?: number;
                                    hours?: number;
                                    days?: number;
                                    weeks?: number;
                                    months?: number;
                                    years?: number;
                                  };
                                    truncateTo?: Timestamp_Interval | null;
                            };
                              lastUpdated_update?: ({
                                inc?: {
                                  milliseconds?: number;
                                  seconds?: number;
                                  minutes?: number;
                                  hours?: number;
                                  days?: number;
                                  weeks?: number;
                                  months?: number;
                                  years?: number;
                                };
                                  dec?: {
                                    milliseconds?: number;
                                    seconds?: number;
                                    minutes?: number;
                                    hours?: number;
                                    days?: number;
                                    weeks?: number;
                                    months?: number;
                                    years?: number;
                                  };
                              })[];
                                notes?: string | null;
                                notes_expr?: {
                                };
                                  priority?: string | null;
                                  priority_expr?: {
                                  };
                                    status?: string | null;
                                    status_expr?: {
                                    };
                                      title?: string | null;
                                      title_expr?: {
                                      };
  };
}
```
### Return Type
Recall that executing the `UpdateServiceOrderStatus` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateServiceOrderStatusData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateServiceOrderStatusData {
  serviceOrder_update?: ServiceOrder_Key | null;
}
```
### Using `UpdateServiceOrderStatus`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateServiceOrderStatus, UpdateServiceOrderStatusVariables } from '@dataconnect/generated';

// The `UpdateServiceOrderStatus` mutation requires an argument of type `UpdateServiceOrderStatusVariables`:
const updateServiceOrderStatusVars: UpdateServiceOrderStatusVariables = {
  id: ..., 
  data: ..., 
};

// Call the `updateServiceOrderStatus()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateServiceOrderStatus(updateServiceOrderStatusVars);
// Variables can be defined inline as well.
const { data } = await updateServiceOrderStatus({ id: ..., data: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateServiceOrderStatus(dataConnect, updateServiceOrderStatusVars);

console.log(data.serviceOrder_update);

// Or, you can use the `Promise` API.
updateServiceOrderStatus(updateServiceOrderStatusVars).then((response) => {
  const data = response.data;
  console.log(data.serviceOrder_update);
});
```

### Using `UpdateServiceOrderStatus`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateServiceOrderStatusRef, UpdateServiceOrderStatusVariables } from '@dataconnect/generated';

// The `UpdateServiceOrderStatus` mutation requires an argument of type `UpdateServiceOrderStatusVariables`:
const updateServiceOrderStatusVars: UpdateServiceOrderStatusVariables = {
  id: ..., 
  data: ..., 
};

// Call the `updateServiceOrderStatusRef()` function to get a reference to the mutation.
const ref = updateServiceOrderStatusRef(updateServiceOrderStatusVars);
// Variables can be defined inline as well.
const ref = updateServiceOrderStatusRef({ id: ..., data: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateServiceOrderStatusRef(dataConnect, updateServiceOrderStatusVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.serviceOrder_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.serviceOrder_update);
});
```

