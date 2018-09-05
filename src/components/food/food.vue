<template>
  <transition name="move">
  	<div v-show="showFlag" class="food" ref="food">
  		<div class="food-content">
  			<div class="image-header">
  				<img :src="food.image" alt="image">
                <div class="back" @click="hide">
                	<i class="icon-arrow_lift"></i>
                </div>
  			</div>	
  			<div class="content">
  				<h1 class="title">{{food.name}}</h1>
  				<div class="detail">
  					<span class="sell-count">月售{{food.sellCount}}</span>
  					<span class="rating">好评率{{food.rating}}%</span>
  				</div>
  				<div class="price">
  					<span class="now">¥{{food.price}}</span>
  					<span class="old" v-show="food.oldPrice">¥{{food.oldPrice}}</span>
  				</div>
  			    <div class="cartcontrol-wrapper">
  			    	<v-cartcontrol :food="food" @cart-add="addFood"></v-cartcontrol>
  			    </div>
                <transition name="fade">
                	<div @click.stop.prevent="addFirst" class="buy" v-show="!food.count || food.count===0">加入购物车</div>
                </transition>
            </div>
            <v-split v-show="food.info"></v-split>
            <div class="info" v-show="food.info">
            	<h1 class="title">商品信息</h1>
            	<p class="text">{{food.info}}</p>
            </div>
            <v-split v-show="food.info"></v-split>
            <div class="rating">
            	<h1 class="title">商品评价</h1>
            	<v-ratingselect :selectType="selectType" :onlyContent="onlyContent" :desc="desc" :ratings="food.ratings" @ratingtype.select="filterRatings" @isContent="isContent"></v-ratingselect>
            	<div class="rating-wrapper">
            		<ul v-show="food.ratings && food.ratings.length">
            			<li v-show="needShow(rating.rateType,rating.text)" v-for="(rating,index) in food.ratings" :key="index" class="rating-item border-1px">
            				<div class="user">
            					<span class="name">{{rating.username}}</span>
            					<img class="avatar" width="12" height="12" :src="rating.avatar" alt="iamge">
            				</div>
            				<div class="time">{{rating.rateTime | formatDate('yyyy-MM-dd hh:mm')}}</div>
            				<p class="text">
            					<span class="icon" :class="{'icon-thumb_up':rating.rateType===0,'icon-thumb_down':rating.rateType===1}"></span>{{rating.text}}
            				</p>
            			</li>
            		</ul>
            		<div class="no-rating" v-show="!food.ratings || !food.ratings.length">暂无评论</div>
            	</div>
            </div>
  		</div>
  	</div>
  </transition>
</template>
<script>
  import BScroll from 'better-scroll';
  import cartcontrol from '../../components/cartcontrol/cartcontrol';
  import Vue from 'vue';
  import split from '../../components/split/split';
  import ratingselect from '../../components/ratingselect/ratingselect';
  import formatDate from '../../common/js/formatedate.js'
  
  const ALL = 2;

  export default {
  	props: {
  		food: {
  			type: Object
  		}
  	},
  	data() {
  		return {
  			showFlag: false,
  			selectType: ALL,//评论type按钮的样式，使用常量切换
  			onlyContent: false,//只看有内容的评论
  			desc: {
  				all: '全部',
  				positive: '推荐',
  				negative: '吐槽'
  			}
  		};
  	},
  	methods: {
  		show() {
  			this.showFlag = true;
  			this.selectType = ALL;
  			this.onlyContent = true;

  			this.$nextTick(() => {
  				if(!this.scroll) {
  					this.scroll = new BScroll(this.$refs.food,{
  						click: true
  					});
  				}else {
  					this.scroll.refresh();
  				}
  			});
  		},
  		hide() {
  			this.showFlag = false;
  		},
  		addFirst(event) {
  			console.log('ok');
           if(!event._constructed) {
           	return;
           }
           this.$root.eventHub.$emit('cart-add',event.target);
           Vue.set(this.food,'count',1);//设置food的属性，不能直接写food.count
  		},
  		addFood(target) {
  			this.$emit('add',target);
  		},
  		isContent(onlyContent) {
  			this.onlyContent = onlyContent
  			this.$nextTick(() => {
  				this.scroll.refresh();
  			});
  		},
  		filterRatings(type) {
  			this.selectType = type;
  			this.$nextTick(() => {
  				this.scroll.refresh();
  			});
  		},
  		needShow(type,text) {//筛选需要展示的评论
  		  if(this.onlyContent && !text) {//只要有内容的评论
  		  	return false;
  		  }
  		  if(this.selectType === ALL) {//显示所有评论
  		  	return true;
  		  }else {
  		  	return type === this.selectType;
  		  }
  		}
  	},
  	components: {
  		'v-cartcontrol':cartcontrol,
  		'v-split':split,
  		'v-ratingselect':ratingselect
  	}
  }
