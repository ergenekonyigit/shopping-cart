module.exports = class Category {
  constructor(props) {
    this.title = props.title;
    this.parentCategory = props.parentCategory || null;
    this.campaign = props.campaign || null;
  }

  addCampaign(newCampaign) {
    this.campaign = newCampaign;
  }
}
