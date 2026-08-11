<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Certificate of Confirmation</title>
    <style>
        @page {
            margin: 0;
            size: A4 landscape;
        }
        body {
            font-family: 'Times New Roman', Times, serif;
            margin: 0;
            padding: 0;
            background: #fff;
            color: #000;
        }
        /* Outer double border */
        .border-outer {
            margin: 20px;
            padding: 5px;
            border: 4px solid #8b0000; /* Dark Red */
            height: calc(100vh - 50px);
            box-sizing: border-box;
            position: relative;
        }
        .border-inner {
            border: 2px solid #8b0000;
            height: 100%;
            box-sizing: border-box;
            padding: 20px;
            position: relative;
            display: table;
            width: 100%;
        }
        .left-column {
            display: table-cell;
            width: 35%;
            vertical-align: middle;
            text-align: center;
            padding-right: 20px;
        }
        .right-column {
            display: table-cell;
            width: 65%;
            vertical-align: middle;
            text-align: center;
            padding-left: 20px;
        }
        .cert-of {
            color: #d4af37;
            font-size: 24px;
            letter-spacing: 2px;
            text-transform: uppercase;
            font-family: 'Georgia', serif;
        }
        .confirmation-title {
            color: #d4af37;
            font-size: 72px;
            font-family: 'Georgia', serif;
            font-style: italic;
            font-weight: bold;
            margin-top: 10px;
            margin-bottom: 30px;
        }
        .certifies {
            font-size: 22px;
            margin-bottom: 30px;
        }
        .name-line {
            width: 80%;
            margin: 0 auto 20px auto;
            border-bottom: 1px solid #333;
            font-size: 32px;
            font-weight: bold;
            padding-bottom: 5px;
        }
        .text-body {
            font-size: 20px;
            line-height: 1.5;
            margin: 0 auto 40px auto;
            width: 90%;
        }
        .field-row {
            margin: 25px auto;
            width: 80%;
            text-align: left;
            font-size: 20px;
            display: table;
        }
        .field-label {
            display: table-cell;
            width: 10%;
            white-space: nowrap;
        }
        .field-value {
            display: table-cell;
            border-bottom: 1px solid #333;
            text-align: center;
            font-weight: bold;
            width: 90%;
            padding-bottom: 5px;
            position: relative;
        }
        .signature-img {
            height: 40px;
            position: absolute;
            bottom: 5px;
            left: 50%;
            transform: translateX(-50%);
        }
        .verse {
            color: #8b0000;
            font-size: 18px;
            line-height: 1.4;
            margin-top: 60px;
            font-style: normal;
        }
        .verse-ref {
            margin-top: 10px;
            font-weight: bold;
        }
        .cross-symbol {
            color: #8b0000;
            font-size: 140px;
            line-height: 1;
            margin-bottom: 10px;
        }
        .dove-emoji {
            font-size: 60px;
        }
    </style>
</head>
<body>
    <div class="border-outer">
        <div class="border-inner">
            
            <div class="left-column">
                <div class="dove-emoji">&#x1F54A;</div>
                <div class="cross-symbol">&#x271D;</div>
                
                <div class="verse">
                    "I am the light of the world.<br>
                    Whoever follows me will<br>
                    never walk in darkness,<br>
                    but will have the light of life."
                    <div class="verse-ref">John 8:12</div>
                </div>
            </div>
            
            <div class="right-column">
                <div class="cert-of">CERTIFICATE OF</div>
                <div class="confirmation-title">Confirmation</div>
                
                <div class="certifies">This certifies that</div>
                
                <div class="name-line">
                    {{ $certificate->recipient_name }}
                </div>
                
                <div class="text-body">
                    was confirmed according to the rites of the Church of Uganda,<br>
                    receiving the Gift of the Holy Spirit
                </div>
                
                <div class="field-row">
                    <div class="field-label">on</div>
                    <div class="field-value">{{ $certificate->issued_date->format('F jS, Y') }}</div>
                </div>
                
                <div class="field-row">
                    <div class="field-label">at</div>
                    <div class="field-value">{{ $certificate->organizationUnit ? $certificate->organizationUnit->name : 'Our Parish' }}</div>
                </div>
                
                <div class="field-row">
                    <div class="field-label">by</div>
                    <div class="field-value">
                        @if($bishopSignature && file_exists($bishopSignature))
                            <img src="data:image/png;base64,{{ base64_encode(file_get_contents($bishopSignature)) }}" class="signature-img">
                        @elseif($priestSignature && file_exists($priestSignature))
                            <img src="data:image/png;base64,{{ base64_encode(file_get_contents($priestSignature)) }}" class="signature-img">
                        @else
                            {{ $certificate->issuedBy ? $certificate->issuedBy->name : '' }}
                        @endif
                    </div>
                </div>
                
            </div>
            
        </div>
    </div>
</body>
</html>
