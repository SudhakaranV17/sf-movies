import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { InputText } from "primereact/inputtext";
import type { z } from "zod";
import { LoginSchema } from "../helpers/auth.helper";
import { useLogin } from "../hooks/auth.hook";

type LoginFormValues = z.infer<typeof LoginSchema>;

export default function LoginForm() {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const { mutate: submitLoginCredentials, isPending: isLoginSubmitting } =
    useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors: loginFieldErrors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(LoginSchema),
  });

  const onLoginFormSubmit = (formValues: LoginFormValues) => {
    submitLoginCredentials(formValues);
  };

  return (
    <form
      onSubmit={handleSubmit(onLoginFormSubmit)}
      className="flex flex-col gap-2"
    >
      {/* Email field */}
      <div className="flex flex-col gap-1">
        <div
          className={`flex items-center gap-2 bg-bg-page border rounded-[6px] px-3 py-[7px] transition-colors focus-within:border-accent ${
            loginFieldErrors.email ? "border-danger" : "border-border-strong"
          }`}
        >
          <i className="pi pi-envelope text-xs text-text-dim shrink-0" />
          <InputText
            {...register("email")}
            className="flex-1 min-w-0 text-xs"
            placeholder="Email address"
            autoComplete="email"
          />
        </div>
        {loginFieldErrors.email && (
          <span className="text-[10px] text-danger flex items-center gap-1">
            <i className="pi pi-exclamation-circle text-[9px]" />
            {loginFieldErrors.email.message}
          </span>
        )}
      </div>

      {/* Password field */}
      <div className="flex flex-col gap-1">
        <div
          className={`flex items-center gap-2 bg-bg-page border rounded-[6px] px-3 py-[7px] transition-colors focus-within:border-accent ${
            loginFieldErrors.password ? "border-danger" : "border-border-strong"
          }`}
        >
          <i className="pi pi-lock text-xs text-text-dim shrink-0" />
          <InputText
            {...register("password")}
            type={isPasswordVisible ? "text" : "password"}
            className="flex-1 min-w-0 text-xs"
            placeholder="Password"
            autoComplete="current-password"
          />
          <button
            type="button"
            onClick={() => setIsPasswordVisible((prev) => !prev)}
            className="bg-transparent border-none cursor-pointer p-0 text-text-dim hover:text-text-muted transition-colors shrink-0"
            aria-label={isPasswordVisible ? "Hide password" : "Show password"}
          >
            <i
              className={`pi text-xs ${isPasswordVisible ? "pi-eye-slash" : "pi-eye"}`}
            />
          </button>
        </div>
        {loginFieldErrors.password && (
          <span className="text-[10px] text-danger flex items-center gap-1">
            <i className="pi pi-exclamation-circle text-[9px]" />
            {loginFieldErrors.password.message}
          </span>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isLoginSubmitting}
        className="w-full bg-accent border-none rounded-[6px] py-2 text-xs font-medium text-bg-page cursor-pointer hover:opacity-90 transition-opacity mt-1 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
      >
        {isLoginSubmitting ? (
          <>
            <i className="pi pi-spin pi-spinner text-xs" />
            Signing in...
          </>
        ) : (
          "Sign in"
        )}
      </button>
    </form>
  );
}
