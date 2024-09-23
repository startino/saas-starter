import { ThemeSupa } from "@supabase/auth-ui-shared"
import type { Provider } from "@supabase/supabase-js"

export const oauthProviders = ["github", "google"] as Provider[]

// use the css variables from DaisyUI to style Supabase auth template
export const sharedAppearance = {
  theme: ThemeSupa,
  variables: {
    default: {
      colors: {
        brand: "hsl(var(--primary))",
        brandAccent: "hsl(var(--primary))",
        inputText: "hsl(var(--primary))",
        brandButtonText: "hsl(var(--primary-foreground))",
        messageText: "hsl(var(--foreground))",
        dividerBackground: "hsl(var(--foreground))",
        inputLabelText: "hsl(var(--foreground))",
        defaultButtonText: "hsl(var(--primary-foreground))",
        anchorTextColor: "hsl(var(--foreground))",
      },
      fontSizes: {
        baseInputSize: "16px",
      },
    },
  },
  className: {
    button: "authBtn",
  },
}
