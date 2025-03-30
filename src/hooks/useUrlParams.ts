import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'

export const useUrlParams = () => {
  const router = useRouter()
  const searchParams = useSearchParams()

  const createQueryString = useCallback(
    (params: Record<string, string | null>) => {
      const current = new URLSearchParams(searchParams.toString())
      Object.entries(params).forEach(([key, value]) => {
        if (value === null) {
          current.delete(key)
        } else {
          current.set(key, value)
        }
      })

      return current.toString()
    },
    [searchParams]
  )

  const updateParams = useCallback(
    (params: Record<string, string | null>) => {
      const queryString = createQueryString(params)
      router.push(`?${queryString}`)
    },
    [createQueryString, router]
  )

  const setParam = useCallback(
    (key: string, value: string | null) => {
      updateParams({ [key]: value })
    },
    [updateParams]
  )

  const getParam = useCallback(
    (key: string) => {
      return searchParams.get(key)
    },
    [searchParams]
  )

  return {
    setParam,
    getParam,
    updateParams,
    createQueryString
  }
}
