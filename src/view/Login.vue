<template>
  <div class="login-view">
    <div class="card">
      <div class="logo">
        <!-- <img src="../static/images/logo.png"> -->
      </div>
      <div class="card-block p-4">
        <!-- Login Form -->
        <form @submit="onSubmit">
          <div class="form-group">
            <label for="email">Email</label>
            <input type="email"
                   class="form-control"
                   id="email"
                   aria-describedby="emailHelp"
                   placeholder="Insert your email"
                   v-model="email"
                   required>
          </div>
          <div class="form-group">
            <label for="senha">Password</label>
            <input type="password"
                   class="form-control"
                   id="senha"
                   placeholder="Insert your password"
                   v-model="password"
                   required>
          </div>
          <div class="alert alert-danger"
               role="alert"
               v-if="error">{{error.message}}</div>
          <div class="flex">
            <a class="link"
              @click.prevent="$refs.forgotPassword.show()"
              href="#">
              Forgot your password?
            </a>
            <button type="submit"
                    class="btn btn-success">
              <i v-if="loading" class="fa fa-spinner"></i>
              <i v-else class="fa fa-check"></i>
              SIGN IN
            </button>
          </div>
        </form>

        <!-- Forgot Password -->
        <div
            ref="forgotPassword"
            title="Recover the password"
            size="sm"
            @ok="onModalOk"
            @shown="onModalShown">
          <form ref="forgotPasswordForm" class="forgot-form">
            <i v-if="loading" class="fa fa-spinner"></i>
            <b-alert
              v-if="recoverError"
              :show="recoverError !== null"
              variant="danger">
              {{ recoverError.message }}
            </b-alert>
            <input
              type="email"
              class="form-control"
              ref="recoverEmail"
              placeholder="Insert your email"
              v-model="recoverEmail"
              @keydown.enter="sendRecoverEmail"
              required/>
          </form>
        </div>

        <div
          ref="recoverSuccess"
          ok-only>
          An email has been sent, please verify your mailbox
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      email: null,
      password: null,
      error: null,
      recoverError: null,
      recoverSuccess: null,
      recoverEmail: null,
      loading: false
    }
  },
  methods: {
    onSubmit (evt) {
      evt.preventDefault()
      this.loading = true
      this.error = null
      this
        .$store
        .dispatch('auth/signIn', {
          email: this.email,
          password: this.password
        })
        .then(() => {
          this.loading = false
        })
        .catch(err => {
          this.error = err
          this.loading = false
        })
    },
    onModalShown () {
      this.$refs.forgotPasswordForm.reset()
      this.recoverError = null
      this.$refs.recoverEmail.focus()
    },
    onModalOk (evt) {
      evt.preventDefault()
      this.sendRecoverEmail()
    },
    sendRecoverEmail () {
      const form = this.$refs.forgotPasswordForm
      // const email = this.$refs.recoverEmail

      this.recoverError = null
      if (form.checkValidity()) {
        this.loading = true
        this
          .$store
          .dispatch('auth/rememberPassword', this.email)
          .then(() => {
            this.loading = false
            this.$refs.forgotPassword.hide()
            this.$refs.recoverSuccess.show()
          })
          .catch(err => {
            this.loading = false
            this.recoverError = err
          })
      } else {
        this.recoverError = {message: 'Please, check the inserted email and try again'}
      }
    }
  }
}
</script>
