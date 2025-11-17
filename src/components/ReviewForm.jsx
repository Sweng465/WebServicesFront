import { useState } from "react";
import API_ENDPOINTS from "../config/api.js";

/* token discovery helper (unchanged) */
const findAuthToken = (obj) => {
  if (!obj || typeof obj !== "object") return null;
  const commonKeys = ["token","accessToken","access_token","idToken","id_token","jwt","authToken","bearer","auth_token"];
  for (const k of commonKeys) {
    const v = obj?.[k];
    if (typeof v === "string" && v.trim().length > 10) return v.trim();
  }
  const seen = new Set();
  const stack = [obj];
  while (stack.length) {
    const cur = stack.pop();
    if (!cur || typeof cur !== "object" || seen.has(cur)) continue;
    seen.add(cur);
    for (const [k, v] of Object.entries(cur)) {
      if (typeof v === "string" && v.trim().length > 10) {
        if (/token|access_token|accessToken|id_token|idToken|jwt|auth/i.test(k)) return v.trim();
      }
      if (typeof v === "object" && v !== null) stack.push(v);
    }
  }
  return null;
};

const ReviewForm = ({ businessId, onCreate = () => {}, currentUser = null, token = null }) => {
  const TITLE_MAX = 100;
  const COMMENT_MAX = 500;

  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [name, setName] = useState(currentUser?.name ?? "");
  const [email, setEmail] = useState(currentUser?.email ?? "");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const buildReviewsUrl = (id) => {
    if (API_ENDPOINTS?.REVIEWS) return API_ENDPOINTS.REVIEWS.replace(":id", id);
    if (API_ENDPOINTS?.BUSINESSES) return `${API_ENDPOINTS.BUSINESSES}/${id}/reviews`;
    return `/api/businesses/${id}/reviews`;
  };

  const getAuthHeader = () => {
    if (typeof token === "string" && token.trim().length > 0) return { Authorization: `Bearer ${token.trim()}` };
    const explicit =
      currentUser?.token ?? currentUser?.accessToken ?? currentUser?.access_token ?? currentUser?.idToken ?? currentUser?.id_token ?? currentUser?.jwt ?? currentUser?.authToken ?? null;
    const explicitToken = typeof explicit === "string" && explicit.trim().length > 0 ? explicit.trim() : null;
    const discovered = explicitToken || findAuthToken(currentUser);
    return discovered ? { Authorization: `Bearer ${discovered}` } : {};
  };

  // Helper to extract a userId from the decoded JWT payload or user object
  const getUserIdFromCurrentUser = () => {
    if (!currentUser || typeof currentUser !== "object") return null;
    // common JWT payload fields and user shapes
    return (
      currentUser?.id ??
      currentUser?.sub ??
      currentUser?.userId ??
      currentUser?.user_id ??
      currentUser?.uid ??
      null
    );
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setError(null);
    if (!businessId) return setError("Missing business id.");
    if (!comment.trim()) return setError("Please enter a review comment.");
    if (!rating || rating < 1 || rating > 5) return setError("Please provide a rating 1–5.");
    if (title.trim().length > TITLE_MAX) return setError(`Title must be ${TITLE_MAX} characters or fewer.`);
    if (comment.trim().length > COMMENT_MAX) return setError(`Comment must be ${COMMENT_MAX} characters or fewer.`);

    setSubmitting(true);
    try {
      const url = buildReviewsUrl(businessId);

      const userIdValue = getUserIdFromCurrentUser();

      // Build body using the DB column names your backend expects
      const body = {
        userId: userIdValue ?? undefined,
        businessId: businessId,
        title: title.trim() || undefined,
        content: comment.trim(),
        rating: Number(rating),
        createdAt: new Date().toISOString()
      };

      const headers = { "Content-Type": "application/json", ...getAuthHeader() };

      const res = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(txt || `Failed to submit review (${res.status})`);
      }

      const data = await res.json();
      const created = data?.data ?? data ?? null;
      if (!created) throw new Error("Unexpected response from server.");

      // notify parent (BusinessDetails will add it into its reviews state)
      onCreate(created);

      // reset form fields
      setRating(5);
      setTitle("");
      setComment("");
    } catch (err) {
      console.error("Error creating review:", err);
      setError(err.message ?? "Failed to submit review.");
    } finally {
      setSubmitting(false);
    }
  };

  const titleRemaining = TITLE_MAX - (title?.length ?? 0);
  const commentRemaining = COMMENT_MAX - (comment?.length ?? 0);

  return (
    <form onSubmit={handleSubmit} className="space-y-3 bg-white p-4 rounded-md border">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Your rating</label>
          <select value={rating} onChange={(e) => setRating(Number(e.target.value))} className="border rounded px-2 py-1 text-sm">
            <option value={5}>5 — Excellent</option>
            <option value={4}>4 — Good</option>
            <option value={3}>3 — Okay</option>
            <option value={2}>2 — Poor</option>
            <option value={1}>1 — Terrible</option>
          </select>
        </div>

        <div className="text-sm text-gray-500">{submitting ? "Submitting…" : ""}</div>
      </div>

      <div>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Summary (optional)"
          className="w-full border rounded px-3 py-2 text-sm"
          maxLength={TITLE_MAX}
        />
        <div className="text-xs text-gray-500 mt-1">{titleRemaining} characters remaining</div>
      </div>

      <div>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write your review..."
          className="w-full border rounded px-3 py-2 text-sm min-h-[90px]"
          required
          maxLength={COMMENT_MAX}
        />
        <div className="text-xs text-gray-500 mt-1">{commentRemaining} characters remaining</div>
      </div>

      {!currentUser && (
        <div className="grid grid-cols-2 gap-2">
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name (optional)" className="border rounded px-3 py-2 text-sm" />
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email (optional)" className="border rounded px-3 py-2 text-sm" />
        </div>
      )}

      {error && <div className="text-sm text-red-600">{error}</div>}

      <div className="flex items-center gap-2">
        <button type="submit" disabled={submitting} className="bg-blue-600 text-white px-4 py-2 rounded text-sm disabled:opacity-60">
          Submit review
        </button>
        <button type="button" onClick={() => { setRating(5); setTitle(""); setComment(""); }} className="text-sm text-gray-600">
          Reset
        </button>
      </div>
    </form>
  );
};

export default ReviewForm;