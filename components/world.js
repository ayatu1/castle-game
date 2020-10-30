//城堡
Vue.component('castle', {
    template: `<div class="castle" :class="'player-'+index">
        <img class="building" :src="'svg/castle'+index+'.svg'" alt="">
        <img class="ground" :src="'svg/ground'+index+'.svg'" alt="">
        <castle-banner :player="player"></castle-banner>
    </div>`,
    props: ['index', 'player']
})

//城堡旗帜
Vue.component('castle-banner' ,{
    template: `<div class="banners">
        <img class="food-icon" src="svg/food-icon.svg" alt="">
        <bubble type="food" :value="player.food" :ratio="foodRatio"></bubble>
        <banner-bar class="food-bar" color="#288339" :ratio="foodRatio"></banner-bar>
        
        <img class="health-icon" src="svg/health-icon.svg" alt="">
        <bubble type="health" :value="player.health" :ratio="healthRatio"></bubble>
        <banner-bar class="health-bar" color="#9b2e2e" :ratio="healthRatio"></banner-bar>
    </div>`,
    props: ['player'],
    computed: {
        foodRatio() {
            return this.player.food / maxFood
        },
        healthRatio() {
            return this.player.health / maxHealth
        }
    }
})

//气泡
Vue.component('bubble', {
    template: `<div class="stat-bubble" :class="type+'-bubble'" :style="bubbleStyle">
        <img :src="'svg/'+type+'-bubble.svg'" alt="">
        <div class="counter">{{value}}</div>
    </div>`,
    props: ['type', 'value','ratio'],
    computed: {
        bubbleStyle() {
            return {
                top: (this.ratio*220+40)*state.worldRatio + 'px'
            }
        }
    }
})

//旗帜
Vue.component('banner-bar', {
    data() {
      return {
          height: 0
      }
    },
    template: '#banner',
    props: ['color', 'ratio'],
    computed: {
        targetHeight() {
            return 220*this.ratio + 40
        }
    },
    created() {
        this.height = this.targetHeight
    },
    watch: {
        targetHeight(newValue, oldValue) {
            const coords = {value: oldValue}
            new TWEEN.Tween(coords) // Create a new tween that modifies 'coords'.
                .to({value: newValue}, 500) // Move to (300, 200) in 1 second.
                .easing(TWEEN.Easing.Cubic.InOut) // Use an easing function to make the animation smooth.
                .onUpdate(() => {
                    this.height = coords.value.toFixed(0)
                })
                .start()
        }
    }
})

//云朵
Vue.component('cloud', {
    data() {
      return {
          style: {
              transform: 'none',
              zIndex: 0,
          },
          cloudAnimationDurations: {min: 10000, max: 50000}
      }
    },
    template: `<div class="cloud" :class="'cloud-'+type" :style="style">
        <img :src="'svg/cloud'+type+'.svg'" alt="" @load="initPosition">
    </div>`,
    props: ['type'],
    methods: {
        initPosition() {
            const width = this.$el.clientWidth
            this.setPosition(-width, 0)
        },
        setPosition(left, top) {
            this.style.transform = `translate(${left}px, ${top}px)`
        },
        startAnimation(delay = 0) {
            const width = this.$el.clientWidth
            const {min, max} = this.cloudAnimationDurations
            const animationDuration = Math.random() * (max - min) + min
            this.style.zIndex = Math.round(max - animationDuration)
            const vm = this

            const top = Math.random()*(window.innerHeight * 0.3)
             new TWEEN.Tween({value: -width})
                 .to({value: window.innerWidth}, animationDuration)
                 .delay(delay)
                 .onUpdate(function () {
                     vm.setPosition(this.value, top)
                 })
                 .onComplete(() => {
                     this.startAnimation(Math.random() * 10000)
                 })
                 .start()
        }
    },
    mounted() {
        //以负值延迟开始动画，所以动画将从中途开始
        this.startAnimation(- Math.random() * this.cloudAnimationDurations.min)
    }
})