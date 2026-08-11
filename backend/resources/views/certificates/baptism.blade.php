<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Certificate of Baptism</title>
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
            border: 4px solid #b87333; /* Copper/Bronze color */
            height: calc(100vh - 50px);
            box-sizing: border-box;
            position: relative;
        }
        /* Inner double border */
        .border-inner {
            border: 2px solid #b87333;
            height: 100%;
            box-sizing: border-box;
            padding: 40px;
            position: relative;
            text-align: center;
        }
        /* Ornate corners could be added with background images, but we'll use CSS for simplicity */
        
        .title {
            font-size: 56px;
            font-weight: bold;
            color: #000;
            margin-top: 20px;
            margin-bottom: 20px;
            /* In a real app we'd load an Old English font here */
            font-family: 'Georgia', serif; 
            letter-spacing: 2px;
            text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
        }
        
        .certifies {
            font-size: 20px;
            letter-spacing: 3px;
            text-transform: uppercase;
            margin-bottom: 40px;
        }
        
        .recipient-line {
            width: 80%;
            margin: 0 auto 20px auto;
            border-bottom: 1px solid #b87333;
            font-size: 28px;
            font-weight: bold;
            font-style: italic;
            padding-bottom: 5px;
            text-transform: capitalize;
        }
        
        .baptized-text {
            font-size: 22px;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 10px;
            line-height: 1.5;
        }
        
        .date-location {
            margin-top: 40px;
            font-size: 20px;
            text-transform: uppercase;
        }
        
        .date-location span {
            display: inline-block;
            border-bottom: 1px solid #b87333;
            min-width: 250px;
            padding: 0 10px;
            font-weight: bold;
        }
        
        .pastor-line {
            margin-top: 30px;
            font-size: 20px;
            text-transform: uppercase;
        }
        
        .pastor-line span {
            display: inline-block;
            border-bottom: 1px solid #b87333;
            min-width: 300px;
            padding: 0 10px;
            font-weight: bold;
        }
        
        .signatures {
            margin-top: 60px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            position: relative;
            width: 90%;
            margin-left: auto;
            margin-right: auto;
        }
        
        .signature-box {
            width: 30%;
            text-align: left;
            font-size: 18px;
            text-transform: uppercase;
        }
        
        .signature-box .sig-line {
            border-bottom: 1px solid #b87333;
            margin-bottom: 5px;
            height: 40px;
        }

        .signature-img {
            height: 40px;
            object-fit: contain;
            display: block;
            margin-top: -30px;
        }
        
        .seal {
            width: 80px;
            height: 80px;
            border: 2px solid #d4af37;
            border-radius: 50%;
            display: inline-block;
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
            /* A simple cross inside the seal */
            background: radial-gradient(circle, #f9f2e3 0%, #d4af37 100%);
        }
        
        .seal::after {
            content: "+";
            font-size: 40px;
            color: #b87333;
            line-height: 80px;
            font-family: Arial, sans-serif;
        }
        
        .verse {
            margin-top: 40px;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 1px;
            width: 80%;
            margin-left: auto;
            margin-right: auto;
            line-height: 1.5;
        }
        
        .verse-ref {
            margin-top: 5px;
            font-size: 14px;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="border-outer">
        <div class="border-inner">
            <div class="title">Certificate of Baptism</div>
            
            <div class="certifies">This Certifies That</div>
            
            <div class="recipient-line">
                {{ $certificate->recipient_name }}
            </div>
            
            <div class="baptized-text">
                was baptized in the name of the Father<br>
                and the Son and of the Holy Spirit
            </div>
            
            <div class="date-location">
                ON <span>{{ $certificate->issued_date->format('F jS, Y') }}</span> 
                AT <span>{{ $certificate->organizationUnit ? $certificate->organizationUnit->name : 'Our Parish' }}</span>
            </div>
            
            <div class="pastor-line">
                PASTOR <span>{{ $certificate->issuedBy ? $certificate->issuedBy->name : '' }}</span>
            </div>
            
            <div style="position: absolute; bottom: 120px; width: 100%;">
                <table style="width: 90%; margin: 0 auto; text-align: left; font-size: 18px; text-transform: uppercase;">
                    <tr>
                        <td style="width: 35%; vertical-align: bottom;">
                            <div style="border-bottom: 1px solid #b87333; height: 50px; position: relative;">
                                @if($priestSignature && file_exists($priestSignature))
                                    <img src="data:image/png;base64,{{ base64_encode(file_get_contents($priestSignature)) }}" style="height: 40px; position: absolute; bottom: 0;">
                                @endif
                            </div>
                            <div>SIGNATURE</div>
                        </td>
                        <td style="width: 30%; text-align: center; vertical-align: bottom;">
                            <div style="width: 80px; height: 80px; border: 2px solid #d4af37; border-radius: 50%; display: inline-block; background: #fff; line-height: 80px; font-size: 40px; color: #d4af37; font-family: sans-serif;">+</div>
                        </td>
                        <td style="width: 35%; vertical-align: bottom;">
                            <div style="border-bottom: 1px solid #b87333; height: 50px; position: relative;">
                                @if($bishopSignature && file_exists($bishopSignature))
                                    <img src="data:image/png;base64,{{ base64_encode(file_get_contents($bishopSignature)) }}" style="height: 40px; position: absolute; bottom: 0;">
                                @endif
                            </div>
                            <div>SIGNATURE</div>
                        </td>
                    </tr>
                </table>
            </div>
            
            <div style="position: absolute; bottom: 30px; width: 100%;">
                <div class="verse">
                    "SO IN CHRIST JESUS YOU ARE ALL CHILDREN OF GOD THROUGH FAITH, FOR ALL OF YOU<br>
                    WHO WERE BAPTIZED INTO CHRIST HAVE CLOTHED YOURSELVES WITH CHRIST"
                </div>
                <div class="verse-ref">
                    GALATIANS 3:26-27
                </div>
            </div>
            
        </div>
    </div>
</body>
</html>
