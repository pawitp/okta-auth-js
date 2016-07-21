define(function(require) {
  var OktaAuth = require('OktaAuth');
  var tokens = require('../util/tokens');
  var oauthUtil = require('../util/oauthUtil');

  describe('token.decode', function () {

    function setupSync() {
      return new OktaAuth({ url: 'http://example.okta.com' });
    }

    it('correctly decodes a token', function () {
      var oa = setupSync();
      var decodedToken = oa.token.decode(tokens.unicodeToken);
      expect(decodedToken).toDeepEqual(tokens.unicodeDecoded);
    });

    it('throws an error for a malformed token', function () {
      var oa = setupSync();
      try {
        oa.token.decode('malformedToken');
        // Should never hit this
        expect(true).toBe(false);
      } catch (e) {
        expect(e.name).toEqual('AuthSdkError');
        expect(e.errorSummary).toBeDefined();
      }
    });
  });

  describe('token.getWithoutPrompt', function () {
    it('returns id_token using sessionToken', function (done) {
      return oauthUtil.setupFrame({
        oktaAuthArgs: {
          url: 'https://auth-js-test.okta.com',
          clientId: 'NPSfOkH5eZrTy8PMDlvx',
          redirectUri: 'https://auth-js-test.okta.com/redirect'
        },
        getWithoutPromptArgs: {
          sessionToken: 'testSessionToken'
        },
        postMessageSrc: {
          baseUri: 'https://auth-js-test.okta.com/oauth2/v1/authorize',
          queryParams: {
            'client_id': 'NPSfOkH5eZrTy8PMDlvx',
            'redirect_uri': 'https://auth-js-test.okta.com/redirect',
            'response_type': 'id_token',
            'response_mode': 'okta_post_message',
            'state': oauthUtil.mockedState,
            'nonce': oauthUtil.mockedNonce,
            'scope': 'openid email',
            'prompt': 'none',
            'sessionToken': 'testSessionToken'
          }
        }
      })
      .fin(function() {
        done();
      });
    });

    it('returns access_token using sessionToken', function (done) {
      return oauthUtil.setupFrame({
        oktaAuthArgs: {
          url: 'https://auth-js-test.okta.com',
          clientId: 'NPSfOkH5eZrTy8PMDlvx',
          redirectUri: 'https://auth-js-test.okta.com/redirect'
        },
        getWithoutPromptArgs: {
          responseType: 'token',
          sessionToken: 'testSessionToken'
        },
        postMessageSrc: {
          baseUri: 'https://auth-js-test.okta.com/oauth2/v1/authorize',
          queryParams: {
            'client_id': 'NPSfOkH5eZrTy8PMDlvx',
            'redirect_uri': 'https://auth-js-test.okta.com/redirect',
            'response_type': 'token',
            'response_mode': 'okta_post_message',
            'state': oauthUtil.mockedState,
            'nonce': oauthUtil.mockedNonce,
            'scope': 'openid email',
            'prompt': 'none',
            'sessionToken': 'testSessionToken'
          }
        },
        time: 1449699929,
        postMessageResp: {
          'access_token': tokens.standardAccessToken,
          'token_type': 'Bearer',
          'expires_in': 3600,
          'state': oauthUtil.mockedState
        },
        expectedResp: {
          accessToken: tokens.standardAccessToken,
          expiresAt: 1449703529,
          scopes: ['openid', 'email'],
          tokenType: 'Bearer'
        }
      })
      .fin(function() {
        done();
      });
    });

    it('returns id_token and access_token (in that order) using an array of responseTypes', function (done) {
      return oauthUtil.setupFrame({
        oktaAuthArgs: {
          url: 'https://auth-js-test.okta.com',
          clientId: 'NPSfOkH5eZrTy8PMDlvx',
          redirectUri: 'https://auth-js-test.okta.com/redirect'
        },
        getWithoutPromptArgs: {
          responseType: ['id_token', 'token'],
          sessionToken: 'testSessionToken'
        },
        postMessageSrc: {
          baseUri: 'https://auth-js-test.okta.com/oauth2/v1/authorize',
          queryParams: {
            'client_id': 'NPSfOkH5eZrTy8PMDlvx',
            'redirect_uri': 'https://auth-js-test.okta.com/redirect',
            'response_type': 'id_token token',
            'response_mode': 'okta_post_message',
            'state': oauthUtil.mockedState,
            'nonce': oauthUtil.mockedNonce,
            'scope': 'openid email',
            'prompt': 'none',
            'sessionToken': 'testSessionToken'
          }
        },
        time: 1449699929,
        postMessageResp: {
          'id_token': tokens.standardIdToken,
          'access_token': tokens.standardAccessToken,
          'token_type': 'Bearer',
          'expires_in': 3600,
          'state': oauthUtil.mockedState
        },
        expectedResp: [{
          idToken: tokens.standardIdToken,
          claims: tokens.standardIdTokenClaims,
          expiresAt: 1449699930,
          scopes: ['openid', 'email']
        }, {
          accessToken: tokens.standardAccessToken,
          expiresAt: 1449703529,
          scopes: ['openid', 'email'],
          tokenType: 'Bearer'
        }]
      })
      .fin(function() {
        done();
      });
    });

    it('returns access_token and id_token (in that order) using an array of responseTypes', function (done) {
      return oauthUtil.setupFrame({
        oktaAuthArgs: {
          url: 'https://auth-js-test.okta.com',
          clientId: 'NPSfOkH5eZrTy8PMDlvx',
          redirectUri: 'https://auth-js-test.okta.com/redirect'
        },
        getWithoutPromptArgs: {
          responseType: ['token', 'id_token'],
          sessionToken: 'testSessionToken'
        },
        postMessageSrc: {
          baseUri: 'https://auth-js-test.okta.com/oauth2/v1/authorize',
          queryParams: {
            'client_id': 'NPSfOkH5eZrTy8PMDlvx',
            'redirect_uri': 'https://auth-js-test.okta.com/redirect',
            'response_type': 'token id_token',
            'response_mode': 'okta_post_message',
            'state': oauthUtil.mockedState,
            'nonce': oauthUtil.mockedNonce,
            'scope': 'openid email',
            'prompt': 'none',
            'sessionToken': 'testSessionToken'
          }
        },
        time: 1449699929,
        postMessageResp: {
          'id_token': tokens.standardIdToken,
          'access_token': tokens.standardAccessToken,
          'token_type': 'Bearer',
          'expires_in': 3600,
          'state': oauthUtil.mockedState
        },
        expectedResp: [{
          accessToken: tokens.standardAccessToken,
          expiresAt: 1449703529,
          scopes: ['openid', 'email'],
          tokenType: 'Bearer'
        }, {
          idToken: tokens.standardIdToken,
          claims: tokens.standardIdTokenClaims,
          expiresAt: 1449699930,
          scopes: ['openid', 'email']
        }]
      })
      .fin(function() {
        done();
      });
    });

    it('returns a single token using an array with a single responseType', function (done) {
      return oauthUtil.setupFrame({
        oktaAuthArgs: {
          url: 'https://auth-js-test.okta.com',
          clientId: 'NPSfOkH5eZrTy8PMDlvx',
          redirectUri: 'https://auth-js-test.okta.com/redirect'
        },
        getWithoutPromptArgs: {
          responseType: ['id_token'],
          sessionToken: 'testSessionToken'
        },
        postMessageSrc: {
          baseUri: 'https://auth-js-test.okta.com/oauth2/v1/authorize',
          queryParams: {
            'client_id': 'NPSfOkH5eZrTy8PMDlvx',
            'redirect_uri': 'https://auth-js-test.okta.com/redirect',
            'response_type': 'id_token',
            'response_mode': 'okta_post_message',
            'state': oauthUtil.mockedState,
            'nonce': oauthUtil.mockedNonce,
            'scope': 'openid email',
            'prompt': 'none',
            'sessionToken': 'testSessionToken'
          }
        },
        expectedResp: [{
          idToken: tokens.standardIdToken,
          claims: tokens.standardIdTokenClaims,
          expiresAt: 1449699930,
          scopes: ['openid', 'email']
        }]
      })
      .fin(function() {
        done();
      });
    });

    oauthUtil.itErrorsCorrectly('throws an error if multiple responseTypes are sent as a string',
      {
        oktaAuthArgs: {
          url: 'https://auth-js-test.okta.com',
          clientId: 'NPSfOkH5eZrTy8PMDlvx',
          redirectUri: 'https://auth-js-test.okta.com/redirect'
        },
        getWithoutPromptArgs: {
          responseType: 'id_token token',
          sessionToken: 'testSessionToken'
        }
      },
      {
        name: 'AuthSdkError',
        message: 'Multiple OAuth responseTypes must be defined as an array',
        errorCode: 'INTERNAL',
        errorSummary: 'Multiple OAuth responseTypes must be defined as an array',
        errorLink: 'INTERNAL',
        errorId: 'INTERNAL',
        errorCauses: []
      }
    );
  });

  describe('token.getWithPopup', function () {
    it('returns id_token using idp', function (done) {
        return oauthUtil.setupPopup({
          oktaAuthArgs: {
            url: 'https://auth-js-test.okta.com',
            clientId: 'NPSfOkH5eZrTy8PMDlvx',
            redirectUri: 'https://auth-js-test.okta.com/redirect'
          },
          getWithPopupArgs: {
            idp: 'testIdp'
          },
          postMessageSrc: {
            baseUri: 'https://auth-js-test.okta.com/oauth2/v1/authorize',
            queryParams: {
              'client_id': 'NPSfOkH5eZrTy8PMDlvx',
              'redirect_uri': 'https://auth-js-test.okta.com/redirect',
              'response_type': 'id_token',
              'response_mode': 'okta_post_message',
              'display': 'popup',
              'state': oauthUtil.mockedState,
              'nonce': oauthUtil.mockedNonce,
              'scope': 'openid email',
              'idp': 'testIdp'
            }
          }
        })
        .fin(function() {
          done();
        });
    });

    it('returns access_token using sessionToken', function (done) {
      return oauthUtil.setupPopup({
        oktaAuthArgs: {
          url: 'https://auth-js-test.okta.com',
          clientId: 'NPSfOkH5eZrTy8PMDlvx',
          redirectUri: 'https://auth-js-test.okta.com/redirect'
        },
        getWithPopupArgs: {
          responseType: 'token',
          idp: 'testIdp'
        },
        postMessageSrc: {
          baseUri: 'https://auth-js-test.okta.com/oauth2/v1/authorize',
          queryParams: {
            'client_id': 'NPSfOkH5eZrTy8PMDlvx',
            'redirect_uri': 'https://auth-js-test.okta.com/redirect',
            'response_type': 'token',
            'response_mode': 'okta_post_message',
            'display': 'popup',
            'state': oauthUtil.mockedState,
            'nonce': oauthUtil.mockedNonce,
            'scope': 'openid email',
            'idp': 'testIdp'
          }
        },
        time: 1449699929,
        postMessageResp: {
          'access_token': tokens.standardAccessToken,
          'token_type': 'Bearer',
          'expires_in': 3600,
          'state': oauthUtil.mockedState
        },
        expectedResp: {
          accessToken: tokens.standardAccessToken,
          expiresAt: 1449703529,
          scopes: ['openid', 'email'],
          tokenType: 'Bearer'
        }
      })
      .fin(function() {
        done();
      });
    });

    it('returns access_token and id_token (in that order) using idp', function (done) {
      return oauthUtil.setupPopup({
        oktaAuthArgs: {
          url: 'https://auth-js-test.okta.com',
          clientId: 'NPSfOkH5eZrTy8PMDlvx',
          redirectUri: 'https://auth-js-test.okta.com/redirect'
        },
        getWithPopupArgs: {
          responseType: ['token', 'id_token'],
          idp: 'testIdp'
        },
        postMessageSrc: {
          baseUri: 'https://auth-js-test.okta.com/oauth2/v1/authorize',
          queryParams: {
            'client_id': 'NPSfOkH5eZrTy8PMDlvx',
            'redirect_uri': 'https://auth-js-test.okta.com/redirect',
            'response_type': 'token id_token',
            'response_mode': 'okta_post_message',
            'display': 'popup',
            'state': oauthUtil.mockedState,
            'nonce': oauthUtil.mockedNonce,
            'scope': 'openid email',
            'idp': 'testIdp'
          }
        },
        time: 1449699929,
        postMessageResp: {
          'id_token': tokens.standardIdToken,
          'access_token': tokens.standardAccessToken,
          'token_type': 'Bearer',
          'expires_in': 3600,
          'state': oauthUtil.mockedState
        },
        expectedResp: [{
          accessToken: tokens.standardAccessToken,
          expiresAt: 1449703529,
          scopes: ['openid', 'email'],
          tokenType: 'Bearer'
        }, {
          idToken: tokens.standardIdToken,
          claims: tokens.standardIdTokenClaims,
          expiresAt: 1449699930,
          scopes: ['openid', 'email']
        }]
      })
      .fin(function() {
        done();
      });
    });

    it('returns id_token and access_token (in that order) using idp', function (done) {
      return oauthUtil.setupPopup({
        oktaAuthArgs: {
          url: 'https://auth-js-test.okta.com',
          clientId: 'NPSfOkH5eZrTy8PMDlvx',
          redirectUri: 'https://auth-js-test.okta.com/redirect'
        },
        getWithPopupArgs: {
          responseType: ['id_token', 'token'],
          idp: 'testIdp'
        },
        postMessageSrc: {
          baseUri: 'https://auth-js-test.okta.com/oauth2/v1/authorize',
          queryParams: {
            'client_id': 'NPSfOkH5eZrTy8PMDlvx',
            'redirect_uri': 'https://auth-js-test.okta.com/redirect',
            'response_type': 'id_token token',
            'response_mode': 'okta_post_message',
            'display': 'popup',
            'state': oauthUtil.mockedState,
            'nonce': oauthUtil.mockedNonce,
            'scope': 'openid email',
            'idp': 'testIdp'
          }
        },
        time: 1449699929,
        postMessageResp: {
          'id_token': tokens.standardIdToken,
          'access_token': tokens.standardAccessToken,
          'token_type': 'Bearer',
          'expires_in': 3600,
          'state': oauthUtil.mockedState
        },
        expectedResp: [{
          idToken: tokens.standardIdToken,
          claims: tokens.standardIdTokenClaims,
          expiresAt: 1449699930,
          scopes: ['openid', 'email']
        }, {
          accessToken: tokens.standardAccessToken,
          expiresAt: 1449703529,
          scopes: ['openid', 'email'],
          tokenType: 'Bearer'
        }]
      })
      .fin(function() {
        done();
      });
    });
  });

  describe('token.getWithRedirect', function() {
    it('sets authorize url and cookie for id_token using sessionToken', function() {
      oauthUtil.setupRedirect({
        getWithRedirectArgs: {
          sessionToken: 'testToken'
        },
        expectedCookie: 'okta-oauth-redirect-params=' + JSON.stringify({
          responseType: 'id_token',
          state: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
          nonce: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
          scope: ['openid', 'email']
        }) + ';',
        expectedRedirectUrl: 'https://auth-js-test.okta.com/oauth2/v1/authorize?' +
                             'client_id=NPSfOkH5eZrTy8PMDlvx&' +
                             'redirect_uri=https%3A%2F%2Fauth-js-test.okta.com%2Fredirect&' +
                             'response_type=id_token&' +
                             'response_mode=fragment&' +
                             'state=aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa&' +
                             'nonce=aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa&' +
                             'sessionToken=testToken&' +
                             'scope=openid%20email'
      });
    });

    it('sets authorize url for access_token and don\'t throw an error if openid isn\'t included in scope', function() {
      oauthUtil.setupRedirect({
        getWithRedirectArgs: {
          responseType: 'token',
          scope: ['email'],
          sessionToken: 'testToken'
        },
        expectedCookie: 'okta-oauth-redirect-params=' + JSON.stringify({
          responseType: 'token',
          state: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
          nonce: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
          scope: ['email']
        }) + ';',
        expectedRedirectUrl: 'https://auth-js-test.okta.com/oauth2/v1/authorize?' +
                             'client_id=NPSfOkH5eZrTy8PMDlvx&' +
                             'redirect_uri=https%3A%2F%2Fauth-js-test.okta.com%2Fredirect&' +
                             'response_type=token&' +
                             'response_mode=fragment&' +
                             'state=aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa&' +
                             'nonce=aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa&' +
                             'sessionToken=testToken&' +
                             'scope=email'
      });
    });

    it('sets authorize url for access_token and id_token using idp', function() {
      oauthUtil.setupRedirect({
        getWithRedirectArgs: {
          responseType: ['token', 'id_token'],
          idp: 'testIdp'
        },
        expectedCookie: 'okta-oauth-redirect-params=' + JSON.stringify({
          responseType: ['token', 'id_token'],
          state: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
          nonce: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
          scope: ['openid', 'email']
        }) + ';',
        expectedRedirectUrl: 'https://auth-js-test.okta.com/oauth2/v1/authorize?' +
                             'client_id=NPSfOkH5eZrTy8PMDlvx&' +
                             'redirect_uri=https%3A%2F%2Fauth-js-test.okta.com%2Fredirect&' +
                             'response_type=token%20id_token&' +
                             'response_mode=fragment&' +
                             'state=aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa&' +
                             'nonce=aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa&' +
                             'idp=testIdp&' +
                             'scope=openid%20email'
      });
    });
  });

  describe('token.parseFromUrl', function() {
    it('parses id_token', function(done) {
      return oauthUtil.setupParseUrl({
        hashMock: '#id_token=' + tokens.standardIdToken +
                  '&state=' + oauthUtil.mockedState,
        oauthCookie: 'okta-oauth-redirect-params=' + JSON.stringify({
          responseType: 'id_token',
          state: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
          nonce: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
          scope: ['openid', 'email']
        }) + ';',
        expectedResp: {
          idToken: tokens.standardIdToken,
          claims: tokens.standardIdTokenClaims,
          expiresAt: 1449699930,
          scopes: ['openid', 'email']
        }
      })
      .fin(function() {
        done();
      });
    });

    it('parses access_token', function(done) {
      return oauthUtil.setupParseUrl({
        time: 1449699929,
        hashMock: '#access_token=' + tokens.standardAccessToken +
                  '&expires_in=3600' +
                  '&token_type=Bearer' +
                  '&state=' + oauthUtil.mockedState,
        oauthCookie: 'okta-oauth-redirect-params=' + JSON.stringify({
          responseType: 'token',
          state: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
          nonce: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
          scope: ['openid', 'email']
        }) + ';',
        expectedResp: {
          accessToken: tokens.standardAccessToken,
          expiresAt: 1449703529,
          scopes: ['openid', 'email'],
          tokenType: 'Bearer'
        }
      })
      .fin(function() {
        done();
      });
    });

    it('parses access_token and id_token', function(done) {
      return oauthUtil.setupParseUrl({
        time: 1449699929,
        hashMock: '#access_token=' + tokens.standardAccessToken +
                  '&id_token=' + tokens.standardIdToken +
                  '&expires_in=3600' +
                  '&token_type=Bearer' +
                  '&state=' + oauthUtil.mockedState,
        oauthCookie: 'okta-oauth-redirect-params=' + JSON.stringify({
          responseType: ['id_token', 'token'],
          state: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
          nonce: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
          scope: ['openid', 'email']
        }) + ';',
        expectedResp: [{
          idToken: tokens.standardIdToken,
          claims: tokens.standardIdTokenClaims,
          expiresAt: 1449699930,
          scopes: ['openid', 'email']
        }, {
          accessToken: tokens.standardAccessToken,
          expiresAt: 1449703529,
          scopes: ['openid', 'email'],
          tokenType: 'Bearer'
        }]
      })
      .fin(function() {
        done();
      });
    });

    oauthUtil.itpErrorsCorrectly('throws an error if nothing to parse',
      {
        setupMethod: oauthUtil.setupParseUrl,
        hashMock: '',
        oauthCookie: 'okta-oauth-redirect-params=' + JSON.stringify({
          responseType: ['id_token', 'token'],
          state: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
          nonce: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
          scope: ['openid', 'email']
        }) + ';'
      },
      {
        name: 'AuthSdkError',
        message: 'Unable to parse a token from the url',
        errorCode: 'INTERNAL',
        errorSummary: 'Unable to parse a token from the url',
        errorLink: 'INTERNAL',
        errorId: 'INTERNAL',
        errorCauses: []
      }
    );

    oauthUtil.itpErrorsCorrectly('throws an error if no cookie set',
      {
        setupMethod: oauthUtil.setupParseUrl,
        hashMock: '#access_token=' + tokens.standardAccessToken +
                  '&id_token=' + tokens.standardIdToken +
                  '&expires_in=3600' +
                  '&token_type=Bearer' +
                  '&state=' + oauthUtil.mockedState,
        oauthCookie: ''
      },
      {
        name: 'AuthSdkError',
        message: 'Unable to parse a token from the url',
        errorCode: 'INTERNAL',
        errorSummary: 'Unable to parse a token from the url',
        errorLink: 'INTERNAL',
        errorId: 'INTERNAL',
        errorCauses: []
      }
    );

    oauthUtil.itpErrorsCorrectly('throws an error if state doesn\'t match',
      {
        setupMethod: oauthUtil.setupParseUrl,
        hashMock: '#access_token=' + tokens.standardAccessToken +
                  '&id_token=' + tokens.standardIdToken +
                  '&expires_in=3600' +
                  '&token_type=Bearer' +
                  '&state=' + oauthUtil.mockedState,
        oauthCookie: 'okta-oauth-redirect-params=' + JSON.stringify({
          responseType: ['id_token', 'token'],
          state: 'mismatchedState',
          nonce: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
          scope: ['openid', 'email']
        }) + ';'
      },
      {
        name: 'AuthSdkError',
        message: 'OAuth flow response state doesn\'t match request state',
        errorCode: 'INTERNAL',
        errorSummary: 'OAuth flow response state doesn\'t match request state',
        errorLink: 'INTERNAL',
        errorId: 'INTERNAL',
        errorCauses: []
      }
    );

    oauthUtil.itpErrorsCorrectly('throws an error if nonce doesn\'t match',
      {
        setupMethod: oauthUtil.setupParseUrl,
        hashMock: '#access_token=' + tokens.standardAccessToken +
                  '&id_token=' + tokens.standardIdToken +
                  '&expires_in=3600' +
                  '&token_type=Bearer' +
                  '&state=' + oauthUtil.mockedState,
        oauthCookie: 'okta-oauth-redirect-params=' + JSON.stringify({
          responseType: ['id_token', 'token'],
          state: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
          nonce: 'mismatchedNonce',
          scope: ['openid', 'email']
        }) + ';'
      },
      {
        name: 'AuthSdkError',
        message: 'OAuth flow response nonce doesn\'t match request nonce',
        errorCode: 'INTERNAL',
        errorSummary: 'OAuth flow response nonce doesn\'t match request nonce',
        errorLink: 'INTERNAL',
        errorId: 'INTERNAL',
        errorCauses: []
      }
    );
  });
});