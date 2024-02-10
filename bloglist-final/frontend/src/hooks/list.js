import { useQuery } from '@tanstack/react-query'
//import { useState } from 'react'

export const useList = (key, backendService) => {
  console.log('test')

  const { status, data, error } = useQuery({
    queryKey: [key],
    queryFn: backendService.getAll,
    refetchOnWindowFocus: false,
    retry: 1,
  })
  return { status, data, error }
}
