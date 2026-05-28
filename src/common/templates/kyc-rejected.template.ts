export const buildKycRejectedTemplate = (
  name: string,
  rejectionReasons: string[]
) => {

  const reasonsHtml = rejectionReasons
    .map(
      (reason) => `
          <li
            style="
              font-size: 14px;
              color: #5a5040;
              font-family: Georgia, 'Times New Roman', serif;
              line-height: 1.8;
              margin-bottom: 10px;
            "
          >
            ${reason}
          </li>
        `
    )
    .join("");

  return `

  <style>
    @media screen and (max-width: 480px) {
      .nui-outer   { padding: 20px 10px !important; }
      .nui-card    { border-radius: 0 !important; }
      .nui-header  { padding: 28px 20px 20px !important; }
      .nui-body    { padding: 24px 16px 20px !important; }
      .nui-heading { font-size: 20px !important; }
      .nui-btn     {
        display: block !important;
        width: 100% !important;
        text-align: center !important;
        padding: 14px 20px !important;
        box-sizing: border-box !important;
      }
      .nui-reason-list li {
        line-height: 1.5 !important;
        margin-bottom: 8px !important;
        font-size: 13px !important;
      }
      .nui-footer { padding: 20px 16px !important; }
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
        style="
          padding: 40px 40px 32px;
          background: #ffffff;
        "
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
        >Account Notification</p>

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
        >KYC Verification Update</h1>

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
            color: #3a3020;
            line-height: 1.8;
            margin: 0 0 8px;
            font-family: Georgia, serif;
          "
        >
          Dear <strong style="color: #8a6820;">${name}</strong>,
        </p>

        <p
          style="
            font-size: 14px;
            color: #5a5040;
            line-height: 1.8;
            margin: 0 0 18px;
            font-family: Georgia, serif;
          "
        >
          Thank you for submitting your KYC verification request to
          Numismatics Unlimited.
        </p>

        <p
          style="
            font-size: 14px;
            color: #5a5040;
            line-height: 1.8;
            margin: 0 0 18px;
            font-family: Georgia, serif;
          "
        >
          After a detailed review by our compliance team, we identified
          multiple issues within your application that must be resolved
          before your account can be approved for trading access.
        </p>

        <p
          style="
            font-size: 14px;
            color: #5a5040;
            line-height: 1.8;
            margin: 0 0 32px;
            font-family: Georgia, serif;
            font-weight: 600;
          "
        >
          Please review the following findings carefully:
        </p>

        <!-- Rejection Reasons -->
        <div
          style="
            border: 1px solid #e0cc90;
            border-left: 3px solid #c9a84c;
            padding: 14px 12px 14px 14px;
            margin-bottom: 32px;
            background: #fdf8ec;
          "
        >

          <p
            style="
              font-size: 11px;
              color: #a08848;
              letter-spacing: 0.12em;
              text-transform: uppercase;
              margin: 0 0 16px;
              font-family: Georgia, serif;
            "
          >
            Verification Findings
          </p>

          <ul
            class="nui-reason-list"
            style="
              padding-left: 14px;
              margin: 0;
            "
          >
            ${reasonsHtml}
          </ul>

        </div>

        <!-- Status Badge -->
        <div style="margin-bottom: 32px; text-align: right;">
          <span
            style="
              font-size: 11px;
              background: #fdecea;
              color: #c0392b;
              border: 1px solid #f5a09a;
              padding: 3px 10px;
              letter-spacing: 0.08em;
              text-transform: uppercase;
              font-family: Georgia, serif;
            "
          >Inactive</span>
        </div>

        <!-- CTA -->
        <div style="text-align: center; margin-bottom: 40px;">

          <a
            class="nui-btn"
            href="http://localhost:3000/login"
            style="
              display: inline-block;
              background: #c9a84c;
              color: #ffffff;
              font-size: 13px;
              font-weight: 700;
              padding: 14px 44px;
              text-decoration: none;
              letter-spacing: 0.12em;
              text-transform: uppercase;
              font-family: Georgia, serif;
            "
          >Resubmit Documents</a>

          <p
            style="
              font-size: 11px;
              color: #a09060;
              margin: 16px 0 0;
              font-family: Georgia, serif;
            "
          >
            Questions?
            <a href="tel:5167984170" style="color: #8a6820; text-decoration: none;">
              (516) 798.4170
            </a>
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