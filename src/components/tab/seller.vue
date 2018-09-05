<template>
  <div class="seller" ref="sellerWrapper">
  	<div class="seller-content">
  		<div class="overview">
  			<h1 class="title">{{seller.name}}</h1>
  			<div class="desc border-1px">
  				<v-star :size="36" :score="seller.score"></v-star>
  				<span class="text">({{seller.ratingCount}})</span>
  				<span class="text">月售{{seller.sellCount}}单</span>
  			</div>
  			<ul class="remark">
  				<li class="block">
  					<h2>起送价</h2>
  					<div class="content">
  						<span class="stress">{{seller.minPrice}}</span>
  					</div>
  				</li>
  				<li class="block">
  					<h2>商家配送</h2>
  					<div class="content">
  						<span class="stress">{{seller.deliveryPrice}}</span>
  					</div>
  				</li>
  				<li class="block">
  					<h2>平均配送时间</h2>
  					<div class="content">
  						<span class="stress">{{seller.deliveryTime}}</span>
  					</div>
  				</li>
  			</ul>
  			<div class="favorite" @click="torggleFavorite">
  				<span class="icon-favorite" :class="{'active':isFavorite}"></span>
  				<span class="text">{{favoriteText}}</span>
  			</div>
  		</div>
  		<v-split></v-split>
  		<div class="bulletin">
  			<h1 class="title">公告与活动</h1>
  			<div class="content-wrapper border-1px">
  				<p class="content">{{seller.bulletin}}</p>
  			</div>
  			<ul v-if="seller.supports" class="supports">
  				<li class="support-item border-1px" v-for="(item,index) in seller.supports" :key="index">
  					<span class="icon" :class="classMap[seller.supports[index].type]"></span>
  					<span class="text">{{seller.supports[index].description}}</span>
  				</li>
  			</ul>
  		</div>
  		<v-split></v-split>
  		<div class="pics">
  			<h1 class="title">商家实景</h1>
  			<div class="pic-wrapper" ref="picsWrapper">
  				<ul class="pic-list" ref="piclist">
  					<li class="pic-item" v-for="(pic,index) in seller.pics" :key="index">
  						<img class="pic" width="120" height="90" :src="pic" alt="image">
  					</li>
  				</ul>
  			</div>
  		</div>
  		<v-split></v-split>
  		<div class="info">
  			<h1 class="title border-1px">商家信息</h1>
  			<ul>
  				<!-- 遍历的误区，遍历的只是个数，内容要添加 -->
  				<li class="info-item border-1px" v-for="(info,index) in seller.infos" :key="index">
  					<span class="text">{{info}}</span>
  				</li>
  			</ul>
  		</div>
  	</div>
  </div>
</template>

<script>
  import star from '../../components/star/star';
  import split from '../../components/split/split';
  import BScroll from 'better-scroll';
  import {saveToLocal,loadFromLocal} from '../../common/js/store.js';

  export default {
    props: {
    	seller: {
    		type: Object
    	}
    },
    data() {
    	return {
    		isFavorite: (() => {
                return loadFromLocal(this.seller.id, 'isFavorite', false);
            })()
        }
    },
    components: {
    	'v-star':star,
    	'v-split':split
    },
    created() {
    	this.classMap=['decrease','discount','special','invoice','guarantee'];
    },
    watch: {
    	'seller'() {//监控props里面的seller数据变化
            this.$nextTick(() => {
            	this._initScroll();
            	this._initPicScroll();
            })
    	}
    },
    mounted() {//dom都执行以后，这个方法执行（hook）,此处滚动方式值得研究。watch/ready/methods。同步执行，dom和内容完全执行完毕后执行scroll，且刷新更新时不影响二次滚动,笔记记之.dom已经准备好，只会执行一次，此页面刷新后，就没有this.seller了
    	this.$nextTick(() => {
    		this._initScroll();
            this._initPicScroll();
    	})
    },
    methods: {
    	_initScroll() {
    		if(!this.scroll) {
    			this.scroll = new BScroll(this.$refs.sellerWrapper,{
        	        click: true
                });
    		}else {
    			this.scroll.refresh();
    		}
    	},
    	_initPicScroll() {
    		if(this.seller.pics) {
    			let picW = 120;
    			let margin = 6;
    			let w = (picW+margin)* this.seller.pics.length - margin;
    			this.$refs.piclist.style.width = w + 'px';
    			this.$nextTick(() => {
    				if(!this.picScroll) {//此处为什么用父级的picsWrapper，而不是ul的piclist呢？笔记记之.可以理解为目标盒子内部内容做滚动，思考所滚动的是什么？
    					this.picScroll = new BScroll(this.$refs.picsWrapper,{
    						scrollX: true,
    						eventPassthrough: 'vertical',//滚动方向横向
    						click: true
    					})
    				}else {
    					this.picScroll.refresh();
    				}
    			})
    		}
    	},
    	torggleFavorite(event) {
    		if(!event._constructed) {
    			return;
    		}
    		this.isFavorite = !this.isFavorite;
    		//将状态缓存到localstorage
    		saveToLocal(this.seller.id,'isFavorite',this.isFavorite);
    	}
    },
    computed: {
    	favoriteText() {
    		return this.isFavorite ? '已收藏' : '收藏';
    	}
    }
  };
