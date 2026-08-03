import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { getSupabaseEnv } from "@/lib/supabase/env";

const PROTECTED_PATH_PREFIX = "/dashboard";

export default async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  let env;
  try {
    env = getSupabaseEnv();
  } catch {
    // Variables d'environnement absentes : on ne bloque pas l'application (pas encore
    // de données sensibles à protéger), mais la session n'est ni rafraîchie ni vérifiée.
    console.warn(
      "[proxy] Supabase environment variables are not configured; skipping auth check.",
    );
    return response;
  }

  const supabase = createServerClient(env.url, env.publishableKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
      },
    },
  });

  // Toujours utiliser getUser() (revalide le token auprès de Supabase) plutôt que
  // getSession() (ne fait que lire le cookie) pour une décision de sécurité fiable.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isProtectedRoute = request.nextUrl.pathname.startsWith(PROTECTED_PATH_PREFIX);

  if (isProtectedRoute && !user) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
