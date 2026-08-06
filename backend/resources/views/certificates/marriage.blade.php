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

        * {
            box-sizing: border-box;
        }

        body {
            font-family: 'Times New Roman', Times, serif;
            margin: 0;
            padding: 0;
            background: #FFFAEE;
            color: #000;
            width: 297mm;
            height: 210mm;
        }

        /* Borders via margin so content never overflows */
        .page-wrap {
            margin: 8px;
            border: 2px solid #000080;
            padding: 4px;
            box-sizing: border-box;
        }

        .inner-border {
            border: 1px solid #000080;
            padding: 12px 14px 10px 14px;
            box-sizing: border-box;
        }

        /* Header */
        table.header-table {
            width: 100%;
            margin-bottom: 2px;
        }
        table.header-table td {
            vertical-align: top;
        }

        .header-text {
            font-family: 'Times New Roman', Times, serif;
            font-weight: bold;
            text-align: center;
        }
        .header-church {
            color: #E22B2B;
            font-size: 18px;
            letter-spacing: 3px;
            margin-bottom: 1px;
            text-transform: uppercase;
        }
        .header-cou {
            color: #000;
            font-size: 14px;
            letter-spacing: 2px;
            margin-bottom: 1px;
        }
        .header-holy {
            color: #000;
            font-size: 14px;
            letter-spacing: 2px;
            margin-bottom: 3px;
        }
        .header-cert {
            color: #FDB813;
            font-size: 32px;
            font-style: italic;
            letter-spacing: 8px;
            margin-bottom: 4px;
        }
        .header-no {
            font-size: 14px;
            font-weight: bold;
            letter-spacing: 2px;
        }

        .main-title {
            color: #E22B2B;
            font-size: 24px;
            font-weight: bold;
            text-align: center;
            letter-spacing: 6px;
            margin: 8px 0 10px 0;
        }

        .this-text {
            font-size: 17px;
            text-align: right;
            margin-right: 40px;
            letter-spacing: 2px;
            margin-bottom: 0;
        }

        .body-text {
            font-size: 17px;
            line-height: 1.55;
            margin: 0 30px;
            letter-spacing: 0.5px;
        }

        .blank {
            color: #E22B2B;
            font-weight: bold;
            text-transform: uppercase;
            border-bottom: 2px dotted #E22B2B;
            padding: 0 4px;
        }

        .sub-label {
            font-size: 15px;
            font-style: italic;
            color: #000;
            font-weight: normal;
        }

        .witness-block {
            margin-top: 6px;
        }

        /* Signatures row */
        .signatures {
            margin-top: 10px;
            width: 100%;
        }
        .sig-box {
            display: inline-block;
            width: 42%;
            text-align: center;
        }
        .sig-box-left { float: left; }
        .sig-box-right { float: right; }

        .sig-line {
            border-top: 1px solid #777;
            margin-top: 4px;
            padding-top: 4px;
            font-size: 13px;
            color: #333;
        }
        .sig-img {
            height: 40px;
            object-fit: contain;
            margin-bottom: -4px;
        }

        .footer-text {
            margin-top: 10px;
            letter-spacing: 2px;
            text-align: center;
            font-size: 16px;
            clear: both;
        }

        .clear { clear: both; }
    </style>