</script>


<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin"
  .seller
    position: absolute
    top: 174px
    bottom: 0
    left: 0
    width: 100%
    overflow: hidden
    .overview
      position: relative
      padding: 18px
      .title
        margin-bottom: 8px
        line-height: 14px
        color: rgb(7,17,27)
        font-size: 14px
      .desc
        padding-bottom: 18px
        border-1px(rgba(7,17,27,0.1))
        font-size: 0
        .star
          display: inline-block
          vertical-align: top
          margin-right: 8px
        .text
          display: inline-block
          line-height: 18px
          vertical-align: top
          margin-right: 12px
          font-size: 10px
          color: rgb(77,85,93)
      .remark
        display: flex
        padding-top: 18px
        .block
          flex:1
          text-align: center
          border-right: 1px solid rgba(7,17,27,0.1)
          &:last-child
            border-right: none
          h2
            margin-bottom: 4px
            line-height: 10px
            font-size: 10px
            color: rgb(147,153,159)
          .content
            line-height: 24px
            font-size: 10px
            color: rgb(7,17,27)
            .stress
              font-size: 20px
      .favorite
        position: absolute
        right: 18px
        top: 18px
        width: 40px
        .icon-favorite
        /*独占一行*/
          display: block
          margin-bottom: 4px
          line-height: 24px
          font-size: 24px
          color: #d4d6d9
          text-align: center
          &.active
            color: rgb(240,20,20)
        .text
          display: block
          font-size: 10px
          line-height: 10px
          color: rgb(77,85,93)
          text-align: center
    .bulletin
      padding: 18px 18px 0 18px
      .title
        margin-bottom: 8px
        line-height: 14px
        color: rgb(7,17,27)
        font-size: 14px
      .content-wrapper
        padding: 0 12px 16px 12px
        border-1px(rgba(7,17,27,0.1))
        .content
          line-height: 24px
          font-size: 12px
          color: rgb(240,20,20)
      .supports
        .support-item
          padding: 16px 12px
          border-1px(rgba(7,17,27,0.1))
          font-size: 0
          &:last-child
            border-none()
          .icon
            display:inline-block
            width:16px
            height: 16px
            vertical-align: top
            margin-right:6px
            background-size:16px 16px
            background-repeat:no-repeat
            &.decrease
              bg-image('decrease_4')
            &.discount
               bg-image('discount_4')
            &.guarantee
              bg-image('guarantee_4')
            &.invoice
              bg-image('invoice_4')
            &.special
              bg-image('special_4')
          .text
            line-height: 16px
            font-size: 12px
            color: rgb(7,17,27)
    .pics
      padding: 18px
      .title
        margin-bottom: 12px
        line-height: 14px
        color: rgb(7,17,27)
        font-size: 14px
      .pic-wrapper
        width: 100%
        overflow: hidden
        white-space: nowrap/*横向滚动不换行*/
        .pic-list
          font-size: 0
          .pic-item
            display: inline-block
            margin-right: 6px
            width: 120px
            height: 90px
            &:last-child
              margin: 0
    .info
      padding: 18px
      .title
        font-size: 14px
        line-height: 14px
        color: rgb(7,17,27)
        padding-bottom: 12px
        border-1px(rgba(7,17,27,0.1))
      .info-item
        padding:16px 12px
        border-1px(rgba(7,17,27,0.1))
        &:last-child
          border-none()
        .text
          line-height: 16px
</style>