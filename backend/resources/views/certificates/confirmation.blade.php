<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Confirmation Certificate</title>
    <style>
        @page {
            margin: 0;
        }
        body {
            font-family: 'Times New Roman', Times, Georgia, serif;
            margin: 0;
            padding: 0;
            background: #fff;
            color: #2c2c2c;
        }

        .certificate {
            width: 100%;
            height: 100%;
            position: relative;
            box-sizing: border-box;
        }

        /* Ornate double border — royal purple */
        .border-outer {
            position: absolute;
            top: 12px;
            left: 12px;
            right: 12px;
            bottom: 12px;
            border: 3px solid #4B0082;
        }
        .border-inner {
            position: absolute;
            top: 22px;
            left: 22px;
            right: 22px;
            bottom: 22px;
            border: 1px solid #7B68AE;
        }

        /* Corner decorations — dove/flame symbol */
        .corner {
            position: absolute;
            width: 50px;
            height: 50px;
            color: #7B68AE;
            font-size: 40px;
            line-height: 1;
        }
        .corner-tl { top: 26px; left: 28px; }
        .corner-tr { top: 26px; right: 28px; transform: scaleX(-1); }
        .corner-bl { bottom: 26px; left: 28px; transform: scaleY(-1); }
        .corner-br { bottom: 26px; right: 28px; transform: scale(-1, -1); }

        .content {
            position: absolute;
            top: 35px;
            left: 50px;
            right: 50px;
            bottom: 40px;
            text-align: center;
        }

        /* Dove / Holy Spirit symbol */
        .spirit-symbol {
            font-size: 40px;
            color: #4B0082;
            margin-bottom: 3px;
        }

        /* Church header */
        .church-name {
            font-size: 28px;
            font-weight: bold;
            color: #4B0082;
            text-transform: uppercase;
            letter-spacing: 4px;
            margin: 0;
        }
        .diocese-name {
            font-size: 18px;
            color: #666;
            margin: 6px 0 2px 0;
            font-style: italic;
        }
        .parish-name {
            font-size: 15px;
            color: #888;
            margin: 0 0 8px 0;
        }

        /* Decorative divider */
        .divider {
            width: 50%;
            margin: 8px auto;
            border: none;
            border-top: 1px solid #7B68AE;
            position: relative;
        }
        .divider::after {
            content: '✦';
            position: absolute;
            top: -10px;
            left: 50%;
            transform: translateX(-50%);
            background: #fff;
            padding: 0 10px;
            color: #7B68AE;
            font-size: 14px;
        }

        /* Certificate title */
        .title {
            font-size: 40px;
            color: #4B0082;
            margin: 12px 0 3px 0;
            font-weight: bold;
            letter-spacing: 2px;
        }
        .subtitle {
            font-size: 15px;
            color: #999;
            text-transform: uppercase;
            letter-spacing: 6px;
            margin: 0 0 15px 0;
        }

        /* Main body */
        .body-text {
            font-size: 17px;
            line-height: 1.8;
            margin: 0 auto;
            max-width: 85%;
        }

        /* Confirmand name */
        .confirmand-name {
            font-size: 32px;
            font-weight: bold;
            color: #2c2c2c;
            margin: 10px 0;
            letter-spacing: 1px;
            text-decoration: underline;
            text-decoration-color: #7B68AE;
            text-underline-offset: 6px;
        }

        /* Confirmation name */
        .confirmation-name {
            font-size: 18px;
            color: #4B0082;
            font-style: italic;
            margin: 0 0 8px 0;
        }

        /* Details */
        .details-grid {
            width: 60%;
            margin: 12px auto;
            text-align: left;
            font-size: 15px;
        }
        .details-grid table {
            width: 100%;
        }
        .details-grid td {
            padding: 4px 8px;
            vertical-align: top;
        }
        .details-grid .label {
            font-weight: bold;
            color: #4B0082;
            width: 45%;
            text-align: right;
            padding-right: 15px;
        }
        .details-grid .value {
            color: #333;
            border-bottom: 1px dotted #ccc;
        }

        /* Scripture */
        .scripture {
            font-style: italic;
            font-size: 13px;
            color: #888;
            margin: 12px auto 0 auto;
            max-width: 75%;
            line-height: 1.5;
        }

        /* Signatures */
        .signatures {
            position: absolute;
            bottom: 55px;
            left: 60px;
            right: 60px;
        }
        .sig-box {
            display: inline-block;
            width: 35%;
            text-align: center;
            vertical-align: bottom;
        }
        .sig-box-left { float: left; }
        .sig-box-right { float: right; }
        .sig-img {
            height: 50px;
            object-fit: contain;
            margin-bottom: 3px;
        }
        .sig-line {
            border-top: 1px solid #333;
            margin-top: 8px;
            padding-top: 5px;
            font-size: 14px;
            font-weight: bold;
            color: #333;
        }
        .sig-name {
            font-size: 12px;
            font-weight: normal;
            color: #666;
        }

        /* Seal */
        .seal {
            position: absolute;
            bottom: 48px;
            left: 50%;
            transform: translateX(-50%);
            width: 80px;
            height: 80px;
            border-radius: 50%;
            border: 2px dashed #7B68AE;
            background: linear-gradient(135deg, #f0eaf7 0%, #d8cce8 100%);
            text-align: center;
            line-height: 1.2;
            padding-top: 22px;
            box-sizing: border-box;
            font-size: 10px;
            font-weight: bold;
            color: #4B0082;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        /* Footer */
        .cert-number {
            position: absolute;
            bottom: 15px;
            right: 30px;
            font-size: 10px;
            color: #bbb;
            font-family: 'Courier New', monospace;
        }
        .cert-date-footer {
            position: absolute;
            bottom: 15px;
            left: 30px;
            font-size: 10px;
            color: #bbb;
        }
    </style>
</head>
<body>
    <div class="certificate">
        <!-- Borders -->
        <div class="border-outer"></div>
        <div class="border-inner"></div>

        <!-- Corner ornaments -->
        <div class="corner corner-tl">&#10054;</div>
        <div class="corner corner-tr">&#10054;</div>
        <div class="corner corner-bl">&#10054;</div>
        <div class="corner corner-br">&#10054;</div>

        <div class="content">
            <!-- Holy Spirit Symbol -->
            <div class="spirit-symbol">&#10014;</div>

            <!-- Church Header -->
            <h1 class="church-name">Church of Uganda</h1>
            <p class="diocese-name">{{ $certificate->diocese ? $certificate->diocese->name : 'Diocese' }}</p>
            <p class="parish-name">{{ $certificate->organizationUnit ? $certificate->organizationUnit->name : 'Parish' }}</p>

            <hr class="divider">

            <!-- Title -->
            <h2 class="title">Certificate of Confirmation</h2>
            <p class="subtitle">Sealed with the Holy Spirit</p>

            <!-- Body -->
            <div class="body-text">
                This is to certify that
            </div>

            <!-- Confirmand Name -->
            <div class="confirmand-name">{{ $certificate->recipient_name }}</div>

            @if($certificate->details['confirmation_name'] ?? '')
                <div class="confirmation-name">
                    Confirmation Name: <strong>{{ $certificate->details['confirmation_name'] }}</strong>
                </div>
            @endif

            <div class="body-text">
                having been baptized and duly instructed in the Christian Faith,
                was confirmed by the laying on of hands by the Bishop<br>
                on the <strong>{{ $certificate->issued_date->format('jS') }}</strong> day of
                <strong>{{ $certificate->issued_date->format('F') }}</strong>,
                <strong>{{ $certificate->issued_date->format('Y') }}</strong>,
                at <strong>{{ $certificate->organizationUnit ? $certificate->organizationUnit->name : 'the Parish Church' }}</strong>,
                according to the rites of the Church of Uganda (Anglican Communion).
            </div>

            <!-- Details -->
            @if($certificate->details && (($certificate->details['parents'] ?? '') || ($certificate->details['sponsors'] ?? '')))
            <div class="details-grid">
                <table>
                    @if($certificate->details['parents'] ?? '')
                    <tr>
                        <td class="label">Parents / Guardians:</td>
                        <td class="value">{{ $certificate->details['parents'] }}</td>
                    </tr>
                    @endif
                    @if($certificate->details['sponsors'] ?? '')
                    <tr>
                        <td class="label">Sponsors / Godparents:</td>
                        <td class="value">{{ $certificate->details['sponsors'] }}</td>
                    </tr>
                    @endif
                </table>
            </div>
            @endif

            <!-- Scripture -->
            <div class="scripture">
                "And you also were included in Christ when you heard the message of truth, the gospel of your salvation.
                When you believed, you were marked in him with a seal, the promised Holy Spirit." &mdash; Ephesians 1:13
            </div>
        </div>

        <!-- Seal -->
        <div class="seal">
            Official<br>Seal
        </div>

        <!-- Signatures -->
        <div class="signatures">
            <div class="sig-box sig-box-left">
                @if($priestSignature && file_exists($priestSignature))
                    <img src="data:image/png;base64,{{ base64_encode(file_get_contents($priestSignature)) }}" class="sig-img">
                @else
                    <div style="height: 50px;"></div>
                @endif
                <div class="sig-line">
                    Parish Priest
                    <div class="sig-name">{{ $certificate->issuedBy ? $certificate->issuedBy->name : '' }}</div>
                </div>
            </div>

            <div class="sig-box sig-box-right">
                @if($bishopSignature && file_exists($bishopSignature))
                    <img src="data:image/png;base64,{{ base64_encode(file_get_contents($bishopSignature)) }}" class="sig-img">
                @else
                    <div style="height: 50px;"></div>
                @endif
                <div class="sig-line">
                    Bishop of the Diocese
                </div>
            </div>
            <div style="clear: both;"></div>
        </div>

        <!-- Footer -->
        <div class="cert-date-footer">Issued: {{ $certificate->issued_date->format('d/m/Y') }}</div>
        <div class="cert-number">Cert No: {{ $certificate->certificate_number }}</div>
    </div>
</body>
</html>
