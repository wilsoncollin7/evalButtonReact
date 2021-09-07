import moment from 'moment';
import lookups from './lookups.json';
import { Payment, Permit } from '../interfaces/healthInterfaces';

// ----------------------------------------------------
// ----------All Exported Filter Functions-------------
// -----------------Uses Lookups-----------------------
// ----------------------------------------------------

export const filterEvalsByPermitNumber = (items: any, permitNumber: string) => {
  function filterItem(item: any) {
    if (item.permitNumber === permitNumber) {
      return item;
    };
  };
  const data = items.filter(filterItem);
  return data[0];
};

export const statusFilter = (statusKey: any) => {
  const types = lookups.PermitStatus;
  function filterItem(item: any) {
    if (item.permitStatusKey === statusKey) {
      return item.permitStatus;
    };
  };
  const status = types.filter(filterItem);
  const data = status[0].permitStatus;
  return data;
};

export const permitTypeFilter = (permitTypeKey: number) => {
  const types = lookups.PermitTypes;
  function filterItem(item: any) {
    if (item.permitTypeKey === permitTypeKey) {
      return item.permitType;
    }
  };
  const permitType = types.filter(filterItem);
  const data = permitType[0].permitType;
  return data;
};

export const projectTypeFilter = (projectTypeKey: number) => {
  if (projectTypeKey === 0) return;
  const types = lookups.ProjectTypes;
  function filterItem(item: any) {
    if (item.ProjectTypeKey === projectTypeKey) {
      return item.ProjectType;
    }
  };
  const projectType: any = types.filter(filterItem);
  const data: string = projectType[0].ProjectType;
  return data;
};

export const evaluationTypeFilter = (projectTypeKey: number) => {
  if (projectTypeKey !== undefined) {
    if (projectTypeKey === 15) {
      return 1886;
    };
    return 1885;
  };
  return 1885;
};

export const permitsFilter = (data: any) => {
  function filterItem(item: any) {
    if (item.permitNumber !== '9999') {
      return item;
    }
  };
  const permits = data.filter(filterItem);
  return permits;
};

export const filterAttributeValueByType = (items: any, type: string) => {
  function filterItem(item: any) {
    if (item.attributeDataType === type) {
      return item;
    };
  };
  const value = items.filter(filterItem);
  const data = value[0].attributeValue;
  return data;
};

export const getHealthSiteEvalCalc = () => {
  const types = lookups.HealthSiteEvalCalc;
  function filterItem(item: any) {
    return item;
  }
  const sites = types.filter(filterItem);
  const data = sites;
  return data;
};

export const getHealthSiteEvalTypes = () => {
  const types = lookups.EnvHealthSiteEvalTypes;
  function filterItem(item: any) {
    return item;
  };
  const sites = types.filter(filterItem);
  const data = sites;
  return data;
};

export const getHealthSiteClasses = () => {
  const types = lookups.EnvHealthSiteClasses;
  function filterItem(item: any) {
    return item;
  };
  const sites = types.filter(filterItem);
  const data = sites;
  return data;
};

export const getEOPApprovedStaff = () => {
  const types = lookups.EOPApprovedStaff;
  function filterItem(item: any) {
    if (!item.Inactive) {
      return item;
    };
  };
  const sites = types.filter(filterItem);
  const data = sites;
  return data;
};


export const getChargeType = (establishmentType: string) => {
  const types = lookups.HealthSiteEvalCalc;
  function filterItem(item: any) {
    if (item.Description === establishmentType) {
      return item;
    };
  };
  const charge = types.filter(filterItem);
  const data = charge[0];
  return data;
};

export const formatDate = (date: Date | undefined) => {
  let data: any;
  if (date !== undefined) {
    data = moment(date).format('L');
  };
  return data;
};

export const getPermitWithFees = (permits: any) => {
  function filterItem(item: Permit) {
    if (item.permitAmount !== 0) {
      return item;
    };
  };
  if (permits.length > 0) {
    const permitsWithFee = permits.filter(filterItem);
    return permitsWithFee;
  };
};

export const getAmountDue = (healthPermitKey: number, payments: any, permitAmount: number) => {
  let difference: number = permitAmount;
  function getAmount() {
    payments.forEach((item: Payment) => {
      if (item.healthPermitKey === healthPermitKey) {
        difference = (permitAmount - item.paymentAmount);
      };
    });
  };
  getAmount();
  return difference;
};

export const getPaymentStatus = (healthPermitKey: number, payments: any, permitAmount: number) => {
  let status: boolean = false;
  function getAmount() {
    payments.forEach((item: Payment) => {
      if (item.healthPermitKey === healthPermitKey) {
        if ((permitAmount - item.paymentAmount) === 0) {
          status = true;
        };
      };
    });
  };
  getAmount();
  return status;
};
