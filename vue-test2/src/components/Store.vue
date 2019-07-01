<template>
    <div>
        <span>{{this.$store.state.username}}</span>
        <button @click="clickMe">点击</button>
    </div>
</template>
<script>
// 测试vuex 从两个方向 测试ui 测试功能
import {mapState,mapActions} from 'vuex'
export default {
    computed:{
        ...mapState(['username'])
    },
    methods:{
        ...mapActions(['set_username']),
        clickMe(){
            this['set_username']('jw')
        }
    }
}
</script>

