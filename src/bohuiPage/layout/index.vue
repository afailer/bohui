<template>
    <div>
        <top-bar></top-bar>
        <menu-bar></menu-bar>
        <router-view></router-view>
    </div>
</template>

<script>
    import TopBar from './components/topBar/index'
    import MenuBar from './components/menuBar/index'
    export default {
        components:{TopBar, MenuBar}
    }
</script>

<style lang="less">

</style>


