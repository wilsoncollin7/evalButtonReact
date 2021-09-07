import * as React from 'react';
import { useParams } from 'react-router-dom';
// bootstrap
import { Col, Row, Card, Button, Table } from 'react-bootstrap';
// import { Link } from 'react-router-dom';
import { ArrowCounterclockwise } from 'react-bootstrap-icons';
// utils
import { UserContext } from '../../../utils/contexts/userContext';
import {
  GetHealthPermitsByTypeAndProjectNumber,
  GetHealthPermitProjectByPermitNumber
} from '../../../graphql/queries/queries';
import {
  evaluationTypeFilter,
  formatDate,
  statusFilter,
  // getPermitWithFees 
} from '../../../utils/filters/healthFilters';
import { PermitProject } from '../../../utils/interfaces/healthInterfaces';
// components
import PrepareEval from '../modals/prepareEval';
import EvalDetailsPage from './evalDetails/evalDetailsPage';
// import InvoicePermit from './modals/invoicePermit';

type Params = {
  projectNumber: string | undefined
};

const Evals: React.FC = () => {
  const { notInGroups, userData } = React.useContext(UserContext);
  // const [user, setUser] = React.useState();
  const [evals, setEvals] = React.useState([]);
  const [permitNumber, setPermitNumber] = React.useState('');
  const [nav, setNav] = React.useState('evals');
  const [project, setProject] = React.useState<PermitProject>({
    healthPermitProjectKey: 0,
    parcelID: '',
    permitNumber: '',
    projectTypeKey: 0,
    projectStatusKey: 0
  });
  const [showPrepare, setShowPrepare] = React.useState(false);
  // const [showInvoice, setShowInvoice] = React.useState(false);
  const { projectNumber } = useParams<Params>();

  const handleClosePrepare = () => setShowPrepare(false);
  const handleShowPrepare = () => setShowPrepare(true);
  // const handleCloseInvoice = () => setShowInvoice(false);
  // const handleShowInvoice = () => setShowInvoice(true);

  const handleNavChange = (value: string) => {
    setNav(value);
  };

  const handleOnClick = (e: any) => {
    setPermitNumber(e.target.id);
    setNav('eval');
  };

  const refresh = () => {
    if (projectNumber !== undefined) {
      GetHealthPermitsByTypeAndProjectNumber(projectNumber, evaluationTypeFilter(project.projectTypeKey))
        .then(res => {
          setEvals(res);
        });
    }
  };

  React.useEffect(() => {
    const getPermits = () => {
      if (projectNumber !== undefined) {
        GetHealthPermitsByTypeAndProjectNumber(projectNumber, evaluationTypeFilter(project.projectTypeKey))
          .then(res => {
            setEvals(res);
          });
      }
    };
    getPermits();
  }, [showPrepare, projectNumber, project, userData.roles]);

  React.useEffect(() => {
    const getProject = () => {
      if (projectNumber !== undefined) {
        console.log(projectNumber)
        GetHealthPermitProjectByPermitNumber(projectNumber)
          .then(res => {
            setProject(res);
          });
      }
    };
    getProject();
  }, [projectNumber]);

  return (
    <>
      {nav === 'evals'
        ?
        <Row>
          <Col>
            <Card>
              <Card.Header>
                Evaluations
            <Button className='float-right ml-3' variant='outline-dark' onClick={refresh}><ArrowCounterclockwise /></Button>
              </Card.Header>
              <Card.Body className='p-0'>
                {evals.length > 0
                  ? <Table striped bordered hover responsive size='sm'>
                    <thead>
                      <tr>
                        <th>Eval #</th>
                        <th>Type</th>
                        <th>Category</th>
                        <th>Status</th>
                        <th>Created</th>
                        <th>Issued</th>
                        <th>Amount</th>
                        <th>Fianl</th>
                        <th>Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {evals.map((item: any, idx) => (
                        <tr key={idx}>
                          {/* <td className='p-0'><Link className='btn btn-info w-100' to={`/${projectNumber}/eval/${item.permitNumber}`} >{item.permitNumber}</Link></td> */}
                          <td className='p-0'><Button variant='info' className='w-100' onClick={handleOnClick} id={item.permitNumber}>{item.permitNumber}</Button></td>
                          <td>Site Evaluation</td>
                          <td>Septic</td>
                          <td>{statusFilter(item.permitStatusKey)}</td>
                          <td>{formatDate(item.creationDate)}</td>
                          <td>{formatDate(item.dateIssued)}</td>
                          <td>{'$' + item.permitAmount.toFixed(2)}</td>
                          <td>{item.finalPassed ? 'Yes' : 'No'}</td>
                          <td className='w-50 position-relative px-3 overflow-hidden'><p className='position-absolute text-nowrap'>{item.description}</p></td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                  : <p>No Evaluations</p>}
              </Card.Body>
            </Card>
          </Col>
          <Col xs='1'>
            <Button
              variant='info'
              onClick={handleShowPrepare}
              hidden={userData.public}
              disabled={
                project?.projectStatusKey === 4
                || project?.projectStatusKey === 6
                || notInGroups(['permitting', 'stormWater', 'env.health', 'fire'])
              }
            >Prepare Evaluation</Button>
            {/* <Button variant='info' onClick={handleShowInvoice} disabled={project?.projectStatusKey === 2 || project?.projectStatusKey === 3}>Invoice Evaluation</Button> */}
          </Col>
          {/* <InvoicePermit show={showInvoice} onHide={handleCloseInvoice} project={project} permits={getPermitWithFees(evals)} title='Evaluations' /> */}
          <PrepareEval show={showPrepare} onHide={handleClosePrepare} project={project} />
        </Row>
        :
        <EvalDetailsPage
          project={project}
          projectNumber={projectNumber}
          permitNumber={permitNumber}
          onChange={handleNavChange}
        />
      }
    </>
  );
};

export default Evals;
