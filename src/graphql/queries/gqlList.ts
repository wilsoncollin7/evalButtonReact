import gql from 'graphql-tag';

export class HealthGqlList {

  // ----------------------------------------------------------------------------------------
  // ------ Queries -------------------------------------------------------------------------
  // ----------------------------------------------------------------------------------------
  Get_Health_PermitsByTypeAndProjectNumber = gql`
    query pGetHealthPermitsByProjectNumber($healthprojectNumber: String!, $permitTypeKey: Int!) {
      pGetHealthPermitsByProjectNumber (healthprojectNumber: $healthprojectNumber, permitTypeKey: $permitTypeKey) {
        creationDate
        createUser
        dateIssued
        description
        finalPassed
        healthPermitKey
        healthPermitProjectKey
        parcelID
        permitAmount
        permitNumber
        permitStatusKey
        permitTypeKey
      }
    }
  `
  Get_PermitTypeAttributes = gql`
    query pGetPermitTypeAttributes($permitProjectKey: Int!, $permitTypeKey: Int!) {
      pGetPermitTypeAttributes (permitProjectKey: $permitProjectKey, permitTypeKey: $permitTypeKey) {
        permitTypeAttributesKey
        permitTypeKey
        permitAttributeKey
        isRequired
        validation
        attributeDataType
        inactive
        attributeOrder
        displayColumn
        feeCategory
        labelDisplayColumn
        radioButtonLabel
        description
        defaultValue
      }
    }
  `
  Get_Health_PermitTypeAttributeByPermitKey = gql`
    query GetHealthPermitTypeAttribute($healthPermitKey: Int!) {
      healthPermitTypeAttribute (healthPermitKey: $healthPermitKey) {
        attributeDataType
        attributeDescription
        attributeValue
        createDate
        createUser
        feeCategory
        healthPermitKey
        healthPermitTypeAttributesKey
        updateDate
        updateUser
        attributeOrder
        displayColumn
      }
    }
  `
  Get_Health_PermitProjectByPermitNumber = gql`
    query GetHealthPermitProjectByPermitNumber($permitNumber: String!) {
      healthPermitProjectByPermitNumber (permitNumber: $permitNumber) {
        healthPermitProjectKey
        parcelID
        permitNumber
        projectTypeKey
        projectStatusKey
      }
    }
  `
  Get_Health_Permits = gql`
    query GetHealthPermits($healthPermitProjectKey: Int!) {
      healthPermits (healthPermitProjectKey: $healthPermitProjectKey) {
        healthPermitProjectKey
        permitNumber
      }
    }
  `
  CalculateFee = gql`
    query pCalculateFee($category: String!, $zoningPermitCategory: String!, $sourceValue: Decimal!, $permitDate: DateTime!, $iccFactor: Decimal!, $permitProjectKey: Int!, $projectTypeKey: Int!) {
      pCalculateFee (category: $category, zoningPermitCategory: $zoningPermitCategory, sourceValue: $sourceValue, permitDate: $permitDate, iccFactor: $iccFactor, permitProjectKey: $permitProjectKey, projectTypeKey: $projectTypeKey) {
        permitFee
        zoningPermitFee
        northwestPermitFee
        northwestPermitglNumber
        permitGLNumber
        zoningPermitGLNumber
      }
    }  
  `
  Get_Health_InvoiceDetailsFromProjectNumber = gql`
    query pGet_Health_Invoice_Details_From_HealthProjectNumber($healthprojectNumber: String!) {
      pGet_Health_Invoice_Details_From_HealthProjectNumber (healthprojectNumber: $healthprojectNumber) {
        createDate
        healthinvoiceKey
        healthpermitKey
        invoicedAmount
        invoiceDate
        invoiceNumber
      }
    } 
  `
  Get_Health_PaymentDetailsFromProjectNumber = gql`
    query pGet_Health_Payment_Details_From_HealthPermitKey($healthprojectNumber: String!) {
      pGet_Health_Payment_Details_From_HealthPermitKey(healthprojectNumber: $healthprojectNumber) {
        healthInvoicePaymentsKey
        healthPermitKey
        notes
        paymentAmount
        paymentDate
        paymentNumber
      }
    }
  `
  Get_UserName = gql`
    {
      userName
    }
  `
  Get_UserGroups = gql`
    {
      userGroups
    }
  `
  // ----------------------------------------------------------------------------------------
  // ------ Mutations -----------------------------------------------------------------------
  // ----------------------------------------------------------------------------------------
  Add_Health_Permit = gql`
    mutation add_Health_permit($permit: Health_PermitInput!) {
      add_Health_Permit(permit: $permit) {
        permitNumber
        healthPermitKey
      }
    }
  `
  Add_Health_PermitTypeAttributes = gql`
    mutation Add_Health_PermitTypeAttribute($attribute: Health_PermitTypeAttributeInput!) {
      add_Health_PermitTypeAttribute(attribute: $attribute) {
        attributeDescription
        attributeValue
      }
    }
  `
  Update_Health_PermitTypeAttribute = gql`
    mutation Update_Health_PermitTypeAttribute($healthPermitTypeAttributesKey: Int!, $value: String!) {
      update_Health_PermitTypeAttribute(healthPermitTypeAttributesKey: $healthPermitTypeAttributesKey, value: $value) {
        attributeValue
        healthPermitTypeAttributesKey
      }
    }
  `
  Update_Health_Permit = gql`
    mutation Update_Health_Permit($healthPermitKey: Int!, $data: Health_Permit_UpdateInput) {
      update_Health_Permit(healthPermitKey: $healthPermitKey, data: $data) {
        description
        healthPermitKey
        permitAmount
        finalPassed
        permitStatusKey
        updateDate
      }
    }
  `
  // ----------------------------------------------------------------------------------------
  // ------ Test ----------------------------------------------------------------------------
  // ----------------------------------------------------------------------------------------
  TEST = gql`
    {
      test
    }
  `;
};
