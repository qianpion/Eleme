<template>
  <div class="ratings" ref="ratingsContent">
  	<div class="ratings-content">
  		<div class="overview">
  			<div class="overview-left">
  				<h1 class="score">{{seller.score}}</h1>
  				<div class="title">综合评分</div>
  				<div class="rank">高于周边商家{{seller.rankRate}}</div>
  			</div>
  			<div class="overview-right">
  				<div class="score-wrapper">
  					<span class="title">服务态度</span>
                    <v-star :size="36" :score="seller.serviceScore"></v-star>
                    <span class="score">{{seller.serviceScore}}</span>
  				</div>
  				<div class="score-wrapper">
  					<span class="title">商品评分</span>
                    <v-star :size="36" :score="seller.foodScore" ></v-star>
                    <span class="score">{{seller.foodScore}}</span>
  				</div>
  				<div class="delivery-wrapper">
  					<span class="title">送达时间</span>
                    <span class="time">{{seller.deliveryTime}}分钟</span>
  				</div>
  			</div>
  		</div>
  		<v-split></v-split>
  		<v-ratingselect :ratings="ratings" :selectType="selectType" :onlyContent="onlyContent" :desc="desc" @ratingtype.select="filterRatings" @isContent="isContent"></v-ratingselect>
  		<div class="rating-wrapper">
  			<ul>
  				<li class="rating-item" v-for="(rating,index) in ratings" :key="index" v-show="needShow(rating.rateType,rating.text)">
  					<div class="avatar">
  						<img :src="rating.avatar" width="28" height="28" alt="img">
  					</div>
  					<div class="content">
  						<h1 class="name">{{rating.username}}</h1>
  						<div class="star-wrapper">
  							<v-star :size="24" :score="rating.score"></v-star>
  							<span class="time" v-show="rating.deliveryTime">{{rating.deliveryTime}}分钟送达</span>
  						</div>
  						<p class="text">{{rating.text}}</p>
  						<div class="recommend-wrapper">
  							<i class="icon-thumb_up"></i>
  							<span class="text" v-for="(recommend,index) in rating.recommend" :key="index"></span>
  						</div>
  						<div class="rating-time">{{rating.rateTime | formatDate('yyyy-MM-dd hh:mm')}}</div>
  					</div>
  				</li>
  			</ul>
  		</div>
  	</div>
  </div>
</template>

<script>
 import formatDate from '../../common/js/formatedate.js'
  import BScroll from 'better-scroll';
  import star from '../../components/star/star';
  import split from '../../components/split/split';
  import ratingselect from '../../components/ratingselect/ratingselect';
  
  const ALL = 2;
  const ERR_OK = 0;

  export default {
    props: {
    	seller: {
    		type:Object
    	}
    },
    data() {
        return {
        	ratings: [],
        	selectType: ALL,
        	onlyContent: false,
        	desc: {
        		all: '全部',
  				positive: '推荐',
  				negative: '吐槽'
        	}
        }
    },
    created() {//请求后端数据
    	this.$http.get('/api/ratings').then((response) => {
            response = response.body;
            if(response.errno === ERR_OK){
            	this.ratings = response.data;
            	console.log(this.ratings);
              this.$nextTick(() => {
                 this._initScroll();
              });
            }
  	    });
    },
    methods: {
    	_initScroll() {
            this.scroll = new BScroll(this.$refs.ratingsContent,{
            	click: true
            }); 
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
  		needShow(type,text) {
  			if(this.onlyContent && !text) {
  				return false;
  			}
  			if(this.selectType === ALL) {
  				return true;
  			}else {
  				return type === this.selectType;
  			}
  		}
    },
    components: {
    	'v-star':star,
    	'v-split':split,
    	'v-ratingselect':ratingselect
    },
  }
</script>
<style lang="stylus" rel="stylesheet/stylus">  
  .ratings
    position: absolute
    top: 174px
    bottom: 0
    left: 0
    width:100% 
    overflow: hidden
    .overview
      display: flex
      padding: 18px 0
      .overview-left
        flex: 0 0 137px
        width: 137px
        border-right: 1px solid rgba(7,17,27,0.1)
        text-align: center
        padding: 6px 0
        @media only screen and (max-width: 320px)//适配320px以下小屏
          flex: 0 0 120px
          width: 120px
        .score
          margin-bottom: 6px
          line-height: 28px
          font-size: 24px
          color: rgb(255,153,0)
        .title
          margin-bottom: 8px
          line-height: 12px
          font-size: 12px
          color: rgb(7,17,27)
        .rank
          line-height: 10px
          color: rgb(147,153,159)
          font-size: 10px
      .overview-right
        flex: 1
        padding: 6px 0 6px 24px
        @media only screen and (max-width: 320px)//适配320px以下小屏
          padding-left: 6px
        .score-wrapper
          margin-bottom: 8px
          font-size: 0
          .title
            display: inline-block
            line-height: 18px
            vertical-align: top
            font-size: 12px
            color: rgb(7,17,27)
          .star
            display: inline-block
            vertical-align: top
            margin: 0 12px
          .score
            display: inline-block
            line-height: 18px
            vertical-align: top
            font-size: 12px
            color: rgb(255,153,0)
        .delivery-wrapper
          font-size: 0
          .title       
            line-height: 18px
            font-size: 12px
            color: rgb(7,17,27)
          .time
            margin-left: 12px
            font-size: 12px
            color:rgb(147,153,159)
    .rating-wrapper
      .rating-item
        display: flex
        padding: 18px
        .avatar
          flex: 0 0 28px
          width: 28px
          margin-right: 12px
          img
            border-radius: 50%
        .content
          flex: 1
          position: relative
          .name
            line-height: 12px
            padding-bottom: 8px
            font-size: 10px
            color: rgb(7,17,27)
          .star-wrapper
            font-size: 0
            padding-bottom: 6px
            .star
              display: inline-block
              vertical-align: top
              margin-right: 6px
            .time
              display: inline-block
              vertical-align: top
              line-height: 12px
              font-size: 10px
              font-weight: 200
              color: rgb(147,153,159)
          .text
            line-height: 18px
            padding-bottom: 8px
            font-size: 12px
            color: rgb(7,17,27)
          .recommend-wrapper
            width: 100%
            font-size: 0
            .icon-thumb_up
              display: inline-block
              line-height: 16px
              font-size: 12px
              color: rgb(0,160,220)
              margin: 0 8px 6px 0
            .text
              display: inline-block
              width: 70px
              line-height: 16px
              margin-right: 8px
              padding: 0 6px
              border: 1px solid rgba(7,17,27,0.1)
              border-radius: 1px
              box-sizing: border-box
              background: #fff
              text-align: center
              overview: hidden
              text-overflow: ellipsis
              white-space: nowrap
              font-size: 9px
              color: rgb(147,153,159)
          .rating-time
            position: absolute
            right: 0
            top: 0
            display:inline-block
            line-height: 12px
            font-size: 10px
            font-weight: 200
            color: rgb(147,153,159)
</style>