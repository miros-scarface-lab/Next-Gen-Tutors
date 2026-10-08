export function navigate(url: string) {
  window.history.pushState({}, '', url);
  window.dispatchEvent(new Event('popstate'));
}
