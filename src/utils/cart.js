export const getCart = () => {
  try {
    const cookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("cart="));
    if (!cookie) return [];
    return JSON.parse(decodeURIComponent(cookie.split("=")[1]));
  } catch {
    return [];
  }
};

export const saveCart = (cart) => {
  const value = encodeURIComponent(JSON.stringify(cart));

  // Cookie expires in 30 days
  document.cookie = `cart=${value}; path=/; max-age=${60 * 60 * 24 * 30}`;
};