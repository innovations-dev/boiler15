/**
 * Custom error class for API-related errors
 * @see ApiError
 */
import { ApiError } from "../api/error";
import { API_ERROR_CODES } from "../schemas/api-types";

/**
 * Fetches data from a given URL with type safety
 *
 * @template T - The expected return type of the API response
 * @param {string} url - The URL to fetch data from
 * @returns {Promise<T>} A promise that resolves to the typed response data
 * @throws {ApiError} When the response is not OK (status >= 400)
 *
 * @example
 * ```typescript
 * interface User {
 *   id: string;
 *   name: string;
 * }
 *
 * // Fetch a single user
 * const user = await fetchData<User>('/api/users/123');
 * ```
 */
export async function fetchData<T>(url: string): Promise<T> {
  const response = await fetch(url);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new ApiError(
      errorData.message || `API Error: ${response.statusText}`,
      errorData.code || API_ERROR_CODES.INTERNAL_SERVER_ERROR,
      response.status
    );
  }

  const data = await response.json();
  return data;
}

/**
 * Fetches data from a given URL with authentication
 *
 * @template T - The expected return type of the API response
 * @param {string} url - The URL to fetch data from
 * @param {string} token - The authentication token to use
 * @returns {Promise<T>} A promise that resolves to the typed response data
 * @throws {ApiError} When the response is not OK (status >= 400)
 *
 * @example
 * ```typescript
 * interface ProtectedData {
 *   secretKey: string;
 * }
 *
 * // Fetch protected data with auth token
 * const data = await fetchDataWithAuth<ProtectedData>('/api/protected', 'your-auth-token');
 * ```
 */
export async function fetchDataWithAuth<T>(
  url: string,
  token: string
): Promise<T> {
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return fetchData(response.toString());
}

/*
  USAGE:

// 1. Create custom hooks for your queries (hooks/use-data.ts)
import { useQuery } from '@tanstack/react-query'
import { fetchData } from '../lib/api-utils'

interface DataType {
  id: number
  title: string
}

export function useData(id: string) {
  return useQuery({
    queryKey: ['data', id],
    queryFn: () => fetchData<DataType>(`/api/data/${id}`),
  })
}

// 2. Usage example in a component (app/[id]/page.tsx)
'use client'

import { useData } from '@/hooks/use-data'
import { Suspense } from 'react'

function DataComponent({ id }: { id: string }) {
  const { data, isLoading, error } = useData(id)

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>
  
  return <div>{data?.title}</div>
}

export default function Page({ params }: { params: { id: string } }) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DataComponent id={params.id} />
    </Suspense>
  )
}

// 3. For mutations, create custom hooks (hooks/use-mutations.ts)
import { useMutation, useQueryClient } from '@tanstack/react-query'

interface UpdateDataType {
  id: string
  title: string
}

async function updateData(data: UpdateDataType) {
  const response = await fetch(`/api/data/${data.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  
  if (!response.ok) {
    throw new ApiError(response.status, 'Failed to update data')
  }
  
  return response.json()
}

export function useUpdateData() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: updateData,
    onSuccess: (data, variables) => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['data', variables.id] })
    },
  })
}

*/
