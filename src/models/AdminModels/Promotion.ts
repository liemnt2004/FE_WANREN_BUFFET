class PromotionAdmin {
  constructor(
    public createdDate: string,
    public updatedDate: string | null,
    public promotionName: string,
    public description: string,
    public promotionType: string,
    public promotionValue: number,
    public startDate: string,
    public endDate: string,
    public promotionStatus: boolean,
    public promotion: number
  ) {}
}
export default PromotionAdmin;
