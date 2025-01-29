import { ApiError } from "./error";

export async function fetchData<T>(url: string): Promise<T> {
  const response = await fetch(url);

  if (!response.ok) {
    throw new ApiError(response.status, `API Error: ${response.statusText}`);
  }

  return response.json();
}

export async function fetchDataWithAuth<T>(
  url: string,
  token: string,
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
