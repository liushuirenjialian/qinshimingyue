$(function() {
    var apiUrl = "http://api.hulai.com";
    var height=document.documentElement.scrollHeight  ||document.body.scrollHeight;
      function getNum(eventname,cal){
        var Nurl=apiUrl+"/h/api/event/getEventNum";
            var data={}
            data.eventname=eventname;
            $.post(Nurl,data,function(result){
                cal(result.data);
            },"json");
      }
     function refNum(){
     getNum('秦时明月IOS',function(num){
        $('#iosNum').text(num);
        bindAll();
     })
     getNum('秦时明月Android',function(num){
        $('#andNum').text(num);
        bindAll();
     })
     }
     
     function bindAll(){
         var ios=  $('#iosNum').text();
         var and=  $('#andNum').text();
        var allNumber= Number(ios) +Number(and);
        $('#allNum').text(allNumber);

     }
  refNum();
    $('.but').on('click', function() {
        // debugger
        var phone = $.trim($('.enter_phone').val());
        // var ios=$('#ios').val();
        // var andr=$('#android')
        var checked = $('input[type="radio"]:checked').val();
        if (!checkedMobile(phone)) {
            return;
        }
        if (phone === '' || checked === '') {
            alert('请输入完整信息!');
        } else if (phone != '' && checked != '') {
            $.ajax({
                type: 'post',
                dataType: 'json',
                url: apiUrl + "/h/api/event/saveRecord",
                data: {
                    'eventname': checked,
                    'mobile': phone
                },
                success: function(json) {
                    if (json.ret != 1) { // 失败
                        alert(json.msg);
                        return;
                    }
                    refNum();
                    // alert('success');
                    $('.gongxi').attr('style', 'display:block');
                    $('form').hide();

                }
            })
        }
    })

    function checkedMobile(mobile) {
        var myreg = /^(((13[0-9]{1})|(14[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
        if (!myreg.test(mobile)) {
            alert('请填写正确的手机号码');
            return false;
        }
        return true;
    }

    $('.gongxi  .close_weixin').click(function() {
        $('.gongxi').hide();
         $('.mengceng').html('');
    })
    $('.yuyue').click(function() {
        $('.yuyuew, form').attr('style', 'display:block');
        $('.mengceng').html('<div style="height: '+height+'px;opacity:0.6;width:100%;position:absolute;top:-50px;left:0px;background:rgb(0,0,0);"></div>')

    })
    $('.yuyuew .close').click(function() {
        $('.yuyuew').hide();
        $('.mengceng').html('');

    })

    $('.weixin').click(function() {
        $('#weixins').attr('style', 'display:block');
        $('.mengceng').html('<div style="height: '+height+'px;opacity:0.6;width:100%;position:absolute;top:-50px;left:0px;background:rgb(0,0,0);"></div>')


    })
    $('.weixin_sec .close_weixin').click(function() {
        $('.weixin_sec').hide();
        $('.mengceng').html('');
    })

    $('.qq').click(function() {
        $('#wanjia').attr('style', 'display:block');
       $('.mengceng').html('<div style="height: '+height+'px;opacity:0.6;width:100%;position:absolute;top:-50px;left:0px;background:rgb(0,0,0);"></div>')


    })
    $('#wanjia .close_weixin').click(function() {
        $('.wanjia').hide();
        $('.mengceng').html('');
    })


    $('.iosdown,.andrdown').click(function() {
        $('.ios_swc').attr('style', 'display:block');
      $('.mengceng').html('<div style="height: '+height+'px;opacity:0.6;width:100%;position:absolute;top:-50px;left:0px;background:rgb(0,0,0);"></div>')


    })
    $('.ios_swc .close_weixin').click(function() {
        $('.ios_swc').hide();
        $('.mengceng').html('');
    })
})
