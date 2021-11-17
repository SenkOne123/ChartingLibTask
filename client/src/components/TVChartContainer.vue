<template>
  <div>
    <button class="button">Add bars</button>
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
    mounted() {
      const widgetOptions = {
        symbol: 'EURUSD',
        // BEWARE: no trailing slash is expected in feed URL
        datafeed: api, // new window.Datafeeds.UDFCompatibleDatafeed(this.datafeedUrl),
        interval: '1',
        container: this.container,
        library_path: this.libraryPath,
        locale: 'en',
        disabled_features: ['use_localstorage_for_settings'],
        // enabled_features: ['study_templates'],
        // charts_storage_url: this.chartsStorageUrl,
        // charts_storage_api_version: this.chartsStorageApiVersion,
        // client_id: this.clientId,
        user_id: this.userId,
        fullscreen: this.fullscreen,
        autosize: this.autosize,
        studies_overrides: this.studiesOverrides,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
      }

      this.tvWidget = new TradingView.widget(widgetOptions)
      const widget = new TradingView.widget(widgetOptions)

      let count = 0

      widget.onChartReady(() => {
        const longShape = widget.activeChart().createMultipointShape(
            [{time: 1637138880}, {time: 1637138880 + widgetOptions.interval*60*15}],
            {
              shape: 'long_position',
              overrides: {
                profitLevel: 200,
                stopLevel: 200,
              },
            })

        const shortShape = widget.activeChart().createMultipointShape(
            [{time: 1637132880}, {time: 1637132880 + widgetOptions.interval*60*15}],
            {
              shape: 'short_position',
              overrides: {
                profitLevel: 200,
                stopLevel: 200,
              },
            })

        console.log(widget.activeChart().getShapeById(longShape).getProperties())

        widget.subscribe('drawing_event', (id, type) => {
          if (type === 'click') {
            count += 1
            console.log(count)
          }
        })

        widget.activeChart().getAllShapes().forEach(({ id, name }) => console.log(id, name))
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
    height: 100%;
  }
  .button {
    margin-left: 50%;
    margin-top: 5px;
    width: 100px;
    height: 30px;
    z-index: 9999;
    position: relative;
  }
</style>