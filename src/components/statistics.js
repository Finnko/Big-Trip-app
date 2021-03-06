import AbstractSmartComponent from "./abstract-smart-component";
import Chart from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import '../../node_modules/chart.js/dist/Chart.min.css';
import {EventTypes} from "../const";
import {getDatesHoursDiff} from "../utils/common";

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
          minBarLength: 50
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
          offset: 10,
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

const getMoneyData = (events) => {
  const moneyMap = {};

  events.forEach((item) => {
    if (!moneyMap[item.type]) {
      moneyMap[item.type] = 0;
    }

    moneyMap[item.type] += +item.price;
  });

  const labels = Object.keys(moneyMap);
  const data = Object.values(moneyMap);

  return {data, labels};
};

const getTransportData = (events) => {
  const typesMap = {};

  events
    .filter((item) => EventTypes.TRANSFERS.includes(item.type))
    .forEach((item) => {
      if (!typesMap[item.type]) {
        typesMap[item.type] = 0;
      }

      typesMap[item.type] += 1;
    });

  const labels = Object.keys(typesMap);
  const data = Object.values(typesMap);

  return {data, labels};
};

const getTimeSpentData = (events) => {
  const timeSpentMap = {};

  events
    .forEach((item) => {
      if (!timeSpentMap[item.type]) {
        timeSpentMap[item.type] = 0;
      }

      timeSpentMap[item.type] += getDatesHoursDiff(item.dateStart, item.dateEnd);
    });

  const labels = Object.keys(timeSpentMap);
  const data = Object.values(timeSpentMap);

  return {data, labels};
};

export default class StatisticsComponent extends AbstractSmartComponent {
  constructor(events) {
    super();

    this._events = events;
    this._moneyChart = null;
    this._transportChart = null;
    this._timeSpentChart = null;

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

    const moneyCtxElement = element.querySelector(`.statistics__chart--money`);
    const transportCtxElement = element.querySelector(`.statistics__chart--transport`);
    const timeCtxElement = element.querySelector(`.statistics__chart--time`);

    this._resetCharts();

    const moneyChartData = getMoneyData(this._events.getEvents());
    const transportChartData = getTransportData(this._events.getEvents());
    const timeSpentChartData = getTimeSpentData(this._events.getEvents());

    this._moneyChart = renderChart(
        moneyCtxElement,
        moneyChartData.data,
        moneyChartData.labels,
        ChartTitles.MONEY,
        (value) => `€ ${value}`);

    this._transportChart = renderChart(
        transportCtxElement,
        transportChartData.data,
        transportChartData.labels,
        ChartTitles.TRANSPORT,
        (value) => `x${value}`);

    this._timeSpentChart = renderChart(
        timeCtxElement,
        timeSpentChartData.data,
        timeSpentChartData.labels,
        ChartTitles.TIME,
        (value) => `${value} H`);
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
