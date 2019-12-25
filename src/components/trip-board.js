import AbstractComponent from "./abstract-component";

const createBoardTemplate = () => {
  return (`<section class="trip-events"></section>`);
};

export default class TripBoard extends AbstractComponent {
  getTemplate() {
    return createBoardTemplate();
  }
}
