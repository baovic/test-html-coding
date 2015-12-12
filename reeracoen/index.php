<?php
if (empty($_SERVER['HTTPS'])) {
    header("Location: https://{$_SERVER['HTTP_HOST']}{$_SERVER['REQUEST_URI']}");
    exit;
}
?>
<?php
    $error = false;
    if (isset($_POST['sendmail']))
    {
		mb_language("Japanese");
		mb_internal_encoding("UTF-8");
        $phone = "";
        if (isset($_POST['phone'])){
            $phone = $_POST['phone'];
        }
        $to = "sangmi.do@neo-career.co.jp";

		$from_name = $_POST['name'];
		$from_addr = $_POST['email'];
		$from_name_enc = mb_encode_mimeheader($from_name, "ISO-2022-JP");
		$from = "$from_name_enc<$from_addr>";

		// メールヘッダを作成
		$header  = "From: $from\n";
		$header .= "Reply-To: $from";

		$subject = "Webからのお問い合わせ";

		$message  ='会社名: '.$_POST['global'] . "\n";
		$message .= 'お名前: '.$_POST['name'] . "\n";
		$message .= 'メールアドレス: '.$_POST['email'] . "\n";
		$message .= '電話番号: '.$phone . "\n";
		$message .= 'お問い合わせ・ご相談内容' . "\n";
		$message .= $_POST['content'] . "\n";

        if(mb_send_mail($to, $subject, $message, $header)){
            header("Location: Thanks.php");
        }else{
          $error = true;
          $error_msg = "<p class='sendmail'>エラーにより送信できませんでした。<br>お手数ですが再度お試しいただくかsangmi.do@neo-career.co.jpまで直接メールを送ってください。</p>";
          $error_script = 
        "<script type=\"text/javascript\">
            $(document).ready(function(){
             $('html, body').animate({scrollTop: $('.sendmail').offset().top}, 500);

            });
        </script>";
        }

		;
    }
