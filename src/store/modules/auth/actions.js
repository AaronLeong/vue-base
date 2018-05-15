import httpCurl from '@/services/http'
import router from '@/router'

/**
 * Sync httpCurl token with current state
*/
export function syncToken ({commit}) {
  if (httpCurl.token) {
    commit('setAccessToken', httpCurl.token)
  }
}

/**
 * Sync router for auth
 */
export function syncRouter ({state, dispatch}, myRouter) {
  dispatch('syncToken')

  myRouter.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requiresAuth)) {
      // this route requires auth, check if logged in
      // if not, redirect to login page (except when it's profile route and
      // there is an access_token).
      if (to.name === 'profile' && to.query.access_token) {
        next()
      } else if (!state.access_token) {
        next({
          name: 'login'
        })
      } else {
        dispatch('loadAccount', state.access_token.AccountsId)
          .then(next)
      }
    } else {
      next() // make sure to always call next()!
    }
  })
}

/**
 * Sign-in account with email and password (stores in state.account)
 * @param  {Function} commit   commit mutations function
 * @param  {String}   email    Accounts email
 * @param  {String}   password Accounts password
 * @return {Promise}           promise of logged Accounts
 */
export function signIn ({commit, dispatch, state}, {email, password}) {
  console.log(email, password)
  return httpCurl
    .post('/Accounts/login', {
      email,
      password
    })
    .then((token) => {
      commit('setAccessToken', token)

      // Update httpCurl Token
      if (state.access_token !== null) {
        httpCurl.setToken(state.access_token)
      } else {
        httpCurl.removeToken()
      }

      router.push({name: 'dashboard'})
      return dispatch('loadAccount', state.access_token.AccountsId)
    })
}

/**
 * Sign-out current logged-in account
 *  (assumes that current state.account is not null)
 * @param  {Function} commit commit mutations function
 * @return {Promise}         promise of the logout
 */
export function signOut ({commit, state}) {
  return httpCurl
    .post('/Accounts/logout', {
      // eslint-disable-next-line dot-notation
      accessToken: state['access_token']
    })
    .then(() => {
      commit('setAccessToken', null)
      httpCurl.removeToken()
      router.push({name: 'login'})
    })
}

/**
 * Load an account by AccountsId in state.account
 * @param  {Function} commit    commit mutations function
 * @param  {Number}   AccountsId account id
 * @return {Promise}            promise of the account
 */
export function loadAccount ({commit}, AccountsId) {
  return httpCurl
    .get(`/Accounts/${AccountsId}`)
    .then(acc => commit('setAccount', acc))
    .catch(() => {
      httpCurl.removeToken()
      router.push({name: 'login'})
    })
}

/**
 * Reset the password of the current logged-in account
 *  (assumes that current state.account is not null)
 *  (assumes that current state.access_token is not null)
 * @param  {Function} commit       commit mutations function
 * @param  {Object}   state        Vuex state
 * @param  {String}   oldPassword  old password
 * @param  {String}   newPassword  new password
 * @return {Promise}              promise of the password reset
 */
export function resetPassword (ctx, {oldPassword, newPassword}) {
  return httpCurl
    .post(
      '/Accounts/change-password',
      {oldPassword, newPassword}
    )
}

/**
 * Send a email to the account Accounts to reset the password
 * @param  {Function} commit       commit mutations function
 * @param  {String}   email        Accounts email
 * @return {Promise}               promise of the sent email
 */
export function rememberPassword (ctx, email) {
  return httpCurl
    .post('/Accounts/reset', {email})
}
