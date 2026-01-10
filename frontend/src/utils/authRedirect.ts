export const saveRedirectPath = () => {
  localStorage.setItem("redirectAfterLogin", window.location.pathname);
};

export const getRedirectPath = () => {
  const path = localStorage.getItem("redirectAfterLogin");
  localStorage.removeItem("redirectAfterLogin");
  return path || "/";
};
