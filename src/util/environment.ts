const environment = {
  API_URL: process.env.NEXT_PUBLIC_API_URL ?? '',
  API_KEY: process.env.NEXT_PUBLIC_API_KEY ?? '',
  REDIRECT_URL: process.env.REDIRECT_URL ?? 'http://localhost:3000',
  TOKEN_URL: process.env.TOKEN_URL ?? 'https://oauth2.googleapis.com/token',
  // REDIRECT_URL: process.env.REDIRECT_URL ?? 'https://datn-fe-git-main-vantu2102s-projects.vercel.app',
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ?? '1026819540455-u3qies0kkvke2ho2p66m5uenl0h5uq9d.apps.googleusercontent.com',
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET ?? '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',
  CODE_VERIFY: process.env.CODE_VERIFY ?? "vantu2102@gmail.com",
  BE_URL: "http://127.0.0.1:8000",
  WS_URL: "ws://127.0.0.1:8000"
}

export default environment
