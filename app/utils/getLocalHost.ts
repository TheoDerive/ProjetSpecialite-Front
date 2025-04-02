export function getLocalhost(value: string){
    const local = window.localStorage.getItem(value);
    const user = JSON.parse(local);

  return user
}
