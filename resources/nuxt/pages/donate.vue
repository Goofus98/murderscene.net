<template>
    <div class="donate-header">
        DONATE
    </div>

    <div class="loading-donate"
        v-if="!show && !isGMOD"
        v-loading="true"
        element-loading-text="Loading..."
        :element-loading-spinner="svg"
        element-loading-svg-view-box="0, 0, 50, 50"
        element-loading-background="rgba(122, 122, 122, 0)"
    >

    </div>

    <transition name="el-zoom-in-center">
        <div class="donate-container" v-show="show" >
            <div class="donate-info" v-once>
                Our community pays monthly for premium Garry's Mod hosting. To help us out you can donate for GP (in-game currency)
                which can be used on all our servers for cosmetics, avatar, and other server 
                unique items. Donated funds will be put toward the upkeep of this community!
            </div>

            <div class="unlogin-notice" v-if="!User">
                Please sign in through Steam
            </div>

            <div class="login-notice" v-if="User">
                You're Logged Into Steam&#160;&#10003;
            </div>

            <a href="https://api.murderscene.net/auth/steam?ret=https://murderscene.net/donate" v-if="!User" class="user-login" v-once>
                <img src="/images/steam_login.png" style="height: 80px;"/>
            </a>


            <a class="steam-card" v-show="show" v-if="User" :href="`https://steamcommunity.com/profiles/${User.steamid}`">
                <div class="steam-media-left">
                    <img :src="`${Currency.avatar}`" style="height: 140px;"/>
                </div>
                <div class="steam-media-body">
                    {{Currency.name}}
                     <br>
                    {{formattedGP}} GP
                </div>
            </a>
            <div class="donate-amount-header" v-once>
                Enter An Amount
            </div>
            <div class="donate-notice" v-once>
                Rates:
                <br>
                $1 = {{sGPPerDollar}} GP
            </div>
            <transition name="el-zoom-in-bottom">
                <div class="donate-amount-header" v-show="donation!='' && calulatedGP != 'NaN'">
                    {{calulatedGP}} GP
                </div>
            </transition>
            <div class="donate">
                <el-input v-model="donation" placeholder="0" class="donate-input">
                    <template #prepend>
                        $
                    </template>
                    <template #append>
                            <el-button class="donate-button" @click="submitDonation">
                                select
                            </el-button>
                    </template>
                </el-input>
            </div>
        </div>
    </transition>
</template>


<script lang="ts">

import { Component, Vue, Setup } from 'vue-facing-decorator'
import { VueCookieNext } from 'vue-cookie-next'
import {useMoneyStore}  from '@/stores/Money'
import { ref } from 'vue'


@Component({
    components: {}
})
export default class IndexClass extends Vue {
    donation = ref('')
    hasFinishedSteamLoad = false
    MoneyStore = useMoneyStore()
    runtimeConfig = useRuntimeConfig()

    async created() {
        await this.MoneyStore.Init();
        this.hasFinishedSteamLoad = true
    }
    
    get User() {
        return VueCookieNext.getCookie('steamid64');
    }

    get Currency() {
        return this.MoneyStore.money;
    }

    get isGMOD() {
        return navigator.userAgent.match("GMod/13") != null;
    }

    get formattedGP() {
        return new Intl.NumberFormat().format(this.Currency.gp);
    }

    get show(){
        return this.hasFinishedSteamLoad
    }

    get calulatedGP(){
        var iDonate = parseInt(this.donation)
        var dollarpergp = parseInt(this.runtimeConfig.public.gpPerDollar)

        return new Intl.NumberFormat().format(iDonate * dollarpergp)
    }
    get iDonation(){
        var iDonate = parseFloat(this.donation).toFixed(2)
        if (Number.isNaN(iDonate)){
            return 0
        }
        return iDonate
    }
    get sDonation(){
        var sDonate = this.iDonation.toString()
        return sDonate.replace('.', '');
    }
    get sGPPerDollar(){

        return new Intl.NumberFormat().format(this.runtimeConfig.public.gpPerDollar);
    }

    submitDonation(){
        if (Number.isNaN(parseInt(this.donation)) || parseInt(this.donation) <= 0 ){
            return;
        }
        this.$router.push("confirm?amt=" + this.sDonation)
    } 
}
</script>


<style>

