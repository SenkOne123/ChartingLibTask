<template>
  <div>
<!--    <div class="rightPanel">-->
<!--      <button @click="handlePlayButtonClick" class="buttons">Play</button>-->
<!--      <button class="buttons">Long pos</button>-->
<!--      <button class="buttons">Short pos</button>-->
<!--      <button class="buttons">Icon up</button>-->
<!--      <button class="buttons">Icon down</button>-->
<!--      <button class="buttons">Text</button>-->
<!--      <button class="buttons">Line</button>-->
<!--    </div>-->
    <div class="TVChartContainer" :id="container" />
  </div>
</template>

<script>
  import api from './api'

  export default {
    name: 'TVChartContainer',
    props: {
      symbol: {
        default: 'AAPL',
        type: String,
      },
      interval: {
        default: 'D',
        type: String,
      },
      container: {
        default: 'tv_chart_container',
        type: String,
      },
      datafeedUrl: {
        default: 'https://demo_feed.tradingview.com',
        type: String,
      },
      libraryPath: {
        default: '/charting_library/charting_library/',
        type: String,
      },
      chartsStorageUrl: {
        default: 'https://saveload.tradingview.com',
        type: String,
      },
      chartsStorageApiVersion: {
        default: '1.2',
        type: String,
      },
      clientId: {
        default: 'tradingview.com',
        type: String,
      },
      userId: {
        default: 'public_user_id',
        type: String,
      },
      fullscreen: {
        default: false,
        type: Boolean,
      },
      autosize: {
        default: true,
        type: Boolean,
      },
      studiesOverrides: {
        type: Object,
      }
    },
    tvWidget: null,
    widgets: null,
    methods: {
      handlePlayButtonClick() {
        this.widgets.onChartReady(() => {
          this.widgets.activeChart().createMultipointShape(
                [{time: 1637192940}, {time: 1637192940 + 60*15}],
                {
                  shape: 'long_position',
                  overrides: {
                    profitLevel: 20,
                    stopLevel: 20,
                  },
                })
        })
      }
    },
    mounted() {
      const widgetOptions = {
        symbol: 'EURUSD',
        datafeed: api,
        interval: '1',
        container: 'tv_chart_container',
        library_path: '/charting_library/charting_library/',
        locale: 'en',
        disabled_features: ['use_localstorage_for_settings'],
        fullscreen: false,
        autosize: true,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
      }
      this.tvWidget = new TradingView.widget(widgetOptions)
      this.widgets = new TradingView.widget(widgetOptions)

      let count = 0

      this.widgets.onChartReady(() => {

        this.widgets.headerReady().then(() => {
          let playButton = this.widgets.createButton()
          let longPos = this.widgets.createButton()
          let shortPos = this.widgets.createButton()
          let iconUp = this.widgets.createButton()
          let iconDown = this.widgets.createButton()
          let text = this.widgets.createButton()
          let line = this.widgets.createButton()
          playButton.textContent = 'Play'
          longPos.textContent = 'Long Pos'
          shortPos.textContent = 'Short Pos'
          iconUp.textContent = 'Icon Up'
          iconDown.textContent = 'Icon Down'
          text.textContent = 'Text'
          line.textContent = 'Line'
          longPos.addEventListener('click', () => {
            this.widgets.activeChart().createMultipointShape(
                [{time: 1637210940}, {time: 1637210940 + 60*30}],
                {
                  shape: 'long_position',
                  overrides: {
                    profitLevel: 20,
                    stopLevel: 20,
                  },
                })
          })
          shortPos.addEventListener('click', () => {
            this.widgets.activeChart().createMultipointShape(
                [{time: 1637210940}, {time: 1637210940 + 60*30}],
                {
                  shape: 'short_position',
                  overrides: {
                    profitLevel: 20,
                    stopLevel: 20,
                  },
                })
          })
          iconDown.addEventListener('click', () => {
            this.widgets.activeChart().createShape(
                {time: 1637207820 + 60*2, price: 1.13286 },
                {
                  shape: 'arrow_down'
                }
            )
          })
          iconUp.addEventListener('click', () => {
            this.widgets.activeChart().createShape(
                {time: 1637201280 - 60*3, price: 1.13313 },
                {
                  shape: 'arrow_up'
                }
            )
          })
          line.addEventListener('click', () => {
            this.widgets.activeChart().createMultipointShape(
                [{time: 1637210940 - 60*80, price: 1.13287}, {time: 1637210940 - 60*100 + 60*40, price: 1.13309}],
                {
                  shape: 'trend_line',
                  overrides: {
                    profitLevel: 20,
                    stopLevel: 20,
                  },
                })
          })
          text.addEventListener('click', () => {
            this.widgets.activeChart().createShape(
                {time: 1637203020, price: 1.1326 },
                {
                  shape: 'text',
                  overrides: {
                    showLabel: true,
                    textSize: 16,
                  },
                  text: 'Sample Text'
                }
            )
          })

        })

        //   widget.subscribe('drawing_event', (id, type) => {
        //     if (type === 'move') {
        //       console.log(widget.activeChart().getShapeById(id).getProperties())
        //     }
        //   })
        //
        //   widget.activeChart().getShapeById(arrowIcon).setProperties({
        //     text: 'AAAAA'
        //   })
        //
        //   widget.activeChart().getAllShapes().forEach(({ id, name }) => console.log(id, name))
        // })
      })
      this.tvWidget.onChartReady(() => {
      })

    },
    destroyed() {
      if (this.tvWidget !== null) {
        this.tvWidget.remove()
        this.tvWidget = null
      }
    }
  }
</script>

<style>
  .TVChartContainer {
    position: absolute;
    width: 100%;
    height: 95%;
  }
  .container_flex {
    display: flex;
    justify-content: space-between;
  }

  .rightPanel {
    padding: 10px;
    margin-left: 35px;
  }

  .buttons {
    margin-left: 10px;
  }
</style>