?>
<!DOCTYPE html>
<html>
  <head>
    <meta content="" name="keywords">
    <meta content="" name="description">
    <meta content="" name="copyright">
    <meta content="text/html; charset=utf-8" http-equiv="Content-Type">
    <meta content="ja" http-equiv="Content-Language">
    <meta content="text/css" http-equiv="Content-Style-Type">
    <meta content="text/javascript" http-equiv="Content-Script-Type">
     <meta id="viewport" name="viewport" content="" />
    <script>
        if(screen.width <= 736){
            document.getElementById("viewport").setAttribute("content", "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no");
        }
    </script>
    <title>neo career</title>
    <link type="text/css" rel="stylesheet" href="css/common.css">
    <script src="js/jquery-1.9.1.min.js"></script>
  </head>
  <body>
        <div class="header">
             <div class="container container-sp-H">  
                <h1>台湾進出ならネオキャリアのGLOBAL MATCH（成功報酬型）</h1>
                <a href="/" class="logo"><img src="images/header-logo.png" alt="neo career"></a>
             </div><!--container  --> 
         <div class="global">
             <div class="container container-sp-S">   
                <span>GLOBAL MATCH</span>
                <a class="link_form"><img src="images/img-0.png" class="phone-email show-pc"></a>
             </div><!--container  --> 
         </div><!--global  --> 
        </div>
        <!--header-->
            <div class="container container-sp-C"> 

                <img src="images/banner.png" class="banner1234 show-pc">
                <img src="images/sp/banner.png" class="banner1234 show-sp">

                <p class="p-1">まずはお気軽にお問い合わせください。</p>
                <ul class="listEp">
                    <li><a class="link_form"><img src="images/button-email.png"></a></li>
                    <li><a href="tel:0359088325"><img src="images/button-phone.png"></a></li>
                </ul>
                <h2 id="div1">こんなことでお困りではないですか？</h2>
                  <img src="images/banner-2.png" class="show-pc">
                  <img src="images/sp/banner-2.png" class="banner-2 show-sp">


                <p class="p-2">お任せください！その課題、GLOBAL MATCH が解決します！</p>
                <h2 id="div2">サービス概要</h2>
                  <img src="images/img-text-1.png" class="img-text-1 show-pc">
                  <img src="images/sp/img-text-1.png" class="img-text-1 show-sp">

                <p class="p-3">
                    貴社に代わって、台湾市場での最適な販路（取引先台湾企業）を探し、貴社商品の提案・PRを行います。<br>貴社の商品に興味のある台湾企業との商談の場を設定いたします。
                </p>

                <img src="images/banner-3.png" class="banner-3 show-pc">
                <img src="images/sp/banner-3.png" class="banner-3 show-sp">

                <h2 id="div3">GLOBAL MATCHが選ばれる３つ理由</h2>
                <ul class="listtroubled">
                    <li>
                      <img src="images/img-1.png" class="show-pc">
                      <img src="images/sp/img-1.png" class="show-sp">
                    </li>
                    <li>
                      <img src="images/img-2.png" class="show-pc">
                      <img src="images/sp/img-2.png" class="show-sp">
                    </li>
                    <li>
                      <img src="images/img-3.png" class="show-pc">
                      <img src="images/sp/img-3.png" class="show-sp">
                    </li>
                </ul>
                 <h2 id="div4">お客様の声</h2>
                 <img src="images/img-text-2.png" class="img-text-1">
                 <ul class="listVoice-1">
                    <li>
                        <img src="images/img-6.png">
                        <p>
                            <span class="span1">A社様（バッグ・財布）</span>
                            <span class="span2">海外へのアプローチとして、それまで海外出張での市場リサーチは行ってきましたが、具体的なテレビ通販会社への足がかりをつかむことは出来ませんでした。 そのような中、アジアンブリッジさんをインターネットで探し当てご相談したところ、驚くほどのスピードで調査・商談まで運んで戴き、大手放送局のTVショッピングに見事採用決定となりました。 放送後はジャパンブランドとして反響を戴き、瞬く間に当社海外市場の主力チャンネルとなりました。</span>
                        </p>
                    </li>
                    <li>
                        <img src="images/img-7.png">
                        <p>
                            <span class="span2">台湾テレビショピング、業界第1位の富邦momoと商談設定。 商談開始から1ヶ月で、上代1万円以上のバッグ2000個の発注が決定。<br>現在はバッグだけでなく、財布などのカテゴリーでも提案が進行中。</span>
                        </p>
                    </li>
                 </ul>
                 <ul class="listVoice-1">
                    <li>
                        <img src="images/img-5.png">
                        <p>
                            <span class="span1">B社様（真珠のアクセサリー）</span>
                            <span class="span2">台湾からのインバウンドで日本で真珠を購入されるお客様も年々増えており、台湾からのお客様からのお問い合わせも非常に多くいただいておりました。<br>台湾でのテレビ通販での販売方法をアジアンブリッジさんにご提案いただき　弊社が独自では開拓できない
