import { Permit } from '../../utils/interfaces/healthInterfaces';
import { client } from '../apollo-client/apollo-client';
import { HealthGqlList } from './gqlList';
const qlList = new HealthGqlList();

// -------------------------------------------------
// ------------ Error Handler ----------------------
// -------------------------------------------------
const handleError = (error: any, caller: string) => {
  console.log('trapped error @ ' + caller);
  throw error.message;
};

// -------------------------------------------------
// ------------------ Queries ----------------------
// -------------------------------------------------
export const GetHealthPermitsByTypeAndProjectNumber = (healthprojectNumber: string, permitTypeKey: number) => {
  return client.query({
    query: qlList.Get_Health_PermitsByTypeAndProjectNumber,
    variables: { healthprojectNumber: healthprojectNumber, permitTypeKey: permitTypeKey }
  }).then(res => {
    const data = res.data.pGetHealthPermitsByProjectNumber;
    return data;
  },
    error => handleError(error, 'GET HEALTH PERMITS')
  );
};

export const GetPermitTypeAttributes = (permitProjectKey: number, permitTypeKey: number) => {
  return client.query({
    query: qlList.Get_PermitTypeAttributes,
    variables: { permitProjectKey: permitProjectKey, permitTypeKey: permitTypeKey }
  }).then(res => {
    const data = res.data.pGetPermitTypeAttributes;
    return data;
  },
    error => handleError(error, 'GET PERMIT TYPE ATTRIBUTES')
  );
};

export const GetHealthPermitTypeAttributeByPermitKey = (healthPermitKey: number) => {
  return client.query({
    query: qlList.Get_Health_PermitTypeAttributeByPermitKey,
    variables: { healthPermitKey: healthPermitKey }
  }).then(res => {
    const data = res.data.healthPermitTypeAttribute;
    return data;
  },
    error => handleError(error, 'GET HEALTH PERMIT TYPE ATTRIBUTES')
  );
};

export const GetHealthPermitProjectByPermitNumber = (permitNumber: string) => {
  return client.query({
    query: qlList.Get_Health_PermitProjectByPermitNumber,
    variables: { permitNumber: permitNumber }
  }).then(res => {
    const data = res.data.healthPermitProjectByPermitNumber[0];
    return data;
  },
    error => handleError(error, 'GET HEALTH PERMIT PROJECT')
  );
};

export const GetHealthPermitsByHealthPermitProjectKey = (healthPermitProjectKey: number) => {
  return client.query({
    query: qlList.Get_Health_Permits,
    variables: { healthPermitProjectKey: healthPermitProjectKey }
  }).then(res => {
    const data = res.data.healthPermits;
    return data;
  },
    error => handleError(error, 'GET HEALTH PERMITS')
  );
};

export const GetHealthInvoiceDetails = (healthprojectNumber: string) => {
  return client.query({
    query: qlList.Get_Health_InvoiceDetailsFromProjectNumber,
    variables: { healthprojectNumber: healthprojectNumber }
  }).then(res => {
    const data = res.data.pGet_Health_Invoice_Details_From_HealthProjectNumber;
    return data;
  },
    error => handleError(error, 'GET HEALTH INVOICE DETAILS')
  );
};

export const GetHealthInvoicePayments = (healthprojectNumber: string) => {
  return client.query({
    query: qlList.Get_Health_PaymentDetailsFromProjectNumber,
    variables: { healthprojectNumber: healthprojectNumber }
  }).then(res => {
    const data = res.data.pGet_Health_Payment_Details_From_HealthPermitKey;
    return data;
  },
    error => handleError(error, 'GET HEALTH INVOICE PAYMENT')
  );
};

export const CalculateFee = (
  category: string,
  zoningPermitCategory: string,
  sourceValue: number,
  permitDate: Date,
  iccFactor: number,
  permitProjectKey: number,
  projectTypeKey: number
) => {
  return client.query({
    query: qlList.CalculateFee,
    variables: {
      category: category,
      zoningPermitCategory: zoningPermitCategory,
      sourceValue: sourceValue,
      permitDate: permitDate,
      iccFactor: iccFactor,
      permitProjectKey: permitProjectKey,
      projectTypeKey: projectTypeKey
    }
  }).then(res => {
    const data = res.data.pCalculateFee;
    return data;
  },
    error => handleError(error, 'CALCULATE FEE')
  );
};

export const GetUserName = () => {
  return client.query({
    query: qlList.Get_UserName
  }).then(res => {
    const data = (res.data.userName);
    return data;
  },
    error => handleError(error, 'GET USER')
  );
};
export const GetUserGroups = () => {
  return client.query({
    query: qlList.Get_UserGroups
  }).then(res => {
    const data = (res.data.userGroups);
    return data;
  },
    error => handleError(error, 'GET USER')
  );
};

// -------------------------------------------------
// ---------------- Mutations ----------------------
// -------------------------------------------------
export const AddHealthPermit = (permit: Permit) => {
  return client.mutate({
    mutation: qlList.Add_Health_Permit,
    variables: { permit: permit }
  }).then(res => {
    const data = res.data.add_Health_Permit;
    return data;
  },
    error => handleError(error, 'ADD HEALTH PERMIT')
  );
};

export const AddHealthPermitTypeAttributes = (attribute: any) => {
  return client.mutate({
    mutation: qlList.Add_Health_PermitTypeAttributes,
    variables: { attribute: attribute }
  }).then(res => {
    const data = res.data.add_Health_PermitTypeAttribute;
    return data;
  },
    error => handleError(error, 'ADD HEALTH PERMIT TYPE ATTRIBUTES')
  );
};

export const UpdateHealthPermitTypeAttributes = (healthPermitTypeAttributesKey: number, value: string) => {
  return client.mutate({
    mutation: qlList.Update_Health_PermitTypeAttribute,
    variables: { healthPermitTypeAttributesKey: healthPermitTypeAttributesKey, value: value }
  }).then(res => {
    const data = res.data.update_Health_PermitTypeAttribute;
    return data;
  },
    error => handleError(error, 'UPDATE HEALTH PERMIT TYPE ATTRIBUTES')
  );
};

export const UpdateHealthPermit = (healthPermitKey: number, data: any) => {
  return client.mutate({
    mutation: qlList.Update_Health_Permit,
    variables: { healthPermitKey: healthPermitKey, data: data}
  }).then(res => {
    const data = res.data.update_Health_Permit;
    return data;
  });
};

// -------------------------------------------------
// ------------------- Test ------------------------
// -------------------------------------------------
export const TEST = () => {
  return client.query({
    query: qlList.TEST
  }).then(res => {
    console.log(res);
  },
    error => handleError(error, 'TEST')
  );
};
