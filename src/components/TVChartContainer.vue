<template>
  <div>
    <div class="TVChartContainer" :id="container" />
  </div>
</template>

<script>
  import api from './api'
  import {getKlines, subscribeKline} from "./api/helpers";

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
    savedChart: null,
    bars: null,
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

      getKlines({
        symbol: 'EURUSD',
        interval: '1',
        from: new Date(0),
        to: Date.now(),
        limit: 1000,
      }).then(res => {
        this.bars = res.slice(0, 799)
      })

      this.widgets.onChartReady(() => {

        this.widgets.headerReady().then(() => {
          let playButton = this.widgets.createButton()
          let longPos = this.widgets.createButton()
          let shortPos = this.widgets.createButton()
          let iconUp = this.widgets.createButton()
          let iconDown = this.widgets.createButton()
          let text = this.widgets.createButton()
          let line = this.widgets.createButton()
          let saveButton = this.widgets.createButton()
          let loadButton = this.widgets.createButton()
          playButton.textContent = 'Play'
          longPos.textContent = 'Long Pos'
          shortPos.textContent = 'Short Pos'
          iconUp.textContent = 'Icon Up'
          iconDown.textContent = 'Icon Down'
          text.textContent = 'Text'
          line.textContent = 'Line'
          saveButton.textContent = 'Save'
          loadButton.textContent = 'Load'
          playButton.addEventListener('click', () => {

          })
          longPos.addEventListener('click', () => {
            this.widgets.activeChart().createMultipointShape(
                [{time: this.bars[798].time/1000}, {time: this.bars[798].time/1000 + 60*30}],
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
                [{time: this.bars[798].time/1000}, {time: this.bars[798].time/1000 + 60*30}],
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
                {time: this.bars[500].time/1000, price: 1.129 },
                {
                  shape: 'arrow_down'
                }
            )
          })
          iconUp.addEventListener('click', () => {
            this.widgets.activeChart().createShape(
                {time: this.bars[500].time/1000, price: 1.128 },
                {
                  shape: 'arrow_up'
                }
            )
          })
          line.addEventListener('click', () => {
            this.widgets.activeChart().createMultipointShape(
                [{time: this.bars[700].time/1000}],
                {
                  shape: 'vertical_line',
                  overrides: {
                    profitLevel: 20,
                    stopLevel: 20,
                  },
                })
          })
          text.addEventListener('click', () => {
            this.widgets.activeChart().createShape(
                {time: this.bars[798].time/1000, price: 1.129 },
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
          saveButton.addEventListener('click', () => {
            this.tvWidget.save(data => {
              this.savedChart = data
            })
            localStorage.setItem('widgets', JSON.stringify(this.savedChart))
          })
          loadButton.addEventListener('click', () => {
            this.widgets.load(JSON.parse(localStorage.getItem('widgets')))
          })

        })

          this.widgets.subscribe('drawing_event', (id, type) => {
            console.log(id,type)
          })

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
</style>