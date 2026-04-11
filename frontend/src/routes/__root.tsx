import PageNotFound from "@/pages/not-found.page";
import { ErrorBoundary } from "@/shared/components/ErrorBoundary";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

// Context type
interface RouterContext {
  authentication: {
    isAuthenticated: boolean;
    user: { id: number; email: string } | null;
  };
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: () => (
    <>
      <ErrorBoundary>
        <Outlet />
        {/* <TanStackRouterDevtools /> */}
      </ErrorBoundary>
    </>
  ),
  notFoundComponent: () => (
    <ErrorBoundary>
      <PageNotFound />
    </ErrorBoundary>
  ),
});
