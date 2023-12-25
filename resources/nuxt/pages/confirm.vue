<template>
    <div class="pay-header">
        PAYMENT CONFIRM
    </div>
    <transition name="el-zoom-in-center">
        <div class="payment-confirm" v-show="shouldShow" >
            <div class="confirm-info" v-once>
                Confirmation of ${{donationAmount}}
            </div>

            <div class="unlogin-notice" v-if="!User"  v-once>
                Please sign in through Steam
            </div>

            <a :href="`http://api.murderscene.net/auth/steam?ret=https://murderscene.net/confirm?amt=${this.$route.query.amt}`" v-if="!User" class="user-login" v-once>
                <img src="/images/steam_login.png" style="height: 80px;">
            </a>
            <a :href="`http://api.murderscene.net/paypal/handle-payment?amt=${this.$route.query.amt}`"  v-if="User" class="paypal-checkout" v-once>
                <el-button color="rgb(255, 196, 57)" size="large" round>Pay with &#160;<img src="/images/paypal.svg" style="height: 25px;"/></el-button>
            </a>
            <div class="confirm-info" v-once>
                Legal Disclaimer
            </div>
            <div class="disclaimer-info" v-once>
            This disclaimer  applies to the use of any services or products related to TMS investigation, including but not limited to access to databases, server usage, and related content provided by TMS. By using these Services, you acknowledge and agree to the following terms:
            <br><br>
            No Guarantee of Refund: <br>In the event that the TMS server crashes or the database becomes corrupt, resulting in a loss of access to or corruption of data, TMS does not guarantee a refund of any payments made for the Services.
            <br><br>
            Assumption of Risks: <br>The use of the Services involves inherent risks, including but not limited to technical failures, server crashes, and database corruption. You acknowledge and accept these risks and understand that the Company shall not be held liable for any financial, data-related, or other losses incurred due to such events.
            <br><br>
            Data Backup Responsibility: <br>It is your responsibility to regularly backup and secure your data obtained through the Services. The Company shall not be responsible for any loss or corruption of data due to server crashes, database corruption, or any other technical issues.
            <br><br>
            No Liability for Consequences: <br>The Company shall not be liable for any direct, indirect, incidental, consequential, or special damages arising out of or in connection with the use of the Services, including but not limited to loss of data, loss of profits, or any other financial or personal losses, even if the Company has been advised of the possibility of such damages.
            <br><br>
            Force Majeure: <br>The Company shall not be responsible for any failure to perform its obligations under this Disclaimer if such failure is caused by circumstances beyond its reasonable control, including but not limited to acts of God, natural disasters, strikes, riots, acts of war, or technical failures.
            <br><br>
            Modification of Services: <br>The Company reserves the right to modify, suspend, or discontinue the Services at any time, with or without notice. You acknowledge that such modifications could result in server crashes or database corruption and agree that the Company shall not be held liable for any resulting damages.
            <br><br>
            Entire Agreement: <br>This Disclaimer constitutes the entire agreement between you and the Company regarding the subject matter hereof and supersedes all prior or contemporaneous understandings, agreements, representations, and warranties.
            <br><br>
            By using the Services provided by the Company, you acknowledge that you have read, understood, and agreed to the terms and conditions outlined in this Disclaimer. If you do not agree to these terms, you should refrain from using the Services. This Disclaimer shall be governed by and construed in accordance with the laws of California, and any disputes arising under or in connection with this Disclaimer shall be subject to the exclusive jurisdiction of the courts located in California.
            </div>
        </div>
    </transition>
</template>


<script lang="ts">

import { Component, Vue, Setup } from 'vue-facing-decorator'
import { VueCookieNext } from 'vue-cookie-next'
import {useMoneyStore}  from '@/stores/Money'
import { ref } from 'vue'
//import StripeForm from '@/components/stripe-form.vue'

@Component({
    components: {
        //StripeForm
    }
})
export default class IndexClass extends Vue {
    shouldShow = false
    
    mounted(){
        this.shouldShow = true
    }

    get valueFields(){
        return {
            "cardName": "",
            "cardNumber": "",
            "cardMonth": "",
            "cardYear": "",
            "cardCvv": "",
        }
    }

    get show(){
        return this.notValidAmount
    }

    get User() {
        return VueCookieNext.getCookie('steamid64');
    }

    get notValidAmount(){
        let isnum = /^\d+$/.test(this.$route.query.amt);

        return isnum
    }

    get donationAmount(){
        var sAmount = this.$route.query.amt
        var formatted = sAmount.substring(0, sAmount.length - 2) + "." + sAmount.substring(sAmount.length - 2, sAmount.length)

        return formatted
    }

    get iDonation(){
        var iDonate = parseInt(this.donation)
        if (Number.isNaN(iDonate)){
            return 0
        }
        return iDonate
    }
}
</script>


<style>

.paypal-checkout{
    display: flex;
    width: fit-content;
    margin: auto;
    margin-bottom: 20px;
}

.user-login{
    display: flex;
    height: 84px;
    width: fit-content;
    margin: auto;
    margin-bottom: 20px;
}

.pay-header{
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

.confirm-info{
    display: flex;
    justify-content: center;
    font-family: 'Noto Sans', sans-serif;
    font-weight: bold;
    font-size:calc(15px + 1.15vh);
    text-shadow: 1px 1px 2px black, 0 0 1em black, 0 0 0.2em black;
    color: rgb(217,217,217);
    margin-bottom: 20px
}

.payment-confirm{

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


.donate-button{
    height: 100%;

    padding: 8px;
    font-weight: normal;

    padding-top: 0px;
    padding-bottom: 0px;

}
h1 {
    font-family: 'Noto Sans', sans-serif;
    font-size: 34px;

    font-weight: bold;
    text-shadow: 1px 1px 2px black, 0 0 1em blue, 0 0 0.2em blue;
    color: rgb(217,217,217);
}

.disclaimer-info{
    font-family: 'Noto Sans', sans-serif;
    font-size:calc(5px + .5vw);
    font-weight: bold;
    text-shadow: 1px 1px 2px black, 0 0 1em black, 0 0 0.2em black;
    color: rgb(217,217,217);
}
p {
    font-family: 'Noto Sans', sans-serif;
    font-size:calc(2px + 1.25vw);
    text-shadow: 1px 1px 2px black, 0 0 1em black, 0 0 0.2em black;
    color: rgb(217,217,217);
    
}

li {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

li::before {
  content: "";
  width: .5rem;
  height: .5rem;
  border-radius: 50%;
  background: grey;
  margin-right: .5rem;
}

body, html {
  padding: 0;
  margin: 0;
  width: 100%;
  min-height: 100vh;

  background-color: var(--canvas-color);
  background-image: radial-gradient(
      circle at center,
      rgb(7,7,7) 0.25rem,
      transparent 0
    ), radial-gradient(circle at center, rgb(7,7,7) 0.25rem, transparent 0);
  background-size: 1.3rem 1.3rem;
  background-position: 0 0, 0.65rem 0.65rem;
  
}

</style>
