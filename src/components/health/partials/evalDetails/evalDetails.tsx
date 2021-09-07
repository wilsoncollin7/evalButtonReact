import * as React from 'react';
// bootstrap
import { Row, Col, Form, InputGroup } from 'react-bootstrap';
// utils
import { formatDate, projectTypeFilter, statusFilter } from '../../../../utils/filters/healthFilters';
import { UserContext } from '../../../../utils/contexts/userContext';
import { PermitProject } from '../../../../utils/interfaces/healthInterfaces';

type Props = {
  project: PermitProject
  evaluation: any
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const EvalDetails: React.FC<Props> = ({ evaluation, onChange, project }) => {
  const [evalInfo, setEvalInfo] = React.useState<any>([]);
  const [feeOverride, setFeeOverride] = React.useState<boolean>(false);
  const [status, setStatus] = React.useState('');
  const [fianlPassedDate, setFinalPassedDate] = React.useState('');
  const { userData } = React.useContext(UserContext);

  const handleFeeOverride = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFeeOverride(e.target.checked);
  };

  const finalPassed = (e: any) => {
    onChange(e);
    if (e.target.checked) {
      setFinalPassedDate(formatDate(new Date()));
    } else {
      setFinalPassedDate('');
    };
  };

  React.useEffect(() => {
    if (evaluation !== undefined) {
      setEvalInfo(evaluation);
      const getStatus = () => {
        if (evalInfo.permitStatusKey !== undefined) {
          setStatus(statusFilter(evalInfo.permitStatusKey));
        };
      };
      getStatus();
    }
  }, [evaluation, evalInfo.permitStatusKey]);

  return (
    <Form>
      <Row>
        <Col>
          <Row>
            <Col>
              <Form.Label>Project Type</Form.Label>
              <Form.Control size='sm' type='text' placeholder={project ? projectTypeFilter(project.projectTypeKey) : ''} disabled />
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Label>Category</Form.Label>
              <Form.Control size='sm' type='text' disabled defaultValue='Septic' />
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Label>Permit</Form.Label>
              <Form.Control size='sm' type='text' disabled defaultValue='Site Evaluation' />
            </Col>
          </Row>
        </Col>
        <Col>
          <Row>
            <Col>
              <Form.Label>Permit Status</Form.Label>
              <Form.Control size='sm' as='select' id='permitStatusKey' defaultValue={evalInfo.permitStatusKey} onChange={onChange} disabled={userData.public}>
                <option>{status}</option>
                <option value={1}>Active</option>
                <option value={3}>Frozen</option>
                <option value={5}>Void</option>
              </Form.Control>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Label>Issued Date</Form.Label>
              <Form.Control size='sm' type='text' disabled defaultValue={formatDate(evalInfo.dateIssued) || ''} />
            </Col>
            <Col>
              <Form.Label>Create Date</Form.Label>
              <Form.Control size='sm' type='text' disabled defaultValue={formatDate(evalInfo.creationDate) || ''} />
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Check className='mt-4' label='Final Passed' id='finalPassed' defaultChecked={evalInfo.finalPassed} onClick={finalPassed} disabled={userData.public} />
            </Col>
            <Col>
              <Form.Label>Final Passed Date</Form.Label>
              <Form.Control size='sm' type='text' placeholder={fianlPassedDate} disabled />
            </Col>
          </Row>
        </Col>
        <Col>
          <Row>
            <Col>
              <Form.Label>Permit Amount</Form.Label>
              <InputGroup size='sm'>
                <InputGroup.Prepend>
                  <InputGroup.Text>$</InputGroup.Text>
                </InputGroup.Prepend>
                <Form.Control size='sm' type='number' disabled={!feeOverride} id='permitAmount' onChange={onChange} defaultValue={evalInfo.permitAmount || ''} />
              </InputGroup>
            </Col>
            <Col>
              <Form.Check className='mt-4' label='Fee Override' onChange={handleFeeOverride} disabled={userData.public} />
            </Col>
          </Row>
          <Row>
            <Col xs='6'>
              <Form.Label>Total Amount</Form.Label>
              <InputGroup size='sm'>
                <InputGroup.Prepend>
                  <InputGroup.Text>$</InputGroup.Text>
                </InputGroup.Prepend>
                <Form.Control size='sm' type='text' disabled defaultValue={evalInfo.permitAmount || ''} />
              </InputGroup>
            </Col>
          </Row>
          {feeOverride ?
            <Row>
              <Col xs='6'>
                <Form.Label>Override Reason</Form.Label>
                <Form.Control size='sm' as='textarea' rows={2} id='overrideReason' onChange={onChange} />
              </Col>
            </Row>
            :
            <Row></Row>
          }
        </Col>
      </Row>
      <Row>
        <Col>
          <Form.Label>Description</Form.Label>
          <Form.Control
            size='sm'
            as='textarea'
            rows={3}
            id='description'
            defaultValue={evalInfo.description || ''}
            onChange={onChange}
            disabled={userData.public}
          />
        </Col>
      </Row>
    </Form>
  )
};

export default EvalDetails;
