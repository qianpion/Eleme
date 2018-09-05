<template>
  <div class="cartcontrol">
  	<transition name="move">
      <div class="cart-decrease" v-show="food.count>0" @click.stop.prevent="decreaseCart">
        <div class="inner icon-remove_circle_outline"></div>
      </div> 
    </transition>
  	<div class="cart-count" v-show="food.count>0">{{food.count}}</div>
  	<div class="cart-add icon-add_circle" @click.stop.prevent="addCart"></div>
  </div>
</template>
<script>
import Vue from 'vue';
  export default {
  	props: {
  		food:{
  			type:Object
  		}
  	},
  	methods: {
  		addCart(event) {
  			if(!event._constructed) {
  				return;
  			}
  			if(!this.food.count) {
  				Vue.set(this.food,'count',1);
  			}else {
  				this.food.count++;
  			}
        this.$emit('cart-add',event.target);//小球动画初始时是点击“加号按钮”触发的，不同位置的“加号按钮”与视口的距离位置都不同。所以在点击加号时派发一个目标事件，由父组件goods.vue进行监听，并添加监听函数
  		},
      decreaseCart(event) {
        if(!event._constructed) {
          return;
        }
        if(this.food.count){
          this.food.count--;
        }
      }
  	}
  }
</script>
<style lang="stylus" rel="stylesheet/stylus">
  .cartcontrol
    font-size: 0
    .cart-decrease
      display: inline-block
      padding: 6px 0 6px 6px
      opacity: 1
      transform: translate3d(0,0,0)
      .inner
        display: inline-block
        line-height: 24px
        font-size: 24px
        color: rgb(0,160,220)
        transition: all 0.2s linear
        transform: rotate(0)
      &.move-enter-active,&.move-leave-active
        transition: all 0.2s linear
      &.move-enter,&.move-leave-to
        opacity: 0
        transform: translate3d(24px,-2px,0)
        .inner
          transform: rotate(-180deg)
    .cart-count
      display: inline-block
      vertical-align: top
      width: 12px 
      padding-top: 6px
      line-height: 24px
      text-align: center
      font-size: 10px
      color: rgb(147,153,159)
      overflow: hidden
      white-space: nowrap
      text-overflow: ellipsis
    .cart-add
      display: inline-block      
      padding: 6px 6px 6px 0
      line-height: 26px
      font-size: 26px
      color: rgb(0,160,220)
</style>