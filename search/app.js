var applePayUiController = (function () {
  var DOMStrings = {
    appleButton: 'ckoApplePay',
    errorMessage: 'ckoApplePayError'
  }
  return {
    DOMStrings,
    displayApplePayButton: function () {
      document.getElementById(DOMStrings.appleButton).style.display = 'block'
    },
    hideApplePayButton: function () {
      document.getElementById(DOMStrings.appleButton).style.display = 'none'
    },
    displayErrorMessage: function () {
      document.getElementById(DOMStrings.errorMessage).style.display = 'block'
    }
  }
})()

var applePayController = (function (uiController) {
  var BACKEND_URL_VALIDATE_SESSION = 'https://{your backend URL}/validateSession'
  var BACKEND_URL_PAY = 'https://{your backend URL}/pay'

  var config = {
    payments: {
      acceptedCardSchemes: ['amex', 'masterCard', 'maestro', 'visa', 'mada']
    },
    shop: {
      product_price: 5470,
      shop_name: 'Demo Shop',
      shop_localisation: {
        currencyCode: 'GBP',
        countryCode: 'GB'
      }
    }
  }
  var _applePayAvailable = function () {
    return window.ApplePaySession && ApplePaySession.canMakePayments()
  }
  var _startApplePaySession = function (config) {
    var applePaySession = new ApplePaySession(6, config)
    _handleApplePayEvents(applePaySession)
    applePaySession.begin()
  }
  var _validateApplePaySession = function (appleUrl, callback) {
    axios
      .post(
        BACKEND_URL_VALIDATE_SESSION,
        {
          appleUrl
        },
        {
          headers: { 'Access-Control-Allow-Origin': '*' }
        }
      )
      .then(function (response) {
        callback(response.data)
      })
  }
  var _performTransaction = function (details, callback) {
    axios
      .post(
        BACKEND_URL_PAY,
        {
          token: details.token,
        },
        {
          headers: { 'Access-Control-Allow-Origin': '*' }
        }
      )
      .then(function (response) {
        callback(response.data)
      })
  }
  var _handleApplePayEvents = function (appleSession) {
    appleSession.onvalidatemerchant = function (event) {
      _validateApplePaySession(event.validationURL, function (merchantSession) {
        appleSession.completeMerchantValidation(merchantSession)
      })
    }
   

    appleSession.onpaymentauthorized = function (event) {
      _performTransaction(event.payment, function (outcome) {
        if (outcome.approved) {
          appleSession.completePayment(ApplePaySession.STATUS_SUCCESS)
          console.log(outcome)
        } else {
          appleSession.completePayment(ApplePaySession.STATUS_FAILURE)
          console.log(outcome)
        }
      })
    }
  }

  var _setButtonClickListener = function () {
    document
      .getElementById(uiController.DOMStrings.appleButton)
      .addEventListener('click', function () {
        _startApplePaySession({
          currencyCode: config.shop.shop_localisation.currencyCode,
          countryCode: config.shop.shop_localisation.countryCode,
          merchantCapabilities: [
            'supports3DS',
            'supportsEMV',
            'supportsCredit',
            'supportsDebit'
          ],
          supportedNetworks: config.payments.acceptedCardSchemes,

          total: {
            label: config.shop.shop_name,
            amount: config.shop.product_price,
            type: 'final'
          }
        })
      })
  }

  return {
    init: function () {
      if (_applePayAvailable()) {
        uiController.displayApplePayButton()
      } else {
        uiController.hideApplePayButton()
        uiController.displayErrorMessage()
      }
      _setButtonClickListener()
    }
  }
})(applePayUiController)
applePayController.init()
