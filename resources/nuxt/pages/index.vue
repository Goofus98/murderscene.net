<template>
    <transition name="el-zoom-in-top">
        <div class="screenshots-container" v-show="hasMounted">
            <el-carousel class="screenshots" trigger="click" height="auto" >
                <div class="screenshots-text">
                    <div class="welcome-message">Welcome To The Murder Scene</div>
                    <div class="welcome-desc">Our community strives to create the best Garry's Mod Murder experience.</div>
                </div>
                <el-carousel-item >
                    <img class="img-screenshot" src="/images/ss1.png"/>
                </el-carousel-item>
                <el-carousel-item >
                    <img class="img-screenshot" src="/images/ss2.png"/>
                </el-carousel-item>
                <el-carousel-item >
                    <img class="img-screenshot" src="/images/ss3.png"/>
                </el-carousel-item>
                <el-carousel-item >
                    <img class="img-screenshot" src="/images/ss4.png"/>
                </el-carousel-item>
                <el-carousel-item >
                    <img class="img-screenshot" src="/images/ss5.png"/>
                </el-carousel-item>
            </el-carousel>
        </div>
    </transition>
    <transition name="el-zoom-in-center">
        <div class="servers-header" v-show="serversLoaded">
            SERVERS
        </div>
    </transition>
        <div class="columns is-variable is-multiline is-mobile is-centered is-1-mobile is-1-tablet is-1-desktop is-1-widescreen is-1-fullhd">

            <div class="column is-3 is-1-fullhd is-1-desktop is-1-tablet is-1-mobile" id="server-cell" v-for="server in Servers">
                
                    <div class="server-card" style="">
                        <div class="server-header">
                           {{server.name}}
                        </div>

                        <el-scrollbar height="97px" style="border-radius: 10px;">

                            <div class="game-info">
                                {{server.description}}
                            </div>
                        </el-scrollbar>
                        <div class="connect-"></div>
                        <div class="server-bottom">
                            <div class="game-stats">
                                gamemode: {{server.gamemode}}
                                <br>
                                map: {{server.map}}
                                <br>
                                players: {{server.players}} / {{server.maxPlayers}}
                            </div>
                        </div>
                        <a :href="'steam://connect/' + server.ip + ':' + server.port">
                            <el-button class="connect-btn" type="success" >Connect</el-button>
                        </a>
                    </div>
            
            </div>

            
        </div>
    
</template>


<script lang="ts">

import { Component, Vue, Setup } from 'vue-facing-decorator'
import { VuePaycard } from "vue-paycard";
import {useServersStore}  from '@/stores/Servers'

@Component({
    components: {
        VuePaycard
    }
})


export default class IndexClass extends Vue {

    ServersStore = useServersStore()
    isMobileView = false
    overMangaCover = false

    windowWidth = window.innerWidth

    isLoaded = false
    curPage = 1
    madeList = false
    pageMangas = {};
    imageWidth = 225
    columnOpts = 'is-1 is-1-fullhd is-1-desktop is-1-tablet is-1-mobile'
    hasMounted = false
    getWide = false
    fits = 'cover'

    serversLoaded = false
    async created() {
        window.addEventListener("resize", this.ScreenHandler);
        await this.ServersStore.Init();
        this.serversLoaded = true;
    }
    


    mounted(){
        this.isMobileView = (window.innerWidth <= 760)
        this.hasMounted = true

    }

    updated(){

    }

    destroyed() {
        window.removeEventListener("resize", this.ScreenHandler);
    }

    ScreenHandler(e) {
        this.windowWidth = window.innerWidth
        this.isMobileView = (this.windowWidth <= 760)
        //this.imageWidth = this.$refs.cover[0].clientWidth
    }
 

    OnChange(pageNumber){
        this.curPage = pageNumber
        console.log(this.curPage)
    }

    get onImgLoad() {
        return this.isLoaded = true;
    }
    get Servers(){
        return this.ServersStore.servers
    }
}
</script>


<style>
@import "https://cdn.jsdelivr.net/npm/bulma@0.9.4/css/bulma.min.css";

:root {
    --canvas-color: rgb(13,13,13);
    --nav-color:rgb(31,31,31);
    --nav-text-color:rgb(217,217,211);
    --nav-hover-color:rgb(56,56,56);
    --caption-z-index:auto;
    --caption-font-size:auto;
    --min-width-check:225px;
}

