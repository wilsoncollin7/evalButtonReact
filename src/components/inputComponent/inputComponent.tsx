import * as React from 'react';
// bootstrap
import { Form } from 'react-bootstrap';
// utils
import { filterDropDownContent } from '../../utils/modules/dropDown';
import { FormUI } from '../../utils/interfaces/healthInterfaces';

type Props = {
  attribute: FormUI
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
};

const InputComponent: React.FC<Props> = ({ attribute, onChange }) => {
  const readOnly: string[] = [
    'SiteEvalTextarea',
    'IssueDate',
    'transferDate',
    'deptReceivedDate',
    'pendingDate',
    'ExpiresDate',
    'OPDate',
    'RequestDate',
    'feeCalcDate',
    'SampleDate',
    // 'ResultsDate',
    'CertOfCompletionDate',
    'WellPermitIssueDate',
    'PerUnitDescription',
    'GDP'
  ];

  const select: string[] = [
    'pendingType',
    'systemType',
    'healthUser',
    'ORCList',
    'TestType',
    'EstablishmentType',
    'WellResults',
    'WaterSupply',
    'TotalColiform',
    'FecalColiform',
    'siteEvalDropDown',
    'siteClassDropDown'
  ];

  const getDropDownContent = (attributeDataType: string) => {
    const content: string[] = filterDropDownContent(attributeDataType);
    return content;
  };  

  return (
    <>
      <Form.Label>{attribute.description}</Form.Label>
      {select.indexOf(attribute.attributeDataType) !== -1 ?
        <Form.Control 
          onChange={onChange}
          size='sm' 
          as='select'
          id={attribute.description}
          defaultValue={attribute.value}
        >
          <option></option>
          {getDropDownContent(attribute.attributeDataType).map((item: any, idx: number) => (
            <option value={item.description} key={idx}>{item.description}</option>
          ))}
        </Form.Control>
        :
        <Form.Control
          size='sm'
          readOnly={readOnly.indexOf(attribute.attributeDataType) !== -1}
          onChange={onChange}
          id={attribute.description}
          type={
            attribute.attributeDataType === 'ResultsDate' ? 'date' : 'text' 
            || 
            attribute.attributeDataType === 'Per' ? 'number' : 'text'
          }
          placeholder={attribute.value}
          as={
            attribute.attributeDataType === 'SiteEvalTextarea'
              ||
            attribute.attributeDataType === 'textarea' ? 'textarea' : 'input'
          }
        />
      }
    </>
  );
};

export default InputComponent;
