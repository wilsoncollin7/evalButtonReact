import * as React from 'react';
// bootstrap
import { Form } from 'react-bootstrap';
// utils
import { UserContext } from '../../utils/contexts/userContext'; 

type Props = {
  item: string
  allChecked: boolean
  isPublic: boolean
  toggleRole: (e: string) => void
  update: (e: string) => void
}

const UserCheckBox: React.FC<Props> = ({ item, allChecked, isPublic, toggleRole, update }) => {
  const { inGroups } = React.useContext(UserContext);
  const [checked, setChecked] = React.useState(inGroups([item]));

  const handleOnClick = () => {
    toggleRole(item);
  };

  const handleOnChange = () => {
    setChecked(inGroups([item]));
    update(item);
  };

  React.useEffect(() => {
    setChecked(inGroups([item]));
  }, [allChecked, isPublic, inGroups, item])
 
  return (
    <Form.Check
      inline
      label={item}
      id={item}
      checked={checked}
      onChange={handleOnChange}
      onClick={handleOnClick}
    />
  )
};

export default UserCheckBox;
