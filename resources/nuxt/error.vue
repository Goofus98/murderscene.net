<template>
    <NavBar/>
    <div class="error" v-once>
        ERROR {{$route.query.code || error.statusCode}}
    </div>
    <div class="error-message" v-once>
        {{$route.query.msg || error.message}}
    </div>
</template>

<script setup>
    import NavBar from './components/navbar.vue'
    defineProps(['error'])
</script>

<style>
.error{
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

.error-message{
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
</style>
