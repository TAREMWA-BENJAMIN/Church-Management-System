<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Marriage Certificate</title>
    <style>
        @page {
            margin: 0;
            size: a4 landscape;
        }
        body {
            font-family: 'Times New Roman', Times, serif;
            margin: 0;
            padding: 0;
            background: #FFFAEE; 
            color: #000;
        }

        /* Fixed borders for DOMPDF */
        .outer-border {
            position: absolute;
            top: 20px;
            bottom: 20px;
            left: 20px;
            right: 20px;
            border: 2px solid #000080;
        }

        .inner-border {
            position: absolute;
            top: 5px;
            bottom: 5px;
            left: 5px;
            right: 5px;
            border: 1px solid #000080;
        }

        .content {
            position: absolute;
            top: 40px;
            left: 40px;
            right: 40px;
            bottom: 40px;
        }

        /* Header layout */
        table.header-table {
            width: 100%;
            margin-bottom: 5px;
        }
        table.header-table td {
            vertical-align: top;
            text-align: center;
        }

        .header-text {
            font-family: 'Times New Roman', Times, serif;
            font-weight: bold;
        }
        .header-church {
            color: #E22B2B;
            font-size: 24px;
            letter-spacing: 4px;
            margin-bottom: 2px;
            text-transform: uppercase;
        }
        .header-cou {
            color: #000;
            font-size: 18px;
            letter-spacing: 3px;
            margin-bottom: 2px;
        }
        .header-holy {
            color: #000;
            font-size: 18px;
            letter-spacing: 3px;
            margin-bottom: 5px;
        }
        .header-cert {
            color: #FDB813;
            font-size: 42px;
            font-style: italic;
            letter-spacing: 10px;
            margin-bottom: 10px;
        }
        .header-no {
            font-size: 18px;
            font-weight: bold;
            letter-spacing: 2px;
        }

        .main-title {
            color: #E22B2B;
            font-size: 32px;
            font-weight: bold;
            text-align: center;
            letter-spacing: 8px;
            margin: 15px 0 25px 0;
        }

        .this-text {
            font-size: 22px;
            text-align: right;
            margin-right: 50px;
            letter-spacing: 2px;
        }

        .body-text {
            font-size: 20px;
            line-height: 1.6;
            margin: 0 40px;
            letter-spacing: 1px;
            text-align: justify;
        }

        .blank {
            color: #E22B2B;
            font-weight: bold;
            text-transform: uppercase;
            border-bottom: 2px dotted #E22B2B;
            padding: 0 5px;
        }

        .sub-label {
            font-size: 18px;
            font-style: italic;
            color: #000;
            font-weight: normal;
        }

        .witness-block {
            margin-top: 10px;
        }

        .signatures {
            margin-top: 10px;
            width: 100%;
        }

        .sig-box {
            display: inline-block;
            width: 40%;
            text-align: center;
        }

        .sig-box-left { float: left; }
        .sig-box-right { float: right; }

        .sig-line {
            border-top: 1px solid #777777;
            margin-top: 5px;
            padding-top: 5px;
            font-size: 16px;
            color: #333333;
        }
        
        .sig-img {
            height: 45px;
            object-fit: contain;
            margin-bottom: -5px;
        }

        .footer-text {
            margin-top: 15px;
            letter-spacing: 2px;
            text-align: center;
        }
        .clear {
            clear: both;
        }
    </style>
