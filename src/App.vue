<template lang="pug">
  #app
    template(v-if="!isLogin")
      .panel.login
        .title
          h1 Matador de Monstros
        .form-login
          input(v-model="namePlayer" placeholder="Digite seu nick" @keydown.enter="login(namePlayer, true)")
          button(type="button" @click.prevent="login(namePlayer, true)")
            | Entrar
        .error(v-if="error")
          p Digite algum nickname
    template(v-if="isLogin")
      .panel.scores
        .score
          h1 {{ namePlayer }}
          .life-bar
            .life(
              :class="{danger: playerLife < 20}"
              :style="{width: playerLife + '%'}"
            )
          div {{ playerLife}}%
        .score
          h1 Monstro
          .life-bar
            .life(
              :class="{danger: monsterLIfe < 20}"
              :style="{width: monsterLIfe + '%'}"
            )
          div {{ monsterLIfe}}%
      .panel.result(v-if="hasResult")
        .win(v-if="monsterLIfe === 0") Você ganhou !!! :)
        .lose(v-else) Você perdeu... :(
      .panel.buttons
        template(v-if="running")
          button.btn.atack(@click="atack(false)")
            | Ataque
          button.btn.especial-atack(@click="atack(true)")
            | Ataque Especial
          button.btn.heal(@click="healAndHurt")
            | Curar
          button.btn.give-up(@click="running = false")
            | Desistir
          button.btn.logof(@click="login(namePlayer, false)")
            | Sair
        template(v-else)
          button.btn.new-game(@click="startGame")
            | Iniciar Jogo
          button.btn.logof(@click="login(namePlayer, false)")
            | Sair
      .panel.logs(v-if="logs.length")
        ul
          li.log(v-for="(log, index) in this.logs" :key="index" :class="log.cls")
            | {{ log.text }}
</template>

<script>

export default {
  name: 'app',
  data () {
    return {
      playerLife: 100,
      monsterLIfe: 100,
      running: false,
      logs: [],
      namePlayer: '',
      isLogin: false,
      error: false
    }
  },
  computed: {
    hasResult () {
      return this.playerLife === 0 || this.monsterLIfe === 0
    }
  },
  methods: {
    login (name, login) {
      if (name.length) {
        this.isLogin = login
      } else if (name.length === 0) {
        this.error = true
      }
      if (!login) {
        this.namePlayer = ''
      }
    },
    startGame () {
      this.running = true
      this.playerLife = 100
      this.monsterLIfe = 100
      this.logs = []
    },
    atack (especial) {
      this.hurt('monsterLIfe', 5, 10, especial, 'Jogador', 'Monstro', 'player')
      if (this.monsterLIfe > 0) {
        this.hurt('playerLife', 7, 12, false, 'Monstro', 'Jogador', 'monster')
      }
    },
    hurt (atr, min, max, especial, source, target, cls) {
      const plus = especial ? 5 : 0
      const hurt = this.getRandom(min + plus, max + plus)
      this[atr] = Math.max(this[atr] - hurt, 0)
      this.registerLog(`${source} atingiu ${target} com ${hurt}.`, cls)
    },
    healAndHurt () {
      this.heal(10, 15)
      this.hurt('playerLife', 7, 12, false, 'Monstro', 'Jogador', 'monster')
    },
    heal (min, max) {
      const heal = this.getRandom(min, max)
      this.playerLife = Math.min(this.playerLife + heal, 100)
      this.registerLog(`Jogador ganhou força de ${heal}`, 'player')
    },
    getRandom (min, max) {
      const value = Math.random() * (max - min) + min
      return Math.round(value)
    },
    registerLog (text, cls) {
      this.logs.unshift({ text, cls })
    }
  },
  watch: {
    hasResult (value) {
      if (value) this.running = false
    }
  }
}
</script>

<style lang="scss">
* {
  @import url('https://fonts.googleapis.com/css?family=Montserrat:300,400,600,700&display=swap');
  font-family: 'Montserrat', sans-serif;
}
#app {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  flex: 1;
  .panel{
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
    width: 100%;
  }
  .login{
    .title{
      text-align: center;
      padding-top: 20px;
      h1{
        font-weight: 300;
        margin: 0;
        padding: 0;
        font-size: 1.5rem;
      }
    }
    .form-login{
      display: flex;
      flex-direction: column;
      padding: 20px;
      input{
        margin: 20px 0;
        padding: 5px 0 5px 5px;
      }
      button{
        margin-bottom: 20px;
        padding: 5px;
        background-color: #259b24;
        border-radius: 3px;
        border: none;
        &:hover{
          background-color: #259b24aa;
        }
      }
    }
    .error{
      color: #e51c23;
      padding: 0 0 20px 20px;
      p{
        margin: 0;
        padding: 0;
      }
    }
  }
  .scores {
    display: flex;
    padding: 20px 0;
    .score{
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      h1{
        font-weight: 300;
        font-size: 1.6rem;
      }
      .life-bar{
        width: 80%;
        height: 22px;
        border: 1px solid #aaa;
        .life {
          display: flex;
          justify-content: center;
          height: 100%;
          background-color: green;
        }
        .danger{
          background-color: red;
        }
      }
    }
  }
  .result{
    display: flex;
    justify-content: center;
    font-weight: 600;
    font-size: 1.3rem;
    .win{
      color: green;
    }
    .lose{
      color: red;
    }
  }
  .buttons{
    display: flex;
    justify-content: center;
    padding: 20px 0;
    margin: 20px 0;
    .btn{
      padding: 5px 15px;
      margin: 0 10px;
      border-radius: 5px;
      text-transform: uppercase;
      font-size: 1.1rem;
    }
    .new-game{
      background-color: #4253af;
      color: #fff;
    }
    .atack{
      background-color: #e51c23;
      color: #fff;
    }
    .especial-atack{
      background-color: #ff9800;
      color: #000;
    }
    .heal{
      background-color: #259b24;
      color: #fff;
    }
    .give-up{
      background-color: #bbb;
      color: #000;
    }
    .logof{
      background-color: blueviolet;
      color: #fff;
    }
  }
  .logs{
    ul{
      display: flex;
      flex-direction: column;
      list-style: none;
      padding: 0;
      margin: 0;
    }
    li{
      display: flex;
      justify-content: center;
      margin: 4px 0;
      padding: 4px 0;
      font-weight: 600;
      font-size: 1.1rem;
      text-transform: uppercase;
      border-radius: 3px;
    }
    .player{
      background-color: #4253afaa;
      color: #fff;
    }
    .monster{
      background-color: #e51c23aa;
      color: #fff;
    }
  }
}
</style>
