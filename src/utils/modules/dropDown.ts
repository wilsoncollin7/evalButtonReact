import lookups from '../filters/lookups.json';

// --------------------------------------------------------------
// --- switch with all dropdown cases for inputs, add as I go ---
// --------------------------------------------------------------
export const filterDropDownContent = (attributeDataType: string) => {
  switch (attributeDataType) {
    // case 'pendingType':
    //   return ;
    // case 'systemType':
    //   return ;
    case 'healthUser':
      return getEOPApprovedStaff();
    // case 'ORCList':
    //   return ;
    // case 'TestType':
    //   return ;
    case 'EstablishmentType':
      return getHealthSiteEvalCalc();
    // case 'WellResults':
    //   return ;
    // case 'WaterSupply':
    //   return ;
    // case 'TotalColiform':
    //   return ;
    // case 'FecalColiform':
    //   return ;
    case 'siteEvalDropDown':
      return getHealthSiteEvalTypes();
    case 'siteClassDropDown':
      return getHealthSiteClasses();
    default:
      return 'Unable to retieve content';
  };
};

// --------------------------------------------------
// --- functions responsible for grabbing content ---
// --------------------------------------------------
// EstablishmentType
export const getHealthSiteEvalCalc = () => {
  const types = lookups.HealthSiteEvalCalc;
  function filterItem(item: any) {
    return item;
  }
  const sites = types.filter(filterItem);
  const data: any = [];
  sites.forEach((item: any) => {
    data.push({
      description: item.Description
    });
  });
  return data;
};

// siteEvalDropDown
export const getHealthSiteEvalTypes = () => {
  const types = lookups.EnvHealthSiteEvalTypes;
  function filterItem(item: any) {
    return item;
  };
  const sites = types.filter(filterItem);
  const data: any = [];
  sites.forEach((item: any) => {
    data.push({
      description: item.SiteEvalType
    });
  });
  return data;
};

// siteClassDropDown
export const getHealthSiteClasses = () => {
  const types = lookups.EnvHealthSiteClasses;
  function filterItem(item: any) {
    return item;
  };
  const sites = types.filter(filterItem);
  const data: any = [];
  sites.forEach((item: any) => {
    data.push({
      description: item.SiteClass
    });
  });
  return data;
};

// healthUser
export const getEOPApprovedStaff = () => {
  const types = lookups.EOPApprovedStaff;
  function filterItem(item: any) {
    if (!item.Inactive) {
      return item;
    };
  };
  const sites = types.filter(filterItem);
  const data: any = [];
  sites.forEach((item: any) => {
    data.push({
      description: item.Name
    });
  });
  return data;
};
