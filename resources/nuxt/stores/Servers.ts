import { defineStore } from 'pinia'


import { $fetch } from 'ohmyfetch'
import { useRoute } from 'vue-router'
import {ServersTransfer, Servers} from "../core/Entities"

let isInitialized = false;

interface ApiData {
    servers: ServersTransfer[];
}
export const useServersStore = defineStore('Servers', {
    state: () => ({
        servers: []
    }),

    actions: {
        async Init() {

            if (!isInitialized){
                const data: ApiData = await $fetch('https://api.murderscene.net/api/servers', {
                    method: 'GET',
                    async onRequestError({ request, options, error }) {
                      console.log('[fetch request error]', request, error)
                    },

                    async onResponse({ request, response, options }) {
                        //console.log(response._data.mangas)
                    }
                })
                data.servers.forEach(instxf =>{
                    this.servers.splice(this.servers.length , 0 , instxf);
                });

                isInitialized = true;
            }
        },
    },
})