new Vue({
    name: 'game',
    el: '#app',
    data: state,
    template: `
<div id="app" :class="cssClass">
    <top-bar :players="players" :turn="turn" :current-player-index="currentPlayerIndex"></top-bar>
    <div class="world">
        <castle v-for="(player, index) in players" :index="index" :player="player"></castle>
        <div class="land"></div>
        <div class="clouds">
            <cloud v-for="index in 10" :type="(index-1)%5+1"></cloud>
        </div>
    </div>
    <transition name="hand">
        <hand :cards="currentHand" v-if="!activeOverlay" @card-play="handlePlayCard" @card-leave-end="handleCardLeaveEnd"></hand>
    </transition>
    <transition name="fade">
      <div class="overlay-background" v-if="activeOverlay" />
    </transition>
    <transition name="zoom">
        <overlay v-if="activeOverlay" :key="activeOverlay" @close="handleOverlayClose">
<!--        <overlay-content-player-turn v-if="activeOverlay === 'player-turn'" :player="currentPlayer"></overlay-content-player-turn>-->
<!--        <overlay-content-last-play v-if="activeOverlay === 'last-play'" :opponent="currentOpponent"></overlay-content-last-play>-->
<!--        <overlay-content-game-over v-if="activeOverlay === 'game-over'" :players="players"></overlay-content-game-over>-->
            <component :is="'overlay-content-'+activeOverlay" :player="currentPlayer" :opponent="currentOpponent" :players="players"></component>
        </overlay>
    </transition>
</div>`,
    computed: {
        // testCard() {
        //     return cards.archers
        // },
        cssClass() {
            return {
                'css-play': this.canPlay
            }
        }
    },
    methods: {
        // createTestHand() {
        //    const cards = []
        //     for(let i = 0; i < 5; i++) {
        //         cards.push(this.testDrawCard())
        //     }
        //     return cards
        // },
        // testDrawCard() {
        //     //随机抽取一张卡牌
        //     const ids = Object.keys(cards)
        //     const randomId = ids[Math.floor(Math.random()*ids.length)]
        //
        //     return {
        //         uid: cardUid++,
        //         id: randomId,
        //         def: cards[randomId]
        //     }
        // },
        // testPlayCard(card) {
        //     //将卡牌从玩家手牌中移除
        //     const index = this.testHand.indexOf(card)
        //     this.testHand.splice(index, 1)
        // }
        handlePlayCard(card) {
            // 将卡牌从玩家手牌中移除，并加入弃牌堆
            playCard(card)
        },
        handleCardLeaveEnd() {
            applyCard()
        },
        handleOverlayClose() {
            overlayCloseHandlers[this.activeOverlay]()
        }
    },
    created() {
        // this.testHand = this.createTestHand()
        beginGame()
    }
})

//窗口大小变化的处理
window.addEventListener('resize', () => {
    state.worldRatio = getWorldRatio()
})

function animate(time) {
    requestAnimationFrame(animate)
    TWEEN.update(time)
}
requestAnimationFrame(animate)

function beginGame() {
    //玩家抽取手牌
    state.players.forEach(drawInitialHand)
}

//从手牌中移除卡牌
function playCard(card) {
    if(state.canPlay) {
        state.canPlay = false
        currentPlayingCard = card
        const index = state.currentPlayer.hand.indexOf(card)
        state.currentPlayer.hand.splice(index, 1)
        //将卡牌放入弃牌堆
        addCardToPile(state.discardPile, card.id)
    }
}

//将卡牌的效果应用到玩家身上
function applyCard() {
    const card = currentPlayingCard
    applyCardEffect(card)

    //延迟700ms以便玩家能看到动画效果
    setTimeout(() => {
        //检查玩家是否死亡
        state.players.forEach(checkPlayerLost)

        if(isOnePlayerDead()) {
            endGame()
        }else {
            nextTurn()
        }
    }, 700)
}

function endGame() {
    state.activeOverlay = 'game-over'
}

//下一回合：将回合数加1，修改当前的玩家，并显示player-turn浮层
function nextTurn() {
    state.turn++
    state.currentPlayerIndex = state.currentOpponentId
    state.activeOverlay = 'player-turn'
}

//根据上一回合的出牌，判断此次回合玩家需要进行的操作
function newTurn() {
    if(state.currentPlayer.skipTurn) {
        skipTurn()
    }else {
        startTurn()
    }
}


function skipTurn() {
    state.currentPlayer.skippedTurn = true
    state.currentPlayer.skipTurn = false
    nextTurn()
}

function startTurn() {
    state.currentPlayer.skippedTurn = false
    if(state.turn > 2) {
        //抽取一张新的牌
        setTimeout(() => {
            state.currentPlayer.hand.push(drawCard())
            state.canPlay = true
        }, 800)
    } else {
        state.canPlay = true   //允许玩家出牌
    }
    state.activeOverlay = null
}

//单击每个浮层时触发的动作
var overlayCloseHandlers = {
    'player-turn': () => {
        if(state.turn > 1) {
            state.activeOverlay = 'last-play'
        }else {
            newTurn()
        }
    },
    'last-play': () => {
        newTurn()
    },
    'game-over': () => {
        location.reload()
    }
}