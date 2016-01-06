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
    <title>Jinjer</title>
    <link type="text/css" rel="stylesheet" href="css/style.css">
    <script src="js/jquery-1.9.1.min.js"></script>
  </head>
  <body>
        <header>
             
             <img src="images/textimg1.png">
        </header>
        <div class="rowYellow">
            <div class="content">
                <p class="p1"><img src="images/text1.png"></p>
                <p class="p2">
                  jinjerは、国内初の人事領域のデータを横断的にマネジメントできるプラットフォームです。<br>
                  ブラックボックス化されてきた人事データを「数値化」「可視化」することで、<br>
                  人事戦略の最適解を導き、人事業務のパフォーマンス向上、更には企業経営の支援が実現できます。<br>
                  採用・勤怠・人材管理など、一気通貫でシームレス管理し、人事の業務コスト削減にも繋がります。
                </p>
            </div>
        </div>
        <div class="rowW">
            <div class="content">
                <p class="p1 p3"><img src="images/text2.png"></p>
                <ul class="ulrowW1">
                  <li><img src="images/img3.png"></li>
                  <li><img src="images/img4.png"></li>
                </ul>
            </div>
        </div>
        <div class="rowB">
            <p class="p4">主要サービス</p>
        </div> 
        <div class="rowW">
            <ul class="ulrowW2">
              <li>
                <p class="p5"><img src="images/text3.png"></p>
                <p class="p6">
                  新卒/中途採用業務におけるプロセスデータを蓄積し、<br>
                  リアルタイムで管理・分析することで戦略的な採用業務を実現できます。
                </p>
              </li>
              <li>
                <p class="p5"><img src="images/text4.png"></p>
                <p class="p6">
                  タレントマネジメント、評価、報酬、福利厚生、教育研修などの人的資産における、すべての一括管理を実現します。<br>
                  ストレスチェックやマイナンバーとの連携も想定しており、2016年初春にリリース予定です。
                </p>
              </li>
              <li>
                <p class="p5"><img src="images/text5.png"></p>
                <p class="p6">
                  マルチデバイスで、どこからでも打刻・勤怠管理を実現します。<br>打刻方法のフレキシブルさ、出勤/シフト/申請管理のユーザビリティの高さから、勤怠関連のパフォーマンス向上につながります。
                </p>
              </li>
            </ul>
        </div>
        <div class="rowB" style="margin-top:0;">
            <p class="p4">お問い合わせ</p>
        </div>
        <div class="rowF">
            <div class="contentF">
                <?php
                    if (isset($_POST['name']))
                    {   
                       
                          $namePhonetic = "";
                          if (isset($_POST['name-phonetic'])){
                              $namePhonetic = $_POST['name-phonetic'];
                              }
                          $company = "";
                          if (isset($_POST['company'])){
                              $company = $_POST['company'];
                              }
                           $phone = "";
                          if (isset($_POST['phone1']) || isset($_POST['phone2']) || isset($_POST['phone3'])){
                              $phone = $_POST['phone1']+$_POST['phone2']+$_POST['phone3'];
                              }   
                          $location = "";
                          if (isset($_POST['location'])){
                              $location = $_POST['location'];
                              }
                                  
                          $headers .= "Reply-To: ".$_POST['email']."\r\n"; 
                          $headers .= "Return-Path: ".$_POST['email']."\r\n";
                          $headers .= "From: ".$_POST['email']."\r\n"; 
                          
                          $headers .= "Organization: Sender Organization\r\n";
                          $headers .= "MIME-Version: 1.0\r\n";
                          $headers .= "Content-type: text/html; charset=utf8\r\n";
                          $headers .= "X-Priority: 3\r\n";
                          $headers .= "X-Mailer: PHP". phpversion() ."\r\n" ;

                          
                          $to      = "webmaster@hcm-jinjer.com";
                          $subject = "Jinjer email";
                          $message ='
                            <p>お問い合わせの種類: '.$_POST['type'].'</p>
                            <p>お名前: '.$_POST['name'].'</p>
                            <p>お名前（ふりがな）: '.$namePhonetic.'</p>
                            <p>会社名: '.$company.'</p>
                            <p>電話番号: '.$phone.'</p>
                            <p>メールアドレス: '.$_POST['email'].'</p>
                            <p>会社所在地: '.$location.'</p>
                            <p>ご要望</p>
                            <p>'.$_POST['content'].'</p>
                        ';
                       
                        if(mail($to,$subject,$message,$headers)){
                            echo "<p class='sendmail'>送信完了しました</p>";
                ?>
                          <script type="text/javascript">
                            $(document).ready(function(){
                             $('html, body').animate({scrollTop: $('.contact').offset().top}, 500);
                            });
                        </script>
                <?php            
                        }else{
                            echo "<p class='sendmail'>エラーにより送信できませんでした。<br>お手数ですが再度お試しいただくかinfo@livepass.jpまで直接メールを送ってください。</p>";
                ?>
                        <script type="text/javascript">
                            $(document).ready(function(){
                             $('html, body').animate({scrollTop: $('.contact').offset().top}, 500);

                            });
                        </script>
                <?php            
                            }
                     }
                ?>
                
                <form class="contact" method="post" id="submit-form" action="index.php">

                        <fieldset class="fieldset1">
                            <label>お問い合わせの種類<img src="images/red.png"></label>
                            <span class="icon-nocheck">   
                                <input name="type" class="check-1" id="check-1" type="radio" style="display: none;" value="1">
                                <b class="text">資料請求</b>
                            </span>
                            <span class="icon-nocheck">   
                                <input name="type" class="check-1" id="check-2" type="radio" style="display: none;" value="2">
                                <b class="text">お問い合わせ</b>
                            </span>
                            <p id="error" class="error err-inquiry-type">error お問い合わせの種類</p>
                        </fieldset>   

                        <fieldset class="fieldset1"> 
                            <label>お名前<img src="images/red.png"></label>
                            <input name="name" id="name" type="text" placeholder="山田太郎" class="input input-global" value=""> 
                            <p id="error" class="error err-name">error お名前</p>
                        </fieldset>  

                        <fieldset class="fieldset1">    
                            <label>お名前（ふりがな）</label>
                            <input name="name-phonetic"  id="name-phonetic" tyle="text" placeholder="やまだたろう" class="input input-masahiko" value=""> 
                            
                        </fieldset>  

                        <fieldset class="fieldset1"> 
                           <label>会社名</label>
                           <input name="company" id="company" type="text" placeholder="" class="input input-email" value=""> 
                          
                        </fieldset>  

                        <fieldset class="fieldset1"> 
                            <label>電話番号</label>
                            <input name="phone1" id="phone" type="text" placeholder="" class="input inputsmall" value=""> 
                            <span class="line">ー</span>
                            <input name="phone2" id="phone" type="text" placeholder="" class="input inputsmall" value=""> 
                            <span class="line">ー</span>
                            <input name="phone3" id="phone" type="text" placeholder="" class="input inputsmall" value=""> 
                            
                        </fieldset>  

                        <fieldset class="fieldset1"> 
                            <label>メールアドレス<img src="images/red.png"></label>
                            <input name="email" id="email" type="text" placeholder="contact@jinjer.com" class="input input-phone" value=""> 
                            <p id="error" class="error err-email">メールアドレスを入力してください</p>
                            <p id="error" class="error err-email-2">メールアドレスの形式が正しくありません</p>
                            <p id="error" class="error err-email-3">error different email </p>
                        </fieldset>  

                        <fieldset class="fieldset1"> 
                            <label>メールアドレス（確認）<img src="images/red.png"></label>
                            <input name="email-confirm" id="email-confirm" type="text" placeholder="contact@jinjer.com" class="input input-phone" value=""> 
                            <p id="error" class="error err-email-confirm">メールアドレスを入力してください</p>
                            <p id="error" class="error err-email-confirm-2">メールアドレスの形式が正しくありません</p>
                        </fieldset>  

                        <fieldset class="fieldset1"> 
                            <label>会社所在地</label>
                            <input name="location" id="location" type="text" placeholder="個人の方は、お住まいの住所を入力してください。" class="input input-phone" value=""> 
                        </fieldset>  

                        <fieldset class="fieldset1"> 
                            <label>ご要望<img src="images/red.png"></label>
                            <textarea class="input-textarea" name="content"  id="content" type="text" placeholder=""></textarea>
                            <p id="error" class="error err-content">error ご要望</p>
                        </fieldset>  
                    <p class="psubmit"><input type="submit" value="送信" class="submit" name="sendmail" id="sendmail" readonly></p>
                </form>
          </div>
       </div>    
 <footer>
    <div class="contentfooter">
        <p class="logo"><img src="images/logo.png"></p>
        <ul>
            <li><a href="http://www.neo-career.co.jp/profile/about_us.html">運営会社</a></li>
           
            <li><a href="https://hcm-jinjer.com/privacy/">PrivacyPolicy</a></li>
        </ul>
        <p class="copiright">Copyright © 2015 NeoCareer Co., LTD. All Rights Reserved.</p>
    </div>
 </footer>      




        <script>
        $(document).ready(function(){
            // check icon checkbox
            $('.check-1').hide();
            $('.icon-nocheck').on({
                'click':function(){                    
                      $(".icon-nocheck").find("input").removeAttr('checked');
                      $(".icon-nocheck").removeClass('active-check');
                      $(this).find("input").attr('checked', true);
                      $(this).addClass("active-check");
                }
            });

           
            $(".error").hide(); 
            $("form").submit(function(){
             
                    var Ra = true;
                    var check1  = $('#check-1').is(':checked'); 
                    var check2  = $("#check-2").is(':checked');
                    var name              = $('#name').val();
                    var email             = $('#email').val();  
                    var emailConfirm      = $('#email-confirm').val();   
                    var emailReg          = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
                    var content             = $('#content').val(); 

                    if(check1 == true || check2 == true){ 
                         $(".err-inquiry-type").hide();
                        
                    } 
                    else{ 
                          $(".err-inquiry-type").show();
                          Ra = false;
                    }
                    // 
                    if(name == ""){ 
                         $(".err-name").show(); 
                         Ra = false;
                    } 
                    else{ $(".err-name").hide(); 
                   }
                    //
                    if(email != ""){ 
                          $(".err-email").hide();
                          if(emailReg.test(email)){
                                 $(".err-email-2").hide();
                                 if(email != emailConfirm){
                                        $(".err-email-3").show(); 
                                        Ra = false;
                                  }
                                  else{
                                         $(".err-email-3").hide(); 
                                  }
                          }
                          else{
                                 $(".err-email-2").show(); 
                                 Ra = false;
                          }
                    } 
                    else{ 
                          $(".err-email").show(); 
                          Ra = false;
                    }
                    //
                    if(emailConfirm != ""){ 
                          $(".err-email-confirm").hide();
                          if(emailReg.test(emailConfirm)){
                                 $(".err-email-confirm-2").hide();
                          }
                          else{
                                 $(".err-email-confirm-2").show(); 
                                 Ra = false;
                          }
                    } 
                    else{ 
                          $(".err-email-confirm").show(); 
                          Ra = false;
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

 