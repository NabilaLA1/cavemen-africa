<?php

/**
 * HTML for PDF ticket (used with Dompdf on PHP / cPanel).
 */
class AsaliTicketPdfHtml
{
    public static function build(array $reg, $eventName, $venueLine, $txRef)
    {
        $name = self::e($reg['fullName'] ?? '');
        $code = self::e($reg['ticketCode'] ?? '');
        $type = self::e($reg['attendanceType'] ?? '');
        $amount = (int) ($reg['ticketPriceNaira'] ?? 0);
        $event = self::e($eventName);
        $venue = self::e($venueLine);
        $ref = self::e($txRef);

        return '<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    * { box-sizing: border-box; }
    body { font-family: DejaVu Sans, sans-serif; color: #1c1915; font-size: 10pt; margin: 0; padding: 28px; }
    .h { background: #1e3d2f; color: #fefdfb; padding: 20px 24px; margin: -28px -28px 20px; }
    .h small { color: #e8a090; font-size: 8pt; letter-spacing: 0.08em; }
    h1 { font-size: 18pt; margin: 8px 0 0; }
    .sub { color: rgba(246,241,232,0.95); font-size: 9pt; margin-top: 6px; font-style: italic; }
    .box { background: #ebe3d2; border-left: 8px solid #c45c3e; padding: 16px 18px; margin: 16px 0; }
    .code { font-family: DejaVu Sans Mono, monospace; font-size: 20pt; font-weight: 700; color: #1e3d2f; margin: 8px 0; letter-spacing: 0.04em; }
    .pill { display: inline-block; background: #1e3d2f; color: #f6f1e8; padding: 6px 12px; border-radius: 20px; font-size: 10pt; font-weight: 700; margin-top: 8px; }
    .foot { text-align: center; color: #4a443a; font-size: 8.5pt; margin-top: 20px; }
    .ref { text-align: center; color: #9e4328; font-size: 8pt; margin-top: 8px; }
  </style>
</head>
<body>
  <div class="h">
    <div><small>CAVEMEN AFRICA · STUDIO OF STUDIOS · KANO</small></div>
    <h1>' . $event . '</h1>
    <p class="sub">Where raw voices rise — a creative space in Northern Nigeria.</p>
  </div>
  <p><strong>Hi ' . $name . ',</strong></p>
  <p style="color:#4a443a;">Your entry pass. Show this PDF or quote your code at the door.</p>
  <div class="box">
    <div style="color:#9e4328;font-size:7.5pt;font-weight:bold;letter-spacing:0.12em;">ENTRY PASS</div>
    <div style="color:#4a443a;font-size:9pt;margin-top:6px;">Code</div>
    <div class="code">' . $code . '</div>
    <div class="pill">' . $type . ' · ₦' . $amount . '</div>
  </div>
  <p class="foot">' . $venue . '</p>
  <p class="ref">Reference: ' . $ref . '</p>
  <p class="foot" style="font-style:italic;">Cavemen Africa · CAVEMEN IMPACT SOLUTIONS LTD</p>
</body>
</html>';
    }

    private static function e($s)
    {
        return htmlspecialchars((string) $s, ENT_QUOTES | ENT_HTML5, 'UTF-8');
    }
}
