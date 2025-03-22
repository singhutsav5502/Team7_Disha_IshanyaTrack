import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios'

interface AuthState {
  isAuthenticated: boolean
  userType: number | null
  userId: string | null
  loading: boolean
  error: string | null
}

const initialState: AuthState = {
  isAuthenticated: false,
  userType: null,
  userId: null,
  loading: false,
  error: null
}

export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ id, password }: { id: string, password: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post('/login', { Id: id, pwd: password })
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.Error || 'Login failed')
    }
  }
)

export const verifyAuth = createAsyncThunk(
  'auth/verify',
  async (_, { getState, rejectWithValue }) => {
    const state = getState() as { auth: AuthState }
    if (state.auth.isAuthenticated && state.auth.userId && state.auth.userType !== null) {
      return { 
        Authenticated: true, 
        Type: state.auth.userType, 
        userId: state.auth.userId 
      }
    }
    return rejectWithValue('Not authenticated')
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.isAuthenticated = false
      state.userType = null
      state.userId = null
    },
    setAuthState: (state, action: PayloadAction<Partial<AuthState>>) => {
      Object.assign(state, action.payload)
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false
        state.isAuthenticated = action.payload.Authenticated
        state.userType = action.payload.Type
        state.userId = action.payload.Id
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(verifyAuth.fulfilled, (state, action) => {
        state.isAuthenticated = action.payload.Authenticated
        state.userType = action.payload.Type
        state.userId = action.payload.userId
      })
      .addCase(verifyAuth.rejected, (state) => {
        state.isAuthenticated = false
        state.userType = null
        state.userId = null
      })
  }
})

export const { logout, setAuthState } = authSlice.actions
export default authSlice.reducer

export const getIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated
export const getUserType = (state: { auth: AuthState }) => state.auth.userType
export const getUserId = (state: { auth: AuthState }) => state.auth.userId
