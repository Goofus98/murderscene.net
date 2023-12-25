import { defineStore } from 'pinia'
import {SteamUserTransfer, SteamUser} from "../core/Entities"

let isInitialized = false;

export const useSteamUserStore = defineStore('SteamUser', {
    state: () => ({
        user: null as SteamUser | null
    }),

    actions: {
        async Init(authUser) {

            if (!isInitialized){
  
                this.user = authUser;
                isInitialized = true;
            }
        },
    },
})

