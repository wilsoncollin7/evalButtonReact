import * as React from 'react';
// import { Link } from 'react-router-dom';
// bootstrap
import { Modal, Button } from 'react-bootstrap';

type Props = {
  show: boolean
  onHide: () => void
  // projectNumber: string | undefined
  onChange: (value: string) => void
};

const DiscardChanges: React.FC<Props> = ({ show, onHide, onChange }) => {
  
  const handleOnClick = () => {
    onChange('evals');
  };
  
  return (
    <Modal show={show} onHide={onHide} centered animation={false} backdrop={false} size='sm'>
      <Modal.Header>
        <Modal.Title className='mx-auto'>Discard Changes?</Modal.Title>
      </Modal.Header>
      <Modal.Footer className='mx-auto'>
        {/* <Link className='mr-2 btn btn-danger' to={`/project/${projectNumber}/evals`}>Discard</Link> */}
        <Button variant='danger' className='mr-2' onClick={handleOnClick}>Discard</Button>
        <Button variant='info' onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DiscardChanges;
