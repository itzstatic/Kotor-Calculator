<template>
  <div id="app">
    <keep-alive>
      <component ref="screen"
        :is="currentScreen" 
        @next="next()"
        @prev="prev()"
        :title="dialog.t(208) + ' ' + build.level"
      />
    </keep-alive>
  </div>
</template>

<script>
import AttributeScreen from './components/screens/AttributeScreen'
import SkillScreen from './components/screens/SkillScreen'
import FeatScreen from './components/screens/FeatScreen'
import PowerScreen from './components/screens/PowerScreen'

import attributeServicePromise from './services/attributeService'
import featServicePromise from './services/featService'
import powerServicePromise from './services/powerService'

import Mutations from './store/mutations'
import { ClassId } from './enums'
import dialogPromise from './dialog'

export default {
  name: 'App',
  components: {
    AttributeScreen, SkillScreen, FeatScreen, PowerScreen
  },
  data() {
    return {
      currentScreenIndex: 0
    }
  },
  asyncComputed: {
    dialog: {
      get: () => dialogPromise,
      default: { t: () => null }
    },
    attributeService: () => attributeServicePromise,
    featService: () => featServicePromise,
    powerService: () => powerServicePromise
  },
  mounted() {
    const unwatch = this.$watch('screens', screens => {
      if (screens.length) {
        this.$refs.screen.opened && this.$refs.screen.opened()
        unwatch()
      }
    })
  },
  computed: {
    currentScreen() {
      return this.screens[this.currentScreenIndex]
    },
    build() {
      return { ...this.$store.getters, ...this.$store.state }
    },
    screens() {
      if (!this.attributeService || !this.featService || !this.powerService) {
        return []
      }
      return [
        this.attributeService.getRemainingPoints(this.build.level) ? AttributeScreen.name : null,
        SkillScreen.name,
        this.featService.getGainedFeatCount(this.build) ? FeatScreen.name : null,
        this.powerService.getGainedPowerCount(this.build) ? PowerScreen.name : null
      ].filter(x => x)
    },
  },
  methods: {
    async next() {
      if (this.currentScreenIndex === this.screens.length - 1) {
        this.$store.commit(Mutations.LevelUp)
        if (this.build.level === 6) {
          this.$store.commit(Mutations.Jedi, ClassId.JediGuardian)
        }
        this.currentScreenIndex = 0
      } else {
        this.currentScreenIndex++
      }
      await this.$nextTick()
      this.$refs.screen.opened && this.$refs.screen.opened()
    },
    async prev() {
      this.currentScreenIndex = (this.currentScreenIndex - 1) % this.screens.length
      await this.$nextTick()
      this.$refs.screen.opened && this.$refs.screen.opened()
    }
  }
}
</script>

<style>
body {
  background: black;
  padding: 40px 100px;
  font-family: Helvetica;
  font-size: 14pt;
  user-select: none;
  
  --primary-color: rgb(48, 138, 200);
  --border-color: rgb(16, 34, 64);
  --background-color: rgb(1, 1, 23);
  --glow-color: rgb(255, 241, 0);
}

/* Buttons */
.btn {
  padding: 6px 8px;
  margin: 4px 2px;
  border-radius: 4px;
  display: inline-block;
  cursor: pointer;
  min-width: 120px;
}

.layout, 
.btn,
::-webkit-scrollbar,
::-webkit-scrollbar-thumb {
  color: var(--primary-color);
}

.layout,
.btn {
  background: var(--background-color);
}

::-webkit-scrollbar {
  width: 15px;
  box-shadow: 0px 1px var(--background-color), 0px -1px var(--background-color);
}

::-webkit-scrollbar-track {
  margin: 2px;
}

::-webkit-scrollbar-thumb {
  background: currentColor;
  border: 3px solid transparent;
  background-clip: padding-box;
}

::-webkit-scrollbar-button {
  border: 7.5px solid; 
  height: 7.5px;
}

::-webkit-scrollbar-button:vertical:decrement {
  border-color: transparent transparent currentColor transparent; 
}

::-webkit-scrollbar-button:vertical:increment {
  border-color: currentColor transparent transparent transparent;
}

.stat {
  display: grid;
  grid-template-columns: 70% 30%;
}

.stat__name-container {
  box-shadow: inset -1px 0px var(--border-color);
}

.stat__name {
  position: relative;
  top: 50%;
  transform: translateY(-50%);
}

* {
	cursor: url(/static/png/gui_mp_selectU.png), auto;
}

:active {
	cursor: url(/static/png/gui_mp_selectD.png), auto;
}
</style>
