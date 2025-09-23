import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, MutationRef, MutationPromise } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;




export interface CreateServiceOrderData {
  serviceOrder_insert: ServiceOrder_Key;
}

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

export interface GetServiceOrderVariables {
  id: UUIDString;
}

export interface ListAvailableServicesData {
  services: ({
    id: UUIDString;
    name: string;
    description?: string | null;
    price: number;
    estimatedDuration?: number | null;
  } & Service_Key)[];
}

export interface ServiceOrderItem_Key {
  id: UUIDString;
  __typename?: 'ServiceOrderItem_Key';
}

export interface ServiceOrder_Key {
  id: UUIDString;
  __typename?: 'ServiceOrder_Key';
}

export interface Service_Key {
  id: UUIDString;
  __typename?: 'Service_Key';
}

export interface UpdateServiceOrderStatusData {
  serviceOrder_update?: ServiceOrder_Key | null;
}

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

export interface Update_Key {
  id: UUIDString;
  __typename?: 'Update_Key';
}

export interface User_Key {
  id: UUIDString;
  __typename?: 'User_Key';
}

interface CreateServiceOrderRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateServiceOrderVariables): MutationRef<CreateServiceOrderData, CreateServiceOrderVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateServiceOrderVariables): MutationRef<CreateServiceOrderData, CreateServiceOrderVariables>;
  operationName: string;
}
export const createServiceOrderRef: CreateServiceOrderRef;

export function createServiceOrder(vars: CreateServiceOrderVariables): MutationPromise<CreateServiceOrderData, CreateServiceOrderVariables>;
export function createServiceOrder(dc: DataConnect, vars: CreateServiceOrderVariables): MutationPromise<CreateServiceOrderData, CreateServiceOrderVariables>;

interface ListAvailableServicesRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListAvailableServicesData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListAvailableServicesData, undefined>;
  operationName: string;
}
export const listAvailableServicesRef: ListAvailableServicesRef;

export function listAvailableServices(): QueryPromise<ListAvailableServicesData, undefined>;
export function listAvailableServices(dc: DataConnect): QueryPromise<ListAvailableServicesData, undefined>;

interface GetServiceOrderRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetServiceOrderVariables): QueryRef<GetServiceOrderData, GetServiceOrderVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetServiceOrderVariables): QueryRef<GetServiceOrderData, GetServiceOrderVariables>;
  operationName: string;
}
export const getServiceOrderRef: GetServiceOrderRef;

export function getServiceOrder(vars: GetServiceOrderVariables): QueryPromise<GetServiceOrderData, GetServiceOrderVariables>;
export function getServiceOrder(dc: DataConnect, vars: GetServiceOrderVariables): QueryPromise<GetServiceOrderData, GetServiceOrderVariables>;

interface UpdateServiceOrderStatusRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateServiceOrderStatusVariables): MutationRef<UpdateServiceOrderStatusData, UpdateServiceOrderStatusVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateServiceOrderStatusVariables): MutationRef<UpdateServiceOrderStatusData, UpdateServiceOrderStatusVariables>;
  operationName: string;
}
export const updateServiceOrderStatusRef: UpdateServiceOrderStatusRef;

export function updateServiceOrderStatus(vars: UpdateServiceOrderStatusVariables): MutationPromise<UpdateServiceOrderStatusData, UpdateServiceOrderStatusVariables>;
export function updateServiceOrderStatus(dc: DataConnect, vars: UpdateServiceOrderStatusVariables): MutationPromise<UpdateServiceOrderStatusData, UpdateServiceOrderStatusVariables>;

