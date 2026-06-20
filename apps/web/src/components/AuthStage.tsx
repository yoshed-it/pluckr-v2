"use client";

/**
 * Mirrors the Swift authentication stack with one calm paper form that
 * swaps between sign in, sign up, and forgot-password states.
 */
import { PaperPanel } from "./PaperPanel";
import { BrandHero } from "./BrandHero";

export type AuthMode = "signin" | "signup" | "forgot";

type AuthStageProps = {
  mode: AuthMode;
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  error: string | null;
  notice: string | null;
  isSubmitting: boolean;
  onModeChange: (mode: AuthMode) => void;
  onFullNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onConfirmPasswordChange: (value: string) => void;
  onSubmit: () => void;
};

function getAuthCopy(mode: AuthMode) {
  switch (mode) {
    case "signup":
      return {
        title: "Create Account",
        subtitle: "Join Pluckr",
        buttonLabel: "Create Account"
      };
    case "forgot":
      return {
        title: "Reset Password",
        subtitle: "Enter your email and we will send a reset link.",
        buttonLabel: "Send Reset Link"
      };
    case "signin":
    default:
      return {
        title: "Pluckr",
        subtitle: "Clinical Journal",
        buttonLabel: "Sign In"
      };
  }
}

export function AuthStage({
  mode,
  fullName,
  email,
  password,
  confirmPassword,
  error,
  notice,
  isSubmitting,
  onModeChange,
  onFullNameChange,
  onEmailChange,
  onPasswordChange,
  onConfirmPasswordChange,
  onSubmit
}: AuthStageProps) {
  const copy = getAuthCopy(mode);
  const isSignIn = mode === "signin";
  const isSignUp = mode === "signup";
  const isForgot = mode === "forgot";
  const isDisabled =
    isSubmitting ||
    (isSignIn && (!email.trim() || !password)) ||
    (isSignUp &&
      (!fullName.trim() || !email.trim() || !password || !confirmPassword)) ||
    (isForgot && !email.trim());

  return (
    <main className="swift-shell">
      <div className="stage-column">
        <BrandHero title={copy.title} subtitle={copy.subtitle} />

        <PaperPanel className="auth-panel">
          <div className="form-stack">
            {isSignUp ? (
              <label className="field-stack">
                <span className="field-label">Full Name</span>
                <input
                  className="swift-field"
                  type="text"
                  placeholder="Full Name"
                  autoComplete="name"
                  value={fullName}
                  onChange={(event) => onFullNameChange(event.target.value)}
                />
              </label>
            ) : null}

            <label className="field-stack">
              <span className="field-label">Email</span>
              <input
                className="swift-field"
                type="email"
                placeholder="Email"
                autoComplete="email"
                value={email}
                onChange={(event) => onEmailChange(event.target.value)}
              />
            </label>

            {!isForgot ? (
              <label className="field-stack">
                <span className="field-label">Password</span>
                <input
                  className="swift-field"
                  type="password"
                  placeholder="Password"
                  autoComplete={isSignUp ? "new-password" : "current-password"}
                  value={password}
                  onChange={(event) => onPasswordChange(event.target.value)}
                />
              </label>
            ) : null}

            {isSignUp ? (
              <label className="field-stack">
                <span className="field-label">Confirm Password</span>
                <input
                  className="swift-field"
                  type="password"
                  placeholder="Confirm Password"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(event) =>
                    onConfirmPasswordChange(event.target.value)
                  }
                />
              </label>
            ) : null}

            {error ? <p className="message-banner message-error">{error}</p> : null}
            {notice ? (
              <p className="message-banner message-success">{notice}</p>
            ) : null}

            <button
              className="swift-button swift-button-primary"
              type="button"
              disabled={isDisabled}
              onClick={onSubmit}
            >
              {isSubmitting ? "Working..." : copy.buttonLabel}
            </button>

            {isSignIn ? (
              <div className="inline-actions">
                <button
                  className="swift-link-button"
                  type="button"
                  onClick={() => onModeChange("signup")}
                >
                  Create Account
                </button>
                <button
                  className="swift-link-button"
                  type="button"
                  onClick={() => onModeChange("forgot")}
                >
                  Forgot Password?
                </button>
              </div>
            ) : (
              <div className="single-action-row">
                <button
                  className="swift-link-button"
                  type="button"
                  onClick={() => onModeChange("signin")}
                >
                  Back to Login
                </button>
              </div>
            )}
          </div>
        </PaperPanel>
      </div>
    </main>
  );
}
