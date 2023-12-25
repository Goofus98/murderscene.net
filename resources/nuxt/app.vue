<template>
    <SeoKit/>
    <NavBar/>
    <div>
      <NuxtLayout>
        <NuxtPage/>
      </NuxtLayout>
    </div>
  </template>


<script setup>
    import NavBar from './components/navbar.vue'
</script>
<style>
  @import "https://cdn.jsdelivr.net/npm/bulma@0.9.4/css/bulma.min.css";

  body, html {
    padding: 0;
    margin: 0;
    width: 100%;
    min-height: 100vh;

    background-color: var(--canvas-color);
    background-image: radial-gradient(
        circle at center,
        rgb(7,7,7) 0.25rem,
        transparent 0
      ), radial-gradient(circle at center, rgb(7,7,7) 0.25rem, transparent 0);
    background-size: 1.3rem 1.3rem;
    background-position: 0 0, 0.65rem 0.65rem;
    
  }
  html{
      overflow-y: scroll; 
  }
</style>