export const buildSalesOrderConfirmationTemplate = ({
  customerName,
  salesOrderNumber,
  totalAmount,
  date,
}: {
  customerName: string;
  salesOrderNumber: string;
  totalAmount: string;
  date: string;
}): string => {

  return `

  <style>
    @media screen and (max-width: 480px) {
      .nui-outer   { padding: 20px 12px !important; }
      .nui-card    { border-radius: 0 !important; }
      .nui-header  { padding: 28px 20px 20px !important; }
      .nui-body    { padding: 28px 20px 24px !important; }
      .nui-heading { font-size: 20px !important; }
      .nui-footer  { padding: 20px 16px !important; }
    }
  </style>

  <div
    class="nui-outer"
    style="
      background-color: #f5f0e8;
      padding: 40px 24px;
      font-family: Georgia, 'Times New Roman', serif;
    "
  >

    <div
      class="nui-card"
      style="
        max-width: 580px;
        margin: auto;
        background-color: #ffffff;
        border: 1px solid #d4b96a;
        border-radius: 4px;
        overflow: hidden;
        box-shadow: 0 4px 24px rgba(100, 80, 20, 0.10);
      "
    >

      <!-- Header -->
      <div
        class="nui-header"
        style="
          background: #1a1400;
          padding: 36px 32px 28px;
          text-align: center;
          border-bottom: 3px solid #c9a84c;
        "
      >
        <div
          style="
            display: inline-block;
            border: 2px solid #c9a84c;
            padding: 6px 18px;
            margin-bottom: 12px;
          "
        >
          <span
            style="
              font-size: 38px;
              font-weight: 700;
              color: #c9a84c;
              letter-spacing: 0.08em;
              font-family: Georgia, serif;
              line-height: 1;
            "
          >NUI</span>
        </div>

        <p
          style="
            font-size: 11px;
            color: #8a7040;
            letter-spacing: 0.15em;
            margin: 0;
            text-transform: uppercase;
            font-family: Georgia, serif;
          "
        >Numismatics Unlimited Inc.</p>

        <p
          style="
            font-size: 12px;
            color: #5a4e28;
            margin: 8px 0 0;
            font-style: italic;
            font-family: Georgia, serif;
          "
        >The go-to partner for precious metals investments</p>

      </div>

      <!-- Body -->
      <div
        class="nui-body"
        style="padding: 40px 40px 32px; background: #ffffff;"
      >

        <p
          style="
            font-size: 12px;
            color: #a08848;
            letter-spacing: 0.12em;
            text-transform: uppercase;
            margin: 0 0 12px;
            font-family: Georgia, serif;
          "
        >Sales Order</p>

        <h1
          class="nui-heading"
          style="
            font-size: 26px;
            font-weight: 700;
            color: #1a1400;
            margin: 0 0 8px;
            font-family: Georgia, serif;
            line-height: 1.2;
          "
        >Sales Order Confirmation</h1>

        <div
          style="
            width: 40px;
            height: 2px;
            background: #c9a84c;
            margin: 0 0 28px;
          "
        ></div>

        <p
          style="
            font-size: 14px;
            color: #5a5040;
            line-height: 1.8;
            margin: 0 0 12px;
            font-family: Georgia, serif;
          "
        >
          Dear <strong style="color: #1a1400;">${customerName}</strong>,
        </p>

        <p
          style="
            font-size: 14px;
            color: #5a5040;
            line-height: 1.8;
            margin: 0 0 32px;
            font-family: Georgia, serif;
          "
        >
          Thank you for your order. We are pleased to confirm that your
          sales order has been received and is being processed by
          Numismatics Unlimited Inc. Please find the order details below,
          along with a copy of the sales order attached to this email for
          your records.
        </p>

        <!-- Order Details Box -->
        <div
          style="
            border: 1px solid #d4b96a;
            border-radius: 2px;
            overflow: hidden;
            margin-bottom: 32px;
          "
        >

          <div
            style="
              background: #1a1400;
              padding: 12px 20px;
              border-bottom: 2px solid #c9a84c;
            "
          >
            <p
              style="
                font-size: 11px;
                color: #c9a84c;
                letter-spacing: 0.14em;
                text-transform: uppercase;
                margin: 0;
                font-family: Georgia, serif;
              "
            >Order Details</p>
          </div>

          <div style="padding: 0 20px 4px;">

            <div style="padding: 10px 0; border-bottom: 1px solid #e8d898;">
              <p style="
                font-size: 11px;
                color: #a08848;
                letter-spacing: 0.1em;
                text-transform: uppercase;
                margin: 0 0 4px;
                font-family: Georgia, serif;
              ">Sales Order #</p>
              <p style="
                font-size: 15px;
                font-weight: 700;
                color: #1a1400;
                margin: 0;
                font-family: Georgia, serif;
                letter-spacing: 0.04em;
              ">${salesOrderNumber}</p>
            </div>

            <div style="padding: 10px 0; border-bottom: 1px solid #e8d898;">
              <p style="
                font-size: 11px;
                color: #a08848;
                letter-spacing: 0.1em;
                text-transform: uppercase;
                margin: 0 0 4px;
                font-family: Georgia, serif;
              ">Order Date</p>
              <p style="
                font-size: 14px;
                font-weight: 400;
                color: #1a1400;
                margin: 0;
                font-family: Georgia, serif;
              ">${date}</p>
            </div>

            <div style="padding: 10px 0; border-bottom: 1px solid #e8d898;">
              <p style="
                font-size: 11px;
                color: #a08848;
                letter-spacing: 0.1em;
                text-transform: uppercase;
                margin: 0 0 4px;
                font-family: Georgia, serif;
              ">Total Amount</p>
              <p style="
                font-size: 15px;
                font-weight: 700;
                color: #1a1400;
                margin: 0;
                font-family: Georgia, serif;
                letter-spacing: 0.04em;
              ">${totalAmount}</p>
            </div>

            <div style="padding: 10px 0;">
              <p style="
                font-size: 11px;
                color: #a08848;
                letter-spacing: 0.1em;
                text-transform: uppercase;
                margin: 0 0 6px;
                font-family: Georgia, serif;
              ">Status</p>
              <span style="
                display: inline-block;
                background: #fdf3d6;
                border: 1px solid #c9a84c;
                color: #7a5c10;
                font-size: 11px;
                font-weight: 700;
                letter-spacing: 0.1em;
                text-transform: uppercase;
                padding: 3px 10px;
                font-family: Georgia, serif;
              ">Confirmed</span>
            </div>

          </div>
        </div>

        <!-- Attachment Note -->
        <div
          style="
            border: 1px solid #e0cc90;
            border-left: 3px solid #c9a84c;
            padding: 16px 20px;
            margin-bottom: 32px;
            background: #fdf8ec;
          "
        >
          <p
            style="
              font-size: 13px;
              color: #7a6838;
              line-height: 1.7;
              margin: 0;
              font-family: Georgia, serif;
            "
          >
            A PDF copy of your sales order is attached to this email.
            Please review the order details carefully. If you have any
            questions or concerns, contact us at
            <a href="tel:5167984170" style="color: #8a6820; text-decoration: none;">
              (516) 798.4170
            </a>
            at your earliest convenience.
          </p>
        </div>

        <p
          style="
            font-size: 12px;
            color: #a09070;
            line-height: 1.7;
            margin: 0;
            font-family: Georgia, serif;
          "
        >
          This is an automated message from Numismatics Unlimited Inc.
          Please do not reply directly to this email. If you require
          assistance, reach out via our official support channels.
        </p>

      </div>

      <!-- Footer -->
      <div
        class="nui-footer"
        style="
          background: #1a1400;
          border-top: 3px solid #c9a84c;
          padding: 24px 32px;
          text-align: center;
        "
      >
        <p
          style="
            font-size: 12px;
            color: #8a7040;
            margin: 0 0 8px;
            letter-spacing: 0.06em;
            font-family: Georgia, serif;
          "
        >© 2026 Numismatics Unlimited Inc. · Est. 1990</p>

        <p style="font-size: 11px; color: #5a4e28; margin: 0; font-family: Georgia, serif;">
          <a href="#" style="color: #8a7040; text-decoration: none; margin-right: 16px;">Privacy Policy</a>
          <a href="#" style="color: #8a7040; text-decoration: none; margin-right: 16px;">Terms of Service</a>
          <a href="#" style="color: #8a7040; text-decoration: none;">Unsubscribe</a>
        </p>
      </div>

    </div>
  </div>

  `;
};