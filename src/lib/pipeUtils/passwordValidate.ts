export function checkPassword(password: string) {
  const checkLength = password.length >= 6 && password.length <= 20;
  return checkLength;
}
