import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API_ENDPOINTS from "../config/api";

// cookie utils
const getCart = () => {
  try {
    const cookie = document.cookie
      .split("; ")
      .find((r) => r.startsWith("cart="));
    if (!cookie) return [];
    return JSON.parse(decodeURIComponent(cookie.split("=")[1]));
  } catch {
    return [];
  }
};

const saveCart = (cart) => {
  const value = encodeURIComponent(JSON.stringify(cart));
  document.cookie = `cart=${value}; path=/; max-age=${60 * 60 * 24 * 30}`;
};

const CartPage = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]); // raw cookie data
  const [listingData, setListingData] = useState([]); // fetched listing data
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cart = getCart();
    setCartItems(cart);
  }, []);

  // Fetch latest listing data
  useEffect(() => {
    const loadListingDetails = async () => {
      setLoading(true);

      const results = [];

      for (const item of cartItems) {
        try {
          const res = await fetch(`${API_ENDPOINTS.LISTINGS}/${item.listingId}`);

          if (!res.ok) {
            results.push({
              listingId: item.listingId,
              error: true,
              deleted: res.status === 404,
            });
            continue;
          }

          const data = await res.json();
          const listing = data?.data ?? data;

          results.push({
            listingId: item.listingId,
            listing,
          });
        } catch {
          results.push({
            listingId: item.listingId,
            error: true,
          });
        }
      }

      setListingData(results);
      setLoading(false);
    };

    if (cartItems.length > 0) loadListingDetails();
    else setListingData([]);
  }, [cartItems]);

  const removeItem = (id) => {
    const updated = cartItems.filter((item) => item.listingId !== id);
    saveCart(updated);
    setCartItems(updated);
  };

  const clearCart = () => {
    saveCart([]);
    setCartItems([]);
  };

  const total = listingData
    .filter((i) => i.listing && i.listing.isAvailable !== 0)
    .reduce((sum, item) => sum + Number(item.listing.price), 0);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-orange-600 to-blue-600 text-gray-900 py-10 px-4">
      <div className="max-w-3xl mx-auto p-6 bg-white bg-opacity-90 rounded-lg shadow-lg">
        <button
          onClick={() => navigate(-1)}
          className="text-blue-700 hover:underline mb-4"
        >
          ← Back
        </button>

        <h1 className="text-3xl font-bold text-center mb-6">Your Cart</h1>

        {loading ? (
          <p className="text-center text-gray-600">Loading cart...</p>
        ) : listingData.length === 0 ? (
          <p className="text-center text-gray-500">Your cart is empty.</p>
        ) : (
          <>
            <div className="space-y-4">
              {listingData.map((item) => {
                const isDeleted = item.deleted;
                const listing = item.listing;

                if (isDeleted) {
                  return (
                    <div key={item.listingId} className="p-4 bg-red-50 rounded-md shadow-sm">
                      <p className="font-semibold text-red-600">
                        Listing #{item.listingId} has been removed.
                      </p>
                      <button
                        className="text-blue-700 mt-2 hover:underline"
                        onClick={() => removeItem(item.listingId)}
                      >
                        Remove from cart
                      </button>
                    </div>
                  );
                }

                if (item.error || !listing) {
                  return (
                    <div key={item.listingId} className="p-4 bg-red-50 rounded-md shadow-sm">
                      <p className="text-red-600">Error loading listing #{item.listingId}</p>
                      <button
                        className="text-blue-700 mt-2 hover:underline"
                        onClick={() => removeItem(item.listingId)}
                      >
                        Remove from cart
                      </button>
                    </div>
                  );
                }

                const unavailable = listing.isAvailable === 0;

                return (
                  <div key={item.listingId} className="flex gap-4 p-4 bg-white rounded-md shadow-sm items-center">
                    <div className="w-24 h-24 bg-gray-100 rounded overflow-hidden flex items-center justify-center">
                      {listing.images?.[0] ? (
                        <img
                          src={listing.images[0]}
                          alt={listing.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-gray-400 text-sm">No image</span>
                      )}
                    </div>

                    <div className="flex-1">
                      <h2
                        className="font-semibold text-lg cursor-pointer hover:underline"
                        onClick={() => navigate(`/listing/${item.listingId}`)}
                      >
                        {listing.title || "Untitled"}
                      </h2>
                      {unavailable && (
                        <p className="text-red-600 font-semibold mt-1">This vehicle has been sold</p>
                      )}
                      <p className="text-gray-700 mt-1">${Number(listing.price).toLocaleString()}</p>
                    </div>

                    <button
                      className="text-red-600 font-medium hover:underline"
                      onClick={() => removeItem(item.listingId)}
                    >
                      Remove
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 p-4 bg-gray-100 rounded-md shadow-inner">
              <div className="flex justify-between text-lg font-semibold mb-4">
                <span>Total</span>
                <span>${total.toLocaleString()}</span>
              </div>
              <div className="flex gap-4 flex-wrap">
                <button
                  className="flex-1 bg-gray-200 text-gray-900 py-2 rounded-md hover:bg-gray-300"
                  onClick={clearCart}
                >
                  Clear Cart
                </button>
                <button className="flex-1 bg-blue-700 text-white py-2 rounded-md hover:bg-blue-800">
                  Checkout
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CartPage;