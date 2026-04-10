import "./App.css";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { routeTree } from "../routeTree.gen";
import { useAuthStore } from "./shared/store/useAuthStore";

// Create a new router instance
const router = createRouter({
  routeTree,
  context: {
    authentication: undefined!, // This will be set in the RouterProvider as initial value
  },
});

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

function App() {
  const { isAuthenticated, user } = useAuthStore();
  return (
    <RouterProvider
      router={router}
      context={{
        authentication: { isAuthenticated, user },
      }}
    />
  );
}

export default App;
