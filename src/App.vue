<template>
  <div id="app">
    <v-header :seller="seller"></v-header>
    <div class="tab border-1px">
      <div class="tab-item">
        <router-link to='/goods'>商品</router-link>
      </div>
      <div class="tab-item">
        <router-link to='/rating'>评价</router-link>
      </div>
      <div class="tab-item">
        <router-link to='/seller'>商家</router-link>
      </div>
    </div>
    <!-- 防止组件间切换后数据改变，将router-view放入keep-alive标签中， -->
    <keep-alive>
        <router-view :seller="seller"></router-view>
    </keep-alive>
  </div>
</template>

<script>
  import {urlParse} from './common/js/util.js';
  import header from './components/header/header.vue';

  const ERR_OK = 0;
    export default {
      data() {
        return {
          seller: {
            id: (() => {
              let queryParam = urlParse();//后端数据的url地址
              // console.log(queryParam);
              return queryParam.id;
            })()
          }
        };
      },
      created() {
        this.$http.get('/api/seller?id=' + this.seller.id).then((response) => {
          response = response.body;//获取数据，object类型
          if (response.errno===ERR_OK) {
            // 成功获取到数据，之后子组件header使用props接收数据，header组件进行渲染
            // this.seller = response.data;直接赋值会id丢失，this.seller.id=undefind
            this.seller = Object.assign({},this.seller,response.data);//对象合并
            console.log(this.seller.id);
          }
        });
      },
      components:{
        'v-header':header
      }
    }
</script>

<style lang="stylus">
  @import "./common/stylus/mixin.styl"
  #app
    .tab
      display:flex;
      width:100%
      height: 40px
      line-height:40px
      border-1px(rgba(7,17,27,0.1))
      .tab-item
        flex:1
        text-align:center
        & > a
          display:block
          font-size:14px
          color:rgb(77,85,93)
          &.active
            color:rgb(240,20,20)
</style>
