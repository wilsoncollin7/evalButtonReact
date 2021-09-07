import * as React from 'react';
// bootstrap
import { Modal, Button, Row, Form, Col, Card, InputGroup, Spinner } from 'react-bootstrap';
// utils
import { useForm } from 'react-hook-form';
import { UserContext } from '../../../utils/contexts';
import {
  formatDate,
  getChargeType,
  projectTypeFilter,
  evaluationTypeFilter
} from '../../../utils/filters/healthFilters';
import { newPermit } from '../../../utils/modules/submitPermit';
import { CalculateFee, GetPermitTypeAttributes } from '../../../graphql/queries/queries';
import { PermitAttributes, PermitProject, FormUI } from '../../../utils/interfaces/healthInterfaces';
// components
import AreYouSure from '../../modals/alerts/areYouSure';
import InputComponent from '../../inputComponent/inputComponent';

type Props = {
  show: boolean
  onHide: () => void
  project: PermitProject
};

type SiteEvalCalc = {
  GalPerDescription: string,
  HelpText: string | null,
  SpecialInstructions: string | null,
  GalFactor: number
};

const PrepareEval: React.FC<Props> = ({ show, onHide, project }) => {
  const { userData, fetchUserData } = React.useContext(UserContext);
  const [chargeFactor, setChargeFactor] = React.useState<number>(120);
  const [fee, setFee] = React.useState<number>(0);
  const [feeOverride, setFeeOverride] = React.useState<boolean>(false);
  const [showChild, setShowChild] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [formUI, setFormUI] = React.useState<FormUI[]>([]);
  const [attributes, setAttributes] = React.useState<string[]>([]);
  const { register, handleSubmit, reset, setValue } = useForm();

  const handleClose = () => setShowChild(false);
  const handleShow = () => setShowChild(true);

  const resetForm = () => {
    setLoading(false);
    setFee(0);
    setFeeOverride(false);
    setChargeFactor(120);
    reset();
  };

  const onSubmit = handleSubmit((data: PermitAttributes) => {
    fetchUserData();
    setLoading(true);
    newPermit(data, project, userData.userName, fee);
    setTimeout(() => {
      onHide();
      resetForm();
    }, 1000);
  });

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    switch (e.target.id) {
      case 'Establishment Type':
        handleEstChange(e.target.value);
        break;
      case 'Per':
        handlePerChange(e.target.value);
        break;
    };
    setValue(`${e.target.id}`, (e.target.value).trim());
  };

  const handleEstChange = (establishmentType: string) => {
    const type: SiteEvalCalc = getChargeType(establishmentType);
    setValue('Charge Type', type.GalPerDescription);
    setValue('Help Text', type.HelpText);
    setValue('Special Instructions', type.SpecialInstructions);
    formUI.filter((item: any) => {
      switch (item.description) {
        case 'Charge Type':
          item.value = type.GalPerDescription;
          break;
        case 'Help Text':
          item.value = type.HelpText;
          break;
        case 'Special Instructions':
          item.value = type.SpecialInstructions;
          break;
      };
      return true;
    });
    setChargeFactor(type.GalFactor);
  };

  const handlePerChange = (e: string) => {
    const perValue: string = e;
    const GPDValue = (parseInt(perValue) * chargeFactor);
    formUI.filter((item: any) => {
      if (item.description === 'GPD') {
        item.value = GPDValue;
      };
      return true;
    });
    setValue('GPD', GPDValue.toString());
    setTimeout(() => {
      getFee(GPDValue);
    }, 500);
  };

  const getFee = (value: number) => {
    if (value > 0) {
      CalculateFee(
        'Site Evaluation',
        '',
        value,
        new Date(),
        0,
        project.healthPermitProjectKey,
        project.projectTypeKey
      ).then(res => {
        const data: number = res.permitFee;
        setFee(data);
        setValue('fee', data);
      });
    } else {
      setFee(0);
      setValue('fee', 0);
    }
  };

  const handleFeeOverride = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFeeOverride(e.target.checked);
  };

  const handleFeeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (feeOverride) {
      const value = parseInt(e.target.value);
      setFee(value);
      setValue('fee', value);
    };
  };

  React.useEffect(() => {
    if (attributes !== undefined && attributes.length > 0) {
      let arr: FormUI[] = [];
      setFormUI([]);
      attributes.map((item: any) => {
        const obj: FormUI = {
          attributeDataType: item.attributeDataType,
          description: item.description,
          displayColumn: item.displayColumn,
          value: ''
        };
        if (obj.description === 'Establishment Type') {
          obj.value = 'Residential';
        } else if (obj.description === 'Charge Type') {
          obj.value = 'bedroom';
        };
        setValue(`${item.description}`, '');
        arr.push(obj);
        return true;
      });
      setValue('Establishment Type', 'Residential');
      setValue('Charge Type', 'bedroom');
      setValue('description', '');
      setFormUI(arr);
    };
  }, [attributes, setValue]);

  React.useEffect(() => {
    if (show && project !== undefined) {
      setValue('permitTypeKey', evaluationTypeFilter(project.projectTypeKey));
      GetPermitTypeAttributes(project.healthPermitProjectKey, evaluationTypeFilter(project.projectTypeKey))
        .then(res => {
          setAttributes(res);
        });
    };
  }, [show, project, setValue]);

  return (
    <>
      <Modal show={show} centered animation={false} backdrop={false} onHide={onHide} size='lg'>
        <Modal.Header>
          <Modal.Title>New Evaluation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Card>
            <Card.Header>
              Site Evaluation Details
            <Button className='float-right' size='sm' variant='secondary' onClick={resetForm}>Reset</Button>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={onSubmit}>
                <Row className='mt-1'>
                  <Col>
                    <Form.Label>Date</Form.Label>
                    <Form.Control size='sm' readOnly value={`${formatDate(new Date())}`} />
                  </Col>
                  <Col>
                    <Form.Label>Project Type</Form.Label>
                    <Form.Control size='sm' type='text' value={project ? projectTypeFilter(project.projectTypeKey) : ''} readOnly />
                  </Col>
                </Row>
                <Row className='mt-1'>
                  <Col>
                    <Form.Label>Description</Form.Label>
                    <Form.Control size='sm' as='textarea' id='description' rows={3} onChange={handleOnChange} />
                  </Col>
                </Row>
                <Row className='mt-1'>
                  <Col>
                    <Form.Label>Fee</Form.Label>
                    <InputGroup size='sm'>
                      <InputGroup.Prepend>
                        <InputGroup.Text>$</InputGroup.Text>
                      </InputGroup.Prepend>
                      <Form.Control size='sm' type='number' readOnly={!feeOverride} defaultValue={0} {...register('fee', { valueAsNumber: true })} onChange={handleFeeChange} />
                    </InputGroup>
                  </Col>
                  <Col>
                    <Form.Check className='mt-4' label='Fee Override' onChange={handleFeeOverride} />
                  </Col>
                </Row>
                <Row>
                  {formUI.map((item: FormUI, idx: number) => (
                    <Col key={idx} xs={item.displayColumn + 2}>
                      <InputComponent attribute={item} onChange={handleOnChange} />
                    </Col>
                  ))}
                </Row>
                <Row className='mt-1'>
                  <Col className='text-center mt-3'>
                    <Button variant='info' type='submit' onClick={onSubmit}>{loading ? <Spinner animation='border' size='sm' /> : 'Save'}</Button>
                    <Button className='ml-2' variant='danger' onClick={handleShow}>Close</Button>
                  </Col>
                </Row>
              </Form>
            </Card.Body>
          </Card>
        </Modal.Body>
      </Modal>
      <AreYouSure show={showChild} onHide={handleClose} cancle={onHide} />
    </>
  );
};

export default PrepareEval;
