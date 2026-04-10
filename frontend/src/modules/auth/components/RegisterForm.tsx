import { useState } from "react";
import { InputText } from "primereact/inputtext";
import { useRegister } from "../hooks/auth.hook";

export default function RegisterForm() {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const {
    register,
    handleSubmit,
    handleRegister,
    isRegistering: isRegistrationSubmitting,
    formState: { errors: registrationFieldErrors },
  } = useRegister();

  return (
    <form
      onSubmit={handleSubmit(handleRegister)}
      className="flex flex-col gap-2"
    >
      {/* Username field */}
      <div className="flex flex-col gap-1">
        <div
          className={`flex items-center gap-2 bg-bg-page border rounded-[6px] px-3 py-[7px] transition-colors focus-within:border-accent ${
            registrationFieldErrors.username
              ? "border-danger"
              : "border-border-strong"
          }`}
        >
          <i className="text-text-dim text-xs pi pi-user shrink-0" />
          <InputText
            {...register("username")}
            className="flex-1 min-w-0 text-xs"
            placeholder="Username"
            autoComplete="username"
          />
        </div>
        {registrationFieldErrors.username && (
          <span className="flex items-center gap-1 text-[10px] text-danger">
            <i className="text-[9px] pi pi-exclamation-circle" />
            {registrationFieldErrors.username.message}
          </span>
        )}
      </div>

      {/* Email field */}
      <div className="flex flex-col gap-1">
        <div
          className={`flex items-center gap-2 bg-bg-page border rounded-[6px] px-3 py-[7px] transition-colors focus-within:border-accent ${
            registrationFieldErrors.email
              ? "border-danger"
              : "border-border-strong"
          }`}
        >
          <i className="text-text-dim text-xs pi pi-envelope shrink-0" />
          <InputText
            {...register("email")}
            className="flex-1 min-w-0 text-xs"
            placeholder="Email address"
            autoComplete="email"
          />
        </div>
        {registrationFieldErrors.email && (
          <span className="flex items-center gap-1 text-[10px] text-danger">
            <i className="text-[9px] pi pi-exclamation-circle" />
            {registrationFieldErrors.email.message}
          </span>
        )}
      </div>

      {/* Password field */}
      <div className="flex flex-col gap-1">
        <div
          className={`flex items-center gap-2 bg-bg-page border rounded-[6px] px-3 py-[7px] transition-colors focus-within:border-accent ${
            registrationFieldErrors.password
              ? "border-danger"
              : "border-border-strong"
          }`}
        >
          <i className="text-text-dim text-xs pi pi-lock shrink-0" />
          <InputText
            {...register("password")}
            type={isPasswordVisible ? "text" : "password"}
            className="flex-1 min-w-0 text-xs"
            placeholder="Password (min 6 characters)"
            autoComplete="new-password"
          />
          <button
            type="button"
            onClick={() => setIsPasswordVisible((prev) => !prev)}
            className="bg-transparent p-0 border-none text-text-dim hover:text-text-muted transition-colors cursor-pointer shrink-0"
            aria-label={isPasswordVisible ? "Hide password" : "Show password"}
          >
            <i
              className={`pi text-xs ${isPasswordVisible ? "pi-eye-slash" : "pi-eye"}`}
            />
          </button>
        </div>
        {registrationFieldErrors.password && (
          <span className="flex items-center gap-1 text-[10px] text-danger">
            <i className="text-[9px] pi pi-exclamation-circle" />
            {registrationFieldErrors.password.message}
          </span>
        )}
      </div>

      {/* Confirm Password field */}
      <div className="flex flex-col gap-1">
        <div
          className={`flex items-center gap-2 bg-bg-page border rounded-[6px] px-3 py-[7px] transition-colors focus-within:border-accent ${
            registrationFieldErrors.confirmPassword
              ? "border-danger"
              : "border-border-strong"
          }`}
        >
          <i className="text-text-dim text-xs pi pi-lock shrink-0" />
          <InputText
            {...register("confirmPassword")}
            type={isPasswordVisible ? "text" : "password"}
            className="flex-1 min-w-0 text-xs"
            placeholder="Confirm password"
            autoComplete="new-password"
          />
        </div>
        {registrationFieldErrors.confirmPassword && (
          <span className="flex items-center gap-1 text-[10px] text-danger">
            <i className="text-[9px] pi pi-exclamation-circle" />
            {registrationFieldErrors.confirmPassword.message}
          </span>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isRegistrationSubmitting}
        className="flex justify-center items-center gap-1.5 bg-accent hover:opacity-90 disabled:opacity-60 mt-1 py-2 border-none rounded-[6px] w-full font-medium text-bg-page text-xs transition-opacity cursor-pointer disabled:cursor-not-allowed"
      >
        {isRegistrationSubmitting ? (
          <>
            <i className="text-xs pi pi-spin pi-spinner" />
            Creating account...
          </>
        ) : (
          "Create account"
        )}
      </button>
    </form>
  );
}