</head>
<body>
    <div class="outer-border">
        <div class="inner-border"></div>
    </div>
    
    <div class="content">
        
        <table class="header-table">
            <tr>
                <td style="width: 25%; text-align: left; vertical-align: top;">
                    @php
                        $churchImgPath = public_path('assets/img/illustrations/real-church.png');
                        $churchImgData = file_exists($churchImgPath) ? base64_encode(file_get_contents($churchImgPath)) : '';
                    @endphp
                    @if($churchImgData)
                        <img src="data:image/png;base64,{{ $churchImgData }}" style="width: 170px; height: 130px; object-fit: cover;" />
                    @else
                        <div style="width: 170px; height: 130px; background: #ddd;"></div>
                    @endif
                </td>
                <td style="width: 50%; vertical-align: top;">
                    <div class="header-text">
                        <div class="header-church">{{ strtoupper($certificate->organizationUnit ? $certificate->organizationUnit->name : 'SAINT ANDREW\'S CHURCH-BUKOTO') }}</div>
                        <div class="header-cou">CHURCH OF UGANDA</div>
                        <div class="header-holy">HOLY MARRIAGE</div>
                        <div class="header-cert">CERTIFICATE</div>
                        <div class="header-no">No. {{ $certificate->certificate_number }}</div>
                    </div>
                </td>
                <td style="width: 25%; text-align: right; vertical-align: top;">
                    @php
                        $logoImgPath = public_path('logo.png');
                        $logoImgData = file_exists($logoImgPath) ? base64_encode(file_get_contents($logoImgPath)) : '';
                    @endphp
                    @if($logoImgData)
                        <img src="data:image/png;base64,{{ $logoImgData }}" style="width: 120px; height: auto; float: right;" />
                    @else
                        <div style="width: 120px; height: 140px; background: #ddd; float: right;"></div>
                    @endif
                </td>
            </tr>
        </table>

        <!-- The user's image explicitly says "MARRIAGE CERTICATE" -->
        <div class="main-title">MARRIAGE CERTICATE</div>

        @php
            $names = explode('&', $certificate->recipient_name);
            $husband = trim($names[0] ?? '');
            $wife = trim($names[1] ?? '');

            $day = $certificate->issued_date->format('jS');
            $month = $certificate->issued_date->format('F');
            $year = $certificate->issued_date->format('Y');
            
            $dioceseName = $certificate->diocese ? $certificate->diocese->name : 'Namirembe diocese';

            $witnesses = explode(',', $certificate->details['sponsors'] ?? '');
            $witness1 = trim($witnesses[0] ?? '');
            $witness2 = trim($witnesses[1] ?? '');
        @endphp

        <div class="this-text">This</div>
        <div class="body-text">
            is to certify that &nbsp;<span class="blank">{{ $husband }}</span><span class="sub-label">(NAME OF HUSBAND)</span> and
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="blank">{{ $wife }}</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="sub-label">(NAME OF WIFE)</span> were<br>
            lawfully wedded on the <span class="blank">{{ $day }}</span> Day of <span class="blank">{{ $month }}</span><br>
            <span class="blank">{{ $year }}</span> According to the rite of the {{ $dioceseName }}<br>
            church of Uganda.<br><br>

            In the Presence of <span class="blank">{{ strtoupper($certificate->issuedBy ? $certificate->issuedBy->name : 'REV.') }}</span> officiating<br>
            The ceremony.<br>
            
            <div class="witness-block">
                <table style="width: 100%; font-size: 20px; margin-bottom: 0; padding-bottom: 0;">
                    <tr>
                        <td style="width: 130px; vertical-align: bottom;">Witnesses</td>
                        <td style="vertical-align: bottom;">1. <span class="blank">{!! $witness1 ?: str_repeat('&nbsp;', 25) !!}</span></td>
                    </tr>
                    <tr>
                        <td></td>
                        <td style="vertical-align: bottom;">2. <span class="blank">{!! $witness2 ?: str_repeat('&nbsp;', 25) !!}</span></td>
                    </tr>
                </table>
            </div>

            <div class="signatures">
                <div class="sig-box sig-box-left">
                    @if(isset($priestSignature) && $priestSignature && file_exists($priestSignature))
                        <img src="data:image/png;base64,{{ base64_encode(file_get_contents($priestSignature)) }}" class="sig-img">
                    @else
                        <div style="height: 45px;"></div>
                    @endif
                    <div class="sig-line">
                        Officiated by<br>
                        {{ $certificate->issuedBy ? $certificate->issuedBy->name : '' }}
                    </div>
                </div>

                <div class="sig-box sig-box-right">
                    @if(isset($bishopSignature) && $bishopSignature && file_exists($bishopSignature))
                        <img src="data:image/png;base64,{{ base64_encode(file_get_contents($bishopSignature)) }}" class="sig-img">
                    @else
                        <div style="height: 45px;"></div>
                    @endif
                    <div class="sig-line">
                        Bishop
                    </div>
                </div>
                <div class="clear"></div>
            </div>
            
            <div class="footer-text">
                As it appears from the marriage register of this church
            </div>
        </div>
    </div>
</body>
</html>
