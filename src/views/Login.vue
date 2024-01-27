<template>
    <section class="login">
        <h2 style="color: #fff; text-align: center; margin-top: 20px; margin-bottom: 20px">
            Login
        </h2>

        <section style="display: flex; flex-direction: column">
            <a @click="loginWithGoogle" class="login-gg-auth" href="#">
                <img
                    class="gg-logo"
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/2048px-Google_%22G%22_Logo.svg.png"
                    alt=""
                />
                Login With Google
            </a>
        </section>
    </section>
</template>

<script lang="ts">
import { firebaseService } from '../services/http-https'
export default {
    data() {
        return {}
    },
    methods: {
        async loginWithGoogle() {
            const data = await firebaseService.signInWithGoogle()
            console.log(data)
            console.log(firebaseService.auth.currentUser)
        },
    },
}
</script>

<style>
.login {
    position: relative;
    left: 50%;
    transform: translateX(-50%) translateY(40px);
    width: 500px;
    height: 600px;
    background-color: #ffffff10;
}

.login-gg-auth {
    display: flex;
    margin: 10px auto;
    align-items: center;
    text-decoration: none;
    padding: 6px 12px;
    font-size: 16px;
    border-radius: 10px;
    color: #fff;
    background-color: #cccccc30;
}

.gg-logo {
    margin-right: 6px;
    width: 20px;
    height: 20px;
}
</style>