販路を獲得することができました。<br>また、貿易開始後も弊社の台湾担当のように非常に親身になって動いていただき大変感謝しております。</span>
                        </p>
                    </li>
                    <li>
                        <img src="images/img-8.png">
                        <p>
                            <span class="span2">台湾テレビショピング3社と商談。 商談開始から2ヶ月ほどで、約3万円の真珠のイヤリングとネックレスのセット500セットの発注が即決定。<br>その後も異なるタイプのネックレスや母の日セットなど複数の商品を台湾で展開する。</span>
                        </p>
                    </li>
                 </ul>
                 <ul class="listVoice-1">
                    <li>
                        <img src="images/img-6.png">
                        <p>
                            <span class="span1">C社様（化粧品）</span>
                            <span class="span2">弊社はもともとアジアの女性のためのミネラルファンデーションのブランド確立を目指しており、早い段階で中華圏は狙いに行きたいと思っておりました。台湾をゲートウェイにしたアジア進出は良く言われおりますので気になっておりましたがなかなかつてがなく、足踏みをしていたところアジアンブリッジさんとの出会いがありました。台湾最大手テレビショップのMomoさんとの出会いをきっかけに多くの台湾の消費者に手に取っていただき、アジア進出の第一歩を踏み出すことができました。</span>
                        </p>
                    </li>
                    <li>
                        <img src="images/img-10.png">
                        <p>
                            <span class="span2">台湾テレビショピングと卸商社、台湾バラエティーショップと商談。 Momoでの販売が決定。全くブランド認知がない状態から1放送で8000円のセットが1000セット以上売れ大反響をよんだ。<br>その後も台湾の有名ブロガーや芸能人がプライベートで商品のファンになるなど台湾でも話題の商品となった。</span>
                        </p>
                    </li>
                 </ul>
                 <h2 id="div5">なぜ今、台湾市場への進出なのか？</h2>
                    <img src="images/img-text-23.png" class="img-text-23 show-pc">
                    <img src="images/sp/img-text-23.png" class="img-text-23 show-sp">
                 <ul class="listtroubled">
                    <li>
                        <img src="images/img-11.png" class="show-pc">
                        <img src="images/sp/img-11.png" class="show-sp">
                        <p class="p-4">台湾でヒットした商品が、その後華僑文化圏で広がっていくことが多く、テストマーケットとして商品力を磨くことができます。</p>
                    </li>
                    <li>
                        <img src="images/img-12.png" class="show-pc">
                        <img src="images/sp/img-12.png" class="show-sp">
                        <p class="p-4">中国本土でのビジネスは、商習慣の違いなど高い障壁がありますが、中国でのビジネスになれた台湾企業と協力することで、中国進出の際のリスクを低減することができます。</p>
                    </li>
                    <li>
                        <img src="images/img-13.png" class="show-pc">
                        <img src="images/sp/img-13.png" class="show-sp">
                        <p class="p-4">中華圏の中で、最も親日であるため、多くの日本商品がブランド化しています。</p>
                    </li>
                 </ul>
                 <h2 id="div6">台湾テレビ通販の魅力</h2>

                 <img src="images/img-text-3.png" class="img-text-1 show-pc">
                 <img src="images/sp/img-text-3.png" class="img-text-1 show-sp">

                 <div class="TVshopping">
                    <div class="tvl">
                        <img src="images/img-14.png" class="show-pc">
                        <img src="images/sp/img-14.png" class="img-14 show-sp">
                        テレビ通販会社の日本製品特集
                    </div>
                    <div class="tvr">
                        <p class="p-6">
                            <span><img src="images/point11.png"><img src="images/point12.png"  class="point12"></span>
                            
                            台湾では、ケーブルテレビでのテレビショッピングが盛んで、配信世帯数は約630万世帯(台湾全世帯の約84%に相当)とされ、 テレビショッピング専門チャンネルの数はなんと9チャンネルもあり、24時間さまざまな商品情報を配信しています。購入層は日本より5〜10歳若く、幅広い年代に利用されています。
                        </p>
                        <p class="p-6">
                            <span><img src="images/point21.png"><img src="images/point22.png"  class="point22"></span>
                            台湾では、ケーブルテレビでのテレビショッピングが盛んで、配信世帯数は約630万世帯(台湾全世帯の約84%に相当)とされ、 テレビショッピング専門チャンネルの数はなんと9チャンネルもあり、24時間さまざまな商品情報を配信しています。購入層は日本より5〜10歳若く、幅広い年代に利用されています。
                        </p>
                        <p class="p-6">
                            <span><img src="images/point31.png"><img src="images/point32.png"  class="point32"></span>
                            台湾では、ケーブルテレビでのテレビショッピングが盛んで、配信世帯数は約630万世帯(台湾全世帯の約84%に相当)とされ、 テレビショッピング専門チャンネルの数はなんと9チャンネルもあり、24時間さまざまな商品情報を配信しています。購入層は日本より5〜10歳若く、幅広い年代に利用されています。
                        </p>
                        <div class="tvr-box">
                               <img src="images/img-text-6.png">
                               <p class="p-7">
                                「日本ならではのもの」、「他には無い特徴のある商品」、「日本でも よく売れている商品」<br>「新しい技術を使った、まだ世にあまり出回ってないもの」<br>などの いずれかが一つでも該当するようでしたら、お問い合わせください。
                               </p> 
                        </div>
                    </div>
                 </div><!--TVshopping  --> 
                 <h2 id="div7" style="clear:both; margin-top:50px; display:inline-block; width:100%;">サービスの流れ</h2>
                   <img src="images/img-text-4.png" class="img-text-1 show-pc" style="margin-top:20px;">
                   <img src="images/sp/img-text-4.png" class="img-text-1 show-sp" style="margin-top:20px;">
                 <div class="ServiceFlow">
                    <img src="images/img-15.png" class="show-pc">
                    <img src="images/sp/img-15.png" class="img-15 show-sp">

                    <div class="ServiceFlowl show-pc">
                        <p class="p-8">担当者との個別面談にて本企画の説明をさせていただきます。</p>
                        <p class="p-8">商品により、成分調査が必要となります。<br>（弊社で実施する場合は別途費用をいただきます。）</p>
                        <p class="p-8">申込書提出、エントリー料金をご入金いただきます。</p>
                        <p class="p-8">所定の仕様書に貴社商品情報をご記入の上提出いただきます。<br>弊社にて仕様書のアドバイス、中国語への翻訳に関しても対応いたします。</p>
                        <p class="p-8">サンプルを弊社にお送りいただきます。</p>
                        <p class="p-8">貴社の商品に興味関心のある台湾企業との商談設定を行います。</p>
                        <p class="p-8">商談企業をご確認いただき、確認書に署名をいただきます。<br>（この確認書の内容に沿ってご請求書を発行いたします。）</p>
                        <p class="p-8">いよいよ商談に向けてご出発です！</p>
                    </div>
                </div>

                <h2 id="div8">ご利用料金</h2>
                <img src="images/sp/img-16.png" class="img-16 show-sp">
                <ul class="Charge show-pc">
                        <li class="li-1">
                            <p>
                                ・御社商品分析<br>
                                ・台湾進出戦略立案<br>
                                ・アプローチ先リストアップ<br>
                                ・アプローチ先企業情報の報告<br>
                                ・アプローチ先選定・優先順位決定までのコンサルティング<br>
                                ・営業戦略立案<br>
                                ・営業資料作成<br>
                                ・営業実施<br>
                                ・興味関心先への資料送付<br>
                                ・サンプル送付代行<br>
                                ・初回商談時の通訳兼現地コーディネーター同行<br>
                                ・商談設定交渉<br>
                                ・スケジュール調整
                            </p>
                        </li>
                        <li class="li-2">
                            <p class="li-2-p1">
                              ・商談設定交渉<br>
                              ・商談スケジュール調整<br>
                              ・商談企業の企業情報リサーチと報告<br>
                              ・その他商談実施に関する事前調整
                            </p>
                            <p class="li-2-p2">
                                ※商談設定が不可だった場合、初期費用の全額返金、または3ヶ月までのリトライの
                                　いずれかをお選びいただけます<br>
                                ※対象商品の成分調査は別途、見積もりにてお引き受けいたします<br>
                                ※商談時の渡航費用は含まれません<br>
                                ※初期費用のお支払いはお申込後10日以内<br>
                                ※商談フィーのお支払いは商談日の翌月末
                            </p>
                        </li>
                </ul>
                <h2 id="div9">返金保証</h2>
                <img src="images/img-text-5.png" class="img-text-1 show-pc">
                <img src="images/sp/img-text-5.png" class="img-text-1 show-sp">


                <div class="Money">
                    <div class="moneyl">
                        <img src="images/img-18.png" class="img-18">
                        レポートイメージ
                    </div>
                    <div class="Moneyr">
                        <p class="p-8">
                            1社とも商談が設定できなかった場合、初期費用は全額返金します。<br>また、台湾テレビショッピング会社が商談を希望しなかった理由をレポートにまとめてご報告しますので、リスクをおさえて台湾進出に挑戦することをが可能です。
                        </p>
                        <p class="p-9">※初期費用の全額返金ではなく、3ヶ月までのリトライをお選びいただくことも可能です</p>
                        <p class="p-10 show-pc"><a id="flow_link"><img src="images/img-19.png"></a></p>
                    </div>
                </div>
                <p class="p-10 show-sp"><img src="images/img-19.png"></p>

                <h2 id="div10" style="clear:both; margin-top:50px; display:inline-block; width:100%;">お問い合わせフォーム</h2>
                <p class="p-11">下記フォームよりお問い合わせいただけます。　お急ぎの方はお電話でもお問い合わせを承っております。</p>
                <p class="p-12"><img src="images/contant-phone.png"></p>


                <?php 
                  if($error){
                    echo $error_msg;
                    echo $error_script;
                  }
                ?>
                <form class="contact" method="post" id="submit-form" action="">

                    <fieldset class="fieldset1 show-pc">
                        <label>会社名<img src="images/img-20.png"></label>
                        <label>お名前<img src="images/img-20.png"></label>
                        <label>E-mail<img src="images/img-20.png"></label>
                        <label>電話番号<img src="images/img-20.png"></label>
                        <label>お問い合わせ・ご相談内容<img src="images/img-20.png"></label>
                    </fieldset>
                    <fieldset class="fieldset2">
                           <label class="show-sp">会社名<img src="images/img-20.png"></label>
                           <input name="global" id="global" type="text" placeholder="例）GLOBAL MATCH" class="input input-global" value="<?php echo isset($_POST['global'])?$_POST['global']:'';?>"> 
                           <p id="error" class="error err-global">会社名を入力してください</p>

                           <label class="show-sp">お名前<img src="images/img-20.png"></label>
                           <input name="name"  id="name" tyle="text" placeholder="例）黒春　真彦" class="input input-masahiko" value="<?php echo isset($_POST['name'])?$_POST['name']:'';?>"> 
                           <p id="error" class="error err-masahiko">お名前を入力してください</p>

                           <label class="show-sp">E-mail<img src="images/img-20.png"></label>
                           <input name="email" id="email" type="text" placeholder="例）info@global-match.com" class="input input-email" value="<?php echo isset($_POST['email'])?$_POST['email']:'';?>"> 
                           <p id="error" class="error err-email">メールアドレスを入力してください</p>
                           <p id="error" class="error err-email-2">メールアドレスの形式が正しくありません</p>

                           <label class="show-sp">電話番号<img src="images/img-20.png"></label>
                           <input name="phone" id="phone" type="text" placeholder="例）03-5908-8325" class="input input-phone" value="<?php echo isset($_POST['phone'])?$_POST['phone']:'';?>"> 
                           <p id="error" class="error err-phone">電話番号を入力してください</p>

                           <label class="show-sp">お問い合わせ・ご相談内容<img src="images/img-20.png"></label>
                           <textarea class="input-textarea" name="content"  id="content" type="text" placeholder="輸出希望商品の内容などをご記入ください">
