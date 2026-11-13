<script setup lang="ts">
import { computed } from 'vue'
import { CheckCircle2, Database, FlaskConical, KeyRound, ServerCog, ShieldCheck } from '@lucide/vue'
import CodeBlock from '@/showcase/CodeBlock.vue'
import { useAuth } from '@/composables/useAuth'

const { config } = useAuth()

const driver = computed(() => config.value.driver)
const tokenStorage = computed(() => config.value.token.storage)

const envExample = `# Driver: sanctum-spa | sanctum-token | none
VITE_AUTH_DRIVER=sanctum-spa
VITE_API_BASE_URL=http://localhost:8000

VITE_AUTH_LOGIN_ENDPOINT=/login
VITE_AUTH_LOGOUT_ENDPOINT=/logout
VITE_AUTH_USER_ENDPOINT=/api/user
VITE_AUTH_CSRF_ENDPOINT=/sanctum/csrf-cookie
VITE_AUTH_FORGOT_PASSWORD_ENDPOINT=/forgot-password
VITE_AUTH_RESET_PASSWORD_ENDPOINT=/reset-password

# Token driver only
VITE_AUTH_TOKEN_STORAGE=memory
VITE_AUTH_TOKEN_RESPONSE_PATH=token

# Local simulation (remove for a real backend)
VITE_AUTH_MOCK=false`

const spaEnv = `APP_URL=http://localhost:8000

# Your SPA's dev origin (host:port, no scheme)
SANCTUM_STATEFUL_DOMAINS=localhost:5173,127.0.0.1:5173

# Cookies must be shared by both origins
SESSION_DOMAIN=localhost
SESSION_DRIVER=cookie`

const spaInstall = `composer require laravel/sanctum
php artisan vendor:publish --provider="Laravel\\Sanctum\\SanctumServiceProvider"
php artisan migrate`

const spaMiddleware = `// Laravel 11/12 — bootstrap/app.php
->withMiddleware(function (Middleware $middleware) {
    // Enables cookie-session auth for requests from stateful domains.
    $middleware->statefulApi();
})`

const spaCors = `// config/cors.php
return [
    'paths' => ['api/*', 'sanctum/csrf-cookie', 'login', 'logout'],
    'allowed_origins' => ['http://localhost:5173'],
    'allowed_methods' => ['*'],
    'allowed_headers' => ['*'],
    'supports_credentials' => true,
];`

const spaRoutes = `// routes/web.php — stateful members only
use Illuminate\\Support\\Facades\\Auth;
use Illuminate\\Validation\\ValidationException;

Route::post('/login', function (Request $request) {
    $credentials = $request->validate([
        'email' => ['required', 'email'],
        'password' => ['required'],
    ]);

    if (! Auth::attempt($credentials, $request->boolean('remember'))) {
        throw ValidationException::withMessages([
            'email' => __('auth.failed'), // → HTTP 422
        ]);
    }

    $request->session()->regenerate();

    return response()->noContent(); // 204
});

Route::post('/logout', function (Request $request) {
    Auth::guard('web')->logout();
    $request->session()->invalidate();
    $request->session()->regenerateToken();

    return response()->noContent();
})->middleware('auth');`

const spaUserRoute = `// routes/api.php
use Illuminate\\Http\\Request;

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', fn (Request $request) => $request->user());
});`

const tokenModel = `// app/Models/User.php
use Laravel\\Sanctum\\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens;
}`

const tokenIssue = `// routes/api.php — configurable token-login endpoint
use Illuminate\\Http\\Request;
use Illuminate\\Support\\Facades\\Hash;
use Illuminate\\Validation\\ValidationException;

Route::post('/auth/token', function (Request $request) {
    $credentials = $request->validate([
        'email' => ['required', 'email'],
        'password' => ['required'],
    ]);

    $user = User::where('email', $credentials['email'])->first();

    if (! $user || ! Hash::check($credentials['password'], $user->password)) {
        throw ValidationException::withMessages([
            'email' => __('auth.failed'),
        ]);
    }

    return [
        // Frontend reads this via VITE_AUTH_TOKEN_RESPONSE_PATH
        'token' => $user->createToken(
            $request->input('device_name', 'vue-daisy-spa'),
            ['*'],
            now()->addDays(7),
        )->plainTextToken,
        'user' => $user,
    ];
});`

