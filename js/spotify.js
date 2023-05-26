/* global SpotifyWebApi getRandomInt Cookies URLToArray language settings infoMessage*/
//# sourceURL=js/components/spotify.js
var SpotifyModule = (function () {
  var CUR_URI = window.location.href.split('#');
  var REDIRECT_URI = CUR_URI[0];

  var accessToken;
  var userinfo;
  var spotifyApi = new SpotifyWebApi();
  var columndiv;

  function _getSpotify(me) {
    me.columndiv = $(me.mountPoint + ' .dt_block');

    me.random = getRandomInt(1, 100000);
    if (
      typeof Cookies.get('spotifyToken') !== 'undefined' ||
      typeof CUR_URI[1] !== 'undefined'
    ) {
      if (typeof CUR_URI[1] !== 'undefined') {
        var hash = URLToArray(CUR_URI[1]);
        Cookies.set('spotifyToken', hash.access_token);
        window.location.href = CUR_URI[0];
      }
      accessToken = Cookies.get('spotifyToken');
      spotifyApi.setAccessToken(accessToken);
      me.columndiv.addClass('spotify');

      renderPlayer(me);

      _getMe(me);
      setInterval(function () {
        _getData(me);
      }, 2000);
    } else if (!settings['spot_clientid']) {
      console.log('Enter your Spotify ClientID in CONFIG.JS');
      infoMessage(
        'Spotify:',
        'Enter your Spotify ClientID in settings or delete spotify block in your CONFIG.js',
        10000
      );
    } else {
      var url = _getLoginURL();
      window.location.href = url;
    }
  }

  function renderPlayer(me) {
    var html = '';
    html += '<div class="current_image">';
    html += '<img />';
    html += '</div>';
    html += '<div class="dt_col">';
    html += '<div class="current_info">';
    html += '<div class="current_artist"></div>';
    html += '<div class="current_track"></div>';
    html += '<div class="current_album"></div>';

    html += '<div class="buttons" style="display:none;">';
    html += '<a class="spotpause" style="display:none;" action="Pause"><em class="fas fa-pause-circle fa-small"></em></a> ';
    html += '<a class="spotplay" style="display:none;" action="Play"><em class="fas fa-play-circle fa-small"></em></a> ';
    html += '<a action="Forward"><em class="fas fa-arrow-circle-right fa-small"></em></a>';
    html += '&nbsp;&nbsp;';
    html += '<a id="shuffle" class="shuffleoff" action="Shuffle"><em class="fas fa-random fa-small"></em></a> ';
    html += '&nbsp;';
    html += '<a action="VolumeDown"><em class="fas fa-minus-circle fa-small"></em></a>';
    html += '&nbsp;';
    html += '<a action="VolumeUp"><em class="fas fa-plus-circle fa-small"></em></a>';
    html +='</div>';
    html +=
    '<a class="change">' +
    language.misc.spotify_select_playlist +
    ' &raquo;</a>';
  html +=
    '<select class="devices">...</select>';

  html += '</div>';

    html +='</div>';
    me.columndiv.html(html);
    me.$mountPoint.on('click', '[action]',function () {
      _trackAction(me, $(this).attr('action'));	
    });
    
    me.$mountPoint.on('click', '.change', function () {
      _createPlaylistsDlg(me);
    });
    me.$mountPoint.find('.spotify select').on('change', function (event) {
      _changeDevice(me, this.value);
    });
  
  }

  function _getMe(me) {
    spotifyApi.getMe(function (err, user) {
      if (!err) userinfo = user;
      else {
        console.log('Error getting Spotify user info. Retry in 5 seconds');
        console.log(err.status);
        if (err.status == 401) {
          //token expired or not authorized
          console.log('token expired');
          var url = _getLoginURL();
          window.location.href = url;
          return;
        }
        setTimeout(function () {
          _getMe(me);
        }, 5000);
      }
    });
  }
  // Todo: columndiv and rand currently are unused

  // eslint-disable-next-line no-unused-vars
  function _getData(me) {
    if ($('select.devices option').length === 0)
      $('select.devices').html(
        '<option>' + language.misc.spotify_select_device + '</option>'
      );
    if (typeof userinfo == 'undefined') {
      console.log('no valid user info');
      return;
    }
    spotifyApi.getMyDevices(function (err, data) {
      if (err) {
        var url = _getLoginURL();
        window.location.href = url;
      } else {
        var devices = data.devices;
        var sel = '';
        var selId = '';
        for (var d in devices) {
          sel = '';
          if (devices[d]['is_active']) {
            sel = 'selected';
            selId = devices[d]['id'];
          }
          if (!devices[d]['is_restricted']) {
            if (
              $('select.devices option[value="' + devices[d]['id'] + '"]')
                .length === 0
            ) {
              $('select.devices').append(
                '<option value="' +
                  devices[d]['id'] +
                  '" ' +
                  sel +
                  '>' +
                  devices[d]['name'] +
                  '</option>'
              );
            }
          }
          me.$mountPoint.find('select.devices').val(selId)
        }

        _getCurrentTrack(me);
      }
    });
  }

  function _createPlaylistsDlg(me) {
    spotifyApi.getUserPlaylists(function (err, playlists) {
      if (err) {
        infoMessage('Spotify getUserPlahylists error ' + err.status, 4000);
        console.log('Spotify getUserPlahylists error ' + err.status);
        return;
      }
      var html =
        '<div class="modal fade" id="spotify_' +
        me.random +
        '" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">';
      html += '<div class="modal-dialog modal-spotify">';
      html += '<div class="modal-content">';
      html += '<div class="modal-header">';
      html +=
        '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>';
      html += '</div>';
      html +=
        '<div class="modal-body" style="padding-left:15px;"><div class="row list">';

      for (var p in playlists.items) {
        if (
          typeof playlists.items[p] !== 'undefined' &&
          typeof playlists.items[p]['uri'] !== 'undefined' &&
          typeof playlists.items[p]['images'][0] !== 'undefined'
        ) {
          html += '<div class="col-lg-3 col-md-4 col-sm-6">';
          html += '<div class="spotlist">';
          html +=
            '<div class="col-xs-4" style="padding:0px;"><a playlistid="'+p+ '"><img src="' +
            playlists.items[p]['images'][0]['url'] +
            '" /></a></div>';
          html +=
            '<div class="col-xs-8 spotify-info" >';
          html +=
            '<a playlistid="'+p+ '">' +
            playlists.items[p]['name'] +
            '</a><br />';
          html +=
            '<a tracklistid="'+p+ '">' +
            '<em>Tracks: ' +
            playlists.items[p]['tracks']['total'] +
            '</em></a></div>';
          html += '</div>';
          html += '</div>';
        }
      }

      html +=
        '</div><div class="row tracks" style="display:none;"></div><br /><br /></div>';
      html += '</div>';
      html += '</div>';
      html += '</div>';

      $('body').append(html);

      var modal = $('#spotify_' + me.random);

      modal.on('click', '[playlistid]', function () {
        var p = $(this).attr('playlistid');
        console.log('playlistid', p);
        _getPlayList(me, playlists.items[p]['owner']['id'], playlists.items[p]['id']);
      });

      modal.on('click', '[tracklistid]', function () {
        var p = $(this).attr('tracklistid');
        console.log('tracklistid', p);
        _getTrackList(me, playlists.items[p]['owner']['id'], playlists.items[p]['id']);
      });


      modal.on('hidden.bs.modal', function () {
        $(this).data('bs.modal', null);
        console.log('destroyed spotframe');
      });

      $('#spotify_' + me.random).modal();
    });
  }

  function _getCurrentTrack(me) {
    //		spotifyApi.getMyCurrentPlayingTrack(function(err, currently) {
    spotifyApi.getMyCurrentPlaybackState(function (err, currently) {
      if (currently.item !== null && typeof currently.item !== 'undefined') {
        _getCurrentHTML(me, currently);
      }
    });
  }

  function _changeDevice(me, deviceID) {
    var deviceIDs = [deviceID];
    spotifyApi.transferMyPlayback(deviceIDs, {}, function (err, res) {
//      console.log(err, res);
    });
  }
  function _getCurrentHTML(me, currently) {
    var item = currently.item;
    me.spotVolume = Number(currently.device.volume_percent);

    if(me.itemid!==item.id) {
      var src = item.album?item.album.images[0].url:item.images[0].url;
      me.$mountPoint.find('.current_image img').attr('src', src);
      me.$mountPoint.find('.current_artist').html(item.artists[0].name || '');
      me.$mountPoint.find('.current_track').html(item.name || '');
      me.$mountPoint.find('.current_album').html(item.album.name || '');
      me.itemid=item.id;
    }

    var html = '';
    if (userinfo.product !== 'premium') {
        me.$mountPoint.find('.buttons').html('<em>Playback functions of Spotify are only working when you have a premium subscription!</em>');
    } else {
        if(!me.buttonsvisible) {
          me.$mountPoint.find('a.change').show();
          me.$mountPoint.find('select.devices').show();
          me.$mountPoint.find('.buttons').show();
          me.buttonsvisible=true; 
        }
        if (me.is_playing !== currently.is_playing) {
          if (currently.is_playing) {
            me.$mountPoint.find('a.spotpause').show();
            me.$mountPoint.find('a.spotplay').hide();
          } else {
            me.$mountPoint.find('a.spotpause').hide();
            me.$mountPoint.find('a.spotplay').show();
          }

          html += '&nbsp;&nbsp;';

          me.shuffle_state = currently.shuffle_state;
          if (currently.shuffle_state) 
            me.$mountPoint.find('a.shuffle').removeClass('shuffleoff');
          else
            me.$mountPoint.find('a.shuffle').addClass('shuffleoff'); 
        }
      }
  }

  function _trackAction(me, action) {
    if (action == 'Play') {
      spotifyApi.play(function () {
        $('.spotpause').show();
        $('.spotplay').hide();
      });
    }
    if (action == 'Pause') {
      spotifyApi.pause(function () {
        $('.spotpause').hide();
        $('.spotplay').show();
      });
    }
    if (action == 'Forward') {
      spotifyApi.skipToNext(function () {
        _getCurrentTrack(me);
      });
    }
    if (action == 'Rewind') {
      spotifyApi.skipToPrevious(function () {
        _getCurrentTrack(me);
      });
    }
    if (action == 'VolumeDown') {
      me.spotVolume = Math.max(0, me.spotVolume - 10);
      spotifyApi.setVolume(me.spotVolume, {});
    }
    if (action == 'VolumeUp') {
      me.spotVolume = Math.min(100, me.spotVolume + 10);
      spotifyApi.setVolume(me.spotVolume, {});
    }
    if (action == 'ShuffleOn' || action == 'Shuffle' && !me.shuffle_state) {
      spotifyApi.setShuffle(true, {});
      $('#shuffle').removeClass('shuffleoff');
    }
    if (action == 'ShuffleOff' || action == 'Shuffle' && me.shuffle_state) {
      spotifyApi.setShuffle(false, {});
      $('#shuffle').addClass('shuffleoff');
    }
  }

  function _getPlayList(me, owner, id) {
    spotifyApi.getPlaylist(id, null, function (err, playlist) {
      spotifyApi.play(
        {
          context_uri: playlist.uri,
        },
        function (err, res) {
          $('.modal,.modal-backdrop').remove();
        }
      );
    });
  }

  function _getTrack(track) {
    spotifyApi.play({ uris: [track] }, function () {
      $('.modal,.modal-backdrop').remove();
    });
  }

  function _getLoginURL(scopes) {
    if (typeof scopes === 'undefined') {
      scopes = [
        'user-read-email',
        'user-read-currently-playing',
        'user-read-playback-state',
        'user-read-recently-played',
        'user-modify-playback-state',
        'playlist-read-private',
        'user-read-private',
        'streaming',
      ];
    }

    return (
      'https://accounts.spotify.com/authorize?client_id=' +
      settings['spot_clientid'] +
      '&redirect_uri=' +
      encodeURIComponent(REDIRECT_URI) +
      '&scope=' +
      encodeURIComponent(scopes.join(' ')) +
      '&response_type=token'
    );
  }

  function _showPlaylists() {
    $('div.modal-body .row.list').show();
    $('div.modal-body .row.tracks').html('').hide();
  }

  function _getTrackList(me, owner, id) {
    spotifyApi.getPlaylist(id, null, function (err, tracks) {
      tracks = tracks.tracks;

      var html =
        '<div class="col-md-12"><div class="spotback"><a onclick="SpotifyModule.showPlaylists();">&laquo; ' +
        language.misc.spotify_back_to_playlist +
        '</a></div></div>';
      for (var t in tracks.items) {
        if (
          typeof tracks.items[t]['track'] !== 'undefined' &&
          typeof tracks.items[t]['track']['uri'] !== 'undefined'
        ) {
          html += '<div class="col-lg-3 col-md-4 col-sm-6">';
          html += '<div class="spottrack">';
          html +=
            '<div style="margin:10px;"><a onclick="SpotifyModule.getTrack(\'' +
            tracks.items[t]['track']['uri'] +
            '\');"><strong>' +
            tracks.items[t]['track']['artists'][0]['name'] +
            '</strong><br />' +
            tracks.items[t]['track']['name'] +
            '</a></div>';
          html += '</div>';
          html += '</div>';
        }
      }
      $('div.modal-body .row.list').hide();
      $('div.modal-body .row.tracks').html(html).show();
    });
  }

  //Expose public functions
  return {
    getSpotify: _getSpotify,
    changeDevice: _changeDevice,
    getPlayList: _getPlayList,
    getTrackList: _getTrackList,
    showPlaylists: _showPlaylists,
    trackAction: _trackAction,
    getTrack: _getTrack,
    createPlaylistsDlg: _createPlaylistsDlg,
  };
})();

//Wrapper function to stay compatible with current module system
// eslint-disable-next-line no-unused-vars
function getSpotify(me, columndiv) {
  return SpotifyModule.getSpotify(me, columndiv);
}
