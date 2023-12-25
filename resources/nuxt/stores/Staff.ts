import { defineStore } from 'pinia'
import { $fetch } from 'ohmyfetch'
import {StaffTransfer, Staff} from "../core/Entities"

interface ApiData {
    staff: StaffTransfer[];
}
export const useStaffStore = defineStore('Staff', {
    state: () => ({
        staff: [],
        isInitialized: false,
    }),

    actions: {
        async Init() {

            if (!this.isInitialized){
                const data: ApiData = await $fetch('https://api.murderscene.net/api/staff', {
                    method: 'GET',
                    async onRequestError({ request, options, error }) {
                      console.log('[fetch request error]', request, error)
                    }
                })
                data.staff.forEach(instxf =>{
                    this.staff.splice(this.staff.length , 0 , instxf);
                });

                this.isInitialized = true;
            }
        },
    },
})