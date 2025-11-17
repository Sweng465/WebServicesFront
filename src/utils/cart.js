export const getCart = (userId) => {
  try {
    const cookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith(`cart_${userId}=`));
    if (!cookie) return [];
    return JSON.parse(decodeURIComponent(cookie.split("=")[1]));
  } catch {
    return [];
  }
};

export const saveCart = (userId, cart) => {
  const value = encodeURIComponent(JSON.stringify(cart));
  document.cookie = `cart_${userId}=${value}; path=/; max-age=${60*60*24*30}`;
};