// Create a plugin by defining a function that accepts oj and
// returns a map of extensions to oj

// Froogaloop is the offical javascript api to Vimeo
// https://github.com/vimeo/player-api/tree/master/javascript
var Froogaloop=function(){function e(a){return new e.fn.init(a)}function h(a,c,b){if(!b.contentWindow.postMessage)return!1;var f=b.getAttribute("src").split("?")[0],a=JSON.stringify({method:a,value:c});"//"===f.substr(0,2)&&(f=window.location.protocol+f);b.contentWindow.postMessage(a,f)}function j(a){var c,b;try{c=JSON.parse(a.data),b=c.event||c.method}catch(f){}"ready"==b&&!i&&(i=!0);if(a.origin!=k)return!1;var a=c.value,e=c.data,g=""===g?null:c.player_id;c=g?d[g][b]:d[b];b=[];if(!c)return!1;void 0!==
a&&b.push(a);e&&b.push(e);g&&b.push(g);return 0<b.length?c.apply(null,b):c.call()}function l(a,c,b){b?(d[b]||(d[b]={}),d[b][a]=c):d[a]=c}var d={},i=!1,k="";e.fn=e.prototype={element:null,init:function(a){"string"===typeof a&&(a=document.getElementById(a));this.element=a;a=this.element.getAttribute("src");"//"===a.substr(0,2)&&(a=window.location.protocol+a);for(var a=a.split("/"),c="",b=0,f=a.length;b<f;b++){if(3>b)c+=a[b];else break;2>b&&(c+="/")}k=c;return this},api:function(a,c){if(!this.element||
!a)return!1;var b=this.element,f=""!==b.id?b.id:null,d=!c||!c.constructor||!c.call||!c.apply?c:null,e=c&&c.constructor&&c.call&&c.apply?c:null;e&&l(a,e,f);h(a,d,b);return this},addEvent:function(a,c){if(!this.element)return!1;var b=this.element,d=""!==b.id?b.id:null;l(a,c,d);"ready"!=a?h("addEventListener",a,b):"ready"==a&&i&&c.call(null,d);return this},removeEvent:function(a){if(!this.element)return!1;var c=this.element,b;a:{if((b=""!==c.id?c.id:null)&&d[b]){if(!d[b][a]){b=!1;break a}d[b][a]=null}else{if(!d[a]){b=
!1;break a}d[a]=null}b=!0}"ready"!=a&&b&&h("removeEventListener",a,c)}};e.fn.init.prototype=e.fn;window.addEventListener?window.addEventListener("message",j,!1):window.attachEvent("onmessage",j);return window.Froogaloop=e}();

function vimeoUrl(video, options)
{
  var out = 'http://player.vimeo.com/video/' + video + '?api=1&player_id=' + options.player_id;
  for(k in options) {
    var v = options[k];
    out += '&' + v + '=' + k;
  }
  return out;
}

module.exports = function(oj,settings){
  if (typeof settings !== 'object')
    settings = {}

  // Create VimeoMovie type
  var VimeoMovie = oj.type('VimeoMovie', {
    // The model-key bind to the url of the movie
    base: oj.View,

    // VimeoMovie(url, properties)
    constructor: function(){
      var union = oj.argumentsUnion(arguments);
      var options = union.options;
      var args = union.args;

      var defaults = {
        width: '400',       // Default the height
        height: '200',      // Default the width
        color: '00adef'     // Color of video controls
      };

      // Default options if unspecified
      for (k in defaults) {
        if (options[k] == null)
          options[k] = defaults[k];
      }

// <iframe id="player1" src="http://player.vimeo.com/video/27855315?api=1&player_id=player1" width="400" height="225" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>

// <p><button>Play</button> <button>Pause</button></p>

      // Create el as relatively positioned div
      this.el = oj.toDOM(function(){
        input = null;
        if(args.length > 0)
          input = args[0];
        oj.iframe(input, {
          style:{
            position:'relative',
          }
        });
      });

      VimeoMovie.base.constructor.apply(this, [options]);

      // Bind events using javascript API
      this.player = Froogaloop(this.el);

      console.log("this.player: ", this.player);

      var this_ = this;

      // When the player is ready, add listeners for pause, finish, and playProgress
      // this.player.addEvent('ready', function() {
      //   this_.$status.text('ready');

      //   this_.player.addEvent('pause', this_.onPause.apply(this_,arguments]);
      //   this_.player.addEvent('finish', function(){this_.onFinish.apply(this_,arguments]);
      //   this_.player.addEvent('playProgress', function(){this_.onPlayProgress.apply(this_,arguments])};
      // });

      // Call the API when a button is pressed
      // $('button').bind('click', function() {
      //   player.api($(this).text().toLowerCase());
      // });
    },
    properties: {
      width: {
        get: function(){ return this.$el.attr('width'); },
        set: function(v){
          this.$el.attr('width', v);
        }
      },

      height: {
        get: function(){ return this.$el.attr('height'); },
        set: function(v){
          this.$el.attr('height', v);
        }
      },

      // The video id
      video: '45878034',      // Video id (<3 space!)

      // Show title (readwrite)
      title: true,

      // Show the users byline on the video (readwrite)
      byline: true,

      // Show the user's portrait on the video (readwrite)
      portrait: true,

      // Color of controls (readwrite)
      color: {
        get: function(){return this.color;}
        set: function(v){
          // Remove prefix of '#'
          if(v.length > 0 && v[0] == '#')
            v = v.slice(1);
          this.color = v;
        }
      },

      // Play the video automatically on load
      autoplay: false,

      // Repeat video when it reaches the end
      loop: false

      src: {
        get: function(){ return vimeoUrl(this.video, video.videoOptions) };
      }

      // Gather options to set url (readonly)
      videoOptions: {
        get: function(){
          return {
            title: this.title,
            byline: this.byline,
            portrait: this.portrait,
            color: this.color,
            autoplay: this.autoplay,
            loop: this.loop,
            player_id: this.id
          };
        }
      },
    },

    methods: {

      play: function(){

      },
      stop: function(){

      },
      rewind: function(){

      }

      onPause: function(id) {
        console.log('paused', id);
      },

      onFinish: function(id) {
        console.log('finish', id);
      },

      onPlayProgress: function(data, id) {
        console.log('playProgress: ', data, id);
      }

    }
  });

  return {VimeoMovie:VimeoMovie};
};

