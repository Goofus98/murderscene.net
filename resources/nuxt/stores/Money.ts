import { defineStore } from 'pinia'


import { $fetch } from 'ohmyfetch'
import { useRoute } from 'vue-router'
import {MoneyTransfer, Money} from "../core/Entities"
import { VueCookieNext } from 'vue-cookie-next'

let isInitialized = false;

interface ApiData {
    money: MoneyTransfer[];
}
export const useMoneyStore = defineStore('Money', {
    state: () => ({
        money: []
    }),

    actions: {
        async Init() {

            if (!isInitialized){

              const data: ApiData = await $fetch('https://api.murderscene.net/auth/currency', {
                method: 'GET',
                credentials: 'include',
                async onRequestError({ request, options, error }) {
                 console.log('[fetch request error]', request, error)
                },
                async onResponse({ request, response, options }) {
                 console.log(response)
                },
                headers: {
                  Cookie: 'laravel_session=' + VueCookieNext.getCookie('laravel_session')
                }
              })
              this.money = Money.hydrate(data);

              isInitialized = true;
            }
        },
    },
})