.screenshots-text{
  position: relative;
  top: 40%;
  z-index: 2;
}

.img-screenshot{
    width: 60vw;
    min-width: 300px;
    min-height: 200px;
    height: 30vw;
    object-fit: fill;
    filter: blur(2px);
    -webkit-filter: blur(2px);
    border-radius: 25px;

    user-drag: none;  
   user-select: none;
   -moz-user-select: none;
   -webkit-user-drag: none;
   -webkit-user-select: none;
   -ms-user-select: none;
}

.el-carousel__item{
    object-fit: cover;
    border-radius: 25px;
    
    min-height: 200px;
    height: 30vw;
}

.welcome-message {
    font-family: 'Noto Sans', sans-serif;
    font-size:calc(12px + 1.5vw);

    font-weight: bold;
    text-shadow: 1px 1px 2px black, 0 0 1em blue, 0 0 0.2em blue;
    color: rgb(217,217,217);
}
.welcome-desc {
    font-family: 'Noto Sans', sans-serif;
    font-size:calc(6px + 1.25vw);
    text-shadow: 1px 1px 2px black, 0 0 1em red, 0 0 0.2em red;
    color: rgb(217,217,217);
    
}

.screenshots-container{
    position: relative;
    width: 100%;
}

.screenshots{
    text-align: center;
    outline-style: dashed;
    outline-width: 5px;
    outline-color: rgb(50,50,50);
    margin: auto;

    max-width: 1920px;
    max-height: 1080px;
    min-height: 200px;
    min-width: 300px;
    width: 60vw;
    height: 30vw;

    scale: 1;
    border-radius: 25px;

    margin-bottom: 20px;
}

.servers-header{
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

.server-header{
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    
    height: 44px;
    line-height: 22px;
    font-family: 'Noto Sans', sans-serif;
    font-size: 18px;
    color: white;
    font-weight: bold;
    text-shadow:
       3px 3px 0 #000,
     -1px -1px 0 #000,  
      1px -1px 0 #000,
      -1px 1px 0 #000,
       1px 1px 0 #000;
    margin-bottom: 10px;
}
.server-bottom{
    position: absolute;
    bottom: 10px;
    left: 10px;
}

.connect-btn{
    position: absolute;
    bottom: 5px;
    right: 5px;
    border-radius: 20px 20px 20px 20px;
}

.el-scrollbar__thumb{
    background-color: white;
    opacity: .9;
}
.game-info{
    font-family: 'Noto Sans', sans-serif;
    font-size: 13px;
    font-weight: 520;
    padding-right: 10px;
    padding-left: 10px;
    text-shadow: 1px 1px 1px black, 0 0 1em black, 0 0 0.1em black;
    color: rgb(217,217,217);
    background-color: rgb(0, 80 ,255);
    border-radius: 10px;
    text-shadow:
       .7px .7px 0 #000,
     -.7px -.7px 0 #000,  
      .7px -.7px 0 #000,
      -.7px .7px 0 #000,
       .7px .7px 0 #000;
}
.game-stats{
    font-family: 'Noto Sans', sans-serif;
    font-size: 11px;
    font-weight: bold;
    line-height: 14px;
    text-shadow: 1px 1px 1px black, 0 0 1em black, 0 0 0.1em black;
    color: rgb(217,217,217);

    text-shadow:
       .8px .8px 0 #000,
     -.8px -.8px 0 #000,  
      .8px -.8px 0 #000,
      -.8px .8px 0 #000,
       .8px .8px 0 #000;
}
.columns {
    position: relative;
    width: 100%;
    height: 100%;
    
    padding-top: 0px;
    padding-bottom: 0px;
    transition: all 200ms ease;
}

#server-cell {
    position: relative;
    z-index: var(--caption-z-index);

    background: -webkit-linear-gradient(top, rgb(161,0,3),rgb(161,0,3) 30px,  rgb(161,0,3) 45px,  rgb(161,0,3), rgb(0,113,242) 70px, rgb(0,113,242));
    min-height: 220px;
    max-height: 1260px;
    min-width: 300px;
    max-width: 500px;
    width: 10vw;
    margin-left: 25px;

    margin-bottom: 25px;
    
    transition: all 200ms ease;

    border-radius: 20px;
    outline-style: dashed;
    outline-width: 5px;
    outline-color: rgb(50,50,50);
}

</style>
