// Some usefull variables
var maxHealth = 10
var maxFood = 10
var handSize = 5
var cardUid = 0
var currentPlayingCard = null   //当前打出的牌

// The consolidated state of our app
var state = {
  // World
  worldRatio: getWorldRatio(),
  // 顶栏组件数据
  players: [
      {
          name: 'anne of cleves',
          //游戏开始时的状态
          food: 10,
          health: 10,
          //是否跳过此回合
          skipTurn: false,
          //跳过了上个回合
          skippedTurn: false,
          hand: [],
          lastPlayedCardId: null,
          dead: false
      },
    {
        name: 'william the bald',
        //游戏开始时的状态
        food: 10,
        health: 10,
        //是否跳过本次回合
        skipTurn: false,
        //跳过了上个回合
        skippedTurn: false,
        hand: [],
        lastPlayedCardId: null,
        dead: false
    }],
    turn: 1,
    currentPlayerIndex: Math.round(Math.random()),
    // testHand: [],
    //浮层
    activeOverlay: null,
    get currentPlayer() {
      return state.players[state.currentPlayerIndex]
    },
    get currentOpponentId() {
      return state.currentPlayerIndex === 0 ? 1 : 0
    },
    get currentOpponent() {
        return state.players[state.currentOpponentId]
    },
    drawPile: pile,  //玩家可以抽取的牌堆
    discardPile: {},   //玩家打出的牌堆
    get currentHand() {
      return state.currentPlayer.hand
    },
    canPlay: true    //防止玩家在回合中重复出牌
}
