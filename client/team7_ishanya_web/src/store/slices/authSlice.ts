import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { fetchProgramData , login } from '../../api'

interface AuthState {
  isAuthenticated: boolean
  userType: number | null
  userId: string | null
  loading: boolean
  error: string | null
  programData: any
}

const initialState: AuthState = {
  isAuthenticated: false,
  userType: null,
  userId: null,
  loading: false,
  error: null,
  programData: [],
}

export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ id, password }: { id: string, password: string }, { rejectWithValue }) => {
    try {
      const response = await login(id, password);
      const programData = await fetchProgramData();
      return { ...response, programData };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.Error || 'Login failed');
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
export const refetchProgramData = createAsyncThunk(
  'auth/fetchProgramData',
  async (_, { rejectWithValue }) => {
    try {
      const programData = await fetchProgramData();
      return programData;
    } catch (error) {
      return rejectWithValue('Failed to fetch program data');
    }
  }
);
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
        state.isAuthenticated = true;
        state.userType = action.payload.Type;
        state.userId = action.payload.id;
        state.programData = action.payload.programData;
        state.error = null;
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
      .addCase(refetchProgramData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(refetchProgramData.fulfilled, (state, action) => {
        state.loading = false;
        state.programData = action.payload;
        state.error = null;
      })
      .addCase(refetchProgramData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
})

export const { logout, setAuthState } = authSlice.actions
export default authSlice.reducer

export const getIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated
export const getUserType = (state: { auth: AuthState }) => state.auth.userType
export const getUserId = (state: { auth: AuthState }) => state.auth.userId
export const getProgramData = (state: { auth: AuthState }) => state.auth.programData;
export const getProgramMapping = (state: { auth: AuthState }) => {
  const programData = state.auth.programData || [];
  if (!Array.isArray(programData)) {
    return []; 
  }
  return state.auth.programData.reduce((mapping, program) => {
    mapping[program.Program_ID] = program.Program_Name;
    return mapping;
  }, {} as Record<string, string>);
};