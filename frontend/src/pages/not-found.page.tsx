import { useNavigate } from "@tanstack/react-router";

const PageNotFound = () => {
  const navigate = useNavigate({
    from: "/not-found",
  });
  return (
    <div className="flex flex-col justify-center items-center bg-revampThemeBg min-h-screen">
      <div className="space-y-4 bg-revampHoverBg shadow-md p-6 rounded-lg w-full max-w-lg">
        <div className="space-y-3 text-center">
          <svg
            className="mx-auto w-12 h-12 text-revampTextPrimary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
            />
          </svg>
          <h1 className="text-revampTextPrimary text-2xl ao-header-variant-1">
            Page Not Found
          </h1>
          <h3 className="text-revampTextSecondary text-sm ao-header-variant-3">
            The page you are looking for does not exist.
          </h3>
        </div>
        <button
          onClick={() => {
            navigate({ to: "/" });
          }}
          className="flex justify-center items-center bg-revampPrimaryBg hover:bg-revampHoverBg px-4 py-2 rounded-lg w-full font-semibold text-white"
        >
          Go to Home
        </button>
      </div>
    </div>
  );
};

export default PageNotFound;
