import * as React from 'react';
// bootstrap
import { Modal, Button } from 'react-bootstrap';

type Props = {
  show: boolean
  onHide: () => void
  cancle?: () => void
};

const AreYouSure: React.FC<Props> = ({ show, onHide, cancle }) => {
  const onClick = () => {
    onHide();
    if (cancle) {
      cancle();
    };
  };

  return (
    <Modal className='areYouSure pt-5' centered animation={false} backdrop={false}  show={show} onHide={onHide} size='sm' keyboard={false} >
      <Modal.Header>
        <Modal.Title className='mx-auto'>Discard?</Modal.Title>
      </Modal.Header>
      <Modal.Footer className='mx-auto'>
        <Button variant='info' onClick={onClick} >
          Yes
        </Button>
        <Button variant='info' onClick={onHide}>
          No
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AreYouSure;
