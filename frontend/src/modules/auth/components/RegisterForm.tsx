import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { InputText } from "primereact/inputtext";
import type { z } from "zod";
import { RegisterSchema } from "../helpers/auth.helper";
import { useRegister } from "../hooks/auth.hook";

type RegisterFormValues = z.infer<typeof RegisterSchema>;

export default function RegisterForm() {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const { mutate: submitRegistrationCredentials, isPending: isRegistrationSubmitting } =
    useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors: registrationFieldErrors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(RegisterSchema),
  });

  const onRegistrationFormSubmit = (formValues: RegisterFormValues) => {
    submitRegistrationCredentials(formValues);
  };

  return (
    <form
      onSubmit={handleSubmit(onRegistrationFormSubmit)}
      className="flex flex-col gap-2"
    >
      {/* Email field */}
      <div className="flex flex-col gap-1">
        <div
          className={`flex items-center gap-2 bg-bg-page border rounded-[6px] px-3 py-[7px] transition-colors focus-within:border-accent ${
            registrationFieldErrors.email
              ? "border-danger"
              : "border-border-strong"
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
        {registrationFieldErrors.email && (
          <span className="text-[10px] text-danger flex items-center gap-1">
            <i className="pi pi-exclamation-circle text-[9px]" />
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
          <i className="pi pi-lock text-xs text-text-dim shrink-0" />
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
            className="bg-transparent border-none cursor-pointer p-0 text-text-dim hover:text-text-muted transition-colors shrink-0"
            aria-label={isPasswordVisible ? "Hide password" : "Show password"}
          >
            <i
              className={`pi text-xs ${isPasswordVisible ? "pi-eye-slash" : "pi-eye"}`}
            />
          </button>
        </div>
        {registrationFieldErrors.password && (
          <span className="text-[10px] text-danger flex items-center gap-1">
            <i className="pi pi-exclamation-circle text-[9px]" />
            {registrationFieldErrors.password.message}
          </span>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isRegistrationSubmitting}
        className="w-full bg-accent border-none rounded-[6px] py-2 text-xs font-medium text-bg-page cursor-pointer hover:opacity-90 transition-opacity mt-1 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
      >
        {isRegistrationSubmitting ? (
          <>
            <i className="pi pi-spin pi-spinner text-xs" />
            Creating account...
          </>
        ) : (
          "Create account"
        )}
      </button>
    </form>
  );
}
