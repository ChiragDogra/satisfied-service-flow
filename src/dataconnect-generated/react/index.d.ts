import { CreateServiceOrderData, CreateServiceOrderVariables, ListAvailableServicesData, GetServiceOrderData, GetServiceOrderVariables, UpdateServiceOrderStatusData, UpdateServiceOrderStatusVariables } from '../';
import { UseDataConnectQueryResult, useDataConnectQueryOptions, UseDataConnectMutationResult, useDataConnectMutationOptions} from '@tanstack-query-firebase/react/data-connect';
import { UseQueryResult, UseMutationResult} from '@tanstack/react-query';
import { DataConnect } from 'firebase/data-connect';
import { FirebaseError } from 'firebase/app';


export function useCreateServiceOrder(options?: useDataConnectMutationOptions<CreateServiceOrderData, FirebaseError, CreateServiceOrderVariables>): UseDataConnectMutationResult<CreateServiceOrderData, CreateServiceOrderVariables>;
export function useCreateServiceOrder(dc: DataConnect, options?: useDataConnectMutationOptions<CreateServiceOrderData, FirebaseError, CreateServiceOrderVariables>): UseDataConnectMutationResult<CreateServiceOrderData, CreateServiceOrderVariables>;

export function useListAvailableServices(options?: useDataConnectQueryOptions<ListAvailableServicesData>): UseDataConnectQueryResult<ListAvailableServicesData, undefined>;
export function useListAvailableServices(dc: DataConnect, options?: useDataConnectQueryOptions<ListAvailableServicesData>): UseDataConnectQueryResult<ListAvailableServicesData, undefined>;

export function useGetServiceOrder(vars: GetServiceOrderVariables, options?: useDataConnectQueryOptions<GetServiceOrderData>): UseDataConnectQueryResult<GetServiceOrderData, GetServiceOrderVariables>;
export function useGetServiceOrder(dc: DataConnect, vars: GetServiceOrderVariables, options?: useDataConnectQueryOptions<GetServiceOrderData>): UseDataConnectQueryResult<GetServiceOrderData, GetServiceOrderVariables>;

export function useUpdateServiceOrderStatus(options?: useDataConnectMutationOptions<UpdateServiceOrderStatusData, FirebaseError, UpdateServiceOrderStatusVariables>): UseDataConnectMutationResult<UpdateServiceOrderStatusData, UpdateServiceOrderStatusVariables>;
export function useUpdateServiceOrderStatus(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateServiceOrderStatusData, FirebaseError, UpdateServiceOrderStatusVariables>): UseDataConnectMutationResult<UpdateServiceOrderStatusData, UpdateServiceOrderStatusVariables>;
