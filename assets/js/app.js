!(function ($){

    // "use strict"; // jsHint

    window.WELLIST          = {};
    // --------------------------------------
    var W                   = window.WELLIST;

    // user-agent && user-agent helper methods
    var ua                        = navigator.userAgent;
    var regex_apple_webkit        = new RegExp(/AppleWebKit\/([\d.]+)/);
    var result_apple_webkit_regex = regex_apple_webkit.exec(ua);
    var apple_webkit_version      = (result_apple_webkit_regex === null ? null : parseFloat(regex_apple_webkit.exec(ua)[1]));

    // global variables
    var GLOBALS = {
        // debug toggles
        debug           : true,

        // user-agents
        user_agent : {
          iOS         : (ua.match(/(iPad|iPhone|iPod)/g) ? true : false),
          iphone      : (ua.match(/(iPhone|iPod)/g) ? true : false),
          ipad        : (ua.match(/(iPad)/g) ? true : false),
          android     : (ua.match(/(Android)/g) ? true : false),
          mobile      : ((/Mobile|iPhone|iPod|BlackBerry|Windows Phone/i).test(ua || navigator.vendor || window.opera) ? true : false),
          mobile_all  : ((/Mobile|Android|iPhone|iPod|BlackBerry|Windows Phone/i).test(ua || navigator.vendor || window.opera) ? true : false),
        },

        browser : {
          // desktop_chrome   : (ua.indexOf('Android') <= -1 && ua.indexOf('iPhone') <= -1 && ua.indexOf('iPod') <= -1 && ua.indexOf('Mobile') <= -1 && ua.indexOf('Mozilla/5.0') > -1 && ua.indexOf('AppleWebKit') > -1 && ua.indexOf('Chrome') > -1),
          desktop_chrome   : (window.chrome ? true : false),
          iphone_chrome    : ((ua.match(/(iPod|iPhone|iPad)/) && ua.match(/AppleWebKit/) && ua.match('CriOS')) ? true : false),
          iphone_safari    : ((ua.match(/(iPod|iPhone|iPad)/) && ua.match(/AppleWebKit/) && !ua.match('CriOS')) ? true : false),
          android_native   : (ua.indexOf('Android') > -1 && ua.indexOf('Mozilla/5.0') > -1 && ua.indexOf('AppleWebKit') > -1 && ua.indexOf('Chrome') <= -1),
          android_chrome   : (ua.indexOf('Android') > -1 && ua.indexOf('Mozilla/5.0') > -1 && ua.indexOf('AppleWebKit') > -1 && ua.indexOf('Chrome') > -1),
          android_samsung  : (ua.indexOf('Android') > -1 && ua.indexOf('Mozilla/5.0') > -1 && ua.indexOf('AppleWebKit') > -1 && ua.indexOf('Chrome') > -1 && ua.indexOf('SCH') > -1)
        }
    }



    /* INITIATE FUNCTIONS
    ------------------------------------------------------------------------ */
    W.init = function(){
        W.setElements();
        W.initScripts();
        W.events();
        W.scroll();
        W.lazyLoadVideo();
        W.lightbox();
        W.animations();
        W.sticky();
        W.headroom();
    };

    /* SET ELEMENTS
    ------------------------------------------------------------------------ */
    W.setElements = function(){
        W.el = {};
    };


    /* PRE
    ------------------------------------------------------------------------ */
    W.initScripts = function(){

        // WOW.js
        if ( window.WOW.length <= 0) { return false; }

        new WOW().init();

    }

    
    /* EVENTS
    ------------------------------------------------------------------------ */
    W.events = function(){

        // input-field focus
        $('.input-icon input, .input-icon select').on('focus', function (event) {
            var $this   = $(this),
                parent  = $this.parent();

            $('.input-field').removeClass('active');
            parent.addClass('active');
        });

        $('.input-icon input, .input-icon select').on('blur', function (event) {
            var $this   = $(this),
                parent  = $this.parent();

            if ( $this.val() === '' ) {
                parent.removeClass('active');
            }

        });

    };

    /* ANIMATIONS
    ------------------------------------------------------------------------ */
    W.animations = function() {

        $('.bounceInUp')
            .one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
              $(this).toggleClass('animated bounceInUp');
            });
    }


    /* SCROLL (requires .scroll class on anchor)
    ------------------------------------------------------------------------ */
    W.scroll = function(){

        // <a> method manual
        $('a.scroll, li.scroll > a').click(function(e){
            e.preventDefault();

            var $this       = $(this),
                target_id   = $this.attr('href'),
                target      = $(target_id),
                // duration    = (target.offset().top - $(window).scrollTop());
                duration    = 650;

            animate_scrollTop(target, duration, 'easeInOutExpo', 0);

            // console.log(duration);

            // animate_scrollTop();
            function animate_scrollTop(target, duration, easing, offset){
                if(target){
                    if(/(iPhone|iPod)\sOS\s6/.test(navigator.userAgent)){
                        $('html, body').animate({
                            scrollTop: target.offset().top
                        }, duration, easing);
                    } else {
                        $('html, body').animate({
                            scrollTop: target.offset().top - (offset)
                        }, duration, easing);
                    }
                }
            }

        });
    };
    

    /* LIGHTBOX
    ------------------------------------------------------------------------ */
    W.lightbox = function() {

        var lightbox = $('#lightbox');

        $('*[data-lightbox-bg-img]').click(function (e){
            var img = $(this);

            $('.page-overlay').addClass('show');
            setTimeout(function() {
                lightbox.addClass('show');
            }, 299)

            lightbox.empty();
            lightbox.append('<img src="'+img.attr('data-img-src')+'">');
        });
    }



    /* LAZYLOAD VIDEO
    ------------------------------------------------------------------------ */
    W.lazyLoadVideo = function() {

        $('.lazyload').click(function(){
            var $this           = $(this),
                video_id        = $this.data('video-id'),
                video_service   = $this.data('video-service'),
                width           = $this.width(),
                height          = $this.height();

                // console.log(width, height);

            // embed code builder function
            function buildEmbed(service, id) {
                if (service === 'youtube') {
                    var embed = '<iframe width="'+width+'" height="'+height+'" src="//www.youtube.com/embed/'+video_id+'?autoplay=1" frameborder="0" allowfullscreen></iframe>';
                    return embed;
                }
                if (service === 'vimeo') {
                    var embed = '<iframe src="//player.vimeo.com/video/'+video_id+'?title=0&amp;autoplay=1&amp;byline=0&amp;portrait=0&amp;badge=0" width="'+width+'" height="'+height+'" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>';
                    return embed;
                }
            }

            // build the embed code
            var embed_code = buildEmbed(video_service, video_id);

            // remove inner elements
            $this.find('iframe').remove();
            $this.find('img').remove();
            $this.find('.media-image-overlay').css('opacity', 0);
            $this.find('.media-image-icon').hide();
            $this.css('background-image', '');
            $this.find('.post-format-video-overlay').remove();

            // append the generated embed code
            if ( $this.find('iframe').length <= 0 ) {
                $this.append(embed_code);
            } else {
                // nothing
            }
        });
    }


    /* LAZYLOAD IMAGE - Run at window onload & scroll
    ------------------------------------------------------------------------ */
    W.lazyLoadImage = function(method) {

        if ( method === 'delayed' ) {
            setTimeout(function(){
                $('.lazyload-img:in-viewport').addClass('show');
            }, 100);
        } else {
            $('.lazyload-img:in-viewport').addClass('show');
        }
    }


    /* STICKY NAV
    ------------------------------------------------------------------------ */
    W.stickyNav = function(){

       var distanceY   = window.pageYOffset || document.documentElement.scrollTop,
           shrinkOn    = $('#hero').outerHeight(),
           // shrinkOn    = 5,
           header      = document.getElementById('header-main');

       if (distanceY > (shrinkOn)) {
           classie.add(header,"stick");
       }  
       else if (distanceY < (shrinkOn)) {
           if (classie.has(header,"stick")) {
               classie.remove(header,"stick");
           }
       }

    };

    /* STICKY JS
    ------------------------------------------------------------------------ */
    W.sticky = function() {

        if ( $('.sticky').length > 0 ) {
            $(window).scrollTop($(window).scrollTop()+1);
        } else {
            return false;
        }

        $('.sticky').sticky();
    }


    /* HEADROOM
    ------------------------------------------------------------------------ */
    W.headroom = function() {

        $('.headroom').headroom({
            tolerance : {
                up : 5,
                down : 25
            },
        });
    }








    /* DOCUMENT READY
    ------------------------------------------------------------------------ */
    $(document).ready(function(){
        
        W.init();


        // invisible font fix for chrome
        if ( GLOBALS.browser.desktop_chrome ) {

            var chrome_fix_2 = function() {
                var orig_body_offset = $('body').offset();
                $('body').offset(orig_body_offset);
            }
            // Invoke Method 2
            chrome_fix_2();
        }

        

        $('#supersecret').on('change focus keydown keyup', function (event) {
            
            var input_val       = $(this).val(),
                viewport        = $(this).parent().find('.viewport'),
                flex_viewport   = $(this).parent().find('.flex-viewport');

            if ( input_val == 'fiftyandfifty' ) {
                flex_viewport.hide();
                viewport.attr('style', 'background-image:url("http://i.imgur.com/imFo1Ot.jpg");');
            } else {
                flex_viewport.show();
                viewport.attr('style', 'background-iamge:url("");');
            }
        });

    });

    /* WINDOW LOAD
    ------------------------------------------------------------------------ */
    $(window).load(function(){
        
        // do stuff once the page has finished loading
        W.lazyLoadImage();

    });

    /* WINDOW SCROLL
    ------------------------------------------------------------------------ */
    $(window).on('scroll', function(){

        // DEBUG - winY position
        // if ( GLOBALS.debug ) { var winY = $(window).scrollTop(); console.log(winY);}

        W.lazyLoadImage();
        // W.stickyNav();

    });


    /* WINDOW RESIZE
    ------------------------------------------------------------------------ */
    $(window).resize(function(){   
        
        // do stuff on window resize


    }).trigger('resize');



    /* ORIENTATION CHANGE (requires jQuery mobile)
    ------------------------------------------------------------------------ */
    window.addEventListener("orientationchange", function() {
        // Announce the new orientation number
        
        console.log('Orientation is: ', window.orientation);

    }, false);



    /* SELF INVOKING ANONYMOUS FUNCTION(s)
    ------------------------------------------------------------------------ */
    (function(){ 

        if(window.location.hash) {
            // puts hash in variable, and removes the # character
            var hash = window.location.hash.substring(1); 
            
            if (hash === 'CUSTOM_HASH_HERE') {
                // do something when custom hash is in url
            }
        } else {
            // no hash found, don't do anything
        }      

    })(); 

})(jQuery);
// Avoid `console` errors in browsers that lack a console.
(function() {
    var method;
    var noop = function () {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());


// viewport detection 
(function($){$.belowthefold=function(element,settings){var fold=$(window).height()+$(window).scrollTop();return fold<=$(element).offset().top-settings.threshold;};$.abovethetop=function(element,settings){var top=$(window).scrollTop();return top>=$(element).offset().top+$(element).height()-settings.threshold;};$.rightofscreen=function(element,settings){var fold=$(window).width()+$(window).scrollLeft();return fold<=$(element).offset().left-settings.threshold;};$.leftofscreen=function(element,settings){var left=$(window).scrollLeft();return left>=$(element).offset().left+$(element).width()-settings.threshold;};$.inviewport=function(element,settings){return!$.rightofscreen(element,settings)&&!$.leftofscreen(element,settings)&&!$.belowthefold(element,settings)&&!$.abovethetop(element,settings);};$.extend($.expr[':'],{"below-the-fold":function(a,i,m){return $.belowthefold(a,{threshold:0});},"above-the-top":function(a,i,m){return $.abovethetop(a,{threshold:0});},"left-of-screen":function(a,i,m){return $.leftofscreen(a,{threshold:0});},"right-of-screen":function(a,i,m){return $.rightofscreen(a,{threshold:0});},"in-viewport":function(a,i,m){return $.inviewport(a,{threshold:0});}});})(jQuery);

// sharepop helper func
function sharePop(url) { window.open( url, "myWindow", "status = 1, height = 500, width = 500, resizable = 0"); }