import Router from 'vue-router'
import Vue from 'vue'
import HelloWord from '../components/HelloWorld.vue'
Vue.use(Router)
export default new Router({
    mode: "hash",
    routes: [
        {
            path: "/",
            component: HelloWord
        },

    ]
})