:root {
    --canvas-color: rgb(13,13,13);
    --nav-color:rgb(31,31,31);
    --nav-text-color:rgb(217,217,211);
    --nav-hover-color:rgb(56,56,56);
    --caption-z-index:auto;
    --caption-font-size:auto;
    --min-width-check:225px;
}
.loading-donate{
    position: relative;
    max-width: 1200px;

    min-width: 300px;
    width: 60vw;
    height: 25vh;

    margin: auto;



    overflow: hidden;
}

.user-login{
    display: flex;
    height: 84px;
    width: fit-content;
    margin: auto;
    margin-bottom: 20px;
}
.steam-card{
    display: flex;

    padding-right: 10px;
    background-image: linear-gradient(to left,  rgb(56,102,255) , rgb(30,50,120));

    width: fit-content;
    height: 140px;
    border-radius: 10px;

    margin: auto;
    margin-bottom: 20px;

    direction: ltr;
    overflow: hidden;
    outline-style: dotted;
    outline-width: 6px;
    outline-color: rgb(60,60,160);
}

.steam-media-body{
    display: flex;

    white-space: nowrap;
    padding-left: 10px;
    font-family: 'Noto Sans', sans-serif;
    font-size:calc(25px + .2rem);

    font-weight: bold;
    text-shadow: 1px 1px 2px black, 0 0 1em black, 0 0 0.2em blue;
    color: rgb(217,217,217);
}

.donate-header{
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    margin: auto;
    margin-bottom: 20px;

    font-family: 'Noto Sans', sans-serif;
    font-size: 34px;

    font-weight: bold;
    text-shadow: 1px 1px 2px black, 0 0 1em blue, 0 0 0.2em blue;
    color: rgb(217,217,217);
}

.donate-info{
    font-family: 'Noto Sans', sans-serif;
    font-size:calc(12px + 1.15vh);
    text-shadow: 1px 1px 2px black, 0 0 1em black, 0 0 0.2em black;
    color: rgb(217,217,217);
    margin-bottom: 5px
}
.donate-container{
    max-width: 1200px;
    min-width: 300px;
    width: 60vw;


    height: auto;
    padding: 30px;
    margin: auto;
    margin-bottom: 20px;
    background-color: rgb(26,26,26);

    border-radius: 25px;

    outline-style: dashed;
    outline-width: 5px;
    outline-color: rgb(50,50,50);

}

.unlogin-notice{
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    margin: auto;

    font-family: 'Noto Sans', sans-serif;
    font-weight:bold;

    font-size:calc(20px + 1.15vh);

    color: rgb(255,0,0);
    text-shadow: 1px 1px 2px rgb(187,0,14), 0 0 0.4em rgb(187,0,14), 0 0 0.4em rgb(187,0,14);
    margin-bottom: 5px;
}

.login-notice{
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    margin: auto;

    font-family: 'Noto Sans', sans-serif;
    font-weight:bold;

    font-size:calc(20px + 1.15vh);

    color: rgb(21,255,0);
    text-shadow: 1px 1px 2px rgb(14,163,0), 0 0 0.4em  rgb(14,163,0), 0 0 0.4em rgb(14,163,0);
    margin-bottom: 5px;
}

.donate-amount-header{

    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    margin: auto;

    font-family: 'Noto Sans', sans-serif;
   font-size:calc(20px + 1.15vh);
   font-weight: bold;
   background-image: linear-gradient(
	to top,
	#462523 0,
    #cb9b51 22%, 
	#f6e27a 45%,
	#f6f2c0 50%,
	#f6e27a 55%,
	#cb9b51 78%,
	#462523 100%
	);
   color:transparent;
   -webkit-background-clip:text;
}

.donate-notice{
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    margin: auto;

    font-family: 'Noto Sans', sans-serif;
    font-weight: bold;
    font-size:calc(10px + 1.15vh);

    color: rgb(217,217,217);
}

.el-input-group__append {
    color: white;

    font-weight: normal;

    --el-fill-color-light: rgb(237,37,83);

    --el-input-border-color: rgb(237,37,83);
}

.donate{
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
}

.donate-input{
    width: 255px;
    height: 60px;
    

    margin: auto;
    font-family: 'Noto Sans', sans-serif;
    font-size: 22px;
    font-weight: bold;
}

.donate-button{
    height: 100%;

    padding: 8px;
    font-weight: normal;

    padding-top: 0px;
    padding-bottom: 0px;

    --el-color-primary: rgb(217,217,211);
    --el-color-primary-light-7: rgb(156,102,255);
    --el-color-primary-light-9: rgb(48,62,255);
    --el-button-text-color: white;
    --el-border-color: rgb(56,102,255);
    --el-fill-color-blank: rgb(56,102,255);
}
</style>