const tokenLogout = `// Revoke the current access token
Route::post('/logout', function (Request $request) {
    $request->user()->currentAccessToken()->delete();

    return response()->noContent();
})->middleware('auth:sanctum');`

const responsibilitiesFrontend = [
  'Requests the CSRF cookie before stateful login.',
  'Sends credentials; never stores passwords.',
  'Attaches the Bearer token in token mode; sends cookies in SPA mode.',
  'Redirects guests, preserves the intended destination.',
  'Handles 401 (expired session) and 419 (expired CSRF) centrally.',
  'Never reads HttpOnly session cookies or logs tokens.',
]

const responsibilitiesBackend = [
  'Installs Sanctum and enables `statefulApi()` middleware.',
  'Allows the SPA origin with `supports_credentials` in CORS.',
  'Sets `SESSION_DOMAIN` so both origins share the cookie.',
  'Provides `/sanctum/csrf-cookie`, login, logout and user routes.',
  'Uses `HasApiTokens` and issues personal access tokens.',
  'Returns 401 / 419 / 422 with Laravel-standard JSON bodies.',
]
</script>

<template>
  <section class="space-y-6">
    <header class="space-y-2">
      <div class="flex flex-wrap items-center gap-2">
        <h1 class="text-2xl font-bold tracking-tight sm:text-3xl">Backend integration</h1>
        <DzBadge color="primary" variant="outline">{{ driver }}</DzBadge>
        <DzBadge v-if="config.mock" color="warning" variant="soft">
          <FlaskConical class="size-3" aria-hidden="true" />
          simulated backend
        </DzBadge>
      </div>
      <p class="max-w-3xl text-sm text-base-content/70">
        Everything the Laravel side must provide for each authentication driver, and what the
        frontend already handles. Frontend responsibilities are implemented and verified; backend
        items require changes in your Laravel application.
      </p>
    </header>

    <DzAlert v-if="config.mock" color="warning" variant="soft">
      <p class="text-sm font-medium">You are using the simulated backend</p>
      <p class="mt-1 text-xs leading-relaxed">
        Set <code class="rounded bg-base-200 px-1">VITE_AUTH_MOCK=false</code> and point
        <code class="rounded bg-base-200 px-1">VITE_API_BASE_URL</code> at a real Laravel app to
        switch from simulated responses to actual Sanctum authentication.
      </p>
    </DzAlert>

    <div class="grid gap-4 lg:grid-cols-2">
      <div class="rounded-box border border-base-300 bg-base-100 p-4">
        <h2 class="flex items-center gap-2 font-semibold">
          <ShieldCheck class="size-4 text-primary" aria-hidden="true" />
          Driver A — Stateful SPA
        </h2>
        <p class="mt-1 text-xs text-base-content/60">
          Recommended when the Vue SPA and Laravel share a top-level domain. The browser owns the
          session cookie; JavaScript never sees credentials.
        </p>
        <ul class="mt-3 space-y-1.5 text-xs">
          <li class="flex items-start gap-1.5">
            <CheckCircle2 class="mt-0.5 size-3.5 shrink-0 text-success" aria-hidden="true" />
            CSRF cookie at <code class="rounded bg-base-200 px-1">/sanctum/csrf-cookie</code>
          </li>
          <li class="flex items-start gap-1.5">
            <CheckCircle2 class="mt-0.5 size-3.5 shrink-0 text-success" aria-hidden="true" />
            Session cookie via <code class="rounded bg-base-200 px-1">withCredentials</code>
          </li>
          <li class="flex items-start gap-1.5">
            <CheckCircle2 class="mt-0.5 size-3.5 shrink-0 text-success" aria-hidden="true" />
            <code class="rounded bg-base-200 px-1">X-XSRF-TOKEN</code> forwarded automatically
          </li>
          <li class="flex items-start gap-1.5">
            <CheckCircle2 class="mt-0.5 size-3.5 shrink-0 text-success" aria-hidden="true" />
            HTTP 419 retries once after refreshing the CSRF cookie
          </li>
        </ul>
      </div>

      <div class="rounded-box border border-base-300 bg-base-100 p-4">
        <h2 class="flex items-center gap-2 font-semibold">
          <KeyRound class="size-4 text-primary" aria-hidden="true" />
          Driver B — Bearer token
        </h2>
        <p class="mt-1 text-xs text-base-content/60">
          For deployments where cookie authentication is unsuitable. The token login endpoint is
          application-specific and fully configurable.
        </p>
        <ul class="mt-3 space-y-1.5 text-xs">
          <li class="flex items-start gap-1.5">
            <CheckCircle2 class="mt-0.5 size-3.5 shrink-0 text-success" aria-hidden="true" />
            Token read from <code class="rounded bg-base-200 px-1">{{ config.token.responsePath }}</code>
            (dot paths supported)
          </li>
          <li class="flex items-start gap-1.5">
            <CheckCircle2 class="mt-0.5 size-3.5 shrink-0 text-success" aria-hidden="true" />
            Storage: <code class="rounded bg-base-200 px-1">{{ tokenStorage }}</code>
          </li>
          <li class="flex items-start gap-1.5">
            <CheckCircle2 class="mt-0.5 size-3.5 shrink-0 text-success" aria-hidden="true" />
            <code class="rounded bg-base-200 px-1">Authorization: Bearer …</code> injected by the
            HTTP client
          </li>
          <li class="flex items-start gap-1.5">
            <CheckCircle2 class="mt-0.5 size-3.5 shrink-0 text-success" aria-hidden="true" />
            Logout revokes the token server-side; 401 clears client state
          </li>
        </ul>
      </div>
    </div>

    <div class="rounded-box border border-base-300 bg-base-100">
      <div class="border-b border-base-300 p-4">
        <h2 class="flex items-center gap-2 font-semibold">
          <ServerCog class="size-4 text-primary" aria-hidden="true" />
          Frontend configuration
        </h2>
        <p class="mt-1 text-xs text-base-content/60">
          Driver selection is deployment-controlled. Environment variables are read once at startup;
          missing optional values fall back to documented defaults.
        </p>
      </div>
      <div class="space-y-3 p-4">
        <CodeBlock :code="envExample" language="env" filename=".env" />
        <div class="overflow-x-auto">
          <table class="table table-sm">
            <thead>
              <tr>
                <th>Variable</th>
                <th>Default</th>
                <th>Purpose</th>
              </tr>
            </thead>
            <tbody class="text-xs">
              <tr>
                <td><code>VITE_AUTH_DRIVER</code></td>
                <td><code>none</code></td>
                <td><code>sanctum-spa</code>, <code>sanctum-token</code> or <code>none</code></td>
              </tr>
              <tr>
                <td><code>VITE_API_BASE_URL</code></td>
                <td><code>http://localhost:8000</code></td>
                <td>Laravel origin used by the shared HTTP client</td>
              </tr>
              <tr>
                <td><code>VITE_AUTH_*_ENDPOINT</code></td>
                <td><code>/login</code>, <code>/logout</code>, <code>/api/user</code>, …</td>
                <td>All endpoint paths are configurable</td>
              </tr>
              <tr>
                <td><code>VITE_AUTH_TOKEN_STORAGE</code></td>
                <td><code>memory</code></td>
                <td><code>memory</code> or <code>sessionStorage</code> (XSS warning)</td>
              </tr>
              <tr>
                <td><code>VITE_AUTH_TOKEN_RESPONSE_PATH</code></td>
                <td><code>token</code></td>
                <td>Dot path to the token in the login response</td>
              </tr>
              <tr>
                <td><code>VITE_AUTH_MOCK</code></td>
                <td>on in development</td>
                <td>Simulated Laravel backend in the axios adapter</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div class="rounded-box border border-base-300 bg-base-100">
      <div class="border-b border-base-300 p-4">
        <h2 class="flex items-center gap-2 font-semibold">
          <Database class="size-4 text-primary" aria-hidden="true" />
          Stateful SPA — Laravel setup
        </h2>
      </div>
      <div class="space-y-4 p-4">
        <div>
          <h3 class="mb-2 text-sm font-medium">1. Install Sanctum</h3>
          <CodeBlock :code="spaInstall" language="bash" />
        </div>
        <div>
          <h3 class="mb-2 text-sm font-medium">2. Stateful domains and session cookie</h3>
          <CodeBlock :code="spaEnv" language="env" filename=".env" />
        </div>
        <div>
          <h3 class="mb-2 text-sm font-medium">3. Enable stateful middleware</h3>
          <CodeBlock :code="spaMiddleware" language="php" filename="bootstrap/app.php" />
        </div>
        <div>
          <h3 class="mb-2 text-sm font-medium">4. CORS with credentials</h3>
          <CodeBlock :code="spaCors" language="php" filename="config/cors.php" />
        </div>
        <div>
          <h3 class="mb-2 text-sm font-medium">5. Login / logout routes</h3>
          <CodeBlock :code="spaRoutes" language="php" filename="routes/web.php" />
        </div>
        <div>
          <h3 class="mb-2 text-sm font-medium">6. Current user endpoint</h3>
          <CodeBlock :code="spaUserRoute" language="php" filename="routes/api.php" />
        </div>
      </div>
    </div>

    <div class="rounded-box border border-base-300 bg-base-100">
      <div class="border-b border-base-300 p-4">
        <h2 class="flex items-center gap-2 font-semibold">
          <KeyRound class="size-4 text-primary" aria-hidden="true" />
          Bearer token — Laravel setup
        </h2>
      </div>
      <div class="space-y-4 p-4">
        <div>
          <h3 class="mb-2 text-sm font-medium">1. Add the HasApiTokens trait</h3>
          <CodeBlock :code="tokenModel" language="php" filename="app/Models/User.php" />
        </div>
        <div>
          <h3 class="mb-2 text-sm font-medium">2. Token issuance endpoint</h3>
          <CodeBlock :code="tokenIssue" language="php" filename="routes/api.php" />
        </div>
        <div>
          <h3 class="mb-2 text-sm font-medium">3. Token revocation endpoint</h3>
          <CodeBlock :code="tokenLogout" language="php" filename="routes/api.php" />
        </div>
        <DzAlert color="info" variant="soft">
          <p class="text-xs leading-relaxed">
            Sanctum has no built-in token-login endpoint — the route and response shape are yours.
            The frontend adapts through <code class="rounded bg-base-200 px-1">VITE_AUTH_LOGIN_ENDPOINT</code>
            and <code class="rounded bg-base-200 px-1">VITE_AUTH_TOKEN_RESPONSE_PATH</code>, so
            <code class="rounded bg-base-200 px-1">{ token, user }</code> and
            <code class="rounded bg-base-200 px-1">{ data: { token } }</code> both work.
          </p>
        </DzAlert>
      </div>
    </div>

    <div class="grid gap-4 lg:grid-cols-2">
      <div class="rounded-box border border-base-300 bg-base-100 p-4">
        <h2 class="font-semibold">Frontend responsibilities</h2>
        <ul class="mt-3 space-y-2 text-xs">
          <li v-for="item in responsibilitiesFrontend" :key="item" class="flex items-start gap-2">
            <CheckCircle2 class="mt-0.5 size-3.5 shrink-0 text-success" aria-hidden="true" />
            {{ item }}
          </li>
        </ul>
      </div>
      <div class="rounded-box border border-base-300 bg-base-100 p-4">
        <h2 class="font-semibold">Laravel responsibilities</h2>
        <ul class="mt-3 space-y-2 text-xs">
          <li v-for="item in responsibilitiesBackend" :key="item" class="flex items-start gap-2">
            <ServerCog class="mt-0.5 size-3.5 shrink-0 text-primary" aria-hidden="true" />
            {{ item }}
          </li>
        </ul>
      </div>
    </div>

    <div class="rounded-box border border-base-300 bg-base-100 p-4">
      <h2 class="font-semibold">Testing without a Laravel backend</h2>
      <p class="mt-1 text-sm text-base-content/70">
        With <code class="rounded bg-base-200 px-1">VITE_AUTH_MOCK</code> enabled (development
        default), a realistic Sanctum backend is simulated inside the Axios adapter: CSRF cookies,
        204 login/logout responses, 419 on missing CSRF, 401 for unauthenticated requests, token
        issuance/revocation and 422 validation errors. Switch drivers in
        <RouterLink to="/settings" class="link link-primary">Settings</RouterLink> and sign in with
        <code class="rounded bg-base-200 px-1">admin@example.com</code> /
        <code class="rounded bg-base-200 px-1">password</code>.
      </p>
      <p class="mt-2 text-xs text-base-content/50">
        Simulated authentication is clearly labeled throughout the UI and must never be mistaken for
        real Laravel Sanctum authentication.
      </p>
    </div>
  </section>
</template>
