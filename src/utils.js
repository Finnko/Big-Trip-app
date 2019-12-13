const RenderPosition = {
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`
};

const getRandomInRange = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const getRandomArrayItem = (array) => {
  const randomIndex = getRandomInRange(0, array.length - 1);

  return array[randomIndex];
};

const getRandomDate = () => {
  const targetDate = new Date();

  const sign = Math.random() > 0.5 ? 1 : -1;
  const diffValue = sign * getRandomInRange(0, 3);
  const hours = getRandomInRange(0, 23);
  const minutes = getRandomInRange(0, 59);

  targetDate.setDate(targetDate.getDate() + diffValue);
  targetDate.setHours(hours, minutes);

  return targetDate;
};

const getUniqueDays = (days, uniqueDays = []) => {

  days.forEach((item) => {
    const someDate = uniqueDays.some((uniqueItem) =>
      timeTagFormatted(new Date(item.date)).slice(0, -6) === timeTagFormatted(new Date(uniqueItem.date)).slice(0, -6));

    if (!someDate) {
      uniqueDays.push(item);
    }
  });

  return uniqueDays;
};

const getRandomTime = (date) => {
  const month = date.getMonth();
  const targetDate = new Date(timeTagFormatted(date).slice(0, -6));

  const hours = getRandomInRange(0, 23);
  const minutes = getRandomInRange(0, 59);

  targetDate.setMonth(month);
  targetDate.setHours(hours, minutes);

  return targetDate;
};

const castTimeFormat = (value) => {
  return value < 10 ? `0${value}` : String(value);
};

const castDateFormat = (value, liter = `D`) => {
  return value < 10 ? `0${value}${liter}` : `${value}${liter}`;
};

const timeTagFormatted = (date) => {
  const year = date.getFullYear();
  const month = castTimeFormat(date.getMonth());
  const day = castTimeFormat(date.getDate());
  const hours = castTimeFormat(date.getHours());
  const minutes = castTimeFormat(date.getMinutes());

  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

const formatTime = (date) => {
  const hours = castTimeFormat(date.getHours());
  const minutes = castTimeFormat(date.getMinutes());

  return `${hours}:${minutes}`;
};

const renderComponent = (container, element, place) => {
  switch (place) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(element);
      break;
    case RenderPosition.BEFOREEND:
      container.append(element);
      break;
  }
};

const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;

  return newElement.firstChild;
};

const repeat = (count, fn) => {
  return Array(count).fill(``).map(fn);
};

export {
  RenderPosition, getRandomInRange, getRandomArrayItem, getRandomDate, formatTime, repeat, renderComponent,
  timeTagFormatted, castDateFormat, castTimeFormat, getRandomTime, getUniqueDays, createElement
};
