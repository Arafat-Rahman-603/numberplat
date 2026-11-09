interface BkashConfig {
  baseUrl: string;
  appKey: string;
  appSecret: string;
  username: string;
  password: string;
  callbackUrl: string;
}

export interface BkashCreatePaymentResponse {
  paymentID: string;
  bkashURL: string;
  amount: string;
  currency: string;
  intent: string;
  merchantInvoiceNumber: string;
  statusCode: string;
  statusMessage: string;
  isSandboxMock?: boolean;
}

export interface BkashExecutePaymentResponse {
  paymentID: string;
  trxID: string;
  transactionStatus: "Completed" | "Authorized" | "Failed" | "Cancelled";
  amount: string;
  currency: string;
  intent: string;
  merchantInvoiceNumber: string;
  customerMsisdn?: string;
  paymentExecuteTime: string;
  statusCode: string;
  statusMessage: string;
}

class BkashService {
  private config: BkashConfig;
  private cachedToken: { token: string; expiresAt: number } | null = null;

  constructor() {
    this.config = {
      baseUrl:
        process.env.BKASH_BASE_URL ||
        "https://tokenized.sandbox.bka.sh/v1.2.0-beta/tokenized/checkout",
      appKey: process.env.BKASH_APP_KEY || "",
      appSecret: process.env.BKASH_APP_SECRET || "",
      username: process.env.BKASH_USERNAME || "",
      password: process.env.BKASH_PASSWORD || "",
      callbackUrl:
        process.env.BKASH_CALLBACK_URL ||
        `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/orders/bkash/callback`,
    };
  }

  public hasCredentials(): boolean {
    return Boolean(
      this.config.appKey &&
        this.config.appSecret &&
        this.config.username &&
        this.config.password
    );
  }

  public async getAccessToken(): Promise<string> {
    const now = Date.now();
    if (this.cachedToken && this.cachedToken.expiresAt > now + 60000) {
      return this.cachedToken.token;
    }

    if (!this.hasCredentials()) {
      throw new Error(
        "bKash credentials missing in environment variables (BKASH_APP_KEY, BKASH_APP_SECRET, BKASH_USERNAME, BKASH_PASSWORD)"
      );
    }

    try {
      const response = await fetch(`${this.config.baseUrl}/token/grant`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          username: this.config.username,
          password: this.config.password,
        },
        body: JSON.stringify({
          app_key: this.config.appKey,
          app_secret: this.config.appSecret,
        }),
      });

      const data = await response.json();

      if (data.statusCode === "0000" && data.id_token) {
        // Cache token (expires_in is usually 3600 seconds)
        const expiresInMs = (parseInt(data.expires_in, 10) || 3600) * 1000;
        this.cachedToken = {
          token: data.id_token,
          expiresAt: now + expiresInMs,
        };
        return data.id_token;
      }

      throw new Error(
        `bKash token grant failed: [${data.statusCode}] ${data.statusMessage || "Unknown error"}`
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error("[bKash] Token grant error:", msg);
      throw err;
    }
  }

  public async createPayment({
    amount,
    orderNumber,
    customerPhone,
  }: {
    amount: number;
    orderNumber: string;
    customerPhone: string;
  }): Promise<BkashCreatePaymentResponse> {
    // If credentials are not set, handle developer sandbox demo checkout mode
    if (!this.hasCredentials()) {
      const mockPaymentID = `BKASH_MOCK_${Date.now()}_${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
      return {
        paymentID: mockPaymentID,
        bkashURL: `${appUrl}/checkout/bkash-sandbox?paymentID=${mockPaymentID}&orderNumber=${orderNumber}&amount=${amount}`,
        amount: amount.toFixed(2),
        currency: "BDT",
        intent: "sale",
        merchantInvoiceNumber: orderNumber,
        statusCode: "0000",
        statusMessage: "Successful (Sandbox Simulation Mode)",
        isSandboxMock: true,
      };
    }

    const token = await this.getAccessToken();

    const response = await fetch(`${this.config.baseUrl}/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: token,
        "X-APP-Key": this.config.appKey,
      },
      body: JSON.stringify({
        mode: "0011",
        payerReference: customerPhone,
        callbackURL: this.config.callbackUrl,
        amount: amount.toFixed(2),
        currency: "BDT",
        intent: "sale",
        merchantInvoiceNumber: orderNumber,
      }),
    });

    const data = await response.json();

    if (data.statusCode === "0000" && data.paymentID) {
      return data;
    }

    throw new Error(
      `bKash create payment failed: [${data.statusCode}] ${data.statusMessage || "Failed to initialize payment"}`
    );
  }

  public async executePayment(paymentID: string): Promise<BkashExecutePaymentResponse> {
    // If mock sandbox
    if (paymentID.startsWith("BKASH_MOCK_")) {
      const mockTrxId = `TRX${Date.now().toString().slice(-6)}${Math.random().toString(36).substring(2, 5).toUpperCase()}`;
      return {
        paymentID,
        trxID: mockTrxId,
        transactionStatus: "Completed",
        amount: "100.00",
        currency: "BDT",
        intent: "sale",
        merchantInvoiceNumber: "INV",
        customerMsisdn: "017XXXXXXXX",
        paymentExecuteTime: new Date().toISOString(),
        statusCode: "0000",
        statusMessage: "Payment successful (Sandbox Verified)",
      };
    }

    const token = await this.getAccessToken();

    const response = await fetch(`${this.config.baseUrl}/execute`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: token,
        "X-APP-Key": this.config.appKey,
      },
      body: JSON.stringify({
        paymentID,
      }),
    });

    const data = await response.json();

    if (data.statusCode === "0000" && data.trxID) {
      return data;
    }

    throw new Error(
      `bKash execute payment failed: [${data.statusCode}] ${data.statusMessage || "Execution failed"}`
    );
  }

  public async queryPayment(paymentID: string): Promise<any> {
    if (paymentID.startsWith("BKASH_MOCK_")) {
      return {
        paymentID,
        transactionStatus: "Completed",
        statusCode: "0000",
      };
    }

    const token = await this.getAccessToken();

    const response = await fetch(`${this.config.baseUrl}/payment/status`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
        "X-APP-Key": this.config.appKey,
      },
      body: JSON.stringify({
        paymentID,
      }),
    });

    return await response.json();
  }
}

export const bkashService = new BkashService();

