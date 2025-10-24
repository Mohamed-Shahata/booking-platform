import ExpertService from "./expertProfile.service";

class ExpertController {
  private expertService: ExpertService;
  constructor() {
    this.expertService = new ExpertService();
  }
}

export default ExpertController;
