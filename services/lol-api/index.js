var request = require('request'),
  async = require('async'),
  API_KEY = process.env.API_KEY;

module.exports = LOL_API = {};

// Template strings don't work :(
//  var requestUrl = 'https://${region}.api.pvp.net/api/lol/${region}/v1.4/summoner/by-name/${summoner_name}?api_key=${API_KEY}';
LOL_API.getSummonerInfo = function(region, summoner_name, cb) {
  var requestUrl = 'https://'+
    region +'.api.pvp.net/api/lol/'+
    region +'/v1.4/summoner/by-name/'+
    summoner_name +'?api_key='+
    API_KEY;
  request.get(requestUrl, function (err, response, body) {
    if (err) return cb(err);
    cb(null, JSON.parse(body));
  })
}

// var requestUrl = 'https://${region}.api.pvp.net/observer-mode/rest/consumer/getSpectatorGameInfo/${platform_id}/${player_id}?api_key=${API_KEY}';

LOL_API.getMatchInfo = function (region, player_id, cb) {
  var region = 'na',
   platform_id = 'NA1'; // TODO: MAP region to platformID

  var requestUrl = 'https://'+
    region +'.api.pvp.net/observer-mode/rest/consumer/getSpectatorGameInfo/'+
    platform_id +'/'+ player_id +'?api_key='+
    API_KEY;

  request.get(requestUrl, function (err, response, body) {
    if (err) return cb(err);
    if (response.statusCode == 404) {
      return cb(null, {
        status : 'fail',
        message : 'Player is not in a game'
      })
    }
    cb(null, JSON.parse(body));
  })
}


LOL_API.getSpectateInfo = function(region, name, cb) {
  var self = this;
  async.waterfall([
    function (callback) {
      self.getSummonerInfo(region, name, callback);
    },
    function (player_info, callback) {
      console.log(player_info)
      self.getMatchInfo(region, player_info[name].id, callback)
    }
  ], function (err, spectate_data) {
    console.log(spectate_data);
    if (err) return cb(err);
    cb(null, spectate_data);
    // cb(null, {
    //   gameId: results.gameId,
    //   spectateKey : results.observers.encryptionKey
    // })
  })

}