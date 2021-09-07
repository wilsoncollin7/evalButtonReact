import * as React from 'react';
// bootstrap
import { Row, Col, Form } from 'react-bootstrap';
// utils
import { filterDropDownContent } from '../../../../utils/modules/dropDown';
import { UserContext } from '../../../../utils/contexts/userContext';

type Props = {
  attributes: string[]
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
};

const SiteEvalDetails: React.FC<Props> = ({ attributes, onChange }) => {
  const [attributesData, setAttributesData] = React.useState<string[]>([]);
  const { userData } = React.useContext(UserContext);

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

  React.useEffect(() => {
    if (attributes.length > 0) {
      setAttributesData(attributes);
    }
  }, [attributes]);

  return (
    <Form>
      <Row>
        {attributesData.map((item: any, idx: number) => (
          <Col key={idx} xs={item.displayColumn - 1}>
            <Form.Label>{item.attributeDescription}</Form.Label>
            {select.indexOf(item.attributeDataType) !== -1 ?
              <Form.Control
                onChange={onChange}
                size='sm'
                as='select'
                defaultValue={item.attributeValue}
                id={item.healthPermitTypeAttributesKey}
                disabled={userData.public}
              >
                <option>{item.attributeValue}</option>
                {getDropDownContent(item.attributeDataType).map((item: any, idx: number) => (
                  <option value={item.description} key={idx}>{item.description}</option>
                ))}
              </Form.Control>
              :
              <Form.Control
                onChange={onChange}
                id={item.healthPermitTypeAttributesKey}
                defaultValue={item.attributeValue}
                readOnly={readOnly.indexOf(item.attributeDataType) !== -1}
                disabled={userData.public}
                type={
                  item.attributeDataType === 'ResultsDate' ? 'date' : 'text' 
                  || 
                  item.attributeDataType === 'Per' ? 'number' : 'text'
                }
                as={
                  item.attributeDataType === 'SiteEvalTextarea'
                    ||
                    item.attributeDataType === 'textarea' ? 'textarea' : 'input'
                }
              />
            }
          </Col>
        ))}
      </Row>
    </Form>
  )
};

export default SiteEvalDetails;
