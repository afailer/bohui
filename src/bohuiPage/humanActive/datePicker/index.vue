<template>
    <div class="time-container">
        <time-picker :direction="leftDate"></time-picker>
        <time-picker :direction="rightDate"></time-picker>
    </div>
</template>

<script>
    import TimePicker from './timePicker'
    export default {
        name: 'datePicker',
        components: {TimePicker},
        data(){
            return{
                leftDate: 'left',
                rightDate: 'right'
            }
        }
    }
</script>

<style lang="less">
    .time-container{
        z-index: 9999999999;
        position: absolute;
        left: 50%;
        width: 300px;
        top: 5px;
        transform: translate(-50%);
    }

</style>