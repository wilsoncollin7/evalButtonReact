import * as React from 'react';
// import { Link, useParams, useHistory } from 'react-router-dom';
// bootstrap
import { Button, Row, Col, Card, Spinner } from 'react-bootstrap';
// utils 
import { useForm } from 'react-hook-form';
import {
  // GetHealthPermitProjectByPermitNumber,
  GetHealthPermitsByTypeAndProjectNumber,
  GetHealthPermitTypeAttributeByPermitKey
} from '../../../../graphql/queries/queries';
import { evaluationTypeFilter, filterEvalsByPermitNumber } from '../../../../utils/filters/healthFilters';
import { UserContext } from '../../../../utils/contexts/userContext';
import { PermitProject } from '../../../../utils/interfaces/healthInterfaces';
// components
import EvalDetails from './evalDetails';
import SiteEvalDetails from './siteEvalDetails';
import DiscardChanges from '../../../modals/alerts/discardChanges';
import { newHealthEvent, updateHealthPermit, updatePermitAttributes } from '../../../../utils/modules/submitPermit';

type FormData = {
  attributes: string[],
  project: string[]
};

type State = {
  isEdited: boolean,
  show: boolean,
  loading: boolean,
};

type Permit = {
  healthPermitKey: number,
  healthPermitProjectKey: number
};

type Params = {
  permitNumber: string | undefined,
  projectNumber: string | undefined
};

type Props = {
  project: PermitProject
  projectNumber: string | undefined,
  permitNumber: string,
  onChange: (value: string) => void
}

const EvalDetailsPage: React.FC<Props> = ({ project, permitNumber, onChange }) => {
  // let history = useHistory();
  const { userData } = React.useContext(UserContext);
  // const { permitNumber, projectNumber } = useParams<Params>();
  const { handleSubmit, setValue } = useForm();
  const [attributes, setAttributes] = React.useState<string[]>([]);
  const [overrideReason, setOverrideReason] = React.useState<string>('');
  // const [project, setProject] = React.useState<PermitProject>({
  //   healthPermitProjectKey: 0,
  //   parcelID: '',
  //   permitNumber: '',
  //   projectTypeKey: 0,
  //   projectStatusKey: 0
  // });
  const [permit, setPermit] = React.useState<Permit>({
    healthPermitKey: 0,
    healthPermitProjectKey: 0
  });
  const [state, setState] = React.useState<State>({
    isEdited: false,
    show: false,
    loading: false,
  });

  const handleClose = () => setState({ ...state, show: false });
  const handleShow = () => setState({ ...state, show: true });

  const onSubmit = handleSubmit((data: FormData) => {
    setState({ ...state, loading: true });
    if (data.attributes !== undefined) {
      updatePermitAttributes(data.attributes);
    };
    if (data.project !== undefined && permitNumber !== undefined) {
      updateHealthPermit(permit.healthPermitKey, data.project);
      newHealthEvent(data.project, permit.healthPermitProjectKey, userData.userName, 1859, permitNumber, overrideReason);
    };
    setTimeout(() => {
      // history.push(`/${projectNumber}/evals`);
      onChange('evals');
    }, 1000);
  });

  const handleAttributeOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(`attributes.${e.target.id}`, e.target.value);
    setState({ ...state, isEdited: true });
  };

  const handleProjectOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    switch (e.target.id) {
      case 'description':
        setValue(`project.${e.target.id}`, e.target.value);
        break;
      case 'permitAmount':
        setValue(`project.${e.target.id}`, parseInt(e.target.value));
        break;
      case 'permitStatusKey':
        setValue(`project.${e.target.id}`, parseInt(e.target.value));
        break;
      case 'finalPassed':
        setValue(`project.${e.target.id}`, e.target.checked);
        break;
      case 'overrideReason':
        setOverrideReason(e.target.value);
        break;
    };
    setState({ ...state, isEdited: true });
  };

  React.useEffect(() => {
    if (permit !== undefined) {
      GetHealthPermitTypeAttributeByPermitKey(permit.healthPermitKey)
        .then(res => {
          setAttributes(res);
        });
    };
  }, [permit])

  React.useEffect(() => {
    const init = () => {
      if (project.permitNumber !== undefined && permitNumber !== undefined) {
        GetHealthPermitsByTypeAndProjectNumber(project.permitNumber, evaluationTypeFilter(project.projectTypeKey))
          .then(res => {
            setPermit(filterEvalsByPermitNumber(res, permitNumber));
          });
      };
    };
    init();
  }, [permitNumber, project]);

  // React.useEffect(() => {
  //   const getProject = () => {
  //     if (projectNumber !== undefined) {
  //       GetHealthPermitProjectByPermitNumber(projectNumber)
  //         .then(res => {
  //           setProject(res);
  //         });
  //     }
  //   };
  //   getProject();
  // }, [projectNumber])

  return (
    <Row>
      <Col>
        <Row>
          {state.isEdited ?
            <Button variant='info' className='mr-2' onClick={handleShow}>Back To Permits</Button>
            :
            // <Link className='mr-2 btn btn-info' to={`/${projectNumber}/evals`}>Back To Permits</Link>
            <Button variant='info' onClick={() => onChange('evals')}>Back To Permits</Button>
          }
          <Button
            variant='warning'
            disabled={!state.isEdited}
            onClick={() => onSubmit()}
            hidden={userData.public}
          >{state.loading ? <Spinner animation="border" size="sm" /> : "Save Changes"}</Button>
        </Row>
        <Row>
          <Card className='my-3 w-100'>
            <Card.Header>
              Evaluation {permitNumber} Details
            </Card.Header>
            <Card.Body>
              <EvalDetails project={project} onChange={handleProjectOnChange} evaluation={permit} />
            </Card.Body>
          </Card>
        </Row>
        <Row>
          <Card className='w-100'>
            <Card.Header>
              Site Evaluation Details
            </Card.Header>
            <Card.Body>
              <SiteEvalDetails
                attributes={attributes}
                onChange={handleAttributeOnChange}
              />
            </Card.Body>
          </Card>
        </Row>
      </Col>
      <DiscardChanges
        show={state.show}
        onHide={handleClose}
        onChange={onChange}
        // projectNumber={projectNumber}
      />
    </Row>
  );
};

export default EvalDetailsPage;
