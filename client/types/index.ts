export interface User {
  username: string,
}
export interface Bill {
  _id: string
  name: string
  category: string
  note?: string
  amount: number
  date: string
  files: Array<{
    url: string
    name: string
    public_id: string
  }>
  user_id: string
  createdAt: string
  updatedAt: string
}

export interface FormData {
  name: string
  category: string
  amount: string
  note: string
  date: string
  files: File[]
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: unknown
}

export interface BillsState {
  bills: Bill[]
  isLoading: boolean
  error: string | null
  analysis: string | null
}

