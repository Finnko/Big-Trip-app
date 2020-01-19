import AbstractSmartComponent from "./abstract-smart-component";
import Chart from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import '../../node_modules/chart.js/dist/Chart.min.css';
import {EventTypes} from "../const";

const ChartColors = {
  CHART_TEXT_COLOR: `#000000`,
  CHART_TEXT_COLOR_INVERSE: `#ffffff`,
  CHART_ACCENT_COLOR: `#72d8f9`,
};

const ChartTitles = {
  MONEY: `MONEY`,
  TRANSPORT: `TRANSPORT`,
  TIME: `TIME SPENT`,
};

const renderChart = (ctx, data, labels, title, labelFormatter) => {
  return new Chart(ctx, {
    type: `horizontalBar`,
    plugins: [ChartDataLabels],
    data: {
      labels,
      datasets: [
        {
          data,
          backgroundColor: ChartColors.CHART_TEXT_COLOR_INVERSE,
          hoverBackgroundColor: ChartColors.CHART_ACCENT_COLOR,
          barThickness: 30,
          barPercentage: 1.0,
        },
      ],
    },
    options: {
      responsive: false,
      layout: {
        padding: {
          left: 60,
          right: 0,
          top: 0,
          bottom: 0,
        },
      },

      plugins: {
        datalabels: {
          color: ChartColors.CHART_TEXT_COLOR,
          font: {
            size: 15,
            weight: `bold`,
          },
          anchor: `end`,
          align: `left`,
          offset: 15,
          formatter: labelFormatter,
        },
      },

      tooltips: {
        enabled: false,
      },

      legend: {
        display: false,
      },

      scales: {
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],

        yAxes: [{
          scaleLabel: {
            padding: {
              bottom: 10,
            },
            labelString: title,
            display: true,
            fontSize: 20,
            fontStyle: `bold`,
            fontColor: ChartColors.CHART_TEXT_COLOR,
          },
          ticks: {
            beginAtZero: true,
            padding: 10,
            fontSize: 15,
            fontColor: ChartColors.CHART_TEXT_COLOR,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
      },
    },
  });
};

const createStatisticsTemplate = () => {
  return (
    `<section class="statistics">
      <h2 class="visually-hidden">Trip statistics</h2>

      <div class="statistics__item statistics__item--money">
        <canvas class="statistics__chart  statistics__chart--money" width="900"></canvas>
      </div>

      <div class="statistics__item statistics__item--transport">
        <canvas class="statistics__chart  statistics__chart--transport" width="900"></canvas>
      </div>

      <div class="statistics__item statistics__item--time-spend">
        <canvas class="statistics__chart  statistics__chart--time" width="900"></canvas>
      </div>
    </section>`
  );
};

const getTransportData = (eventsData) => {
  const typesMap = {};

  eventsData
    .filter((item) => EventTypes.TRANSFER.includes(item.type))
    .forEach((item) => {
      const type = item.type;

      if (!typesMap[type]) {
        typesMap[type] = 0;
      }

      typesMap[type] += 1;
    });

  const labels = Object.keys(typesMap);
  const data = Object.values(typesMap);

  return {data, labels};
};


export default class StatisticsComponent extends AbstractSmartComponent {
  constructor(events) {
    super();

    this._events = events;
    this._moneyChart = null;
    this._transportChart = null;
    this._timeSpentChart = null;
    console.log(this._events);

    this._renderCharts();
  }

  getTemplate() {
    return createStatisticsTemplate();
  }

  show() {
    super.show();

    this.rerender(this._events);
  }

  rerender() {
    super.rerender();

    this._renderCharts();
  }

  recoveryListeners() {
  }

  _renderCharts() {
    const element = this.getElement();

    const moneyCtx = element.querySelector(`.statistics__chart--money`);
    const transportCtx = element.querySelector(`.statistics__chart--transport`);
    const timeCtx = element.querySelector(`.statistics__chart--time`);

    this._resetCharts();

    const transportChartData = getTransportData(this._events.getEvents());

    this._moneyChart = renderChart(moneyCtx, [20, 30, 40, 50, 60], [`Sightseeing`, `Sightseeing`, `transport`, `transport`, `restaraunt`], ChartTitles.MONEY);

    this._transportChart = renderChart(
        transportCtx,
        transportChartData.data,
        transportChartData.labels,
        ChartTitles.TRANSPORT,
        (value) => `x${value}`);

    this._timeSpentChart = renderChart(timeCtx, [20, 30, 40, 50, 60], [`Sightseeing`, `transport`, `transport`, `transport`, `transport`], ChartTitles.TIME);
  }

  _resetCharts() {
    if (this._moneyChart) {
      this._moneyChart.destroy();
      this._moneyChart = null;
    }

    if (this._transportChart) {
      this._transportChart.destroy();
      this._transportChart = null;
    }

    if (this._timeSpentChart) {
      this._timeSpentChart.destroy();
      this._timeSpentChart = null;
    }
  }
}
