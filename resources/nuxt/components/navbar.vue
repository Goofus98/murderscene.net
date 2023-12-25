
<template>

<Link rel="preconnect" href="https://fonts.googleapis.com" />
<Link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Noto+Sans:400,400i,700" crossorigin="" />
<Link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" crossorigin="" />



<div class="login"/>


<el-row class="header" ref="header" justify='center'>
    <img class="logo" src="/images/logo.png" />
    <el-row class="navigation-btns" ref="navigation-btns">
        <div
        v-for="nav in Navigation"
        >
            <a v-if="showButtons && nav.isExternal" :href="nav.route">
                <el-button class="Nav-Butt">
                    {{nav.name}}
                </el-button>
            </a>
            <router-link
            v-if="showButtons && !nav.isExternal"
            :to=nav.route
            style="margin:0px;"
            >
                <el-button class="Nav-Butt">
                    {{nav.name}}
                </el-button>
            </router-link>
        </div>
    </el-row>
    <SteamLogin></SteamLogin>
    <el-dropdown class="nav-dropdown" v-if="!showButtons" style="align-items: center;"> 

    <img class="list-dropdown" src="/images/list.svg" style="min-height: 40px; max-height: 40px; color: white;"/>

    <template #dropdown>
        <el-dropdown-menu>
            <a v-for="nav in Navigation" :href="nav.route">
                <el-dropdown-item>{{nav.name}}</el-dropdown-item>
            </a>
        </el-dropdown-menu>
    </template>
    </el-dropdown>
</el-row>


</template>




<script lang="ts">

import { Component, Vue, Setup } from 'vue-facing-decorator'
import lang from '../data/lang/english.json'
import {RouterLink} from 'vue-router'
import {useSteamUserStore}  from '@/stores/Steam'



import SteamLogin from './steam-login.vue'

@Component({
    components: {
        SteamLogin
    }
})


export default class IndexClass extends Vue {

    steamUserStore = useSteamUserStore()
    windowWidth = window.innerWidth
    showButtons = !(this.windowWidth<= 900 )

    async created() {
        window.addEventListener("resize", this.myEventHandler);
    }
    mounted() {
        //window.addEventListener('message', this.onMessage, false)

    }

    beforeDestroy () {
        //window.removeEventListener('message', this.onMessage)
    }
    destroyed() {
        window.removeEventListener("resize", this.myEventHandler);
    }
    myEventHandler(e) {
        this.windowWidth = window.innerWidth
        this.showButtons = !(this.windowWidth<= 900 )
    }
 
    get Navigation() {
        return lang.navbar;
    }
}
</script>



<style>

@import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css");


:root {
    --canvas-color: rgb(13,13,13);
    --nav-color:rgb(31,31,31);
    --nav-text-color:rgb(217,217,211);
    --nav-hover-color:rgb(56,56,56);
    --caption-z-index:auto;
    --caption-font-size:auto;
    --min-width-check:225px;
}


.el-input-group__append {

    --el-fill-color-light: rgb(237,37,83);

    --el-input-border-color: rgb(31,31,31);
}
.logo{
    min-width:170px;
    max-width:225px;
    max-height:175px;
    width:10vw;
    height:auto;
    z-index: 2;
    transform: translate(0px, -35%);

    user-drag: none;  
   user-select: none;
   -moz-user-select: none;
   -webkit-user-drag: none;
   -webkit-user-select: none;
   -ms-user-select: none;
}
.nav-dropdown{
    transform: translate(0, -32%);
}
.steam-login{

    max-width:225px;
    max-height:175px;
    width:auto;
    height:auto;

    transform: translate(0px, -100%);

    user-drag: none;  
    user-select: none;
    -moz-user-select: none;
    -webkit-user-drag: none;
    -webkit-user-select: none;
    -ms-user-select: none;
}
.login{

    padding-top: 10px;
    height: 60px;
}
.header{
    min-height: 50px;
    max-height: 50px;

    background-color: rgb(56,102,255);

    margin-bottom: 20px;
}

.navigation{

    min-height: 53px;
    max-height: 5%;


    background-color: rgb(56,102,255);
    margin-bottom: 20px;
}

.navigation-btns{

    min-height: 50px;
    max-height: 50px;



    background-color: rgb(56,102,255);
    margin-bottom: 20px;
}
.Nav-Butt{
    height: 100%;

    font-family: 'Noto Sans', sans-serif;
    font-size: 19px;
    border-radius: 0px;

    --el-color-primary: rgb(217,217,211);

    --el-color-primary-light-7: rgb(56,102,255);
    --el-color-primary-light-9: rgb(48,62,255);

    --el-button-text-color: white;

    --el-border-color: rgb(56,102,255);


    --el-fill-color-blank: rgb(56,102,255);
}
.dropdown-nav{


    height: auto;
    background-color: rgb(31,31,31);
    border-radius: 0px;
    padding: 5px; 
    --el-color-primary: rgb(217,217,211);
    --el-color-primary-light-3: rgb(56,56,56);
    --el-color-primary-light-5: rgb(56,56,56);
    --el-color-primary-light-7: rgb(56,56,56);
    --el-color-primary-light-8: rgb(56,56,56);
    --el-color-primary-light-9: rgb(56,56,56);
    --el-color-primary-dark-2: rgb(56,56,56);



    --el-button-text-color: rgb(217,217,211);
    --el-color-white: rgb(31,31,31);
    --el-bg-color: rgb(31,31,31);
    --el-border-color: rgb(31,31,31);
    --el-border-color-hover: rgb(31,31,31);
    --el-bg-color: rgb(31,31,31);
    --el-bg-color-page: rgb(31,31,31);
    --el-bg-color-overlay: rgb(31,31,31);

    --el-fill-color-blank: rgb(31,31,31);

}


.search-button{
    padding: 0px;
}
.list-dropdown{
    height: 100%;
    filter: invert(100%);
}
</style>