<?php echo isset($_POST['content'])?$_POST['content']:'';?></textarea>
                           <p id="error" class="error err-content">お問い合わせ・ご相談内容を入力してください</p>
                    </fieldset>
                    <p><input type="submit" value="" class="submit" name="sendmail" id="sendmail" readonly></p>
                </form>
            </div><!--container  -->    
        <div class="footer">
            <div class="container">
                <ul class="menu-footer">
                    <li>■サイトメニュー</li>
                    <li><a style="cursor: pointer;" id="1">こんなことでお困りではないですか？</a></li>
                    <li><a style="cursor: pointer;" id="2">サービス概要</a></li>
                    <li><a style="cursor: pointer;" id="3">GLOBAL MATCHが選ばれる3つの理由</a></li>
                    <li><a style="cursor: pointer;" id="4">お客様の声</a></li>
                    <li><a style="cursor: pointer;" id="5">なぜ今、台湾市場への進出なのか？</a></li>
                    <li><a style="cursor: pointer;" id="6">台湾テレビ通販の魅力</a></li>
                    <li><a style="cursor: pointer;" id="7">サービスの流れ</a></li>
                    <li><a style="cursor: pointer;" id="8">ご利用料金</a></li>
                    <li><a style="cursor: pointer;" id="9">返金保証</a></li>
                    <li><a href="http://www.neo-career.co.jp/policy.html">プライバシーポリシー</a></li>
                </ul>
            </div>
        </div> 
        <div class="copiriight">
          <div class="container c-copi">
            Copyright (C) NeoCareer Co.,LTD. All Rights Reserved.
          </div>
      </div>
        <script>
        $(document).ready(function(){
            $("#1").click(function() {
                $('html, body').animate({
                    scrollTop: $("#div1").offset().top
                }, 500);
            });
            $("#2").click(function() {
                $('html, body').animate({
                    scrollTop: $("#div2").offset().top
                }, 500);
            });
            $("#3").click(function() {
                $('html, body').animate({
                    scrollTop: $("#div3").offset().top
                }, 500);
            });
            $("#4").click(function() {
                $('html, body').animate({
                    scrollTop: $("#div4").offset().top
                }, 500);
            });
            $("#5").click(function() {
                $('html, body').animate({
                    scrollTop: $("#div5").offset().top
                }, 500);
            });
            $("#6").click(function() {
                $('html, body').animate({
                    scrollTop: $("#div6").offset().top
                }, 500);
            });
            $("#7,#flow_link").click(function() {
                $('html, body').animate({
                    scrollTop: $("#div7").offset().top
                }, 500);
            });
            $("#8").click(function() {
                $('html, body').animate({
                    scrollTop: $("#div8").offset().top
                }, 500);
            });
            $("#9").click(function() {
                $('html, body').animate({
                    scrollTop: $("#div9").offset().top
                }, 500);
            });
            $("#10").click(function() {
                $('html, body').animate({
                    scrollTop: $("#div10").offset().top
                }, 500);
            });
            $(".link_form").click(function() {
                $('html, body').animate({
                    scrollTop: $("#div10").offset().top
                }, 500);
            });


            $(".error").hide(); 
            $("form").submit(function(){
             
                    var Ra = true;
                    var global    = $('#global').val();
                    var name  = $('#name').val();
                    var email     = $('#email').val();
                    var phone     = $('#phone').val();
                    var content   = $('#content').val();    
                    var emailReg  = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
                    
                    if(global == ""){ 
                         $(".err-global").show();
                         $(".input-global").css("margin-bottom","0");
                         Ra = false;
                    } 
                    else{ $(".err-global").hide();
                         $(".input-global").css("margin-bottom","20px");
                  }
                    //
                    if(name == ""){ 
                         $(".err-masahiko").show();
                         $(".input-masahiko").css("margin-bottom","0");
                         Ra = false;
                    } 
                    else{ $(".err-masahiko").hide();
                         $(".input-masahiko").css("margin-bottom","20px");
                  }
                    //
                    if(email != ""){ 
                          $(".err-email").hide();
                          if(emailReg.test(email)){
                                 $(".err-email-2").hide();
                                 $(".input-email").css("margin-bottom","20px"); 
                          }
                          else{
                                 $(".err-email-2").show(); 
                                 $(".input-email").css("margin-bottom","0"); 
                                 Ra = false;
                          }
                    } 
                    else{ 
                          $(".err-email").show(); 
                          $(".input-email").css("margin-bottom","0"); 
                          Ra = false;
                    }
                    // 
                    if(phone == ""){ 
                         $(".err-phone").show();
                         $(".input-phone").css("margin-bottom","0"); 
                         Ra = false;
                    } 
                    else{ $(".err-phone").hide();
                         $(".input-phone").css("margin-bottom","20px"); 
                   }
                    //
                    if(content == ""){ 
                         $(".err-content").show();
                         Ra = false;
                    } 
                    else{ $(".err-content").hide();}
    
    
                    if(Ra==true){
                        return true;
                    }   
                    else{ 
                        
                    return false;
                    
                    }   
            });
            
            
        });

        
    </script>   
  </body>
</html>

 