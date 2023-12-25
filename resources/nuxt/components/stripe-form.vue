<template>

    <div class="card-input" style="height: 750px; width: 500px;">

        <VuePaycard  ref="creditCard" :value-fields="valueFields"/>
        Card Number
        <el-input v-model="cardNum" placeholder="" :formatter="cardNumberFormatter"  style="height: 40px;"/>
        Card Holder
        <el-input v-model="cardName" placeholder="" style = "height: 40px;"/>
        Date
        
        <div class="card-date">

            <el-select v-model="cardMonth" class="month-selector" style="width: 100px;" placeholder="Month" size="large">
                <el-option
                v-for="month in months"
                :key="month"
                :label="month"
                :value="month"
                />
            </el-select>
            <el-select v-model="cardYear" class="month-selector" style="width: 100px;" placeholder="Year" size="large">
                <el-option
                v-for="year in years"
                :key="year"
                :label="year"
                :value="year"
                />
            </el-select>
        </div>
        Email
        <el-input v-model="email" placeholder="" style="height: 40px;"/>
        CCV
        <el-input v-model="cardCVV"  @focus="focusCCV" @change="unfocusCCV" maxlength="3" placeholder="" style="width: 100px; height: 40px;"/>


    </div>


</template>



<script lang="ts">
import { Component, Vue, Setup } from 'vue-facing-decorator'
import { ref, onBeforeMount  } from 'vue'
import { VuePaycard } from "vue-paycard";
import { loadStripe } from 'vue-stripe-js'

import { StripeElements, StripeElement } from 'vue-stripe-js'

@Component({
    components: {VuePaycard, StripeElements, StripeElement}
})
export default class IndexClass extends Vue {
    cardNum = ref('')
    cardName = ref('')
    cardMonth = ref('')
    cardYear = ref('')
    cardCVV = ref('')
    email = ref('')
    config = useRuntimeConfig();


    months = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"]

    mounted(){
        let recaptchaScript = document.createElement('script')
        recaptchaScript.setAttribute('src', 'https://js.stripe.com/v3/')
        document.head.appendChild(recaptchaScript)


    }

    get years(){
        var ret = [];
        var curYear = new Date().getFullYear()
        for (let i = 0; i < 12; i++) {
            ret[i] = curYear + i;
        }
        return ret;
     }
    get valueFields(){

        return {
            "cardName": this.cardName,
            "cardNumber": this.cardNum,
            "cardMonth": this.cardMonth,
            "cardYear": this.cardYear,
            "cardCvv": this.cardCVV,
        }
    }

    focusCCV(e){
        let stripe = Stripe(this.config.public.stripekey)
        const elements = stripe.elements()
        const cardElement = elements.create('card', {
            style: {
                base: {
                    fontSize: '16px'
                }
            }
        })

        this.$refs.creditCard.isCardFlipped = true;
    }
    unfocusCCV(e){
        this.$refs.creditCard.isCardFlipped = false;
    }

    cardNumberFormatter(value){
        var ret = ""
        for (let i = 0; i < (value.length % 4); i++) {
            if(i * 4 + 4 > value.length){
                ret = ret + value.slice(i * 4, value.length)
            }else{
                ret = ret + value.slice(i * 4, i * 4 + 4)
            }
            
        }
        return value
    }
    cardNumberParser(value){


        return ""
    }
}
</script>


<style>


.card-input{
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    background-color: white;

    font-family: 'Noto Sans', sans-serif;
    font-weight: bold;
    font-size: 15px;
}

.el-select-dropdown__item {
  display: flex;
  align-items: center;
  margin-bottom: 10px;

  color:black;
}

.el-select-dropdown__item::before {
    visibility: hidden;
}
</style>
