<template>
    
    <a :href="`http://api.murderscene.net/auth/steam?ret=${ReturnURL}`" v-if="!User" class="steam-login-logo">
        
        <img class="steam-login-img" src="/images/steam_login.png" style="height: 50px;"/>

    </a>

    <div class="steam-user" v-if="User">


        <el-dropdown> 
            <div class="steam-name">
                {{User.name}} 
            </div>
            <template #dropdown>
                <el-dropdown-menu>


                    <a :href="`https://api.murderscene.net/auth/logout`">
                        <el-dropdown-item>Logout</el-dropdown-item>
                    </a>

                    <a :href="`https://steamcommunity.com/profiles/${User.steamid}`">
                        <el-dropdown-item>Profile</el-dropdown-item>
                    </a>


                </el-dropdown-menu>
            </template>
        </el-dropdown>

        <img :src="`${User.avatar}`" style="height: 40px;"/>

    </div>
</template>


<script lang="ts">
    import { Component, Vue, Setup } from 'vue-facing-decorator'
    import {useSteamUserStore}  from '@/stores/SteamUser'
    import { VueCookieNext } from 'vue-cookie-next'

    @Component
    export default class IndexClass extends Vue {
        SteamStore = useSteamUserStore();

        async created() {
            await this.SteamStore.Init();
            //VueCookieNext.setCookie("return", window.location)
            //console.log(VueCookieNext.getCookie('steamid64'))
        }
        mounted() {

        }

        get User() {
            return VueCookieNext.getCookie('steamid64');
        }

        get ReturnURL() {
            if (this.$route.query){
                return window.location
            }
            return window.location.origin + this.$route.path;
        }

    }
</script>

<style>
    .steam-name{
        font-family: 'Noto Sans', sans-serif;
        font-size:18px;
        text-shadow: 1px 1px 2px black, 0 0 1em black, 0 0 0.2em black;
        color: rgb(217,217,217);
        padding: 10px;
    }
    .steam-user{
        display: flex;  

        align-items: center;
        text-align: center;
        max-width:225px;
        max-height:40px;
        width:auto;
        height:auto;
        direction: ltr;
        overflow: hidden;
        transform: translate(0px, -120%);

        border-radius: 7px ;
        background-color: rgb(46,46,46);
        outline-style: dashed;
        outline-width: 3px;
        outline-color: rgb(70,70,70);
    }
    .steam-login-logo {
        height: 25px;
        transform: translate(0px, -200%);
    }
    .steam-login-img {
        width:auto;
        height:auto;

        user-drag: none;  
        user-select: none;
        -moz-user-select: none;
        -webkit-user-drag: none;
        -webkit-user-select: none;
        -ms-user-select: none;
    }


</style>