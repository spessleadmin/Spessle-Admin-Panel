const NOTIFICATION_TYPE_LABELS = {
  MESSAGE_RECEIVED: "Message Received",
  REQUEST_RECEIVED: "Order Request Received",
  REQUEST_PAID: "Request Paid",
  REQUEST_CANCELLED: "Request Cancelled",
  ORDER_EARNING: "Order Earning",
  ORDER_PENDING: "Order Pending",
  ORDER_REFUND: "Order Refunded",
};

export function formatNotificationType(typeName) {
  return NOTIFICATION_TYPE_LABELS[typeName] || typeName;
}
