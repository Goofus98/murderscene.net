<template>
    <div class="staff-header">
        STAFF
    </div>
    <div class="loading-staff"
        v-if="!show && !isGMOD"
        v-loading="true"
        element-loading-text="Loading..."
        :element-loading-spinner="svg"
        element-loading-svg-view-box="0, 0, 50, 50"
        element-loading-background="rgba(122, 122, 122, 0)"
    />

    <transition name="el-zoom-in-center">
        <div class="staff" v-show="show" >
            <div class="columns is-variable is-multiline is-mobile is-centered is-1-mobile is-1-tablet is-1-desktop is-1-widescreen is-1-fullhd">
                <div class="column is-4 is-1-fullhd is-1-desktop is-1-tablet is-1-mobile" id="staff-cell" v-for="member in Staff">

                    <a :href="`https://steamcommunity.com/profiles/${member.steamid}`">
                        <div class="media">
                            <div class="media-left">
                                <el-image class="avatar-image" loading="lazy" :src="`${member.profile}`"/>
                            </div>
                            <div class="media-body">
                                {{member.name}}
                                <br>
                                {{member.rank}}
                            </div>
                            
                        </div>
                    </a>
                </div>
            </div>
        </div>
    </transition>
</template>


<script lang="ts">

import { Component, Vue, Setup } from 'vue-facing-decorator'
import {useStaffStore}  from '@/stores/Staff'

@Component({
    components: {}
})
export default class IndexClass extends Vue {
    StaffStore = useStaffStore()
    loading = ref(true)
    showStaff = false


    async created() {
        await this.StaffStore.Init();
        this.showStaff = true
    }

    get Staff(){
        return this.StaffStore.staff
    }
    //check if client is viewing on Gmod
    get isGMOD() {
        return navigator.userAgent.match("GMod/13") != null;
    }

    get show(){
        return this.showStaff
    }
}
</script>


<style>
@import "https://cdn.jsdelivr.net/npm/bulma@0.9.4/css/bulma.min.css";

.staff-header{
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

.staff{
    position: relative;
    max-width: 1200px;

    min-width: 300px;
    width: 60vw;

    margin: auto;

    padding: 25px;

    background-color: rgb(26,26,26);

    border-radius: 25px;

    outline-style: dashed;
    outline-width: 5px;
    outline-color: rgb(50,50,50);

    overflow: hidden;
}

.loading-staff{
    position: relative;
    max-width: 1200px;

    min-width: 300px;
    width: 60vw;
    height: 25vh;

    margin: auto;



    overflow: hidden;
}

.media-body{
    display: flex;

    text-overflow: ellipsis;
    word-wrap: break-word;

    font-family: 'Noto Sans', sans-serif;
    font-size:calc(15px + .2rem);

    font-weight: bold;
    text-shadow: 1px 1px 2px black, 0 0 1em black, 0 0 0.2em blue;
    color: rgb(217,217,217);
}

#staff-cell{
    position: relative;
    height: 95px;
    min-width: 320px;
    max-width: 320px;

    margin-bottom: 25px;
    
    transition: all 200ms ease;
}

.media-left{

    padding: 10px;
}
.avatar-image{
    width: 84px;
    height: 84px;
    transform: translate(0px, -5px);

    
    border-radius: 20px;

    outline-style: solid;
    outline-width: 3px;
    outline-color: rgb(50,50,50);
}


.media{
    display: flex;
    

    background-image: linear-gradient(to left,  rgb(56,102,255) , rgb(30,50,120));
    min-width: 250px;
    max-width: 320px;
    
    
    height: 95px;
    border-radius: 10px;
    direction: ltr;
    overflow: hidden;
    outline-style: solid;
    outline-width: 3px;
    outline-color: rgb(60,60,60);
}

.columns {
    position: relative;

    padding-top: 0px;
    padding-bottom: 0px;
    transition: all 200ms ease;
}

</style>
