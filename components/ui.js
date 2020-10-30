//顶栏
Vue.component('top-bar', {
    props:['players','currentPlayerIndex', 'turn'],
    template: `
    <div class="top-bar" :class="'player-' + currentPlayerIndex">
        <div class="player p0">{{players[0].name}}</div>
        <div class="turn-counter">
            <img class="arrow" src="svg/turn.svg" />
            <div class="turn">Turn {{turn}}</div>
        </div>
        <div class="player p1">{{players[1].name}}</div>
    </div>
    `
})

//卡牌
Vue.component('card', {
    props: ['def'],
    methods: {
        play() {
            this.$emit('play')
        }
    },
    template: `
<div class="card" :class="'type-' + def.type" @click="play">
  <div class="title">{{def.title}}</div>
  <img class="separator" src="svg/card-separator.svg" />
  <div class="description"><div v-html="def.description"></div></div>
  <div class="note" v-if="def.note"><div v-html="def.note"></div> </div>
</div>`
})

//玩家的手牌，拥有5张卡牌
Vue.component('hand', {
    template: `<div class="hand">
    <div class="wrapper">
        <transition-group tag="div" name="card" class="cards" @after-leave="handleLeaveTransitionEnd">
            <card v-for="card in cards" :key="card.uid" :def="card.def" @play="handlePlay(card)"></card>
        </transition-group>
    </div>
</div>`,
    props: ['cards'],
    methods: {
        handlePlay(card) {
            this.$emit('card-play', card)
        },
        handleLeaveTransitionEnd() {
            this.$emit('card-leave-end')
        }
    }
})


//浮层
Vue.component('overlay', {
    template: `
<div class="overlay" @click="handleClick">
    <div class="content">
        <slot></slot> 
    </div>  
</div>
    `,
    methods: {
        handleClick() {
            this.$emit('close')
        }
    }
})

//显示游戏回合开始的相关内容
Vue.component('overlay-content-player-turn', {
    template: `<div>
        <div class="big" v-if="player.skipTurn">
            {{player.name}},<br>your turn is skipped!
        </div>
        <div class="big" v-else>
            {{player.name}},<br>your turn has come!
            <div>Tap to continue</div>
        </div>
    </div>`,
    props: ['player']
})

//显示对手上一个回合的出牌信息
Vue.component('overlay-content-last-play', {
    template: `<div>
        <div v-if="opponent.skippedTurn">{{opponent.name}} turn was skipped!</div>
        <template v-else>
            <div>{{opponent.name}} just played:</div>
            <card :def="lastPlayedCard"></card>
        </template>
    </div>`,
    props: ['opponent'],
    computed: {
        lastPlayedCard() {
            return getLastPlayedCard(this.opponent)
        }
    }
})

//游戏结果
Vue.component('player-result', {
    template: `<div class="player-result" :class="result">
        <span class="name">{{player.name}}</span> is 
        <span class="result">{{result}}</span>
    </div>`,
    props: ['player'],
    computed: {
        result() {
            return this.player.dead ? 'defeated' : 'victorious'
        }
    }
})

//显示游戏结果的信息
Vue.component('overlay-content-game-over', {
    template: `<div>
        <div>Game Over</div>
        <player-result v-for="player in players" :player="player"></player-result>
    </div>`,
    props: ['players']
})