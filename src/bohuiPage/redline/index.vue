<template>
    <div style="width: 100%; height: 100%" class="content">
        <div>
            <bohui-map></bohui-map>
            <left-top></left-top>
            <left-bottom></left-bottom>
            <right-top></right-top>
        </div>
    </div>
</template>

<script>
    import $ from "jquery";
    import BohuiMap from './map'
    import LeftTop from './leftTopPart'
    import LeftBottom from './leftBottomPart'
    import RightTop from './rightTopPart'
    export default {
        name: 'index',
        components: {BohuiMap, LeftTop, LeftBottom, RightTop},
        mounted() {
            if (this.$store.state.terminal == "web") {
                window.fullHeight = document.documentElement.clientHeight;
                $(".content,.contentbox,#map").height(window.fullHeight - 105 + "px");
                $(".mychart.commondiv").height(window.fullHeight - 490 + "px");
                $(".mychart.commondiv").height(window.fullHeight - 490 + "px");
                $(".mychart.commondiv #rightchart").height(window.fullHeight - 540 + "px");

                $(".myoverview.commondiv,.mystatistics.commondiv").height(
                    (window.fullHeight - 154) / 2 + "px"
                );
                $(".mytable").height(
                    (window.fullHeight - 150) + "px"
                );
                var margintop = ((window.fullHeight - 154) / 2 - 338) / 2;
                if (margintop < 0) {
                    margintop = 0;
                }
                $(".mystatistics #staticschart").css({ marginTop: margintop + "px" });
                var top = (window.fullHeight - 154) / 2 - 358;
                if (top < 0) {
                    top = 0;
                }
                $(".myoverview.commondiv .overcontents").css({ paddingTop: top + "px" });
                $(".rotation").width(document.documentElement.clientWidth/2-40+"px");
                $(".rotation").css({"marginLeft":-(document.documentElement.clientWidth/4-20)+"px"});
                window.onresize = () => {
                    return (() => {
                        window.fullHeight = document.documentElement.clientHeight;
                        $(".content,.contentbox,#map").height(window.fullHeight - 104 + "px");
                        $(".mychart.commondiv").height(window.fullHeight - 490 + "px");
                        $(".myoverview.commondiv,.mystatistics.commondiv").height(
                            (window.fullHeight - 154) / 2 + "px"
                        );
                        var margintop = ((window.fullHeight - 154) / 2 - 338) / 2;
                        if (margintop < 0) {
                            margintop = 0;
                        }
                        $(".mystatistics #staticschart").css({ marginTop: margintop + "px" });
                        var top = (window.fullHeight - 154) / 2 - 358;
                        if (top < 0) {
                            top = 0;
                        }
                        $(".myoverview.commondiv .overcontents").css({ paddingTop: top + "px" });
                        $(".rotation").width(document.documentElement.clientWidth/2-40+"px");
                        $(".rotation").css({"marginLeft":-(document.documentElement.clientWidth/4-20)+"px"});
                    })();
                };
            }
        }
    }
</script>

<style lang="less">

</style>