
import * as DcatApV3 from "../v3/dcat-ap-v3-model";

export interface Distribution extends DcatApV3.Distribution {

  /**
   * @lc-property https://gov.cz/slovník/podmínky-užití/specifikace
   */
  podmínkyUžitíSpecifikace: DcatApV3.Resource | null;

  accessService: DataService[];

}

export interface DataService extends DcatApV3.DataService {

  /**
   * @lc-property http://data.europa.eu/r5r/hvdCategory
   */
  hvdCategory: DcatApV3.Concept[];

  /**
   * @lc-property http://purl.org/dc/terms/identifier
   */
  identifier: DcatApV3.Literal[];

}