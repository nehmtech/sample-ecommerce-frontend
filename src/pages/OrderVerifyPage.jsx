import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { verifyPayment } from "../services/api";
import { CheckCircle, XCircle } from "lucide-react";

export default function OrderVerifyPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("verifying"); // verifying | success | failed

  useEffect(() => {
    verifyPayment(id)
      .then(() => setStatus("success"))
      .catch(() => setStatus("failed"));
  }, [id]);

  if (status === "verifying") {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600" />
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <CheckCircle size={56} className="mx-auto text-emerald-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900">Payment Successful!</h2>
        <p className="text-gray-500 mt-2">Your order has been confirmed.</p>
        <button
          onClick={() => navigate(`/orders/${id}`)}
          className="mt-6 bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
        >
          View Order
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 py-20 text-center">
      <XCircle size={56} className="mx-auto text-red-500 mb-4" />
      <h2 className="text-2xl font-bold text-gray-900">Payment Failed</h2>
      <p className="text-gray-500 mt-2">Something went wrong with your payment.</p>
      <button
        onClick={() => navigate(`/orders/${id}`)}
        className="mt-6 bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
      >
        Try Again
      </button>
    </div>
  );
}