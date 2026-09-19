import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "react-hot-toast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { persistQueryClient } from "@tanstack/react-query-persist-client";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import AppLayout from "./ui/AppLayout";
import Login from "./features/login/Login";
import Register from "./features/register/Register";
import HomePage from "./ui/HomePage";
import Editor from "./features/editor/Index";
import UserProfile from "./features/userDashboard/UserProfile";
import Error from "./ui/Error";
import ProtectedRoute from "./ui/ProtectedRoute";
import PublicRoute from "./ui/PublicRoute";
import Learn from "./features/learn/Index";
import NewsFeed from "./features/community/NewsFeed";

const persister = createSyncStoragePersister({
  storage: window.localStorage,
  key: "react-query-cache",
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 3,
      retry: 1,
      gcTime: 1000 * 60 * 30,
    },
  },
});

persistQueryClient({
  queryClient,
  persister,
});
const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    errorElement: <Error />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "/login",
        element: (
          <PublicRoute>
            <Login />
          </PublicRoute>
        ),
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/editor",
        element: <Editor />,
      },
      {
        path: "/editor/:id",
        element:(
          <ProtectedRoute>
         <Editor />
        </ProtectedRoute>)
      },
      {
        path: "/user/:id",

        element: (
          <ProtectedRoute>
            <UserProfile />
          </ProtectedRoute>
        ),
      },
      {
        path: "/learn",

        element: (
          <ProtectedRoute>
            <Learn />
          </ProtectedRoute>
        ),
      },
      {
        path: "/user/:id/newsfeed",
        element: (
          <ProtectedRoute>
            <NewsFeed />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

function App() {
  return (
    <>
      <Toaster position="top-center" />
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools initialIsOpen={false} />
        <RouterProvider router={router} />
      </QueryClientProvider>
    </>
  );
}
export default App;
