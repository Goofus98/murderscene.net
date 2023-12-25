import { defineStore } from 'pinia'
import { $fetch } from 'ohmyfetch'
import {SteamUserTransfer, SteamUser} from "../core/Entities"
import { VueCookieNext } from 'vue-cookie-next'

let isInitialized = false;

interface ApiData {
    user: SteamUserTransfer;
}
export const useSteamUserStore = defineStore('SteamUser', {
    state: () => ({
        user: SteamUser
    }),

    actions: {
        async Init() {

            if (!isInitialized){
                const data: ApiData = VueCookieNext.getCookie('steamid64');
                
                this.user = SteamUser.hydrate(data);

                isInitialized = true;
            }
        },
    },
})