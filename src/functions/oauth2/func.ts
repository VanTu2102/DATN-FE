import environment from "@/util/environment";

export function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
export async function sha256(verifier: string) {
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return new Uint8Array(hashBuffer);
}
export function base64URLEncode(arrayBuffer: any) {
  let base64 = btoa(String.fromCharCode.apply(null, arrayBuffer));
  base64 = base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  return base64;
}
export async function generateCodeChallenge(codeVerifier: string) {
  const hashed = await sha256(codeVerifier);
  return base64URLEncode(hashed);
}
export async function requestToken(params: any) {
  let data = await fetch(environment.TOKEN_URL, {
    method: "POST",
    body: JSON.stringify(params),
  })
  return await data.json()
}
