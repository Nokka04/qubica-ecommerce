import { ref, shallowRef, type Ref } from 'vue'
import { isAxiosError } from 'axios'

/** Convert any thrown value into a user-friendly message. */
export function getErrorMessage(err: unknown): string {
  if (isAxiosError(err)) {
    if (err.code === 'ECONNABORTED') return 'The request timed out. Please try again.'
    if (err.response) return `Request failed with status ${err.response.status}.`
    return 'Network error. Please check your connection.'
  }
  return err instanceof Error ? err.message : 'An unexpected error occurred.'
}

interface UseAsyncData<T> {
  data: Ref<T | null>
  loading: Ref<boolean>
  error: Ref<string | null>
  run: (fetcher: () => Promise<T>) => Promise<void>
}

/**
 * Generic async data helper that tracks loading and error state.
 * Keeps components declarative and avoids repeating try/catch boilerplate.
 */
export function useAsyncData<T>(): UseAsyncData<T> {
  const data = shallowRef<T | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function run(fetcher: () => Promise<T>): Promise<void> {
    loading.value = true
    error.value = null
    try {
      data.value = await fetcher()
    } catch (err) {
      error.value = getErrorMessage(err)
      data.value = null
    } finally {
      loading.value = false
    }
  }

  return { data, loading, error, run }
}
