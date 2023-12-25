import * as ElementPlusIconsVue from '@element-plus/icons-vue'

let $icons: ElementPlusIconsVue
export default defineNuxtPlugin({
    name: 'my-plugin',
    enforce: 'pre', // or 'post'
    async setup (nuxtApp) {
      // this is the equivalent of a normal functional plugin
      $icons = nuxtApp.$icons;
    },
    hooks: {
      // You can directly register Nuxt app hooks here
      'app:created'() {
        const nuxtApp = useNuxtApp()
        // 
      }
    }
  })

  export {$icons}