package com.swe4302.models;

import java.util.Date;
import java.util.UUID;

public final class Payment {

	public enum PaymentMethod {
		CASH,
		CARD,
		MOBILE_BANKING
	}

	public enum PaymentStatus {
		PENDING,
		PAID,
		FAILED,
		REFUNDED
	}

	private final String id;
	private double amount;
	private PaymentMethod method;
	private PaymentStatus status;
	private String transactionReference;
	private final Date createdAt;
	private Date paidAt;

	public Payment(double amount, PaymentMethod method) {
		this.id = UUID.randomUUID().toString();
		setAmount(amount);
		setMethod(method);
		this.status = PaymentStatus.PENDING;
		this.createdAt = new Date();
	}

	public String getId() {
		return id;
	}

	public double getAmount() {
		return amount;
	}

	public void setAmount(double amount) {
		if (amount < 0) {
			throw new IllegalArgumentException("Amount cannot be negative");
		}
		this.amount = amount;
	}

	public PaymentMethod getMethod() {
		return method;
	}

	public void setMethod(PaymentMethod method) {
		if (method == null) {
			throw new IllegalArgumentException("Payment method is required");
		}
		this.method = method;
	}

	public PaymentStatus getStatus() {
		return status;
	}

	public String getTransactionReference() {
		return transactionReference;
	}

	public Date getCreatedAt() {
		return new Date(createdAt.getTime());
	}

	public Date getPaidAt() {
		return paidAt == null ? null : new Date(paidAt.getTime());
	}

	public void markPaid(String transactionReference) {
		if (status == PaymentStatus.REFUNDED) {
			throw new IllegalStateException("Refunded payment cannot be marked as paid again");
		}
		this.status = PaymentStatus.PAID;
		this.transactionReference = transactionReference;
		this.paidAt = new Date();
	}

	public void markFailed() {
		if (status == PaymentStatus.REFUNDED) {
			throw new IllegalStateException("Refunded payment cannot be marked as failed");
		}
		this.status = PaymentStatus.FAILED;
	}

	public void refund() {
		if (status != PaymentStatus.PAID) {
			throw new IllegalStateException("Only paid payments can be refunded");
		}
		this.status = PaymentStatus.REFUNDED;
	}

	public boolean isSuccessful() {
		return status == PaymentStatus.PAID;
	}
}
