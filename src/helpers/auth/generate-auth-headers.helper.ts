export const generateAuthHeaders = () => {
  const username = import.meta.env.VITE_AUTH_USERNAME;
  const password = import.meta.env.VITE_AUTH_PASSWORD;

  const token = btoa(`${username}:${password}`);
  return {
    Authorization: `Basic ${token}`,
  };
};
