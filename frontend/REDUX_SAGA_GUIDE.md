# Hướng Dẫn Redux + Redux Saga Architecture

## 📚 Cấu Trúc Thư Mục

```
frontend/src/
├── redux/                          # ⭐ Global Redux Store
│   ├── store.ts                   # Configure store
│   ├── reducer.ts                 # Combine tất cả reducers
│   └── saga.ts                    # Combine tất cả sagas
│
└── features/                       # ⭐ Features (theo domain)
    └── users/
        ├── api/                    # API calls & GraphQL
        │   ├── index.ts           # Export API functions
        │   ├── queries.ts         # GraphQL queries
        │   └── types.ts           # User types
        │
        ├── redux/                  # Redux logic cho Users
        │   └── slice.ts           # ⭐ CHỈ 1 SLICE cho feature
        │
        ├── saga/                   # Saga logic cho Users
        │   ├── index.ts           # Combine user sagas
        │   └── fetch-users.ts     # Individual saga
        │
        ├── components/            # UI components
        └── pages/                 # Page components
```

## 🔄 Luồng Dữ Liệu (Data Flow)

```
Component
   ↓ dispatch(action)
Redux Store
   ↓ trigger
Saga (Side Effect)
   ↓ call API
Apollo GraphQL
   ↓ return data
Saga
   ↓ put(successAction)
Redux Store (update state)
   ↓ useSelector
Component (re-render)
```

## 📝 Chi Tiết Từng File

### 1️⃣ **slice.ts** - Trái Tim của Feature

```typescript
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",              // Tên prefix cho actions
  initialState: {...},       // State ban đầu
  reducers: {                // Định nghĩa actions & reducers
    fetchUsersRequested(state, action) {
      // Logic cập nhật state
    },
  },
});

export const userActions = userSlice.actions;  // Export để dùng
export default userSlice.reducer;              // Export để kết nối store
```

**Quy tắc:**

- ✅ MỘT feature = MỘT slice
- ✅ Tất cả actions/reducers của feature ở đây
- ❌ KHÔNG tách reducer ra file riêng

### 2️⃣ **saga/fetch-users.ts** - Xử Lý Side Effects

```typescript
import { call, put, takeLatest } from "redux-saga/effects";
import { userActions } from "../redux/slice";

// Worker saga - Thực hiện công việc
function* fetchUsersSaga(action) {
  try {
    const users = yield call(fetchUsers, action.payload);
    yield put(userActions.fetchUsersSucceeded(users));
  } catch (error) {
    yield put(userActions.fetchUsersFailed(error.message));
  }
}

// Watcher saga - Lắng nghe actions
export function* watchFetchUsers() {
  yield takeLatest(
    userActions.fetchUsersRequested.type, // Lắng nghe action này
    fetchUsersSaga // Gọi worker saga
  );
}
```

**Các effect quan trọng:**

- `call()` - Gọi function (API, etc.)
- `put()` - Dispatch action vào Redux
- `takeLatest()` - Chỉ xử lý request mới nhất
- `takeEvery()` - Xử lý tất cả requests
- `select()` - Lấy data từ Redux state

### 3️⃣ **saga/index.ts** - Combine User Sagas

```typescript
import { all, fork } from "redux-saga/effects";
import { watchFetchUsers } from "./fetch-users";

export default function* userSaga() {
  yield all([
    fork(watchFetchUsers),
    // fork(watchCreateUser),
    // fork(watchUpdateUser),
  ]);
}
```

### 4️⃣ **redux/reducer.ts** - Combine All Features

```typescript
import { combineReducers } from "@reduxjs/toolkit";
import userReducer from "@/features/users/redux/slice";

const reducer = combineReducers({
  user: userReducer, // state.user
  // team: teamReducer, // state.team
});
```

### 5️⃣ **redux/saga.ts** - Root Saga

```typescript
import { all, fork } from "redux-saga/effects";
import userSaga from "@/features/users/saga";

export default function* rootSaga() {
  yield all([
    fork(userSaga),
    // fork(teamSaga),
  ]);
}
```

### 6️⃣ **redux/store.ts** - Configure Store

```typescript
import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import reducer from "./reducer";
import saga from "./saga";

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: false, // Tắt thunk, dùng saga
      serializableCheck: false, // Tắt check cho saga
    }).concat(sagaMiddleware),
});

sagaMiddleware.run(saga); // Chạy root saga
```

## 💡 Cách Sử Dụng Trong Component

```typescript
import { useDispatch, useSelector } from "react-redux";
import { userActions } from "@/features/users/redux/slice";
import type { RootState } from "@/redux/store";

function UserList() {
  const dispatch = useDispatch();

  // Lấy data từ Redux
  const {
    data: users,
    loading,
    error,
  } = useSelector((state: RootState) => state.user);

  // Trigger fetch
  useEffect(() => {
    dispatch(userActions.fetchUsersRequested("ATHLETE"));
  }, [dispatch]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <ul>
      {users.map((user) => (
        <li>{user.name}</li>
      ))}
    </ul>
  );
}
```

## 🎯 Best Practices

### ✅ NÊN:

1. **1 Feature = 1 Slice** - Đơn giản, dễ maintain
2. **Tất cả logic trong slice.ts** - Không tách ra nhiều file
3. **Saga xử lý async** - API calls, side effects
4. **Type safety** - Dùng TypeScript đầy đủ
5. **Normalize state** - Tránh duplicate data

### ❌ KHÔNG NÊN:

1. Tách reducer ra file riêng (không cần thiết)
2. Tạo nhiều slices cho 1 feature
3. Xử lý async trong reducer (dùng saga)
4. Dùng `any` type
5. Nested state quá sâu

## 🔍 Khi Nào Thêm Feature Mới?

```
features/
├── users/          # User management
│   ├── redux/slice.ts
│   └── saga/index.ts
│
├── teams/          # Team management
│   ├── redux/slice.ts
│   └── saga/index.ts
│
└── auth/           # Authentication
    ├── redux/slice.ts
    └── saga/index.ts
```

Mỗi feature độc lập, dễ scale!

## 🚀 Ví Dụ Hoàn Chỉnh

Xem các file đã được refactor:

- [slice.ts](frontend/src/features/users/redux/slice.ts) - Redux logic
- [saga/index.ts](frontend/src/features/users/saga/index.ts) - Combine sagas
- [saga/fetch-users.ts](frontend/src/features/users/saga/fetch-users.ts) - Fetch saga
- [Table.tsx](frontend/src/features/users/pages/Table.tsx) - Component usage