</script>
<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin"
  .food
    position: fixed
    top: 0
    left: 0
    bottom: 48px
    z-index: 30
    width: 100%
    background: #fff
    transform: translate3d(0,0,0)
    &.move-enter-active,&.move-leave-active
      transition: all .2s linear
    &.move-enter,&.move-leave-active
      transform: translate3d(100%,0,0)
    .image-header/*可学习之黑技术*/
      position: relative
      width:100%
      height: 0
      padding-top: 100%/*padding值设置为百分百，相当于相对于盒子的宽度进行计算的百分比，也就是宽高相等*/
      img
        position: absolute
        top: 0
        left: 0
        width: 100%
        height: 100%
      .back
        position: absolute
        top: 10px
        left: 0
        .icon-arrow_lift
          display: block
          padding: 10px
          font-size: 20px
          color: #fff
    .content
      position: relative
      padding: 18px
      .title
        line-height: 14px
        margin-bottom: 8px
        font-size: 14px
        font-weight: 700
        color: rgb(7,17,27)
      .detail
        margin-bottom: 18px
        line-height: 10px
        height: 10px
        font-size: 0
        .sell-count,.rating
          font-size: 10px
          color: rgb(147,153,159)
        .sell-count
          margin-right: 12px
      .price
        font-size: 0
        line-height: 19px
        .sign
          font-size: 11px
        .now
          margin-right: 8px
          font-size: 16px
          font-weight: 900
          color: #fa3a12
        .old
          text-decoration: line-through
          font-size: 10px
          color: rgb(147,153,159)
      .cartcontrol-wrapper
        position: absolute
        right: 12px
        bottom: 12px
      .buy
        position: absolute
        right: 18px
        bottom: 18px
        z-index: 10
        height: 24px
        line-height: 24px
        padding: 0 12px
        box-sizing: border-box
        font-size: 10px
        border-radius: 12px
        color: #fff
        background: rgb(0,160,220)
        opacity: 1
        &.fade-enter-active,&.fade-leave-active 
          transition: all .2s
        &.fade-enter,&.fade-leave-to
          opacity: 0
          z-index: -1
    .info
      padding: 18px


      .title
        line-height: 14px
        margin-bottom: 6px
        font-size: 14px
        color: rgb(7,17,27)
      .text
        line-height: 24px
        padding: 0 8px
        font-size: 12px
        color: rgb(77,85,93)
    .rating
      padding-top: 18px
      .title
        line-height: 14px
        margin-left: 18px
        font-size: 14px
        color: rgb(7,17,27)
      .rating-wrapper
        padding: 0 18px
        .rating-item
          position: relative
          padding: 16px 0
          border-1px(rgba(7,17,27,0.1))
          .user
            position: absolute
            right: 0
            top: 16px
            line-height: 12px
            font-size: 0
            .name
              display: inline-block
              vertical-align: top
              margin-right: 6px
              font-size: 10px
              color: rgb(147,153,159)
            .avatar
              border-radius: 50%
          .time
            display: inline-block
            position: absolute
            left:0
            top: 16px
            margin-bottom: 6px
            line-height: 12px
            font-size: 10px
            color: rgb(147,153,159)
          .text
            font-size: 12px
            line-height: 24px
            color: rgb(7,17,27)
            margin-top: 18px
            .icon
              margin-right: 4px
              font-size: 12px
              line-height: 24px
              &.icon-thumb_up
                color: rgb(0,160,220)
        .no-rating
          padding: 16px 0
          font-size: 12px
          color: rgb(147,153,159)
</style>