<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>{{ $certificate->type }} Certificate</title>
    <style>
        body {
            font-family: 'Times New Roman', Times, serif;
            margin: 0;
            padding: 0;
            background: #fff;
            color: #333;
        }
        .container {
            width: 100%;
            height: 100%;
            border: 15px solid #4B0082; /* Deep Purple */
            padding: 40px;
            box-sizing: border-box;
            position: relative;
            text-align: center;
        }
        .header {
            margin-bottom: 30px;
        }
        .header h1 {
            font-size: 36px;
            color: #4B0082;
            margin: 0;
            text-transform: uppercase;
            letter-spacing: 2px;
        }
        .header h2 {
            font-size: 24px;
            color: #666;
            margin: 10px 0 0 0;
            font-weight: normal;
        }
        .certificate-title {
            font-size: 48px;
            color: #D4AF37; /* Gold */
            margin: 40px 0;
            font-style: italic;
            font-weight: bold;
        }
        .content {
            font-size: 22px;
            line-height: 1.6;
            margin-bottom: 50px;
        }
        .recipient {
            font-size: 32px;
            font-weight: bold;
            color: #000;
            text-decoration: underline;
        }
        .details-table {
            width: 60%;
            margin: 0 auto;
            text-align: left;
            font-size: 18px;
        }
        .details-table td {
            padding: 5px 0;
        }
        .details-table td:first-child {
            font-weight: bold;
            color: #555;
            width: 40%;
        }
        .signatures {
            position: absolute;
            bottom: 60px;
            width: 100%;
            left: 0;
        }
        .signature-box {
            display: inline-block;
            width: 35%;
            text-align: center;
        }
        .signature-img {
            height: 60px;
            object-fit: contain;
            margin-bottom: 5px;
        }
        .signature-line {
            border-top: 1px solid #000;
            margin-top: 10px;
            padding-top: 5px;
            font-weight: bold;
        }
        .certificate-number {
            position: absolute;
            bottom: 20px;
            right: 40px;
            font-size: 12px;
            color: #999;
        }
        .seal {
            position: absolute;
            bottom: 40px;
            left: 50%;
            transform: translateX(-50%);
            width: 100px;
            height: 100px;
            border-radius: 50%;
            background-color: #D4AF37;
            color: #fff;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            font-weight: bold;
            text-align: center;
            border: 2px dashed #B8860B;
        }
        .seal-text {
            margin-top: 35px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Church of Uganda</h1>
            <h2>{{ $certificate->diocese ? $certificate->diocese->name : 'Unknown Diocese' }}</h2>
            <h3>{{ $certificate->organizationUnit ? $certificate->organizationUnit->name : 'Unknown Parish' }}</h3>
        </div>

        <div class="certificate-title">
            Certificate of {{ $certificate->type }}
        </div>

        <div class="content">
            This is to certify that<br>
            <span class="recipient">{{ $certificate->recipient_name }}</span><br>
            received the Holy Sacrament of {{ $certificate->type }}<br>
            on {{ $certificate->issued_date->format('F jS, Y') }}.
        </div>

        @if($certificate->details)
        <table class="details-table">
            @foreach($certificate->details as $key => $value)
                <tr>
                    <td>{{ ucwords(str_replace('_', ' ', $key)) }}:</td>
                    <td>{{ $value }}</td>
                </tr>
            @endforeach
        </table>
        @endif

        <div class="seal">
            <div class="seal-text">OFFICIAL SEAL</div>
        </div>

        <div class="signatures">
            <div class="signature-box" style="float: left; margin-left: 10%;">
                @if($priestSignature && file_exists($priestSignature))
                    <img src="data:image/png;base64,{{ base64_encode(file_get_contents($priestSignature)) }}" class="signature-img">
                @else
                    <div style="height: 60px;"></div>
                @endif
                <div class="signature-line">
                    Parish Priest<br>
                    <span style="font-size: 14px; font-weight: normal;">{{ $certificate->issuedBy ? $certificate->issuedBy->name : 'Priest' }}</span>
                </div>
            </div>

            <div class="signature-box" style="float: right; margin-right: 10%;">
                @if($bishopSignature && file_exists($bishopSignature))
                    <img src="data:image/png;base64,{{ base64_encode(file_get_contents($bishopSignature)) }}" class="signature-img">
                @else
                    <div style="height: 60px;"></div>
                @endif
                <div class="signature-line">
                    Bishop of the Diocese
                </div>
            </div>
            <div style="clear: both;"></div>
        </div>

        <div class="certificate-number">
            Cert No: {{ $certificate->certificate_number }}
        </div>
    </div>
</body>
</html>
