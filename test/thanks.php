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
                <img src="images/img-0.png" class="phone-email show-pc">
             </div><!--container  --> 
         </div><!--global  --> 
        </div>
        <!--header-->
            <div class="container container-sp-C"> 
                <?php
                     if (isset($_POST['email']))
                    {   
                          echo $_POST['email'];
                          exit;
                           $phone = "";
                           if (isset($_POST['phone'])){
                               $phone = $_POST['phone'];
                               }
                           $headers .= "Reply-To: ".$_POST['email']."\r\n"; 
                           $headers .= "Return-Path: ".$_POST['email']."\r\n";
                           $headers .= "From: ".$_POST['email']."\r\n"; 
                          
                           $headers .= "Organization: Sender Organization\r\n";
                           $headers .= "MIME-Version: 1.0\r\n";
                           $headers .= "Content-type: text/html; charset=utf8\r\n";
                           $headers .= "X-Priority: 3\r\n";
                           $headers .= "X-Mailer: PHP". phpversion() ."\r\n" ;

                          
                           $to      = "info@livepass.jp";
                           $subject = "livepassCatch からのお問い合わせ";
                           $message ='
                             <p>会社名: '.$_POST['global'].'</p>
                             <p>お名前: '.$_POST['masahiko'].'</p>
                             <p>メールアドレス: '.$_POST['email'].'</p>
                             <p>電話番号: '.$phone.'</p>
                             <p>お問い合わせ・ご相談内容</p>
                             <p>'.$_POST['content'].'</p>
                        ';
                        $options="Content-type:text/html;charset=utf-8\r\nFrom:$from\r\nReply-to:$from";
                        mail($to,$subject,$message,$headers);
                                       
                     }
                ?>
                
                <h2 class="thanks">メール送信完了</h2>
                <div class="c-thank">
                    <img src="images/img-text-7.png" class="img-text-7">
                    <p class="p-thanks">ご確認が出来次第、担当者からご連絡させていただきます。</p>
                    <p class="p-t-back">
                      <a href="index.php">
                        <img src="images/button-back.png" class="button-back show-pc">
                        <img src="images/sp/button-back.png" class="button-back show-sp">
                      </a>
                    </p>
                </div>
                
            </div><!--container  -->    
        <div class="footer">
            <div class="container">
                <ul class="menu-footer">
                    <li><a>■サイトメニュー</a></li>
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
        
  </body>
</html>

 