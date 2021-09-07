import * as React from 'react';
// bootstrap
import { Modal, Button, Card, Table, Form, Row } from 'react-bootstrap';
// utils
import { GetHealthInvoicePayments } from '../../graphql/queries/queries';
import {
  permitTypeFilter,
  formatDate,
  getAmountDue,
  getPaymentStatus
} from '../../utils/filters/healthFilters';
import { Payment, Permit, PermitProject } from '../../utils/interfaces/healthInterfaces';

type Props = {
  show: boolean
  onHide: () => void
  title: string
  project: PermitProject
  permits: Permit[]
};

const InvoicePermit: React.FC<Props> = ({ show, onHide, title, project, permits }) => {
  const [payments, setPayment] = React.useState<Payment[]>([]);
  const [total, setTotal] = React.useState<number>(0);
  const [checked, setChecked] = React.useState<boolean>(false);

  const handleChecked = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setChecked(true);
      const value: number = parseInt(e.target.value);
      setTotal(+total + +value);
    } else {
      setChecked(false);
      const value: number = parseInt(e.target.value);
      setTotal(+total - +value);
    };
  };

  React.useEffect(() => {
    const getPayments = () => {
      GetHealthInvoicePayments(project.permitNumber)
        .then(res => {
          setPayment(res);
        });
    };
    if (project !== undefined && permits !== undefined && show) {
      getPayments();
    };
  }, [show, permits, project]);

  return (
    <Modal show={show} centered animation={false} backdrop={false} onHide={onHide} size='lg'>
      <Modal.Header>
        <Modal.Title className='mx-auto'>Invoice {title}</Modal.Title>
        <Button className='float-right' variant='outline-dark' onClick={onHide}>X</Button>
      </Modal.Header>
      <Modal.Body className='pb-0'>
        <Card>
          <Card.Header>
            Unpaid {title}
          </Card.Header>
          <Card.Body className='p-0'>
            <Table striped bordered hover responsive size='sm'>
              <thead>
                <tr>
                  <th>Invoice?</th>
                  <th>#</th>
                  <th>Type</th>
                  <th>Description</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Outstanding</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {permits !== undefined
                  ? permits.map((item: any, idx: number) => (
                    <tr key={idx} className={getPaymentStatus(item.healthPermitKey, payments, item.permitAmount) ? 'd-none' : ''}>
                      <td className='text-center'>{<Form.Check value={getAmountDue(item.healthPermitKey, payments, item.permitAmount)} onChange={handleChecked} />}</td>
                      <td>{item.permitNumber}</td>
                      <td className='text-nowrap'>{permitTypeFilter(item.permitTypeKey)}</td>
                      <td className='position-relative px-3 overflow-hidden'><p className='position-absolute text-nowrap'>{item.description}</p></td>
                      <td>{formatDate(item.creationDate)}</td>
                      <td>{`$${item.permitAmount.toFixed(2)}`}</td>
                      <td>{`$${getAmountDue(item.healthPermitKey, payments, item.permitAmount).toFixed(2)}`}</td>
                      <td>{getPaymentStatus(item.healthPermitKey, payments, item.permitAmount) ? 'Paid' : 'Unpaid'}</td>
                    </tr>
                  ))
                  : <tr></tr>
                }
              </tbody>
            </Table>
          </Card.Body>
        </Card>
        <span className='float-right'>Invoice Total: ${total.toLocaleString()}</span>
      </Modal.Body>
      <Modal.Footer className='d-block'>
        <Row>
          {checked ? <Button className='mx-auto' variant='info'>Create Invoice</Button> : ''}
        </Row>
      </Modal.Footer>
    </Modal>
  );
};

export default InvoicePermit;
