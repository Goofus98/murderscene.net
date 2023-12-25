<template>

    <div class="rules-header" v-once>
        RULES
    </div>
    <transition name="el-zoom-in-center">
        <div class="rules" v-show="show" >


            <div class="rules-list" v-once>
                    Our server tries to have very lax and minimal rules. <br>Below is a summarized version of <a href="https://wiki.facepunch.com/gmod/Server_Operator_Rules"> Facepunch's server guidelines</a>:
                    <el-divider style="margin-bottom:7px; margin-top:7px; opacity: 0.5;" border-style="dashed" content-position="left" > 
                    </el-divider>
                    <li>Do not harass or threaten others</li>
                    <li>Do not use discriminatory language</li>
                    <li>Do not share others personal information</li>
                    <li>Do not hack or cheat</li>
                    <li>Do not do or say anything that is illegal under the Law of the U.S.</li> 
                    <li>Do not display sexual violence</li>
                    <li>Admins have the final say</li>
            </div>
        </div>
    </transition>
</template>


<script lang="ts">

import { Component, Vue, Setup } from 'vue-facing-decorator'


@Component({
    components: {}
})
export default class IndexClass extends Vue {
    showRules = false

    mounted(){
        this.showRules = true
    }

    get show(){
        return this.showRules
    }
}
</script>


<style>
:root {
    --canvas-color: rgb(13,13,13);
    --nav-color:rgb(31,31,31);
    --nav-text-color:rgb(217,217,211);
    --nav-hover-color:rgb(56,56,56);
    --caption-z-index:auto;
    --caption-font-size:auto;
    --min-width-check:225px;
}

.rules-header{
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


.rules-list{
    font-family: 'Noto Sans', sans-serif;
    font-size:calc(12px + 1.15vh);
    text-shadow: 1px 1px 2px black, 0 0 1em black, 0 0 0.2em black;
    color: rgb(217,217,217);
}
.rules{
    max-width: 1200px;
    min-width: 300px;
    width: 60vw;

    padding: 30px;
    margin: auto;
    margin-bottom: 20px;
    background-color: rgb(26,26,26);

    border-radius: 25px;

    outline-style: dashed;
    outline-width: 5px;
    outline-color: rgb(50,50,50);

}

li {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

li::before {
  content: "";
  width: .5rem;
  height: .5rem;
  border-radius: 50%;
  background: grey;
  margin-right: .5rem;
}
</style>
