<template>
  <div>
    <div class="button_box">
      <button @click="" class="button">Play</button>
      <button @click="longPosButtonClick" class="button">Long Pos</button>
      <button @click="shortPosButtonClick" class="button">Short Pos</button>
      <button @click="arrowUpButtonClick" class="button">Icon Up</button>
      <button @click="arrowDownButtonClick" class="button">Icon Down</button>
      <button @click="textButtonClick" class="button">Text</button>
      <button @click="lineButtonClick" class="button">Line</button>
      <button @click="saveButtonClick" class="button">Save</button>
      <button @click="loadButtonClick" class="button">Load</button>
    </div>
    <div class="TVChartContainer" :id="container"/>
  </div>
</template>

<script>
import api from './api'
import {getKlines} from "./api/helpers";

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
  play: false,
  methods: {
    handlePlayButtonClick() {
    },
    longPosButtonClick() {
        this.widgets.activeChart().createMultipointShape(
            [{time: this.bars[798].time / 1000}, {time: this.bars[798].time / 1000 + 60 * 30}],
            {
              shape: 'long_position',
              overrides: {
                profitLevel: 20,
                stopLevel: 20,
              },
            })
      },
    shortPosButtonClick() {
      this.widgets.activeChart().createMultipointShape(
          [{time: this.bars[798].time / 1000}, {time: this.bars[798].time / 1000 + 60 * 30}],
          {
            shape: 'short_position',
            overrides: {
              profitLevel: 20,
              stopLevel: 20,
            },
          })
    },
    arrowUpButtonClick() {
      this.widgets.activeChart().createShape(
          {time: this.bars[500].time / 1000, price: this.bars[500].close + 0.00090},
          {
            shape: 'arrow_up'
          }
      )
    },
    arrowDownButtonClick() {
      this.widgets.activeChart().createShape(
          {time: this.bars[600].time / 1000, price: this.bars[700].close + 0.00090},
          {
            shape: 'arrow_down'
          }
      )
    },
    textButtonClick() {
      this.widgets.activeChart().createShape(
          {time: this.bars[798].time / 1000, price: 1.129},
          {
            shape: 'text',
            overrides: {
              showLabel: true,
              textSize: 16,
            },
            text: 'Sample Text'
          }
      )
    },
    lineButtonClick() {
      this.widgets.activeChart().createMultipointShape(
          [{time: this.bars[700].time / 1000}],
          {
            shape: 'vertical_line',
            overrides: {
              profitLevel: 20,
              stopLevel: 20,
            },
          })
    },
    saveButtonClick() {
      this.tvWidget.save(data => {
        this.savedChart = data
      })
      localStorage.setItem('widgets', JSON.stringify(this.savedChart))
    },
    loadButtonClick() {
      this.widgets.load(JSON.parse(localStorage.getItem('widgets')))
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
      this.widgets.subscribe('drawing_event', (id, type) => {
        console.log(id, type)
      })

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

.button_box {
  display: flex;
  margin-top: 15px;
  margin-left: 45px;
}

.button {
  font-family: "Roboto Thin", sans-serif;
  margin-left: 10px;
  color: #ffffff;
  background-color: #000000;
  border-radius: 4px;
  border-width: 0;
  min-width: 100px;
  min-height: 30px;
}

.button:hover {
  font-family: "Roboto Thin", sans-serif;
  margin-left: 10px;
  border-radius: 4px;
  color: #ffffff;
  background-color: #555555;
  box-shadow: #333333;
  border-width: 0;
  min-width: 100px;
  min-height: 30px;
}

</style>