</head>
<body>
    <div class="page-wrap">
        <div class="inner-border">

                {{-- Header --}}
                <table class="header-table">
                    <tr>
                        {{-- Church illustration --}}
                        <td style="width: 22%; text-align: left; vertical-align: top;">
                            @php
                                $churchImgPath = public_path('assets/img/illustrations/real-church.png');
                                $churchImgData = file_exists($churchImgPath) ? base64_encode(file_get_contents($churchImgPath)) : '';
                            @endphp
                            @if($churchImgData)
                                <img src="data:image/png;base64,{{ $churchImgData }}" style="width: 140px; height: 110px; object-fit: cover;" />
                            @else
                                <div style="width: 140px; height: 110px; background: #ddd;"></div>
                            @endif
                        </td>

                        {{-- Center text --}}
                        <td style="width: 60%; vertical-align: top;">
                            <div class="header-text">
                                <div class="header-church">{{ strtoupper($certificate->organizationUnit ? $certificate->organizationUnit->name : 'SAINT ANDREW\'S CHURCH-BUKOTO') }}</div>
                                <div class="header-cou">CHURCH OF UGANDA</div>
                                <div class="header-holy">HOLY MARRIAGE</div>
                                <div class="header-cert">CERTIFICATE</div>
                                <div class="header-no">No. {{ $certificate->certificate_number }}</div>
                            </div>
                        </td>

                        {{-- Logo --}}
                        <td style="width: 20%; text-align: right; vertical-align: top;">
                            @php
                                $logoImgPath = public_path('logo.png');
                                $logoImgData = file_exists($logoImgPath) ? base64_encode(file_get_contents($logoImgPath)) : '';
                            @endphp
                            @if($logoImgData)
                                <img src="data:image/png;base64,{{ $logoImgData }}" style="width: 90px; height: auto; display: block; margin-left: auto;" />
                            @else
                                <div style="width: 90px; height: 100px; background: #ddd; margin-left: auto;"></div>
                            @endif
                        </td>
                    </tr>
                </table>

                {{-- Title --}}
                <div class="main-title">MARRIAGE CERTICATE</div>

                @php
                    $names   = explode('&', $certificate->recipient_name);
                    $husband = trim($names[0] ?? '');
                    $wife    = trim($names[1] ?? '');

                    $day   = $certificate->issued_date->format('jS');
                    $month = $certificate->issued_date->format('F');
                    $year  = $certificate->issued_date->format('Y');

                    $dioceseName = $certificate->diocese ? $certificate->diocese->name : 'Namirembe diocese';

                    $witnesses = explode(',', $certificate->details['sponsors'] ?? '');
                    $witness1  = trim($witnesses[0] ?? '');
                    $witness2  = trim($witnesses[1] ?? '');
                @endphp

                {{-- "This" right-aligned --}}
                <div class="this-text">This</div>

                {{-- Body --}}
                <div class="body-text">
                    is to certify that &nbsp;<span class="blank">{{ $husband }}</span>&nbsp;<span class="sub-label">(NAME OF HUSBAND)</span> and
                    &nbsp;&nbsp;&nbsp;<span class="blank">{{ $wife }}</span>&nbsp;&nbsp;&nbsp;<span class="sub-label">(NAME OF WIFE)</span> were<br>
                    lawfully wedded on the <span class="blank">{{ $day }}</span> Day of <span class="blank">{{ $month }}</span><br>
                    <span class="blank">{{ $year }}</span> According to the rite of the {{ $dioceseName }}
                    church of Uganda.<br><br>

                    In the Presence of <span class="blank">{{ strtoupper($certificate->issuedBy ? $certificate->issuedBy->name : 'REV.') }}</span> officiating<br>
                    The ceremony.

                    {{-- Witnesses --}}
                    <div class="witness-block">
                        <table style="width: 100%; font-size: 17px;">
                            <tr>
                                <td style="width: 110px; vertical-align: bottom;">Witnesses</td>
                                <td style="vertical-align: bottom;">1. <span class="blank">{!! $witness1 ?: str_repeat('&nbsp;', 20) !!}</span></td>
                            </tr>
                            <tr>
                                <td></td>
                                <td style="vertical-align: bottom;">2. <span class="blank">{!! $witness2 ?: str_repeat('&nbsp;', 20) !!}</span></td>
                            </tr>
                        </table>
                    </div>

                    {{-- Signatures --}}
                    <div class="signatures">
                        <div class="sig-box sig-box-left">
                            @if(isset($priestSignature) && $priestSignature && file_exists($priestSignature))
                                <img src="data:image/png;base64,{{ base64_encode(file_get_contents($priestSignature)) }}" class="sig-img">
                            @else
                                <div style="height: 40px;"></div>
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
                                <div style="height: 40px;"></div>
                            @endif
                            <div class="sig-line">
                                Bishop
                            </div>
                        </div>
                        <div class="clear"></div>
                    </div>

                    {{-- Footer --}}
                    <div class="footer-text">
                        As it appears from the marriage register of this church
                    </div>
                </div>

        </div>
    </div>
</body>
</html>
