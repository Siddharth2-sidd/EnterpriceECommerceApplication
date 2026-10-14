import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { createPayment, getPaymentByOrderId, processPayment,} from "../../api/paymentApi";

function unwrapResponse(response) {
  return response?.data ?? response;
}

function getPaymentId(payment) {
  return (
    payment?.paymentId ??
    payment?.id ??
    payment?.payment?.paymentId ??
    payment?.payment?.id ??
    null
  );
}

function getPaymentStatus(payment) {
  return (
    payment?.paymentStatus ??
    payment?.status ??
    payment?.payment?.paymentStatus ??
    payment?.payment?.status ??
    "Unknown"
  );
}

function getPaymentMethod(payment) {
  return (
    payment?.paymentMethod ??
    payment?.method ??
    payment?.payment?.paymentMethod ??
    "Not provided"
  );
}

function getPaymentAmount(payment) {
  return (
    payment?.amount ??
    payment?.totalAmount ??
    payment?.payment?.amount ??
    null
  );
}

export default function PaymentStatus() {
  const { orderId } = useParams();

  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadPayment = useCallback(async () => {
    if (!orderId) {
      setError("Order ID is missing.");
      setLoading(false);
      return;
    }
    try {
      setError("");

      const response = await getPaymentByOrderId(orderId);
      const data = unwrapResponse(response);

      setPayment(data?.payment ?? data);
    } catch (err) {
      setPayment(null);
      setError(err.response?.data?.message ?? "Could not load payment details. Check whether a payment exists for this order.");
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    loadPayment();
  }, [loadPayment]);

  const handleCreatePayment = async () => {
    try {
      setCreating(true);
      setError("");
      setMessage("");

      // EXAMPLE ONLY:
      // Replace this object with the exact CreatePaymentRequestDto
      // fields documented by your .NET API in Swagger.
      const response = await createPayment({
        orderId: Number(orderId),
      });

      const data = unwrapResponse(response);
      setPayment(data?.payment ?? data);
      setMessage("Payment record created.");

      // Fetch the authoritative record from the backend.
      await loadPayment();
    } catch (err) {
      setError(err.response?.data?.message ?? "Could not create the payment.");
    } finally {
      setCreating(false);
    }
  };

  const handleProcessPayment = async () => {
    const paymentId = getPaymentId(payment);

    if (!paymentId) {
      setError("Payment ID is missing from the API response.");
      return;
    }

    try {
      setProcessing(true);
      setError("");
      setMessage("");

      await processPayment(paymentId);

      // Read the latest status rather than trusting the button click.
      await loadPayment();
      setMessage("Payment processing request completed. Check the latest status below.");
    } catch (err) {
      setError(err.response?.data?.message ?? "Payment processing failed. Refresh the status before retrying.");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return <div className="payment-page">Loading payment details...</div>;
  }

  const paymentId = getPaymentId(payment);
  const status = getPaymentStatus(payment);
  const normalizedStatus = String(status).toLowerCase();

  const isSuccessful = [
    "paid",
    "success",
    "successful",
    "completed",
  ].includes(normalizedStatus);

  const isPending = [
    "pending",
    "created",
    "processing",
    "initiated",
  ].includes(normalizedStatus);

  return (
    <main className="payment-page">
      <div className="payment-card">
        <h1>Payment Details</h1>
        <p>Order ID: {orderId}</p>

        {error && (
          <div className="payment-alert payment-error">
            {error}
          </div>
        )}

        {message && (
          <div className="payment-alert payment-success">
            {message}
          </div>
        )}

        {!payment ? (
          <div>
            <p>No payment details were loaded for this order.</p>
            <button
              onClick={handleCreatePayment}
              disabled={creating}
            >
              {creating ? "Creating..." : "Create Payment"}
            </button>
          </div>
        ) : (
          <>
            <div className="payment-detail-row">
              <span>Payment ID</span>
              <strong>{paymentId ?? "Not returned"}</strong>
            </div>

            <div className="payment-detail-row">
              <span>Payment Method</span>
              <strong>{getPaymentMethod(payment)}</strong>
            </div>

            <div className="payment-detail-row">
              <span>Amount</span>
              <strong>
                {getPaymentAmount(payment) != null
                  ? `₹${Number(getPaymentAmount(payment)).toFixed(2)}`
                  : "See order details"}
              </strong>
            </div>

            <div className="payment-detail-row">
              <span>Status</span>
              <strong
                className={
                  isSuccessful
                    ? "payment-status-success"
                    : "payment-status-pending"
                }
              >
                {status}
              </strong>
            </div>

            {isPending && (
              <button
                onClick={handleProcessPayment}
                disabled={processing || !paymentId}
              >
                {processing ? "Processing..." : "Process Payment"}
              </button>
            )}

            <button
              className="payment-secondary-button"
              onClick={loadPayment}
            >
              Refresh Status
            </button>

            {isSuccessful && (
              <p className="payment-confirmation">
                Payment is marked successful by the API.
              </p>
            )}
          </>
        )}

        <Link to={`/orders/${orderId}`}>View Order Details</Link>
        <Link to="/orders">Back to My Orders</Link>
      </div>
    </main>
  );
}
