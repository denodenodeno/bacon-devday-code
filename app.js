var App = function () {
    'use strict';
    
    var username,
        fullname,
        unavailabilityLabel,
        buttonEnabled,
        usernameEntered,
        fullnameEntered,
        availabilityRequest,
        availabilityResponse,
        usernameAvailable;
        
    function init () {
        unavailabilityLabel = $("#username-unavailable")
        username = textFieldValue($('#username input'));
        fullname = textFieldValue($('#fullname input'));
        usernameEntered = username.map(_nonEmpty);
        fullnameEntered = fullname.map(_nonEmpty);
        availabilityRequest = username
                              .changes()
                              .map(function (user) {
                                  return {
                                      url: '/usernameavailable/' + user
                                  }
                              });
        availabilityResponse = availabilityRequest.flatMapLatest(_toResultStream);
        usernameAvailable = availabilityResponse.toProperty(true);
        buttonEnabled = usernameEntered.and(fullnameEntered).and(usernameAvailable);
        
        function textFieldValue(field) {
            function getValue() {
                return field.val();
            }
            
            return field
                        .asEventStream('keyup')
                        .map(getValue)
                        .toProperty('')
                        .log();
        }
        
        usernameAvailable.not().onValue(function (show) {
           setVisibility(unavailabilityLabel, show); 
        });
        
        buttonEnabled.onValue(function (enabled) {
            $('#register button').attr('disabled', !enabled);
        });
    }
    
    function getUsername() {
        return username;
    }
    
    
    ////helper functions
    function _and(a, b) {
        return a && b;
    }
    
    function _nonEmpty(x) {
        return x.length > 0;
    }
    
    function _toResultStream(req) {
        return Bacon.fromPromise($.ajax(req));
    }
    
    return {
        init: init,
        getUsername: getUsername
    }
    
}();