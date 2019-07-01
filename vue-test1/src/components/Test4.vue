<template>
    <div>
        {{user}}
    </div>
</template>
<script>
import axios from 'axios';
export default {
    data(){
        return {user:''}
    },  
    mounted(){
        axios.get('/user').then((res)=>{
            this.user = res.data.user;
        }).catch(err=>{
            console.log(err);
        });
    }
}
</script>